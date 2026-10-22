const { test, expect } = require('@playwright/test');

async function registerAndGenerate(page, players) {
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of players) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Match', exact: true }).click();
  const participants = page.locator('#playerSkillList input[type=checkbox]');
  for (const checkbox of await participants.all()) await checkbox.check();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
}

test('the button, success message and shareable text fit the viewport without horizontal overflow, even with long player names', async ({ page }) => {
  test.skip(page.viewportSize().width > 500, 'Mobile-only presentation check; desktop layout is covered separately.');

  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await registerAndGenerate(page, [
    ['Alexandra Montgomery-Fitzgerald', 2],
    ['Bartholomew Winterbottom-Hargreaves', 3],
    ['Christopher Vandenberg-Thistlewood', 4],
    ['Dominika Featherstonehaugh-Blackwood', 5],
  ]);
  await expect(page.locator('#shareControls')).toBeVisible();

  const viewportWidth = page.viewportSize().width;
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(viewportWidth);

  for (const locator of [
    page.getByRole('button', { name: 'Copy teams', exact: true }),
    page.getByLabel('Teams to copy'),
  ]) {
    await expect(locator).toBeVisible();
    const box = await locator.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(viewportWidth + 1);
  }

  await page.getByRole('button', { name: 'Copy teams', exact: true }).click();
  const confirmation = page.getByRole('status').filter({ hasText: /copied/i });
  await expect(confirmation).toBeVisible();
  const confirmationBox = await confirmation.boundingBox();
  expect(confirmationBox.x).toBeGreaterThanOrEqual(0);
  expect(confirmationBox.x + confirmationBox.width).toBeLessThanOrEqual(viewportWidth + 1);
});

test('the Copy teams button is reachable by Tab, shows a visible focus style and activates by Enter and Space', async ({ page }) => {
  test.skip(page.viewportSize().width <= 500, 'Keyboard activation check targets the desktop pointer-free flow.');

  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  // Equal scores guarantee the second generation applies immediately, without a
  // pending decision, so the button stays available for the Space activation below.
  await registerAndGenerate(page, [['Ana', 5], ['Beto', 5], ['Caio', 5], ['Dani', 5]]);
  await expect(page.locator('#shareControls')).toBeVisible();

  const copyButton = page.getByRole('button', { name: 'Copy teams', exact: true });
  // In Teams, the way back and the generation control come before the share controls.
  await page.getByRole('button', { name: 'Back to selection', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Generate another composition', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(copyButton).toBeFocused();

  const outlineStyle = await copyButton.evaluate(element => getComputedStyle(element).outlineStyle);
  expect(outlineStyle).not.toBe('none');

  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Teams to copy')).toBeFocused();

  await copyButton.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status').filter({ hasText: /copied/i })).toBeVisible();

  await page.getByRole('button', { name: 'Generate another composition', exact: true }).click();
  await copyButton.focus();
  await page.keyboard.press(' ');
  await expect(page.getByRole('status').filter({ hasText: /copied/i })).toBeVisible();
});
