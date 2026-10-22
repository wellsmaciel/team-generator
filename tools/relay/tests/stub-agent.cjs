// Fake claude/codex for relay.test.cjs: no AI is called. Behaviour comes from $STUB_DIR/script.json:
//   { "claude": [ { "append": "...", "exit": 0, "sleepMs": 0 } ], "codex": [ ... ] }
// Each invocation consumes the next action for its role and records argv, stdin and cwd in calls.jsonl.
const fs = require('node:fs');
const path = require('node:path');

const dir = process.env.STUB_DIR;
const args = process.argv.slice(2);
const role = args.includes('exec') ? 'codex' : 'claude';
const stdin = fs.readFileSync(0, 'utf8');

const scriptFile = path.join(dir, 'script.json');
const script = JSON.parse(fs.readFileSync(scriptFile, 'utf8'));
const action = (script[role] || []).shift() || {};
fs.writeFileSync(scriptFile, JSON.stringify(script));
const watched = {};
for (const file of (process.env.STUB_WATCH || '').split(',').filter(Boolean)) {
  watched[path.basename(file)] = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
}
fs.appendFileSync(path.join(dir, 'calls.jsonl'), JSON.stringify({ role, args, stdin, cwd: process.cwd(), watched }) + '\n');

if (action.touch) fs.writeFileSync(action.touch, '');
setTimeout(() => {
  if (action.append) fs.appendFileSync(process.env.STUB_TICKET, '\n\n' + action.append + '\n', 'utf8');
  if (action.stdout) process.stdout.write(action.stdout);
  if (action.stderr) process.stderr.write(action.stderr);
  process.exit(action.exit || 0);
}, action.sleepMs || 0);
