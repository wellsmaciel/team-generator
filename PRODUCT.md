# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Organizers preparing futsal matches who reuse player registrations, choose participants, and form teams.

## Product Purpose

Team Generator helps an organizer prepare teams with reasonably close skill totals, review and adjust the result, and share team names. The organizer makes the final judgment about balance.

## Positioning

The product combines reusable local player registrations, fixed-goalkeeper constraints, team generation, manual swaps, and shareable team lists that omit skill scores and totals. Generated balance is guidance rather than a guarantee.

## Operating Context

The main use is on a phone, with tablet and desktop support. The organizer registers players, selects participants for a match, chooses the number of teams, reviews warnings and generated teams, optionally regenerates or swaps players, then copies or manually shares the team list.

## Capabilities and Constraints

Player names, integer skill estimates from 1 to 10, and fixed-goalkeeper status are stored in the current browser. Selection and match state reset on reload. There is no account, synchronization, or remote backup. Skill scores are estimates and do not guarantee balanced play; the organizer decides whether the teams are satisfactory. The default shared team list omits skill scores and totals. Rules for sports other than futsal are outside the confirmed scope.

## Evidence on Hand

The repository contains the running application (`index.html`, `script.js`, `styles.css`), project documentation, and automated checks. Physical-phone behavior has not been validated. A possible test group of 15 players is documented, but contact and testing have not occurred. No numeric success targets are documented. Do not present the possible group as a customer or fabricate test results.

## Product Principles

- Reuse player registrations across matches on the same browser.
- Keep the organizer in control of participant selection and final team adjustments.
- Treat skill scores as estimates and generated balance as assistance, not a promise.
- Keep skill scores and totals out of the default shared team list.
- Support use across phone, tablet, and desktop layouts.
