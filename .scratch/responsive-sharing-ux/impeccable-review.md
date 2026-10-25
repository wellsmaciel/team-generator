---
target: WhatsApp link and overall UX, phone/tablet/desktop
total_score: 30
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 4
target_identity: "file:C:\\VSC Projects\\team-generator\\index.html"
target_fingerprint: "sha256:104d95a7b111888ed344a3e59ae904a14a873474f9f86a736131fcc9c2978b10"
target_path: "C:\\VSC Projects\\team-generator\\index.html"
timestamp: 2026-10-25T09-52-23Z
slug: index-html
---
## Design-specificity verdict

Medium specificity. The workflow and domain concepts fit a futsal organizer (reusable roster, fixed goalkeepers, estimated skill, team generation, and private-by-default skill scores), but the dark-card visual language is generic. Source review only; browser rendering was unavailable.

## Heuristic scores

| Heuristic | Score |
| --- | ---: |
| Visibility of system status | 3/4 |
| Match between system and the real world | 4/4 |
| User control and freedom | 3/4 |
| Consistency and standards | 3/4 |
| Error prevention | 3/4 |
| Recognition rather than recall | 3/4 |
| Flexibility and efficiency of use | 2/4 |
| Aesthetic and minimalist design | 3/4 |
| Help users recognize, diagnose, and recover from errors | 3/4 |
| Help and documentation | 3/4 |

Total: 30/40.

## Cognitive load

Pass: content is chunked into sections, related controls are grouped, the roster remains visible while selecting, and teams/swaps/sharing are progressively revealed. Partial: match details, participant selection, team count, and generation are all presented in the Match area; participants require scanning a full list; skill scores can imply more precision than the estimate provides, though the interface explains they are estimates. No decision presents more than four obvious sharing choices: WhatsApp, copy, and manual text selection.

## Emotional journey

The first-run guide reduces uncertainty. Registering a full roster and selecting participants are the effort valley. Generated teams provide a payoff, and the estimate caveat protects trust. Copy success/failure messaging is useful. Opening WhatsApp transfers the organizer to another context without confirmation that a message was sent, so the handoff may feel uncertain; the interface should never imply a send occurred.

## Strengths

- Futsal-specific concepts and fixed-goalkeeper constraints are represented directly.
- The organizer keeps control through warnings, regeneration, undo, and manual swaps.
- WhatsApp and copy use the same message, with skill scores and totals omitted.

## Priority issues

1. Long rosters require scanning and scrolling to find a participant; a keyboard-accessible search/filter would help mobile organizers.
2. On compatible phones/tablets, a native share sheet could reduce friction while retaining direct WhatsApp and copy paths.
3. With a populated roster, the local-only persistence cue is no longer prominent; match location/date/time also reset on reload. Explain these limits near the relevant controls.
4. Optional match details occupy the first part of the Match flow along with selection and team generation. Improve hierarchy, especially in short mobile viewports.

## Persona red flags

- An organizer at the sideline may be using one hand, in bright sunlight, with a long roster.
- A nontechnical organizer may expect a populated roster to sync to another browser/device.
- A participant asked to rate skill may read an estimate as an objective score.

## Minor observations

- Font loading depends on Google Fonts, with system fallbacks already defined.
- Manual copy remains available through a read-only text area if clipboard access fails.
- Responsive CSS includes phone/tablet breakpoints and tablet touch-target rules, but rendered behavior was not verified here.
- A destructive player-registration action already has a confirmation dialog; an additional undo flow was not established as a priority by this review.

## Questions

- How many participants are in the longest roster organizers normally use?
- Should the quickest mobile route open a native share sheet, or stay directly in WhatsApp?
- Is it important to keep optional match details visible by default on the phone?
