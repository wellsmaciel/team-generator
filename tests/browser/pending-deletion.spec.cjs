const { test, expect } = require('@playwright/test');

test('confirming deletion during a worse preview clears the match and allows a new generation', async ({ page }, testInfo) => {
  // Playwright creates a fresh browser context, without the user's saved registrations.
  await page.goto('/');
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 0 / 0');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['Bruno', 2], ['Carla', 3], ['Diego', 4], ['Eva', 5]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Player Skill', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  const navigation = page.getByRole('navigation', { name: 'Main', exact: true });
  await navigation.getByRole('button', { name: 'Match', exact: true }).click();
  const participants = page.locator('#playerSkillList input[type=checkbox]');
  for (const checkbox of await participants.all()) await checkbox.check();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.locator('#teamsContainer .team')).toHaveCount(2);
  await page.getByRole('button', { name: 'Generate another composition', exact: true }).click();
  await expect(page.locator('#alternativeControls')).toBeVisible();
  await expect(page.locator('#alternativeStatus')).toContainText('less balanced');
  await expect(page.locator('#btnTeams')).toBeDisabled();

  const dialogHandled = new Promise((resolve, reject) => {
    page.once('dialog', async dialog => {
      try {
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toBe('Delete this player from the registration?\nBruno - 2');
        await dialog.accept();
        resolve();
      } catch (error) { reject(error); }
    });
  });
  await navigation.getByRole('button', { name: 'Players', exact: true }).click();
  await page.getByRole('button', { name: 'Delete Bruno', exact: true }).click();
  await dialogHandled;
  await expect(page.getByRole('button', { name: 'Delete Bruno', exact: true })).toHaveCount(0);
  await navigation.getByRole('button', { name: 'Match', exact: true }).click();
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 3 / 3');
  await expect(page.locator('#teamsContainer')).toBeEmpty();
  await expect(page.locator('#alternativeControls')).toBeHidden();
  await expect(page.locator('#alternativeStatus')).toBeEmpty();
  await expect(page.locator('#teamsStatus')).toHaveText('Match settings or registration changed. Generate teams again.');
  await expect(page.locator('#shareControls')).toBeHidden();
  await expect(page.locator('#shareText')).toHaveValue('');
  await expect(page.locator('#swapControls')).toBeHidden();
  await expect(page.locator('#firstSwapPlayer')).toBeEmpty();
  await expect(page.locator('#secondSwapPlayer')).toBeEmpty();
  await expect(page.locator('#btnTeams')).toBeEnabled();
  await expect(page.locator('#btnTeams')).toHaveText('Generate Teams');

  // Restore the minimum of four participants through the registration form.
  await navigation.getByRole('button', { name: 'Players', exact: true }).click();
  await page.getByLabel('Player Name', { exact: true }).fill('Replacement');
  await page.getByLabel('Player Skill', { exact: true }).fill('2');
  await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  await navigation.getByRole('button', { name: 'Match', exact: true }).click();
  await participants.last().check();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.locator('#teamsContainer .team')).toHaveCount(2);
  expect((await page.locator('#teamsContainer li').allTextContents()).sort())
    .toEqual(['Carla', 'Diego', 'Eva', 'Replacement']);
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 4 / 4');
  await expect(page.locator('#alternativeControls')).toBeHidden();
  await expect(page.locator('#shareControls')).toBeVisible();
  await expect(page.locator('#swapControls')).toBeVisible();
  await expect(page.locator('#shareText')).toHaveValue(/Replacement/);
  expect(await page.locator('#shareText').inputValue()).not.toContain('Bruno');
  await testInfo.attach('browser-version', { body: page.context().browser().version(), contentType: 'text/plain' });
  await page.screenshot({ path: testInfo.outputPath('new-generation-after-deletion.png'), fullPage: true });
});
