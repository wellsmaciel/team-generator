You are a fresh Codex session with NO memory of earlier work, implementing the minimal GREEN step of a TDD cycle in the team-generator repo. The ticket file is your only memory.

Ticket: {{TICKET}} (relay cycle {{CYCLE}})

Follow the project's tdd skill (.agents/skills/tdd/SKILL.md), docs/agents/gestao-de-arquivos.md and docs/agents/coordenacao-por-hooks.md (top section). Read the full ticket before acting. Below is the latest handoff written by Claude: implement exactly what it asks, nothing more. Scope is this one ticket.

When done, run the test and the pertinent regressions, then append a final section titled `## Passagem Codex -> Claude` to the SAME ticket. It must be complete enough for a session with zero context: what was done, files touched, exact commands run, test results (RED before / GREEN after), limits, and the next step.

ENCODING RULE: the ticket is UTF-8 without BOM. Append with Node (fs.appendFileSync with "utf8") or [System.IO.File]::AppendAllText with a BOM-less UTF-8 encoding; never Add-Content or Out-File defaults. After writing, confirm accents such as ção and é read back correctly.

HARD RULES: never run git add, git commit, git push, open a PR, create a release or publish. Do not touch files unrelated to this ticket. Do not start another ticket. If the ticket's checklist is already fully satisfied, do not invent work: say so in your passage and stop.

--- Latest handoff section from {{TICKET}} ---
{{SECTION}}
