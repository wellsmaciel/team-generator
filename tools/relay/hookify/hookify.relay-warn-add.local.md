---
name: relay-warn-add
enabled: false
event: bash
action: warn
pattern: git\s+add\s+(-A|--all|\.)(\s|$)
---

Relay policy: stage only explicit file paths (git add -- <path>), never -A, --all or ".". Nobody stages or commits during a relay run; the user commits after reviewing the ticket.
