// Run with: node tools/relay/tests/relay.test.cjs
// Drives relay.cjs as a child process against a throwaway workspace; claude/codex are stubs, no real AI.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const RELAY = path.join(__dirname, '..', 'relay.cjs');
const REAL_CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'relay.config.json'), 'utf8'));
const STUB = path.join(__dirname, 'stub-agent.cjs');
const RULES = ['hookify.relay-block-git.local.md', 'hookify.relay-warn-add.local.md'];
const TICKET_REL ='.scratch/relay-test/ticket.md';

function makeWorkspace(ticketText) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'relay-test-'));
  const stateDir = path.join(root, '.claude', 'codex-relay');
  fs.mkdirSync(stateDir, { recursive: true });
  fs.mkdirSync(path.join(root, '.scratch', 'relay-test'), { recursive: true });
  fs.writeFileSync(path.join(root, TICKET_REL), ticketText, 'utf8');
  const configPath = path.join(root, 'relay.test.config.json');
  const config = JSON.parse(JSON.stringify(REAL_CONFIG));
  for (const who of ['claude', 'codex']) {
    config[who].command = process.execPath;
    config[who].prefixArgs = [STUB];
  }
  const stubDir = path.join(root, 'stub');
  fs.mkdirSync(stubDir);
  const ws = {
    root,
    stateDir,
    stubDir,
    config,
    script(actions) { fs.writeFileSync(path.join(stubDir, 'script.json'), JSON.stringify(actions)); },
    calls() {
      const file = path.join(stubDir, 'calls.jsonl');
      return fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line)) : [];
    },
    run(args) {
      fs.writeFileSync(configPath, JSON.stringify(ws.config), 'utf8');
      const env = {
        ...process.env, STUB_DIR: stubDir, STUB_TICKET: path.join(root, TICKET_REL),
        STUB_WATCH: RULES.map(name => path.join(root, '.claude', name)).join(','),
      };
      if (ws.pathPrepend) env.PATH = ws.pathPrepend + path.delimiter + env.PATH;
      const result = spawnSync(process.execPath, [RELAY, ...args, '--root', root, '--config', configPath], { encoding: 'utf8', env, timeout: 20000 });
      return { status: result.status, out: result.stdout + result.stderr };
    },
  };
  ws.script({});
  return ws;
}

const tests = [];
function test(name, options, fn) {
  if (typeof options === 'function') { fn = options; options = {}; }
  if (options.onlyWin32 && process.platform !== 'win32') return;
  tests.push([name, fn]);
}

test('dry-run on a ticket without any handoff plans a fresh Claude RED step', () => {
  const ws = makeWorkspace('# Ticket\n\n## Critérios\n\n- algo\n');
  const result = ws.run(['start', TICKET_REL, '--dry-run']);
  assert.equal(result.status, 0, result.out);
  assert.match(result.out, /acao=claude-red/);
});

test('dry-run plans a fresh Codex step when the last section is a handoff to Codex (arrow or ASCII)', () => {
  for (const heading of ['## Passagem Claude → Codex', '## Passagem 3 Claude -> Codex']) {
    const ws = makeWorkspace('# Ticket\n\n## Passagem Codex -> Claude\n\nantiga\n\n' + heading + '\n\nfaça isto\n');
    const result = ws.run(['start', TICKET_REL, '--dry-run']);
    assert.match(result.out, /acao=codex-green/, heading + '\n' + result.out);
  }
});

test('dry-run plans a fresh Claude verify step when the last section is a handoff to Claude', () => {
  for (const heading of ['## Passagem Codex -> Claude', '## Passagem 2 Codex → Claude']) {
    const ws = makeWorkspace('# Ticket\n\n## Passagem Claude → Codex\n\nantiga\n\n' + heading + '\n\nfeito\n');
    const result = ws.run(['start', TICKET_REL, '--dry-run']);
    assert.match(result.out, /acao=claude-verify/, heading + '\n' + result.out);
  }
});

