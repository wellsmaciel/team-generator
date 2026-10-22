#!/usr/bin/env node
// Claude <-> Codex relay: every step runs in a brand-new process with no context; the ticket .md is the only memory.
// Usage: node tools/relay/relay.cjs start <ticket> [--dry-run] | stop | status | log --last N
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) { positional.push(arg); continue; }
    const name = arg.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) flags[name] = true;
    else { flags[name] = next; i += 1; }
  }
  return { positional, flags };
}

// Splits the ticket into "## " sections; the last one decides the next step.
function lastSection(ticketText) {
  const lines = ticketText.split(/\r?\n/);
  let start = -1;
  lines.forEach((line, index) => { if (/^## /.test(line)) start = index; });
  if (start < 0) return null;
  return { heading: lines[start], text: lines.slice(start).join('\n') };
}

// Marker sections win over handoffs; markers only count outside "## Passagem" sections, so a handoff that merely quotes one is harmless.
function classify(ticketText, markers) {
  const section = lastSection(ticketText);
  if (!section) return { acao: 'claude-red', section };
  const isPassage = /^## Passagem /.test(section.heading);
  if (!isPassage && section.text.includes(markers.reviewed)) return { acao: 'parar', motivo: 'revisado', section };
  if (!isPassage && section.text.includes(markers.ready)) return { acao: 'claude-review', section };
  if (/^## Passagem .*(→|->)\s*Codex/.test(section.heading)) return { acao: 'codex-green', section };
  if (/^## Passagem .*(→|->)\s*Claude/.test(section.heading)) return { acao: 'claude-verify', section };
  if (!/^## Passagem /m.test(ticketText)) return { acao: 'claude-red', section };
  return { acao: 'parar', motivo: 'secao-desconhecida', section };
}

function loadConfig(root, flags) {
  const file = flags.config ? path.resolve(flags.config) : path.join(__dirname, 'relay.config.json');
  const config = JSON.parse(fs.readFileSync(file, 'utf8'));
  config.markers = { ...config.markers };
  if (typeof flags.ready === 'string') config.markers.ready = flags.ready;
  if (flags['max-cycles'] !== undefined) config.maxCycles = Number(flags['max-cycles']);
  if (typeof flags.reviewed === 'string') config.markers.reviewed = flags.reviewed;
  return config;
}

function pidAlive(pid) {
  try { process.kill(pid, 0); return true; } catch (error) { return error.code === 'EPERM'; }
}

// Stale = older than lockMaxAgeMinutes AND no live process. A young lock of a dead pid still blocks (conservative).
function inspectLock(stateDir, config) {
  const file = path.join(stateDir, 'relay.lock');
  if (!fs.existsSync(file)) return { estado: 'livre', file };
  let info = {};
  try { info = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { info = {}; }
  const ageMin = Math.round((Date.now() - Date.parse(info.ts || 0)) / 60000);
  const alive = Number.isInteger(info.pid) && pidAlive(info.pid);
  const stale = ageMin > config.lockMaxAgeMinutes && !alive;
  const estado = stale ? 'velho' : alive ? 'ativo' : 'recente';
  return { estado, file, pid: info.pid, ageMin };
}

// The relay is the only writer of relay.log.jsonl; the AIs never touch it.
function appendLog(stateDir, event) {
  fs.mkdirSync(stateDir, { recursive: true });
  const line = JSON.stringify({ ts: new Date().toISOString(), ...event });
  fs.appendFileSync(path.join(stateDir, 'relay.log.jsonl'), line + '\n', 'utf8');
}

// The hookify rules live versioned in tools/relay/hookify/ and are copied to .claude/ (local, ignored) on first use.
// Toggling edits only the "enabled:" frontmatter line; the ECC runtime reads it on every hook call.
function setRules(root, enabled) {
  const sourceDir = path.join(__dirname, 'hookify');
  const targetDir = path.join(root, '.claude');
  fs.mkdirSync(targetDir, { recursive: true });
  for (const name of fs.readdirSync(sourceDir).filter(file => /^hookify\..+\.local\.md$/.test(file))) {
    const target = path.join(targetDir, name);
    const text = fs.readFileSync(fs.existsSync(target) ? target : path.join(sourceDir, name), 'utf8');
    fs.writeFileSync(target, text.replace(/^enabled:\s*(true|false)\s*$/m, 'enabled: ' + enabled), 'utf8');
  }
}

function switchOff(root, stateDir) {
  setRules(root, false);
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(path.join(stateDir, 'disabled'), '');
}

// Keeps only the newest `keep` files of logs/ (never deletes anything outside it).
function rotateLogs(logsDir, keep) {
  const files = fs.readdirSync(logsDir).map(name => ({ name, mtime: fs.statSync(path.join(logsDir, name)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  for (const file of files.slice(keep)) fs.rmSync(path.join(logsDir, file.name), { force: true });
}

const STEPS = {
  'claude-red': { quem: 'claude', prompt: 'claude-red.md' },
  'codex-green': { quem: 'codex', prompt: 'codex-green.md' },
  'claude-verify': { quem: 'claude', prompt: 'claude-verify.md' },
  'claude-review': { quem: 'claude', prompt: 'claude-review.md' },
};

function sectionHash(section) {
  return crypto.createHash('sha256').update(section ? section.text : '').digest('hex');
}

function hashFile(stateDir, ticketRel) {
  return path.join(stateDir, 'state', ticketRel.replace(/[\\/: ]/g, '_') + '.last-hash');
}

function renderPrompt(step, vars) {
  const template = fs.readFileSync(path.join(__dirname, 'prompts', step.prompt), 'utf8');
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => (key in vars ? vars[key] : '{{' + key + '}}'));
}

// Fixed models/effort come from the config, never from global defaults. No resume/continue flags: every step is a fresh session.
function buildCommand(config, quem, stepLogBase) {
  const spec = config[quem];
  if (quem === 'claude') {
    return {
      command: spec.command,
      args: [...spec.prefixArgs, '-p', '--model', spec.model, '--effort', spec.effort,
        '--permission-mode', spec.permissionMode || 'dontAsk', '--no-session-persistence',
        '--output-format', 'stream-json', '--verbose',
        '--allowedTools', ...spec.allowedTools, '--disallowedTools', ...spec.disallowedTools],
    };
  }
  return {
    command: spec.command,
    args: [...spec.prefixArgs, 'exec', '-m', spec.model, '-c', 'model_reasoning_effort="' + spec.effort + '"',
      '-s', spec.sandbox, '--ephemeral', '--json', '-o', stepLogBase + '.last-message.txt'],
  };
}

// Windows: npm installs CLIs as .cmd shims, which spawn() cannot run directly. Resolve bare names via PATH
// and run shims through the shell with explicitly quoted arguments (the prompt never travels as an argument).
function resolveCommand(command, env) {
  if (process.platform !== 'win32' || /[\\/]/.test(command) || path.extname(command)) return command;
  for (const dir of String(env.PATH || env.Path || '').split(path.delimiter).filter(Boolean)) {
    for (const ext of ['.exe', '.cmd', '.bat']) {
      if (fs.existsSync(path.join(dir, command + ext))) return path.join(dir, command + ext);
    }
  }
  return command;
}

function quoteArg(arg) {
  return /[\s"&|<>^%]/.test(arg) ? '"' + arg.replace(/"/g, '\\"') + '"' : arg;
}

function killTree(child) {
  if (process.platform === 'win32') spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
  else child.kill('SIGKILL');
}

// abortReason() is polled while the step runs (disabled file, timeout, Ctrl+C); a non-empty reason kills the process tree.
function runProcess({ command, args, cwd, env, input, logFile, abortReason }) {
  return new Promise(resolve => {
    const started = Date.now();
    const out = fs.openSync(logFile, 'w');
    let bytes = 0;
    let tail = '';
    const resolved = resolveCommand(command, env);
    const shim = process.platform === 'win32' && /\.(cmd|bat)$/i.test(resolved);
    const child = shim
      ? spawn(quoteArg(resolved), args.map(quoteArg), { cwd, env, shell: true, stdio: ['pipe', 'pipe', 'pipe'] })
      : spawn(resolved, args, { cwd, env, stdio: ['pipe', 'pipe', 'pipe'] });
    const collect = chunk => { bytes += chunk.length; fs.writeSync(out, chunk); tail = (tail + chunk.toString('utf8')).slice(-2000); };
    child.stdout.on('data', collect);
    child.stderr.on('data', collect);
    let aborted = '';
    const poll = setInterval(() => {
      aborted = aborted || abortReason();
      if (aborted) killTree(child);
    }, 300);
    child.on('error', error => { tail += String(error.message); });
    child.on('close', code => {
      clearInterval(poll);
      fs.closeSync(out);
      resolve({ aborted, code: code === null ? -1 : code, bytes, tail, duracaoS: Math.round((Date.now() - started) / 100) / 10 });
    });
    child.stdin.on('error', () => {});
    child.stdin.end(input);
  });
}

async function runLoop({ root, config, ticketRel, stateDir }) {
  const ticketPath = path.join(root, ticketRel);
  const logsDir = path.join(stateDir, 'logs');
  fs.mkdirSync(logsDir, { recursive: true });
  appendLog(stateDir, { ticket: ticketRel, ciclo: 0, evento: 'start' });
  let cycle = 0;
  let interrupted = false;
  process.once('SIGINT', () => { interrupted = true; });
  for (;;) {
    const plan = classify(fs.readFileSync(ticketPath, 'utf8'), config.markers);
    const step = STEPS[plan.acao];
    if (!step) {
      appendLog(stateDir, { ticket: ticketRel, ciclo: cycle, evento: 'stop', saida: plan.acao + ':' + plan.motivo });
      return 0;
    }
    const hashPath = hashFile(stateDir, ticketRel);
    const before = sectionHash(plan.section);
    if (fs.existsSync(hashPath) && fs.readFileSync(hashPath, 'utf8').trim() === before) {
      appendLog(stateDir, { ticket: ticketRel, ciclo: cycle, evento: 'stop', saida: 'secao-ja-processada' });
      return 1;
    }
    if (cycle >= config.maxCycles) {
      appendLog(stateDir, { ticket: ticketRel, ciclo: cycle, evento: 'limite', saida: 'teto=' + config.maxCycles });
      appendLog(stateDir, { ticket: ticketRel, ciclo: cycle, evento: 'stop', saida: 'limite' });
      return 1;
    }
    cycle += 1;
    const base = path.join(logsDir, 'c' + cycle + '-' + plan.acao);
    const prompt = renderPrompt(step, {
      TICKET: ticketRel, CYCLE: String(cycle), READY: config.markers.ready, REVIEWED: config.markers.reviewed,
      SECTION: plan.section ? plan.section.text : '',
    });
    const spec = buildCommand(config, step.quem, path.relative(root, base));
    const modelo = config[step.quem].model;
    appendLog(stateDir, { ticket: ticketRel, ciclo: cycle, evento: 'passo_iniciado', quem: step.quem, modelo });
    const stepStart = Date.now();
    const result = await runProcess({
      ...spec, cwd: root, env: { ...process.env, ...config[step.quem].env }, input: prompt, logFile: base + '.log',
      abortReason: () => {
        if (fs.existsSync(path.join(stateDir, 'disabled'))) return 'disabled';
        if (interrupted) return 'ctrl-c';
        return Date.now() - stepStart > config.stepTimeoutMinutes * 60000 ? 'timeout' : '';
      },
    });
    const done = {
      ticket: ticketRel, ciclo: cycle, quem: step.quem, modelo,
      saida: 'exit=' + result.code + ' bytes=' + result.bytes, duracao_s: result.duracaoS, ref: path.relative(root, base + '.log'),
    };
    rotateLogs(logsDir, config.logRetention);
    if (result.aborted) {
      appendLog(stateDir, { ...done, evento: 'passo_erro', erro: 'interrompido: ' + result.aborted });
      appendLog(stateDir, { ticket: ticketRel, ciclo: cycle, evento: 'stop', saida: result.aborted });
      return 1;
    }
    if (result.code !== 0) {
      appendLog(stateDir, { ...done, evento: 'passo_erro', erro: result.tail.trim().split(/\r?\n/).slice(0, 5).join('\n').slice(0, 600) });
      appendLog(stateDir, { ticket: ticketRel, ciclo: cycle, evento: 'stop', saida: 'passo_erro' });
      return 1;
    }
    appendLog(stateDir, { ...done, evento: 'passo_ok' });
    // Recorded only after a successful return, so a failed step can be retried by the next start.
    fs.mkdirSync(path.dirname(hashPath), { recursive: true });
    fs.writeFileSync(hashPath, before);
    if (sectionHash(lastSection(fs.readFileSync(ticketPath, 'utf8'))) === before) {
      appendLog(stateDir, { ticket: ticketRel, ciclo: cycle, evento: 'stop', saida: 'sem-progresso' });
      return 1;
    }
  }
}

async function main(argv) {
  const { positional, flags } = parseArgs(argv);
  const [command, ticketRel] = positional;
  const root = path.resolve(flags.root || path.join(__dirname, '..', '..'));
  const config = loadConfig(root, flags);
  const logFile = path.join(root, config.stateDir, 'relay.log.jsonl');
  const readEvents = () => (fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line)) : []);
  const formatEvent = e => [e.ts, 'c' + e.ciclo, e.evento, e.quem, e.modelo, e.saida, e.duracao_s !== undefined ? e.duracao_s + 's' : '',
    e.erro ? String(e.erro).replace(/\s*\n\s*/g, ' | ') : '', e.ref, e.ticket].filter(part => part !== undefined && part !== '').join(' ');
  if (command === 'log') {
    const count = Number(flags.last) || 20;
    for (const event of readEvents().slice(-count)) console.log(formatEvent(event));
    return 0;
  }
  if (command === 'status') {
    const stateDir = path.join(root, config.stateDir);
    console.log('relay=' + (fs.existsSync(path.join(stateDir, 'disabled')) ? 'desligado' : 'ligado'));
    const lock = inspectLock(stateDir, config);
    console.log('lock=' + lock.estado + (lock.pid ? ' pid=' + lock.pid : ''));
    const last = readEvents().at(-1);
    console.log('ultimo=' + (last ? formatEvent(last) : 'nenhum'));
    return 0;
  }
  if (command === 'stop') {
    const stateDir = path.join(root, config.stateDir);
    switchOff(root, stateDir);
    appendLog(stateDir, { ciclo: 0, evento: 'stop', saida: 'manual' });
    console.log('Relay switched off; hookify rules disabled.');
    return 0;
  }
  if (command === 'start') {
    const text = fs.readFileSync(path.join(root, ticketRel), 'utf8');
    const plan = classify(text, config.markers);
    const stateDir = path.join(root, config.stateDir);
    if (flags['dry-run'] !== true) {
      const disabledFile = path.join(stateDir, 'disabled');
      if (fs.existsSync(disabledFile)) {
        if (flags.enable !== true) {
          appendLog(stateDir, { ticket: ticketRel, ciclo: 0, evento: 'stop', saida: 'disabled' });
          console.error('Relay is disabled (' + path.relative(root, disabledFile) + '). Pass --enable to authorize this run.');
          return 1;
        }
        fs.rmSync(disabledFile);
      }
      const lock = inspectLock(stateDir, config);
      if (lock.estado === 'ativo' || lock.estado === 'recente') {
        appendLog(stateDir, { ticket: ticketRel, ciclo: 0, evento: 'stop', saida: 'lock-' + lock.estado });
        console.error('Another relay run holds ' + path.relative(root, lock.file) + ' (' + lock.estado + ').');
        return 1;
      }
      fs.mkdirSync(stateDir, { recursive: true });
      if (lock.estado === 'velho') fs.rmSync(lock.file);
      fs.writeFileSync(lock.file, JSON.stringify({ pid: process.pid, ts: new Date().toISOString(), ticket: ticketRel }), { flag: 'wx' });
      setRules(root, true);
      try {
        return await runLoop({ root, config, ticketRel, stateDir });
      } finally {
        switchOff(root, stateDir);
        fs.rmSync(lock.file, { force: true });
      }
    }
    const disabled = fs.existsSync(path.join(stateDir, 'disabled'));
    console.log('disabled=' + (disabled ? 'sim' : 'nao') + (disabled ? ' (start real recusaria iniciar)' : ''));
    const lock = inspectLock(stateDir, config);
    const lockNote = { livre: '', velho: ' (limparia o lock velho e seguiria)', ativo: ' (recusaria iniciar: outra execucao viva)', recente: ' (recusaria iniciar: lock recente)' }[lock.estado];
    console.log('lock=' + lock.estado + (lock.pid ? ' pid=' + lock.pid + ' idade=' + lock.ageMin + 'min' : '') + lockNote);
    console.log('teto=' + config.maxCycles + ' ciclos');
    appendLog(stateDir, { ticket: ticketRel, ciclo: 0, evento: 'start', dry_run: true });
    console.log('acao=' + plan.acao + (plan.motivo ? ' motivo=' + plan.motivo : ''));
    if (plan.motivo === 'secao-desconhecida') console.log('aviso: ultima secao nao reconhecida: ' + plan.section.heading);
    appendLog(stateDir, { ticket: ticketRel, ciclo: 0, evento: 'stop', dry_run: true, saida: plan.acao + (plan.motivo ? ':' + plan.motivo : '') });
    return 0;
  }
  console.error('unknown command: ' + command);
  return 2;
}

if (require.main === module) main(process.argv.slice(2)).then(code => { process.exitCode = code; });
module.exports = { parseArgs, classify };
