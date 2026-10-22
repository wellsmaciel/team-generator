const { test, expect } = require('@playwright/test');

test('Tab visits registration, participants, team count/generation and sharing controls in document order, with visible focus', async ({ page }) => {
  test.skip(page.viewportSize().width <= 500, 'Keyboard traversal check targets the desktop pointer-free flow.');

  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();

  const playerNameInput = page.getByLabel('Player Name', { exact: true });
  const playerSkillInput = page.getByLabel('Estimated skill (1–10)', { exact: true });
  const goalkeeperCheckbox = page.getByLabel('Fixed goalkeeper (plays only in goal)', { exact: true });
  const addPlayerButton = page.getByRole('button', { name: 'Add Player', exact: true });

  for (const [name, score] of [['Ana', 5], ['Beto', 5], ['Caio', 5], ['Dani', 5]]) {
    await playerNameInput.fill(name);
    await playerSkillInput.fill(String(score));
    await addPlayerButton.click();
  }
  const outlineOf = async locator => locator.evaluate(element => getComputedStyle(element).outlineStyle);

  await playerNameInput.focus();
  await expect(playerNameInput).toBeFocused();
  expect(await outlineOf(playerNameInput)).not.toBe('none');

  await page.keyboard.press('Tab');
  await expect(playerSkillInput).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(goalkeeperCheckbox).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(addPlayerButton).toBeFocused();
  expect(await outlineOf(addPlayerButton)).not.toBe('none');

  // Navigation scrolls to Match but both areas remain in the document. Tab therefore
  // follows document order through registered player actions before match controls.
  const matchNavigationButton = page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Match', exact: true });
  await matchNavigationButton.click();
  const selectAllButton = page.getByRole('button', { name: 'Select All Players', exact: true });
  await expect(matchNavigationButton).toBeFocused();
  await page.keyboard.press('Tab');
  for (const name of ['Ana', 'Beto', 'Caio', 'Dani']) {
    await expect(page.getByRole('button', { name: `Edit ${name}`, exact: true })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: `Delete ${name}`, exact: true })).toBeFocused();
    await page.keyboard.press('Tab');
  }
  for (const control of [playerNameInput, playerSkillInput, goalkeeperCheckbox, addPlayerButton]) {
    await expect(control).toBeFocused();
    await page.keyboard.press('Tab');
  }
  await expect(selectAllButton).toBeFocused();
  expect(await outlineOf(selectAllButton)).not.toBe('none');

  // Select everyone by keyboard; the button then disables itself, so it must not
  // trap focus and the next Tab continues to the first participant.
  await page.keyboard.press('Enter');
  await expect(selectAllButton).toBeDisabled();
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 4 / 4');

  const participantCheckboxes = page.locator('#playerSkillList input[type="checkbox"]');
  for (let index = 0; index < 4; index++) {
    await page.keyboard.press('Tab');
    await expect(participantCheckboxes.nth(index)).toBeFocused();
  }

  const teamCountInput = page.getByLabel('Number of teams', { exact: true });
  await page.keyboard.press('Tab');
  await expect(teamCountInput).toBeFocused();
  expect(await outlineOf(teamCountInput)).not.toBe('none');

  const generateButton = page.getByRole('button', { name: 'Generate Teams', exact: true });
  await page.keyboard.press('Tab');
  await expect(generateButton).toBeFocused();
  expect(await outlineOf(generateButton)).not.toBe('none');

  // Activate generation by keyboard, as a keyboard-only user would, instead of clicking.
  await page.keyboard.press('Enter');
  await expect(page.locator('#shareControls')).toBeVisible();
  // Start the Teams tab-order check at its generation control.
  await page.getByRole('button', { name: 'Generate another composition', exact: true }).focus();

  const copyButton = page.getByRole('button', { name: 'Copy teams', exact: true });
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('First player', { exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Second player', { exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Confirm swap', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Cancel', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(copyButton).toBeFocused();
  expect(await outlineOf(copyButton)).not.toBe('none');

  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Teams to copy')).toBeFocused();
});
