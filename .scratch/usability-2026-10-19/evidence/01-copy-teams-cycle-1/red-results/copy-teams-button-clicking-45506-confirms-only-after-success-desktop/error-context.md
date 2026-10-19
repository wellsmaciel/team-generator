# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: copy-teams-button.spec.cjs >> clicking Copy teams copies the current shareable text and confirms only after success
- Location: tests\browser\copy-teams-button.spec.cjs:3:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Copy teams', exact: true })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - heading "Building up your Team" [level=1] [ref=e2]
  - heading "Add the Player name and their skill" [level=2] [ref=e3]
  - generic [ref=e4]:
    - generic [ref=e5]:
      - status
      - generic [ref=e6]: Player Name
      - textbox "Player Name" [ref=e7]
      - generic [ref=e8]: Player Skill
      - spinbutton "Player Skill" [ref=e9]
      - generic [ref=e10]:
        - checkbox "Fixed goalkeeper (plays only in goal)" [ref=e11]
        - text: Fixed goalkeeper (plays only in goal)
      - button "Add Player" [ref=e12]
    - status [ref=e13]: Players saved in this browser.
    - generic [ref=e14]:
      - heading "Click to Generate Teams" [level=2] [ref=e15]
      - text: Number of teams
      - spinbutton "Number of teams" [ref=e16]: "2"
      - paragraph [ref=e17]: Choose at least 2 teams, with at least 2 selected players per team.
      - button "Generate another composition" [active] [ref=e18]
      - status [ref=e19]: "No fixed goalkeeper in teams: 1, 2. Someone will need to play in goal."
      - status
  - heading "Added players" [level=2] [ref=e20]
  - generic [ref=e21]:
    - generic [ref=e22]:
      - heading "Players and Skills" [level=3] [ref=e23]
      - paragraph [ref=e24]: Check the players who will play in this match. Unchecking keeps their registration.
      - status [ref=e25]: "Selected for this match: 4 / 4"
      - list [ref=e26]:
        - listitem [ref=e27]:
          - generic [ref=e28]:
            - checkbox "Bruno - 2" [checked] [ref=e29]
            - text: Bruno - 2
          - button "Edit Bruno" [ref=e30]: Edit
          - button "Delete Bruno" [ref=e31]: Delete
        - listitem [ref=e32]:
          - generic [ref=e33]:
            - checkbox "Carla - 3" [checked] [ref=e34]
            - text: Carla - 3
          - button "Edit Carla" [ref=e35]: Edit
          - button "Delete Carla" [ref=e36]: Delete
        - listitem [ref=e37]:
          - generic [ref=e38]:
            - checkbox "Diego - 4" [checked] [ref=e39]
            - text: Diego - 4
          - button "Edit Diego" [ref=e40]: Edit
          - button "Delete Diego" [ref=e41]: Delete
        - listitem [ref=e42]:
          - generic [ref=e43]:
            - checkbox "Eva - 5" [checked] [ref=e44]
            - text: Eva - 5
          - button "Edit Eva" [ref=e45]: Edit
          - button "Delete Eva" [ref=e46]: Delete
    - heading "List of Team and Players" [level=2] [ref=e47]
    - generic [ref=e48]:
      - generic [ref=e49]:
        - generic [ref=e50]:
          - heading "Players Team 1 (2)" [level=3] [ref=e51]
          - list [ref=e52]:
            - listitem [ref=e53]: Eva
            - listitem [ref=e54]: Bruno
        - generic [ref=e55]:
          - heading "Skill total - Team 1" [level=3] [ref=e56]
          - paragraph [ref=e57]: "7"
      - generic [ref=e58]:
        - generic [ref=e59]:
          - heading "Players Team 2 (2)" [level=3] [ref=e60]
          - list [ref=e61]:
            - listitem [ref=e62]: Diego
            - listitem [ref=e63]: Carla
        - generic [ref=e64]:
          - heading "Skill total - Team 2" [level=3] [ref=e65]
          - paragraph [ref=e66]: "7"
    - region [ref=e67]:
      - heading "Share teams" [level=3] [ref=e68]
      - paragraph [ref=e69]: Select the text below and copy it to share your teams. Skill scores are not included.
      - text: Teams to copy
      - textbox "Teams to copy" [ref=e70]: Team 1 Eva Bruno Team 2 Diego Carla
    - region [ref=e71]:
      - heading "Swap players" [level=3] [ref=e72]
      - paragraph [ref=e73]: "Choose two players from different teams: outfield for outfield, or goalkeeper for goalkeeper."
      - generic [ref=e74]:
        - generic [ref=e75]: First player
        - combobox "First player" [ref=e76]:
          - option "Choose a player" [selected]
          - 'option "Team 1, player 1: Eva - 5 (Outfield)"'
          - 'option "Team 1, player 2: Bruno - 2 (Outfield)"'
          - 'option "Team 2, player 1: Diego - 4 (Outfield)"'
          - 'option "Team 2, player 2: Carla - 3 (Outfield)"'
        - generic [ref=e77]: Second player
        - combobox "Second player" [ref=e78]:
          - option "Choose a player" [selected]
          - 'option "Team 1, player 1: Eva - 5 (Outfield)"'
          - 'option "Team 1, player 2: Bruno - 2 (Outfield)"'
          - 'option "Team 2, player 1: Diego - 4 (Outfield)"'
          - 'option "Team 2, player 2: Carla - 3 (Outfield)"'
        - button "Confirm swap" [ref=e79]
        - button "Cancel" [ref=e80]
      - status
  - contentinfo [ref=e81]:
    - paragraph [ref=e82]: Team Generator — Created by Wells Maciel v1.0
    - paragraph [ref=e83]:
      - link "LinkedIn" [ref=e84] [cursor=pointer]:
        - /url: https://www.linkedin.com/in/wells-velasquez-maciel/
    - paragraph [ref=e85]:
      - link "GitHub" [ref=e86] [cursor=pointer]:
        - /url: https://github.com/wellsmaciel
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test('clicking Copy teams copies the current shareable text and confirms only after success', async ({ page }) => {
  4  |   await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  5  |   await page.goto('/');
  6  |   for (const [name, score] of [['Bruno', 2], ['Carla', 3], ['Diego', 4], ['Eva', 5]]) {
  7  |     await page.getByLabel('Player Name', { exact: true }).fill(name);
  8  |     await page.getByLabel('Player Skill', { exact: true }).fill(String(score));
  9  |     await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  10 |   }
  11 |   const participants = page.locator('#playerSkillList input[type=checkbox]');
  12 |   for (const checkbox of await participants.all()) await checkbox.check();
  13 |   await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  14 |   await expect(page.locator('#shareControls')).toBeVisible();
  15 | 
  16 |   const expectedText = await page.getByLabel('Teams to copy').inputValue();
  17 | 
> 18 |   await page.getByRole('button', { name: 'Copy teams', exact: true }).click();
     |                                                                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
  19 | 
  20 |   await expect(page.getByRole('status').filter({ hasText: /copied/i })).toBeVisible();
  21 |   const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  22 |   expect(clipboardText).toBe(expectedText);
  23 | });
  24 | 
```