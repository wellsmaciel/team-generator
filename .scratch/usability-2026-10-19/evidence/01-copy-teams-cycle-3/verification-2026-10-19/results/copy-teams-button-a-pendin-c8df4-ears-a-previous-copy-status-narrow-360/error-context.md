# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: copy-teams-button.spec.cjs >> a pending less-balanced preview hides Copy teams and clears a previous copy status
- Location: tests\browser\copy-teams-button.spec.cjs:61:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('#copyStatus')
Expected: ""
Received: "Teams copied."
Timeout:  5000ms

Call log:
  - Expect "toHaveText" locator('#copyStatus') with timeout 5000ms
  - waiting for locator('#copyStatus')
    14 × locator resolved to <p role="status" id="copyStatus">Teams copied.</p>
       - unexpected value "Teams copied."

```

```yaml
- heading "Building up your Team" [level=1]
- heading "Add the Player name and their skill" [level=2]
- status
- text: Player Name
- textbox "Player Name"
- text: Player Skill
- spinbutton "Player Skill"
- checkbox "Fixed goalkeeper (plays only in goal)"
- text: Fixed goalkeeper (plays only in goal)
- button "Add Player"
- status: Players saved in this browser.
- heading "Click to Generate Teams" [level=2]
- text: Number of teams
- spinbutton "Number of teams": "2"
- paragraph: Choose at least 2 teams, with at least 2 selected players per team.
- button "Generate another composition" [disabled]
- status: "No fixed goalkeeper in teams: 1, 2. Someone will need to play in goal."
- status: "This preview is less balanced: the difference between the highest and lowest skill totals increased from 0 to 2. Accept this composition or undo to restore the previous teams."
- button "Accept composition"
- button "Undo composition"
- heading "Added players" [level=2]
- heading "Players and Skills" [level=3]
- paragraph: Check the players who will play in this match. Unchecking keeps their registration.
- status: "Selected for this match: 4 / 4"
- list:
  - listitem:
    - checkbox "Bruno - 2" [checked]
    - text: Bruno - 2
    - button "Edit Bruno": Edit
    - button "Delete Bruno": Delete
  - listitem:
    - checkbox "Carla - 3" [checked]
    - text: Carla - 3
    - button "Edit Carla": Edit
    - button "Delete Carla": Delete
  - listitem:
    - checkbox "Diego - 4" [checked]
    - text: Diego - 4
    - button "Edit Diego": Edit
    - button "Delete Diego": Delete
  - listitem:
    - checkbox "Eva - 5" [checked]
    - text: Eva - 5
    - button "Edit Eva": Edit
    - button "Delete Eva": Delete
- heading "List of Team and Players" [level=2]
- heading "Players Team 1 (2)" [level=3]
- list:
  - listitem: Carla
  - listitem: Eva
- heading "Skill total - Team 1" [level=3]
- paragraph: "8"
- heading "Players Team 2 (2)" [level=3]
- list:
  - listitem: Diego
  - listitem: Bruno
- heading "Skill total - Team 2" [level=3]
- paragraph: "6"
- contentinfo:
  - paragraph: Team Generator — Created by Wells Maciel v1.0
  - paragraph:
    - link "LinkedIn":
      - /url: https://www.linkedin.com/in/wells-velasquez-maciel/
  - paragraph:
    - link "GitHub":
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
  18 |   await page.getByRole('button', { name: 'Copy teams', exact: true }).click();
  19 | 
  20 |   await expect(page.getByRole('status').filter({ hasText: /copied/i })).toBeVisible();
  21 |   const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  22 |   expect(clipboardText.replace(/\r\n/g, '\n')).toBe(expectedText);
  23 | });
  24 | 
  25 | test('clipboard rejection offers manual copying without losing the displayed teams or players', async ({ page }) => {
  26 |   await page.goto('/');
  27 |   for (const [name, score] of [['Bruno', 2], ['Carla', 3], ['Diego', 4], ['Eva', 5]]) {
  28 |     await page.getByLabel('Player Name', { exact: true }).fill(name);
  29 |     await page.getByLabel('Player Skill', { exact: true }).fill(String(score));
  30 |     await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  31 |   }
  32 |   const participants = page.locator('#playerSkillList input[type=checkbox]');
  33 |   for (const checkbox of await participants.all()) await checkbox.check();
  34 |   await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  35 |   await expect(page.locator('#shareControls')).toBeVisible();
  36 |   const shareText = page.getByLabel('Teams to copy');
  37 |   const expectedText = await shareText.inputValue();
  38 |   const expectedTeams = await page.locator('#teamsContainer').innerText();
  39 | 
  40 |   // Simulate rejection only at the external clipboard API boundary.
  41 |   await page.evaluate(() => {
  42 |     navigator.clipboard.writeText = async () => {
  43 |       throw new DOMException('Clipboard access denied for this test.', 'NotAllowedError');
  44 |     };
  45 |   });
  46 |   await page.getByRole('button', { name: 'Copy teams', exact: true }).click();
  47 | 
  48 |   await expect(page.getByRole('status').filter({ hasText: /^Teams copied\.$/ })).toHaveCount(0);
  49 |   await expect(shareText).toBeVisible();
  50 |   await expect(shareText).toHaveValue(expectedText);
  51 |   await expect(shareText).toHaveAttribute('readonly', '');
  52 |   await expect(page.locator('#teamsContainer')).toHaveText(expectedTeams, { useInnerText: true });
  53 |   await expect(page.locator('#playerSkillList label')).toHaveText([
  54 |     'Bruno - 2', 'Carla - 3', 'Diego - 4', 'Eva - 5',
  55 |   ]);
  56 |   await expect(page.getByRole('status').filter({
  57 |     hasText: /copy[\s\S]*manually|manually[\s\S]*copy|select[\s\S]*copy/i,
  58 |   })).toBeVisible();
  59 | });
  60 | 
  61 | test('a pending less-balanced preview hides Copy teams and clears a previous copy status', async ({ page }) => {
  62 |   await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  63 |   await page.goto('/');
  64 |   for (const [name, score] of [['Bruno', 2], ['Carla', 3], ['Diego', 4], ['Eva', 5]]) {
  65 |     await page.getByLabel('Player Name', { exact: true }).fill(name);
  66 |     await page.getByLabel('Player Skill', { exact: true }).fill(String(score));
  67 |     await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  68 |   }
  69 |   const participants = page.locator('#playerSkillList input[type=checkbox]');
  70 |   for (const checkbox of await participants.all()) await checkbox.check();
  71 |   await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  72 |   await expect(page.locator('#shareControls')).toBeVisible();
  73 | 
  74 |   await page.getByRole('button', { name: 'Copy teams', exact: true }).click();
  75 |   await expect(page.getByRole('status').filter({ hasText: /copied/i })).toBeVisible();
  76 | 
  77 |   await page.getByRole('button', { name: 'Generate another composition', exact: true }).click();
  78 |   await expect(page.locator('#alternativeControls')).toBeVisible();
  79 |   await expect(page.locator('#alternativeStatus')).toContainText('less balanced');
  80 | 
  81 |   await expect(page.locator('#shareControls')).toBeHidden();
> 82 |   await expect(page.locator('#copyStatus')).toHaveText('');
     |                                             ^ Error: expect(locator).toHaveText(expected) failed
  83 | });
  84 | 
```