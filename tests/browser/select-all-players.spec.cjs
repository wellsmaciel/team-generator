const { test, expect } = require('@playwright/test');

async function registerPlayers(page, players) {
  const navigation = page.getByRole('navigation', { name: 'Main', exact: true });
  await navigation.getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of players) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Player Skill', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await navigation.getByRole('button', { name: 'Match', exact: true }).click();
}

test('Select All Players checks every registered player, updates the count and still allows individual unchecking', async ({ page }) => {
  await page.goto('/');
  await registerPlayers(page, [
    ['Ana', 5],
    ['Beto', 6],
    ['Caio', 7],
    ['Dani', 8],
  ]);

  const checkboxes = page.locator('#playerSkillList input[type=checkbox]');
  await expect(checkboxes).toHaveCount(4);
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 0 / 4');

  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();

  for (const checkbox of await checkboxes.all()) await expect(checkbox).toBeChecked();
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 4 / 4');

  await checkboxes.nth(1).uncheck();

  await expect(checkboxes.nth(0)).toBeChecked();
  await expect(checkboxes.nth(1)).not.toBeChecked();
  await expect(checkboxes.nth(2)).toBeChecked();
  await expect(checkboxes.nth(3)).toBeChecked();
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 3 / 4');
});

test('Select All Players is disabled when there are no registered players or everyone is already selected, and enabled again after unchecking someone', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Match', exact: true }).click();
  const selectAllButton = page.getByRole('button', { name: 'Select All Players', exact: true });

  await expect(selectAllButton).toBeDisabled();

  await registerPlayers(page, [
    ['Ana', 5],
    ['Beto', 6],
  ]);
  await expect(selectAllButton).toBeEnabled();

  await selectAllButton.click();
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 2 / 2');
  await expect(selectAllButton).toBeDisabled();

  await page.locator('#playerSkillList input[type=checkbox]').first().uncheck();
  await expect(selectAllButton).toBeEnabled();
});

test('Select All Players clears generated teams when it adds someone to the selection', async ({ page }) => {
  await page.goto('/');
  await registerPlayers(page, [
    ['Ana', 5],
    ['Beto', 6],
    ['Caio', 7],
    ['Dani', 8],
    ['Eva', 9],
  ]);
  const checkboxes = page.locator('#playerSkillList input[type=checkbox]');
  for (const index of [0, 1, 2, 3]) await checkboxes.nth(index).check();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.locator('#shareControls')).toBeVisible();

  await page.getByRole('button', { name: 'Back to selection', exact: true }).click();
  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();

  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 5 / 5');
  await expect(page.locator('#shareControls')).toBeHidden();
});
