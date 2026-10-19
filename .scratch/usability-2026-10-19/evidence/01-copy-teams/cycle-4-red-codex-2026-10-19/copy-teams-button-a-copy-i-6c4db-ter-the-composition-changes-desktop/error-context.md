# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: copy-teams-button.spec.cjs >> a copy in progress does not apply a late success message after the composition changes
- Location: tests\browser\copy-teams-button.spec.cjs:128:1

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
  - listitem: Bruno
  - listitem: Diego
- heading "Skill total - Team 1" [level=3]
- paragraph: "6"
- heading "Players Team 2 (2)" [level=3]
- list:
  - listitem: Carla
  - listitem: Eva
- heading "Skill total - Team 2" [level=3]
- paragraph: "8"
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
  58  |   })).toBeVisible();
  59  | });
  60  | 
  61  | test('a pending less-balanced preview hides Copy teams and clears a previous copy status', async ({ page }) => {
  62  |   await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  63  |   await page.goto('/');
  64  |   for (const [name, score] of [['Bruno', 2], ['Carla', 3], ['Diego', 4], ['Eva', 5]]) {
  65  |     await page.getByLabel('Player Name', { exact: true }).fill(name);
  66  |     await page.getByLabel('Player Skill', { exact: true }).fill(String(score));
  67  |     await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  68  |   }
  69  |   const participants = page.locator('#playerSkillList input[type=checkbox]');
  70  |   for (const checkbox of await participants.all()) await checkbox.check();
  71  |   await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  72  |   await expect(page.locator('#shareControls')).toBeVisible();
  73  | 
  74  |   await page.getByRole('button', { name: 'Copy teams', exact: true }).click();
  75  |   await expect(page.getByRole('status').filter({ hasText: /copied/i })).toBeVisible();
  76  | 
  77  |   await page.getByRole('button', { name: 'Generate another composition', exact: true }).click();
  78  |   await expect(page.locator('#alternativeControls')).toBeVisible();
  79  |   await expect(page.locator('#alternativeStatus')).toContainText('less balanced');
  80  | 
  81  |   await expect(page.locator('#shareControls')).toBeHidden();
  82  |   await expect(page.locator('#copyStatus')).toHaveText('');
  83  | });
  84  | 
  85  | test('Copy teams copies the currently displayed composition after undo, accept and a manual swap', async ({ page }) => {
  86  |   await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  87  |   await page.goto('/');
  88  |   for (const [name, score] of [['Bruno', 2], ['Carla', 3], ['Diego', 4], ['Eva', 5]]) {
  89  |     await page.getByLabel('Player Name', { exact: true }).fill(name);
  90  |     await page.getByLabel('Player Skill', { exact: true }).fill(String(score));
  91  |     await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  92  |   }
  93  |   const participants = page.locator('#playerSkillList input[type=checkbox]');
  94  |   for (const checkbox of await participants.all()) await checkbox.check();
  95  |   await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  96  |   await expect(page.locator('#shareControls')).toBeVisible();
  97  |   const shareText = page.getByLabel('Teams to copy');
  98  | 
  99  |   async function copyAndCompareWithDisplayedText() {
  100 |     const expectedText = await shareText.inputValue();
  101 |     await page.getByRole('button', { name: 'Copy teams', exact: true }).click();
  102 |     await expect(page.getByRole('status').filter({ hasText: /copied/i })).toBeVisible();
  103 |     const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  104 |     expect(clipboardText.replace(/\r\n/g, '\n')).toBe(expectedText);
  105 |   }
  106 | 
  107 |   const originalText = await shareText.inputValue();
  108 |   await page.getByRole('button', { name: 'Generate another composition', exact: true }).click();
  109 |   await expect(page.locator('#alternativeControls')).toBeVisible();
  110 |   await page.getByRole('button', { name: 'Undo composition' }).click();
  111 |   await expect(page.locator('#alternativeControls')).toBeHidden();
  112 |   await expect(shareText).toHaveValue(originalText);
  113 |   await copyAndCompareWithDisplayedText();
  114 | 
  115 |   await page.getByRole('button', { name: 'Generate another composition', exact: true }).click();
  116 |   await expect(page.locator('#alternativeControls')).toBeVisible();
  117 |   await page.getByRole('button', { name: 'Accept composition' }).click();
  118 |   await expect(page.locator('#alternativeControls')).toBeHidden();
  119 |   await copyAndCompareWithDisplayedText();
  120 | 
  121 |   await page.getByLabel('First player', { exact: true }).selectOption({ index: 1 });
  122 |   await page.getByLabel('Second player', { exact: true }).selectOption({ index: 3 });
  123 |   await page.getByRole('button', { name: 'Confirm swap', exact: true }).click();
  124 |   await expect(page.locator('#swapStatus')).toContainText('Players swapped');
  125 |   await copyAndCompareWithDisplayedText();
  126 | });
  127 | 
  128 | test('a copy in progress does not apply a late success message after the composition changes', async ({ page }) => {
  129 |   await page.goto('/');
  130 |   for (const [name, score] of [['Bruno', 2], ['Carla', 3], ['Diego', 4], ['Eva', 5]]) {
  131 |     await page.getByLabel('Player Name', { exact: true }).fill(name);
  132 |     await page.getByLabel('Player Skill', { exact: true }).fill(String(score));
  133 |     await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  134 |   }
  135 |   const participants = page.locator('#playerSkillList input[type=checkbox]');
  136 |   for (const checkbox of await participants.all()) await checkbox.check();
  137 |   await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  138 |   await expect(page.locator('#shareControls')).toBeVisible();
  139 | 
  140 |   // Simulate a slow copy only at the external clipboard API boundary: writeText
  141 |   // stays pending until the test explicitly resolves it from outside the app.
  142 |   await page.evaluate(() => {
  143 |     window.__resolvePendingCopy = undefined;
  144 |     navigator.clipboard.writeText = () => new Promise(resolve => {
  145 |       window.__resolvePendingCopy = resolve;
  146 |     });
  147 |   });
  148 | 
  149 |   await page.getByRole('button', { name: 'Copy teams', exact: true }).click();
  150 |   await expect.poll(() => page.evaluate(() => typeof window.__resolvePendingCopy === 'function')).toBe(true);
  151 | 
  152 |   await page.getByRole('button', { name: 'Generate another composition', exact: true }).click();
  153 |   await expect(page.locator('#alternativeControls')).toBeVisible();
  154 |   await expect(page.locator('#copyStatus')).toHaveText('');
  155 | 
  156 |   await page.evaluate(() => window.__resolvePendingCopy());
  157 | 
> 158 |   await expect(page.locator('#copyStatus')).toHaveText('');
      |                                             ^ Error: expect(locator).toHaveText(expected) failed
  159 |   await expect(page.getByRole('status').filter({ hasText: /copied/i })).toHaveCount(0);
  160 | });
  161 | 
```