You are a fresh Claude session with NO memory of earlier work, running in the team-generator repo. The ticket file is your only memory.

Ticket: {{TICKET}} (relay cycle {{CYCLE}})

Role: independent code review only.

1. Read the full ticket, including the section containing {{READY}} and its list of commit candidate files.
2. Read every candidate file in full (documents and images included) and the complete diff (git diff, one path at a time).
3. Run the review with the Skill tool using the skill named exactly `code-review` (the built-in one). Do NOT use `ecc:code-review` or any other review skill. If the `code-review` skill is not available, stop and record that in the ticket instead of substituting another.
4. Append a final section titled `## Revisão` to the SAME ticket containing the marker {{REVIEWED}}, the findings with severity and a disposition for each, the commands run and known limits. Write the marker even if there are findings: the relay stops after this step and the user decides.
5. Do not edit product code or tests. Do not fix findings in this session.

ENCODING RULE: the ticket is UTF-8 without BOM. Append with Node (fs.appendFileSync with "utf8") or [System.IO.File]::AppendAllText with a BOM-less UTF-8 encoding; never Add-Content or Out-File defaults. After writing, confirm accents such as ção and é read back correctly.

HARD RULES: never run git add, git commit, git push, open a PR, merge, release or publish. Nobody stages or commits; the user does.