test('dry-run plans a review-only Claude step when the last section carries the ready marker', () => {
  const ws = makeWorkspace('# Ticket\n\n## Passagem Codex -> Claude\n\nfeito\n\n## Pronto\n\nPRONTO_PARA_REVISAO\n- a.js\n');
  const result = ws.run(['start', TICKET_REL, '--dry-run']);
  assert.match(result.out, /acao=claude-review/, result.out);
});

test('markers are parameters: a custom ready marker is honoured and the default one is not', () => {
  const ws = makeWorkspace('# Ticket\n\n## Fim\n\nTASK99_READY\n');
  assert.match(ws.run(['start', TICKET_REL, '--dry-run', '--ready', 'TASK99_READY']).out, /acao=claude-review/);
  assert.doesNotMatch(ws.run(['start', TICKET_REL, '--dry-run']).out, /acao=claude-review/);
});

test('dry-run stops when the last section carries the reviewed marker, even if it quotes the ready marker', () => {
  const ws = makeWorkspace('# Ticket\n\n## Pronto\n\nPRONTO_PARA_REVISAO\n\n## Revisão\n\nREVISADO (era PRONTO_PARA_REVISAO)\n');
  const result = ws.run(['start', TICKET_REL, '--dry-run']);
  assert.match(result.out, /acao=parar motivo=revisado/, result.out);
});

test('dry-run stops and warns, without guessing, on an unrecognised last section after earlier handoffs', () => {
  const ws = makeWorkspace('# Ticket\n\n## Passagem Claude → Codex\n\nx\n\n## Bloqueio\n\nfalta decisão\n');
  const result = ws.run(['start', TICKET_REL, '--dry-run']);
  assert.match(result.out, /acao=parar motivo=secao-desconhecida/, result.out);
  assert.match(result.out, /Bloqueio/, result.out);
});

test('dry-run reports the disabled switch and that a real start would refuse', () => {
  const ws = makeWorkspace('# Ticket\n');
  assert.match(ws.run(['start', TICKET_REL, '--dry-run']).out, /disabled=nao/);
  fs.writeFileSync(path.join(ws.stateDir, 'disabled'), '');
  const result = ws.run(['start', TICKET_REL, '--dry-run']);
  assert.match(result.out, /disabled=sim/, result.out);
  assert.match(result.out, /recusaria iniciar/, result.out);
});

test('dry-run reports the cycle cap from config and lets --max-cycles override it', () => {
  const ws = makeWorkspace('# Ticket\n');
  assert.match(ws.run(['start', TICKET_REL, '--dry-run']).out, /teto=12 ciclos/);
  assert.match(ws.run(['start', TICKET_REL, '--dry-run', '--max-cycles', '3']).out, /teto=3 ciclos/);
});

function writeLock(ws, { pid, ageMinutes }) {
  const lock = path.join(ws.stateDir, 'relay.lock');
  fs.writeFileSync(lock, JSON.stringify({ pid, ts: new Date(Date.now() - ageMinutes * 60000).toISOString() }));
  return lock;
}

const DEAD_PID = 2147483646;

test('dry-run reports a stale lock (older than 30 min, no live process) as clearable and a fresh or live one as blocking', () => {
  const ws = makeWorkspace('# Ticket\n');
  assert.match(ws.run(['start', TICKET_REL, '--dry-run']).out, /lock=livre/);
  writeLock(ws, { pid: DEAD_PID, ageMinutes: 45 });
  assert.match(ws.run(['start', TICKET_REL, '--dry-run']).out, /lock=velho .*limparia/);
  writeLock(ws, { pid: process.pid, ageMinutes: 45 });
  assert.match(ws.run(['start', TICKET_REL, '--dry-run']).out, /lock=ativo .*recusaria iniciar/);
  writeLock(ws, { pid: DEAD_PID, ageMinutes: 5 });
  assert.match(ws.run(['start', TICKET_REL, '--dry-run']).out, /lock=recente .*recusaria iniciar/);
});

