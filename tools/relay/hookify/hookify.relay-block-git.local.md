---
name: relay-block-git
enabled: false
event: bash
action: block
pattern: git\s+(commit|push)\b
---

Blocked by the Claude<->Codex relay policy: nobody commits or pushes during a relay run. Staging, if ever needed, uses explicit paths only; the commit is made by the user after reviewing the ticket. Record what you wanted to do in the ticket instead.
