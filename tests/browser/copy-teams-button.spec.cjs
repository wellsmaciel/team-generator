const { test, expect } = require('@playwright/test');

test('clicking Copy teams copies the current shareable text and confirms only after success', async ({ page }) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['Bruno', 2], ['Carla', 3], ['Diego', 4], ['Eva', 5]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Match', exact: true }).click();
  const participants = page.locator('#playerSkillList input[type=checkbox]');
  for (const checkbox of await participants.all()) await checkbox.check();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.locator('#shareControls')).toBeVisible();

  const expectedText = await page.getByLabel('Message preview').inputValue();

  await page.getByRole('button', { name: 'Copy teams', exact: true }).click();

  await expect(page.getByRole('status').filter({ hasText: /copied/i })).toBeVisible();
  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboardText.replace(/\r\n/g, '\n')).toBe(expectedText);
});

test('clipboard rejection offers manual copying without losing the displayed teams or players', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['Bruno', 2], ['Carla', 3], ['Diego', 4], ['Eva', 5]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Match', exact: true }).click();
  const participants = page.locator('#playerSkillList input[type=checkbox]');
  for (const checkbox of await participants.all()) await checkbox.check();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.locator('#shareControls')).toBeVisible();
  const shareText = page.getByLabel('Message preview');
  const expectedText = await shareText.inputValue();
  const expectedTeams = await page.locator('#teamsContainer').innerText();

  // Simulate rejection only at the external clipboard API boundary.
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new DOMException('Clipboard access denied for this test.', 'NotAllowedError');
    };
  });
  await page.getByRole('button', { name: 'Copy teams', exact: true }).click();

  await expect(page.getByRole('status').filter({ hasText: /^Message copied\.$/ })).toHaveCount(0);
  await expect(shareText).toBeVisible();
  await expect(shareText).toHaveValue(expectedText);
  await expect(shareText).toHaveAttribute('readonly', '');
  await expect(page.locator('#teamsContainer')).toHaveText(expectedTeams, { useInnerText: true });
  await expect(page.locator('#playerSkillList .player-name')).toHaveText(['Bruno', 'Carla', 'Diego', 'Eva']);
  await expect(page.locator('#playerSkillList .player-score')).toHaveText(['2', '3', '4', '5']);
  await expect(page.getByRole('status').filter({
    hasText: /copy[\s\S]*manually|manually[\s\S]*copy|select[\s\S]*copy/i,
  })).toBeVisible();
});

test('a pending less-balanced preview hides Copy teams and clears a previous copy status', async ({ page }) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['Bruno', 2], ['Carla', 3], ['Diego', 4], ['Eva', 5]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Match', exact: true }).click();
  const participants = page.locator('#playerSkillList input[type=checkbox]');
  for (const checkbox of await participants.all()) await checkbox.check();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.locator('#shareControls')).toBeVisible();

  await page.getByRole('button', { name: 'Copy teams', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: /copied/i })).toBeVisible();

  await page.getByRole('button', { name: 'Generate another composition', exact: true }).click();
  await expect(page.locator('#alternativeControls')).toBeVisible();
  await expect(page.locator('#alternativeStatus')).toContainText('less balanced');

  await expect(page.locator('#shareControls')).toBeHidden();
  await expect(page.locator('#copyStatus')).toHaveText('');
});

test('Copy teams copies the currently displayed composition after undo, accept and a manual swap', async ({ page }) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['Bruno', 2], ['Carla', 3], ['Diego', 4], ['Eva', 5]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Match', exact: true }).click();
  const participants = page.locator('#playerSkillList input[type=checkbox]');
  for (const checkbox of await participants.all()) await checkbox.check();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.locator('#shareControls')).toBeVisible();
  const shareText = page.getByLabel('Message preview');

  async function copyAndCompareWithDisplayedText() {
    const expectedText = await shareText.inputValue();
    await page.getByRole('button', { name: 'Copy teams', exact: true }).click();
    await expect(page.getByRole('status').filter({ hasText: /copied/i })).toBeVisible();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText.replace(/\r\n/g, '\n')).toBe(expectedText);
  }

  const originalText = await shareText.inputValue();
  await page.getByRole('button', { name: 'Generate another composition', exact: true }).click();
  await expect(page.locator('#alternativeControls')).toBeVisible();
  await page.getByRole('button', { name: 'Undo composition' }).click();
  await expect(page.locator('#alternativeControls')).toBeHidden();
  await expect(shareText).toHaveValue(originalText);
  await copyAndCompareWithDisplayedText();

  await page.getByRole('button', { name: 'Generate another composition', exact: true }).click();
  await expect(page.locator('#alternativeControls')).toBeVisible();
  await page.getByRole('button', { name: 'Accept composition' }).click();
  await expect(page.locator('#alternativeControls')).toBeHidden();
  await copyAndCompareWithDisplayedText();

  await page.getByLabel('First player', { exact: true }).selectOption({ index: 1 });
  await page.getByLabel('Second player', { exact: true }).selectOption({ index: 3 });
  await page.getByRole('button', { name: 'Confirm swap', exact: true }).click();
  await expect(page.locator('#swapStatus')).toContainText('Players swapped');
  await copyAndCompareWithDisplayedText();
});