function readLog(ws) {
  const file = path.join(ws.stateDir, 'relay.log.jsonl');
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line)) : [];
}

test('dry-run appends start and stop events to relay.log.jsonl with the agreed fields', () => {
  const ws = makeWorkspace('# Ticket\n');
  ws.run(['start', TICKET_REL, '--dry-run']);
  const events = readLog(ws);
  assert.deepEqual(events.map(e => e.evento), ['start', 'stop']);
  for (const event of events) {
    assert.equal(event.ticket, TICKET_REL);
    assert.equal(event.dry_run, true);
    assert.ok(!Number.isNaN(Date.parse(event.ts)));
  }
  assert.equal(events[0].ciclo, 0);
});

const FULL_FLOW = {
  claude: [
    { append: '## Passagem Claude → Codex\n\nred feito' },
    { append: '## Pronto para revisão\n\nPRONTO_PARA_REVISAO\n- a.js' },
    { append: '## Revisão\n\nREVISADO sem achados' },
  ],
  codex: [{ append: '## Passagem Codex -> Claude\n\ngreen feito' }],
};

test('a real start walks RED -> GREEN -> verify -> review in fresh processes and stops at the reviewed marker', () => {
  const ws = makeWorkspace('# Ticket\n\n## Critérios\n\n- algo\n');
  ws.script(FULL_FLOW);
  const result = ws.run(['start', TICKET_REL]);
  assert.equal(result.status, 0, result.out);
  assert.deepEqual(ws.calls().map(c => c.role), ['claude', 'codex', 'claude', 'claude']);
  assert.match(fs.readFileSync(path.join(ws.root, TICKET_REL), 'utf8'), /REVISADO sem achados\n$/);
  const events = readLog(ws);
  assert.deepEqual(events.map(e => e.evento), ['start', 'passo_iniciado', 'passo_ok', 'passo_iniciado', 'passo_ok',
    'passo_iniciado', 'passo_ok', 'passo_iniciado', 'passo_ok', 'stop']);
  assert.deepEqual(events.filter(e => e.evento === 'passo_ok').map(e => e.ciclo), [1, 2, 3, 4]);
});

test('a failing step is logged as passo_erro with the first error lines and the relay stops without retrying', () => {
  const ws = makeWorkspace('# Ticket\n');
  ws.script({ claude: [{ exit: 3, stderr: 'boom line 1\nboom line 2\nl3\nl4\nl5\nl6\nl7\n' }, { append: '## Passagem Claude → Codex\n\nnão deve rodar' }] });
  const result = ws.run(['start', TICKET_REL]);
  assert.notEqual(result.status, 0);
  assert.equal(ws.calls().length, 1);
  const events = readLog(ws);
  assert.deepEqual(events.map(e => e.evento), ['start', 'passo_iniciado', 'passo_erro', 'stop']);
  const failure = events[2];
  assert.equal(failure.quem, 'claude');
  assert.match(failure.erro, /^boom line 1\nboom line 2/);
  assert.ok(failure.erro.split('\n').length <= 5);
  assert.match(failure.saida, /exit=3/);
  assert.match(failure.ref, /logs[\\/]c1-claude-red\.log$/);
});

function hashFiles(ws) {
  const dir = path.join(ws.stateDir, 'state');
  return fs.existsSync(dir) ? fs.readdirSync(dir).filter(name => name.endsWith('.last-hash')) : [];
}

