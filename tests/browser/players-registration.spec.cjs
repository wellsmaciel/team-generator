const { test, expect } = require('@playwright/test');

const LONG_NAME = 'Maximiliano Bartolomeu de Albuquerque-Montenegro Sobrinho Neto';

// Records written before the goalkeeper flag existed, plus literal names.
const SAVED = [
  { name: LONG_NAME, score: 7 },
  { name: '  <b>Zé</b> & "Co"  ', score: 5 },
  { name: 'Carla', score: 3, isGoalkeeper: true },
  { name: 'Diego', score: 4 },
];

async function openWithSavedPlayers(page) {
  await page.addInitScript(saved => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('team-generator.players', JSON.stringify(saved));
      sessionStorage.setItem('seeded', '1');
    }
  }, SAVED);
  await page.goto('/');
  return page.getByRole('navigation', { name: 'Main', exact: true });
}

test('saved legacy records load in Players with literal names, long names fit the screen, and editing keeps them intact', async ({ page }) => {
  const navigation = await openWithSavedPlayers(page);
  await navigation.getByRole('button', { name: 'Players', exact: true }).click();

  await expect(page.getByRole('button', { name: `Edit ${LONG_NAME}`, exact: true })).toBeVisible();
  await expect(page.locator('#registeredPlayerList')).toContainText('<b>Zé</b> & "Co"');
  await expect(page.locator('#registeredPlayerList li').filter({ hasText: 'Carla' })).toContainText('(Goalkeeper)');
  const { width } = page.viewportSize();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  const buttons = page.locator('#registeredPlayerList li button');
  for (const button of await buttons.all()) {
    const box = await button.boundingBox();
    expect(box.x, 'button starts inside the screen').toBeGreaterThanOrEqual(0);
    expect(box.x + box.width, 'button ends inside the screen').toBeLessThanOrEqual(width);
    expect(box.height, 'touch target height').toBeGreaterThanOrEqual(24);
  }

  // Editing a legacy record and cancelling leaves the registration untouched.
  await page.getByRole('button', { name: 'Edit Diego', exact: true }).click();
  await expect(page.getByLabel('Player Name', { exact: true })).toHaveValue('Diego');
  await expect(page.getByRole('button', { name: 'Save changes', exact: true })).toBeVisible();
  await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill('9');
  await page.getByRole('button', { name: 'Cancel edit', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Add Player', exact: true })).toBeVisible();
  await expect(page.getByLabel('Player Name', { exact: true })).toHaveValue('');
  await expect(page.locator('#registeredPlayerList li').filter({ hasText: 'Diego' })).toContainText('Diego - 4');

  // Saving the edit persists it, and the stored literal name is unchanged.
  await page.getByRole('button', { name: 'Edit Diego', exact: true }).click();
  await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill('9');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.locator('#registeredPlayerList li').filter({ hasText: 'Diego' })).toContainText('Diego - 9');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('team-generator.players')));
  expect(stored.map(player => [player.name, player.score])).toEqual([
    [LONG_NAME, 7], ['  <b>Zé</b> & "Co"  ', 5], ['Carla', 3], ['Diego', 9],
  ]);
  expect(stored.find(player => player.name === 'Carla').isGoalkeeper).toBe(true);

  // Selection and match are never persisted: after a reload nothing is selected.
  await page.reload();
  await navigation.getByRole('button', { name: 'Match', exact: true }).click();
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 0 / 4');
  await expect(page.locator('#teamsContainer')).toBeEmpty();
});

test('only navigating keeps a pending decision, cancelling an edit keeps the match, saving an edit invalidates it', async ({ page }) => {
  const navigation = await openWithSavedPlayers(page);
  const players = navigation.getByRole('button', { name: 'Players', exact: true });
  const match = navigation.getByRole('button', { name: 'Match', exact: true });

  await match.click();
  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.locator('#teamsContainer .team')).toHaveCount(2);
  await page.getByRole('button', { name: 'Generate another composition', exact: true }).click();
  const pending = await page.locator('#alternativeStatus').textContent();
  await expect(page.locator('#alternativeControls')).toBeVisible();
  const teamsBefore = await page.locator('#teamsContainer').innerHTML();

  // Navigation alone changes nothing.
  await players.click();
  await match.click();
  await expect(page.locator('#alternativeControls')).toBeVisible();
  await expect(page.locator('#alternativeStatus')).toHaveText(pending);
  expect(await page.locator('#teamsContainer').innerHTML()).toBe(teamsBefore);

  // Cancelling an edit preserves the result and the pending decision.
  await players.click();
  await page.getByRole('button', { name: 'Edit Diego', exact: true }).click();
  await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill('1');
  await page.getByRole('button', { name: 'Cancel edit', exact: true }).click();
  await match.click();
  await expect(page.locator('#alternativeControls')).toBeVisible();
  await expect(page.locator('#alternativeStatus')).toHaveText(pending);
  expect(await page.locator('#teamsContainer').innerHTML()).toBe(teamsBefore);
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 4 / 4');

  // Saving an edit invalidates the match but keeps the selection.
  await players.click();
  await page.getByRole('button', { name: 'Edit Diego', exact: true }).click();
  await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill('1');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await match.click();
  await expect(page.locator('#teamsContainer')).toBeEmpty();
  await expect(page.locator('#alternativeControls')).toBeHidden();
  await expect(page.locator('#teamsStatus')).toHaveText('Match settings or registration changed. Generate teams again.');
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 4 / 4');
  await expect(page.getByRole('button', { name: 'Generate Teams', exact: true })).toBeEnabled();
});
