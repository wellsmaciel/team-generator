const { test, expect } = require('@playwright/test');

async function addPlayers(page, names) {
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Main', exact: true });
  await navigation.getByRole('button', { name: 'Players', exact: true }).click();
  for (const [index, name] of names.entries()) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(index + 4));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await navigation.getByRole('button', { name: 'Match', exact: true }).click();
}

test('search filters match participants by name without changing selection or Select All scope', async ({ page }) => {
  await addPlayers(page, ['Ana Silva', 'Beto Costa', 'Carla Souza']);
  const search = page.getByRole('searchbox', { name: 'Search players' });
  const list = page.locator('#playerSkillList');
  const checkboxes = list.getByRole('checkbox');

  await expect(search).toBeVisible();
  await search.focus();
  await expect(search).toBeFocused();
  await expect(search).toHaveCSS('outline-width', '3px');
  await page.keyboard.type('bEtO');
  await expect(list.locator('li')).toHaveCount(1);
  await expect(list).toContainText('Beto Costa');
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 0 / 3');

  await checkboxes.first().check();
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 1 / 3');
  await search.fill('no such player');
  await expect(list).toContainText('No players found.');
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 1 / 3');
  await search.fill('');
  await expect(list.locator('li')).toHaveCount(3);
  await expect(list.getByRole('checkbox').nth(1)).toBeChecked();

  await search.fill('Ana');
  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 3 / 3');
  await search.fill('');
  for (const checkbox of await list.getByRole('checkbox').all()) await expect(checkbox).toBeChecked();

  for (const width of [360, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(search).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});