test('a copy in progress does not apply a late success message after the composition changes', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['Bruno', 2], ['Carla', 3], ['Diego', 4], ['Eva', 5]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Match', exact: true }).click();
  const participants = page.locator('#playerSkillList input[type=checkbox]');
  for (const checkbox of await participants.all()) await checkbox.check();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.locator('#shareControls')).toBeVisible();

  // Simulate a slow copy only at the external clipboard API boundary: writeText
  // stays pending until the test explicitly resolves it from outside the app.
  await page.evaluate(() => {
    window.__resolvePendingCopy = undefined;
    navigator.clipboard.writeText = () => new Promise(resolve => {
      window.__resolvePendingCopy = resolve;
    });
  });

  await page.getByRole('button', { name: 'Copy teams', exact: true }).click();
  await expect.poll(() => page.evaluate(() => typeof window.__resolvePendingCopy === 'function')).toBe(true);

  await page.getByRole('button', { name: 'Generate another composition', exact: true }).click();
  await expect(page.locator('#alternativeControls')).toBeVisible();
  await expect(page.locator('#copyStatus')).toHaveText('');

  await page.evaluate(() => window.__resolvePendingCopy());

  await expect(page.locator('#copyStatus')).toHaveText('');
  await expect(page.getByRole('status').filter({ hasText: /copied/i })).toHaveCount(0);
});

test('a missing clipboard API offers manual copying without losing the displayed teams or players', async ({ page }) => {
  // Simulate absence only at the external clipboard API boundary, before the app script runs.
  // `delete navigator.clipboard` leaves the inherited Navigator.prototype.clipboard getter
  // reachable in Chromium, so the property must be overridden instead of deleted.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
  });
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['Bruno', 2], ['Carla', 3], ['Diego', 4], ['Eva', 5]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Match', exact: true }).click();
  const participants = page.locator('#playerSkillList input[type=checkbox]');
  for (const checkbox of await participants.all()) await checkbox.check();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.locator('#shareControls')).toBeVisible();
  const shareText = page.getByLabel('Message preview');
  const expectedText = await shareText.inputValue();
  const expectedTeams = await page.locator('#teamsContainer').innerText();

  expect(await page.evaluate(() => navigator.clipboard === undefined)).toBe(true);
  await page.getByRole('button', { name: 'Copy teams', exact: true }).click();

  await expect(page.getByRole('status').filter({ hasText: /^Message copied\.$/ })).toHaveCount(0);
  await expect(shareText).toBeVisible();
  await expect(shareText).toHaveValue(expectedText);
  await expect(shareText).toHaveAttribute('readonly', '');
  await expect(page.locator('#teamsContainer')).toHaveText(expectedTeams, { useInnerText: true });
  await expect(page.locator('#playerSkillList .player-name')).toHaveText(['Bruno', 'Carla', 'Diego', 'Eva']);
  await expect(page.locator('#playerSkillList .player-score')).toHaveText(['2', '3', '4', '5']);
  await expect(page.getByRole('status').filter({
    hasText: /copy[\s\S]*manually|manually[\s\S]*copy|select[\s\S]*copy/i,
  })).toBeVisible();
});

test('a copy in progress does not apply a late error message after the composition changes', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['Bruno', 2], ['Carla', 3], ['Diego', 4], ['Eva', 5]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Match', exact: true }).click();
  const participants = page.locator('#playerSkillList input[type=checkbox]');
  for (const checkbox of await participants.all()) await checkbox.check();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.locator('#shareControls')).toBeVisible();

  // Simulate a slow, later-rejected copy only at the external clipboard API boundary:
  // writeText stays pending until the test explicitly rejects it from outside the app.
  await page.evaluate(() => {
    window.__rejectPendingCopy = undefined;
    navigator.clipboard.writeText = () => new Promise((_resolve, reject) => {
      window.__rejectPendingCopy = reject;
    });
  });

  await page.getByRole('button', { name: 'Copy teams', exact: true }).click();
  await expect.poll(() => page.evaluate(() => typeof window.__rejectPendingCopy === 'function')).toBe(true);

  await page.getByRole('button', { name: 'Generate another composition', exact: true }).click();
  await expect(page.locator('#alternativeControls')).toBeVisible();
  await expect(page.locator('#copyStatus')).toHaveText('');

  await page.evaluate(() => window.__rejectPendingCopy(new DOMException('Clipboard access denied for this test.', 'NotAllowedError')));

  await expect(page.locator('#copyStatus')).toHaveText('');
  await expect(page.getByRole('status').filter({
    hasText: /copy[\s\S]*manually|manually[\s\S]*copy|select[\s\S]*copy/i,
  })).toHaveCount(0);
});

