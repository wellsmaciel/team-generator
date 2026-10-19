# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: copy-teams-button.spec.cjs >> clipboard rejection offers manual copying without losing the displayed teams or players
- Location: tests\browser\copy-teams-button.spec.cjs:25:1

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('#teamsContainer')
Timeout: 5000ms
- Expected  - 13
+ Received  +  1

- Players Team 1 (2)
- Eva
- Bruno
- Skill total - Team 1
-
- 7
-
- Players Team 2 (2)
- Diego
- Carla
- Skill total - Team 2
-
- 7
+ Players Team 1 (2)EvaBrunoSkill total - Team 17Players Team 2 (2)DiegoCarlaSkill total - Team 27

Call log:
  - Expect "toHaveText" locator('#teamsContainer') with timeout 5000ms
  - waiting for locator('#teamsContainer')
    14 × locator resolved to <div id="teamsContainer">…</div>
       - unexpected value "Players Team 1 (2)EvaBrunoSkill total - Team 17Players Team 2 (2)DiegoCarlaSkill total - Team 27"

```

```yaml
- heading "Players Team 1 (2)" [level=3]
- list:
  - listitem: Eva
  - listitem: Bruno
- heading "Skill total - Team 1" [level=3]
- paragraph: "7"
- heading "Players Team 2 (2)" [level=3]
- list:
  - listitem: Diego
  - listitem: Carla
- heading "Skill total - Team 2" [level=3]
- paragraph: "7"
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
> 52 |   await expect(page.locator('#teamsContainer')).toHaveText(expectedTeams);
     |                                                 ^ Error: expect(locator).toHaveText(expected) failed
  53 |   await expect(page.locator('#playerSkillList label')).toHaveText([
  54 |     'Bruno - 2', 'Carla - 3', 'Diego - 4', 'Eva - 5',
  55 |   ]);
  56 |   await expect(page.getByRole('status').filter({
  57 |     hasText: /copy[\s\S]*manually|manually[\s\S]*copy|select[\s\S]*copy/i,
  58 |   })).toBeVisible();
  59 | });
  60 | 
```