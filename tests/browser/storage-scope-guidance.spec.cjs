const { test, expect } = require('@playwright/test');

test('storage guidance stays visible while registrations persist and match details reset on reload', async ({ page }) => {
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Main', exact: true });
  const playerStorageGuidance = page.getByText('Players are saved only in this browser.', { exact: true });
  const matchStorageGuidance = page.getByText('Match location, date, and time are temporary and will be cleared when you reload this page.', { exact: true });

  await navigation.getByRole('button', { name: 'Players', exact: true }).click();
  await expect(playerStorageGuidance).toBeVisible();
  await page.getByLabel('Player Name', { exact: true }).fill('Ana');
  await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill('5');
  await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Edit Ana', exact: true })).toBeVisible();
  await expect(playerStorageGuidance).toBeVisible();

  await navigation.getByRole('button', { name: 'Match', exact: true }).click();
  await expect(matchStorageGuidance).toBeVisible();
  await page.getByLabel('Match location', { exact: true }).fill('Riverside Court');
  await page.getByLabel('Match date', { exact: true }).fill('2026-11-07');
  await page.getByLabel('Match time', { exact: true }).fill('18:30');
  await page.reload();

  await navigation.getByRole('button', { name: 'Players', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Edit Ana', exact: true })).toBeVisible();
  await expect(playerStorageGuidance).toBeVisible();
  await navigation.getByRole('button', { name: 'Match', exact: true }).click();
  await expect(matchStorageGuidance).toBeVisible();
  await expect(page.getByLabel('Match location', { exact: true })).toHaveValue('');
  await expect(page.getByLabel('Match date', { exact: true })).toHaveValue('');
  await expect(page.getByLabel('Match time', { exact: true })).toHaveValue('');

  await page.setViewportSize({ width: 820, height: 900 });
  await expect(matchStorageGuidance).toBeVisible();
  await navigation.getByRole('button', { name: 'Players', exact: true }).click();
  await expect(playerStorageGuidance).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(820);
});