test('a step that leaves the ticket unchanged stops the relay, records the handled section hash, and a restart refuses the same section', () => {
  const ws = makeWorkspace('# Ticket\n\n## Passagem Claude → Codex\n\nfaça\n');
  ws.script({ codex: [{}, { append: '## Passagem Codex -> Claude\n\nnão deve rodar' }] });
  assert.notEqual(ws.run(['start', TICKET_REL]).status, 0);
  assert.equal(ws.calls().length, 1);
  assert.equal(readLog(ws).at(-1).saida, 'sem-progresso');
  assert.equal(hashFiles(ws).length, 1);
  const again = ws.run(['start', TICKET_REL, '--enable']);
  assert.notEqual(again.status, 0);
  assert.equal(ws.calls().length, 1, 'the same section must not be relayed twice');
  assert.equal(readLog(ws).at(-1).saida, 'secao-ja-processada');
});

test('the section hash is not recorded when the step fails', () => {
  const ws = makeWorkspace('# Ticket\n\n## Passagem Claude → Codex\n\nfaça\n');
  ws.script({ codex: [{ exit: 1 }] });
  ws.run(['start', TICKET_REL]);
  assert.equal(hashFiles(ws).length, 0);
});

test('the cycle cap stops a ping-pong that keeps making progress and logs a limite event', () => {
  const ws = makeWorkspace('# Ticket\n');
  const claude = [1, 2, 3, 4, 5].map(n => ({ append: '## Passagem Claude → Codex\n\nvolta ' + n }));
  const codex = [1, 2, 3, 4, 5].map(n => ({ append: '## Passagem Codex -> Claude\n\nvolta ' + n }));
  ws.script({ claude: [claude[0], claude[1], claude[2]], codex });
  const result = ws.run(['start', TICKET_REL, '--max-cycles', '3']);
  assert.notEqual(result.status, 0);
  assert.equal(ws.calls().length, 3);
  assert.deepEqual(readLog(ws).slice(-2).map(e => e.evento), ['limite', 'stop']);
});

test('a real start refuses to run while the disabled file exists, and --enable removes it explicitly', () => {
  const ws = makeWorkspace('# Ticket\n');
  fs.writeFileSync(path.join(ws.stateDir, 'disabled'), '');
  ws.script({ claude: [{ append: '## Passagem Claude → Codex\n\nx' }], codex: [{ append: '## Passagem Codex -> Claude\n\ny' }] });
  const refused = ws.run(['start', TICKET_REL]);
  assert.notEqual(refused.status, 0);
  assert.equal(ws.calls().length, 0);
  assert.equal(readLog(ws).at(-1).saida, 'disabled');
  ws.run(['start', TICKET_REL, '--enable', '--max-cycles', '1']);
  assert.equal(ws.calls().length, 1);
});

test('creating the disabled file during a step kills that step and stops the relay', () => {
  const ws = makeWorkspace('# Ticket\n');
  ws.script({ claude: [{ touch: path.join(ws.stateDir, 'disabled'), sleepMs: 15000, append: '## Passagem Claude → Codex\n\ntarde demais' }] });
  const started = Date.now();
  const result = ws.run(['start', TICKET_REL]);
  assert.ok(Date.now() - started < 10000, 'step was not interrupted');
  assert.notEqual(result.status, 0);
  assert.equal(readLog(ws).at(-1).saida, 'disabled');
  assert.doesNotMatch(fs.readFileSync(path.join(ws.root, TICKET_REL), 'utf8'), /tarde demais/);
});

test('a real start refuses a live or recent lock without touching it', () => {
  for (const lock of [{ pid: process.pid, ageMinutes: 45 }, { pid: DEAD_PID, ageMinutes: 5 }]) {
    const ws = makeWorkspace('# Ticket\n');
    const file = writeLock(ws, lock);
    ws.script({ claude: [{ append: '## Passagem Claude → Codex\n\nx' }] });
    assert.notEqual(ws.run(['start', TICKET_REL]).status, 0);
    assert.equal(ws.calls().length, 0);
    assert.match(readLog(ws).at(-1).saida, /^lock-/);
    assert.ok(fs.existsSync(file));
  }
});

