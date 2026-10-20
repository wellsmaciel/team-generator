# Team Generator

A static web application for selecting participants and forming teams using integer skill scores from 1 to 10. No framework, backend or external dependencies are required.

## Run locally

Keep `index.html`, `script.js`, `styles.css` and `Dark_court.jpg` together, then open `index.html` in a browser. A local static server, such as VS Code Live Server, is optional. Use the same address and browser profile when checking saved players.

## How to use

1. Enter a player name, a whole-number skill score from 1 to 10 and, optionally, mark **Fixed goalkeeper**. Click **Add Player**.
2. Use **Edit** to change a registration, **Save changes** to save it or **Cancel edit** to discard the edit. **Delete** asks for confirmation. Duplicate names are allowed.
3. Check the players participating in this match, or click **Select All Players** above the list to check every registered player at once. Unchecking a player keeps their registration. **Select All Players** is disabled when there are no registered players or everyone is already selected, and becomes available again as soon as someone is unchecked or a player is added. When it adds someone to the selection it clears the current match, like any other selection change; it never selects players for you silently and does not save the selection.
4. Choose at least 2 teams, with at least 2 selected participants per team, then click **Generate Teams**.
5. Review participants, skill totals and warnings. Team sizes differ by at most one participant. Each team has at most one fixed goalkeeper; too many selected goalkeepers block generation. Missing goalkeepers and unequal sizes produce warnings.
6. Use **Generate another composition** to search for different groups. Equal or better balance applies immediately. Any increase in the difference between the highest and lowest totals shows a preview requiring **Accept composition** or **Undo composition**. Sharing and swaps are unavailable during that decision.
7. To swap players, choose participants from different teams and click **Confirm swap**. Swap outfield for outfield or goalkeeper for goalkeeper. **Cancel** clears the choices.
8. Under **Share teams**, click **Copy teams** to copy the text with one action, or select and copy it manually. It contains team titles and names, without skill scores or totals, and follows the accepted composition after generation, swaps or undo. A confirmation message appears only after a successful copy; if the clipboard is unavailable or denies access, guidance to copy manually appears instead, without claiming success or losing the displayed teams. The button is unavailable together with the share text when there are no teams or a pending decision.

Adding a player, saving an edit, confirming deletion, changing selection or changing the team count clears the current match. Canceling an edit or deletion preserves it.

## Saved data

Registrations (name, score and goalkeeper flag) are stored locally under `team-generator.players`. Selection and match state are held only in memory and reset on reload. Storage errors are reported; unreadable saved data is not automatically overwritten. Clearing browser data may remove registrations. There is no account, synchronization or remote backup. Names are displayed as literal text.

## Team balancing

The first generation fixes capacities, places goalkeepers in different teams, then assigns outfield players by descending score to the available team with the lowest total. It then repeatedly applies the best exchange between players of the same role that strictly reduces the difference between the highest and lowest team totals. It stops when no such exchange improves that difference. Capacities and goalkeeper counts remain unchanged. Integer differences strictly decrease, so the adjustment terminates.

For five outfield players with scores `10, 10, 10, 1, 1` and two teams, the initial result now has totals 12 and 20, rather than 21 and 11, with sizes 3 and 2.

This is a local improvement method and does not guarantee a global optimum. Neutral intermediate exchanges, exchanges between different roles and larger exchange cycles are not explored by the initial adjustment.

Another composition uses 64 random complete assignments plus valid single exchanges. It may find a worse alternative or report that no different valid grouping was found. Changing only team labels or member order does not count as a different composition. There is no composition history beyond the pending preview and its exact undo copy.

## Verification status

Stage 05's essential checks were completed on 18 October 2026 using recorded browser checks, user screenshots/reports and Playwright. The C1 correction was developed test-first: its simulated-page test failed with a difference of 10 before the change and passed with 8 afterward; its first generation also passed in a real browser. Existing Node.js checks cover swaps, regeneration, decisions, invalidation and share text with simulated DOM and storage.

Run the dependency-free checks from the project directory:

```text
node --check script.js
node tests/initial-team-balance.test.cjs
node tests/manual-player-swaps.test.cjs
node tests/regenerate-teams.test.cjs
node tests/share-team-text.test.cjs
git diff --check
```

Playwright is a development dependency; it is not required to open or run the application. To install and run browser checks in Windows PowerShell:

```powershell
npm.cmd ci --cache .scratch/npm-cache
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location) '.scratch/playwright-browsers'
npx.cmd --no-install playwright install chromium
npm.cmd run test:browser
```

The browser suite creates its own loopback server on port 51806 and a fresh browser context per test. It does not read the user's browser profile or registrations. It runs at 1280×720, 360×800 and 390×844, covering deletion during a pending preview, keyboard/copy/paste after undo/acceptance/swaps, the Copy teams button (success, clipboard rejection and absence, stale-feedback races, invalidation) and its presentation/keyboard access. All tests passed on Chromium 156.0.8078.4. An integrated flow check chains Select All Players, generation, Copy teams, a manual swap, another composition (accept or undo) and copying again, confirming that the clipboard always matches the displayed teams without skill scores. Screenshots and an HTML report are generated under `.scratch/playwright-results` and `.scratch/playwright-report`.

The [stage 05 checklist](docs/testes-manuais-etapa-05.md) links the evidence and its limits. Copy/paste was verified with real keyboard shortcuts into a separate browser-based local text editor. Physical phones and pasting into native applications such as Notepad were not tested. Narrow browser widths are simulations; they do not establish touch or mobile keyboard behavior. Tests added for existing behavior are acceptance checks, not a new TDD cycle. Future fixes continue to require a failing test before the implementation change.

## Current scope

Manual text copying, the Copy teams button, team generation placed after the participant list and the Select All Players button are available. There is no button to unselect everyone. There is no login, backend, cross-device synchronization, saved match, image sharing or sharing with skill totals. No published application URL has been confirmed.

## Project files

- `index.html`: page structure and controls
- `styles.css`: page styling
- `script.js`: registrations, local storage, selection, generation and match actions
- `Dark_court.jpg`: background image
- `tests/*.test.cjs`: dependency-free Node.js checks
- `tests/browser/`, `playwright.config.cjs`: isolated browser checks and their server
- `package.json`, `package-lock.json`: development-only Playwright dependency and commands
- `docs/`: rules, decisions, verification checklist and continuity notes

Created by Wells Maciel as a JavaScript learning project. Available for educational and personal use.