test('confirming a manual swap after a successful copy clears the previous success message', async ({ page }) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['Bruno', 2], ['Carla', 3], ['Diego', 4], ['Eva', 5]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Match', exact: true }).click();
  const participants = page.locator('#playerSkillList input[type=checkbox]');
  for (const checkbox of await participants.all()) await checkbox.check();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.locator('#shareControls')).toBeVisible();

  const shareText = page.getByLabel('Message preview');
  const textBeforeSwap = await shareText.inputValue();

  await page.getByRole('button', { name: 'Copy teams', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: /copied/i })).toBeVisible();

  await page.getByLabel('First player', { exact: true }).selectOption({ index: 1 });
  await page.getByLabel('Second player', { exact: true }).selectOption({ index: 3 });
  await page.getByRole('button', { name: 'Confirm swap', exact: true }).click();
  await expect(page.locator('#swapStatus')).toContainText('Players swapped');

  await expect(shareText).not.toHaveValue(textBeforeSwap);
  await expect(page.locator('#copyStatus')).toHaveText('');
});

test('an immediately applied regeneration without a pending decision clears the previous success message', async ({ page }) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();
  // Equal scores guarantee the search never finds a worse alternative, so the
  // next generation always applies immediately, without a pending decision.
  for (const [name, score] of [['Ana', 5], ['Beto', 5], ['Caio', 5], ['Dani', 5]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Match', exact: true }).click();
  const participants = page.locator('#playerSkillList input[type=checkbox]');
  for (const checkbox of await participants.all()) await checkbox.check();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.locator('#shareControls')).toBeVisible();

  const shareText = page.getByLabel('Message preview');
  const textBeforeRegeneration = await shareText.inputValue();

  await page.getByRole('button', { name: 'Copy teams', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: /copied/i })).toBeVisible();

  await page.getByRole('button', { name: 'Generate another composition', exact: true }).click();
  await expect(page.locator('#alternativeControls')).toBeHidden();
  await expect(page.locator('#alternativeStatus')).toContainText('New composition applied');

  await expect(shareText).not.toHaveValue(textBeforeRegeneration);
  await expect(page.locator('#copyStatus')).toHaveText('');
});

test('regenerating after an invalidating selection change does not resurface the old copy confirmation', async ({ page }) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['Bruno', 2], ['Carla', 3], ['Diego', 4], ['Eva', 5]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Match', exact: true }).click();
  const participants = page.locator('#playerSkillList input[type=checkbox]');
  for (const checkbox of await participants.all()) await checkbox.check();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.locator('#shareControls')).toBeVisible();

  await page.getByRole('button', { name: 'Copy teams', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: /copied/i })).toBeVisible();

  // Unchecking a participant invalidates the current results and the share text.
  await page.getByRole('button', { name: 'Back to selection', exact: true }).click();
  await participants.first().uncheck();
  await expect(page.locator('#teamsContainer')).toBeEmpty();
  await expect(page.locator('#shareControls')).toBeHidden();
  await expect(page.locator('#teamsStatus')).toHaveText('Match settings or registration changed. Generate teams again.');

  await participants.first().check();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();

  await expect(page.locator('#teamsContainer .team')).toHaveCount(2);
  await expect(page.locator('#shareControls')).toBeVisible();
  await expect(page.locator('#copyStatus')).toHaveText('');
});

test('Copy teams copies literal HTML-looking names as plain text, without interpreting them', async ({ page }) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['<b>Sam</b>', 2], ['Alex', 3], ['Alex', 4], ['Player 10', 5]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Match', exact: true }).click();
  const participants = page.locator('#playerSkillList input[type=checkbox]');
  for (const checkbox of await participants.all()) await checkbox.check();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.locator('#shareControls')).toBeVisible();
  expect(await page.locator('#teamsContainer b').count()).toBe(0);

  const expectedText = await page.getByLabel('Message preview').inputValue();
  expect(expectedText).toContain('<b>Sam</b>');

  await page.getByRole('button', { name: 'Copy teams', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: /copied/i })).toBeVisible();

  const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboardText.replace(/\r\n/g, '\n')).toBe(expectedText);
});