test('a real start clears a stale lock, holds its own lock while running and releases it afterwards', () => {
  const ws = makeWorkspace('# Ticket\n');
  const file = writeLock(ws, { pid: DEAD_PID, ageMinutes: 45 });
  ws.script({ claude: [{ append: '## Pronto\n\nPRONTO_PARA_REVISAO', sleepMs: 0 }], codex: [] });
  ws.config.maxCycles = 1;
  ws.run(['start', TICKET_REL]);
  assert.equal(ws.calls().length, 1);
  assert.ok(!fs.existsSync(file), 'lock must be released');
});

test('start enables the hookify rules only while running; the run ends with them disabled and the relay switched off', () => {
  const ws = makeWorkspace('# Ticket\n');
  ws.script({ claude: [{ append: '## Pronto\n\nPRONTO_PARA_REVISAO' }, { append: '## Revisão\n\nREVISADO' }] });
  ws.run(['start', TICKET_REL]);
  const during = ws.calls()[0].watched;
  for (const name of RULES) assert.match(during[name], /^enabled: true$/m, name);
  for (const name of RULES) {
    const after = fs.readFileSync(path.join(ws.root, '.claude', name), 'utf8');
    assert.match(after, /^enabled: false$/m, name);
    assert.doesNotMatch(after, /^enabled: true$/m, name);
  }
  assert.ok(fs.existsSync(path.join(ws.stateDir, 'disabled')));
});

test('stop switches the relay off and disables the hookify rules', () => {
  const ws = makeWorkspace('# Ticket\n');
  for (const name of RULES) fs.writeFileSync(path.join(ws.root, '.claude', name), '---\nname: x\nenabled: true\nevent: bash\n---\nmsg\n');
  const result = ws.run(['stop']);
  assert.equal(result.status, 0, result.out);
  assert.ok(fs.existsSync(path.join(ws.stateDir, 'disabled')));
  for (const name of RULES) assert.match(fs.readFileSync(path.join(ws.root, '.claude', name), 'utf8'), /^enabled: false$/m);
  assert.equal(readLog(ws).at(-1).evento, 'stop');
});

