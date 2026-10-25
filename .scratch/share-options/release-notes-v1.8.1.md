## What's new

- Clarify the device share, WhatsApp draft, and copy options, with a consistent responsive hierarchy.

All options use the same message without skill scores. The WhatsApp option opens a draft for the organizer to choose a recipient and send.

## Verification

- Full Playwright suite: 192 passed, 12 skipped by project configuration, 0 failed (desktop, 360 px, 390 px).
- Four Node regression scripts passed.
- Device share and WhatsApp handoff were simulated in Chromium; no physical device, native WhatsApp session, or real message send was tested.