test('log --last N prints the last N events as readable lines, not raw JSON', () => {
  const ws = makeWorkspace('# Ticket\n');
  ws.script({ claude: [{ exit: 2, stderr: 'kaput' }] });
  ws.run(['start', TICKET_REL]);
  const result = ws.run(['log', '--last', '2']);
  const lines = result.out.trim().split('\n');
  assert.equal(lines.length, 2, result.out);
  assert.match(lines[0], /passo_erro .*claude .*claude-sonnet-5-5 .*exit=2/);
  assert.match(lines[0], /kaput/);
  assert.match(lines[1], /stop/);
  assert.doesNotMatch(result.out, /[{}"]/);
});

test('status shows whether the relay is on, the lock and the last event', () => {
  const ws = makeWorkspace('# Ticket\n');
  fs.writeFileSync(path.join(ws.stateDir, 'disabled'), '');
  const off = ws.run(['status']).out;
  assert.match(off, /relay=desligado/);
  assert.match(off, /lock=livre/);
});

test('acceptance: fixed models, fresh sessions, no bypass, prompt only on stdin, nothing sensitive in the relay log', () => {
  process.env.RELAY_TEST_SECRET = 'hunter2-secret-value';
  const ws = makeWorkspace('# Ticket\n');
  ws.script(FULL_FLOW);
  ws.run(['start', TICKET_REL]);
  delete process.env.RELAY_TEST_SECRET;
  const calls = ws.calls();
  const [red, green, verify, review] = calls;
  for (const call of [red, verify, review]) {
    assert.ok(call.args.includes('-p'));
    assert.deepEqual(call.args.slice(call.args.indexOf('--model'), call.args.indexOf('--model') + 2), ['--model', 'claude-sonnet-5-5']);
    assert.deepEqual(call.args.slice(call.args.indexOf('--effort'), call.args.indexOf('--effort') + 2), ['--effort', 'medium']);
  }
  assert.deepEqual(green.args.slice(0, 5), ['exec', '-m', 'gpt-6-luna', '-c', 'model_reasoning_effort="medium"']);
  for (const call of calls) {
    const joined = call.args.join(' ');
    assert.doesNotMatch(joined, /resume|--continue|--session-id|dangerously|bypassPermissions/, joined);
    assert.equal(call.cwd, fs.realpathSync(ws.root));
    assert.ok(call.stdin.includes(TICKET_REL), 'prompt must arrive on stdin and name the ticket');
    assert.ok(!joined.includes(TICKET_REL), 'prompt must not be passed as an argument');
  }
  assert.match(green.stdin, /red feito/, 'codex prompt carries the latest handoff section');
  assert.match(review.stdin, /skill named exactly `code-review`/);
  assert.doesNotMatch(red.stdin + verify.stdin + review.stdin + green.stdin, /\{\{/, 'all placeholders resolved');
  const log = fs.readFileSync(path.join(ws.stateDir, 'relay.log.jsonl'), 'utf8');
  assert.doesNotMatch(log, /hunter2|fresh Claude session|HARD RULES|PATH=/);
  assert.equal(readLog(ws).filter(e => e.evento === 'passo_ok').every(e => e.modelo && e.quem && e.ref), true);
});

test('step logs are rotated to the newest logRetention files and the current step logs survive', () => {
  const ws = makeWorkspace('# Ticket\n');
  const logsDir = path.join(ws.stateDir, 'logs');
  fs.mkdirSync(logsDir);
  for (let i = 0; i < 10; i += 1) {
    const file = path.join(logsDir, 'old-' + i + '.log');
    fs.writeFileSync(file, 'old');
    const when = new Date(Date.now() - (100 - i) * 60000);
    fs.utimesSync(file, when, when);
  }
  ws.config.logRetention = 4;
  ws.script({ claude: [{ append: '## Pronto\n\nPRONTO_PARA_REVISAO' }, { append: '## Revisão\n\nREVISADO' }] });
  ws.run(['start', TICKET_REL]);
  const left = fs.readdirSync(logsDir);
  assert.equal(left.length, 4, left.join(','));
  assert.ok(left.some(name => name.startsWith('c2-claude-review')));
  assert.ok(!left.includes('old-0.log'));
});

test('on Windows a bare command that resolves to a .cmd shim runs and keeps the quoted -c argument intact', { onlyWin32: true }, () => {
  const ws = makeWorkspace('# Ticket\n');
  const binDir = path.join(ws.root, 'bin');
  fs.mkdirSync(binDir);
  fs.writeFileSync(path.join(binDir, 'fakecodex.cmd'), '@echo off\r\n"' + process.execPath + '" "' + STUB + '" %*\r\n');
  ws.config.codex.command = 'fakecodex';
  ws.config.codex.prefixArgs = [];
  ws.pathPrepend = binDir;
  ws.script({ codex: [{ append: '## Passagem Codex -> Claude\n\nok' }] });
  fs.writeFileSync(path.join(ws.root, TICKET_REL), '# Ticket\n\n## Passagem Claude → Codex\n\nfaça\n');
  ws.run(['start', TICKET_REL, '--max-cycles', '1']);
  const [call] = ws.calls();
  assert.ok(call, 'the .cmd shim was not executed');
  assert.deepEqual(call.args.slice(0, 5), ['exec', '-m', 'gpt-6-luna', '-c', 'model_reasoning_effort="medium"']);
});

let failed = 0;
for (const [name, fn] of tests) {
  try { fn(); console.log('ok   - ' + name); } catch (error) { failed += 1; console.log('FAIL - ' + name + '\n' + error.message); }
}
process.exit(failed ? 1 : 0);
