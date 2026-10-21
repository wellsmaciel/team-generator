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

test('Select All Players, generation, copy, swap, regeneration and copy again stay coherent', async ({ page }) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  const names = ['Ana', 'Beto', 'Caio', 'Dani', 'Eva', 'Fabio'];
  await registerPlayers(page, names.map((name, index) => [name, index + 4]));

  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 6 / 6');
  await expect(page.getByRole('button', { name: 'Select All Players', exact: true })).toBeDisabled();

  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.locator('#shareControls')).toBeVisible();

  const shareText = page.getByLabel('Teams to copy');
  const copyButton = page.getByRole('button', { name: 'Copy teams', exact: true });

  async function expectCopyMatchesDisplayedTeams() {
    const displayed = await shareText.inputValue();
    await copyButton.click();
    await expect(page.locator('#shareControls')).toContainText(/copied/i);
    // The Windows clipboard returns CRLF; the textarea holds LF (same normalization as copy-teams-button).
    expect((await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n')).toBe(displayed);
    // Every selected participant exactly once, and no skill scores in the copied text.
    const lines = displayed.split('\n').filter(line => line && !/^Team \d+$/.test(line));
    expect(lines.sort()).toEqual([...names].sort());
    expect(displayed).not.toMatch(/\d{2,}|skill|total/i);
    return displayed;
  }

  const firstText = await expectCopyMatchesDisplayedTeams();

  // Manual swap between the first player of team 1 and the first player of team 2.
  await page.getByLabel('First player', { exact: true }).selectOption({ index: 1 });
  const secondOptions = await page.locator('#secondSwapPlayer option').allTextContents();
  const team2Index = secondOptions.findIndex(text => text.startsWith('Team 2'));
  await page.getByLabel('Second player', { exact: true }).selectOption({ index: team2Index });
  await page.getByRole('button', { name: 'Confirm swap', exact: true }).click();
  await expect(page.locator('#swapStatus')).toContainText('Players swapped');
  const swappedText = await expectCopyMatchesDisplayedTeams();
  expect(swappedText).not.toBe(firstText);

  // Another composition: either applied at once or held for a decision. Either way the copy
  // must follow the composition the organizer sees, and nothing is copyable during a decision.
  await page.locator('#btnTeams').click();
  const decision = page.locator('#alternativeControls');
  if (await decision.isVisible()) {
    await expect(page.locator('#shareControls')).toBeHidden();
    await expect(copyButton).toBeHidden();
    await page.getByRole('button', { name: 'Undo composition' }).click();
    await expect(shareText).toHaveValue(swappedText);
    await expectCopyMatchesDisplayedTeams();
    await page.locator('#btnTeams').click();
    if (await decision.isVisible()) {
      await page.getByRole('button', { name: 'Accept composition' }).click();
      await expect(decision).toBeHidden();
    }
  }
  await expectCopyMatchesDisplayedTeams();
});

test('after Select All Players disables itself by mouse click, focus is not trapped and Tab continues to the first participant', async ({ page }, testInfo) => {
  await page.goto('/');
  await registerPlayers(page, [['Ana', 5], ['Beto', 6], ['Caio', 7], ['Dani', 8]]);
  const selectAllButton = page.getByRole('button', { name: 'Select All Players', exact: true });
  await selectAllButton.click();
  await expect(selectAllButton).toBeDisabled();

  const active = await page.evaluate(() => document.activeElement && (document.activeElement.id || document.activeElement.tagName));
  await testInfo.attach('active-element-after-click', { body: String(active), contentType: 'text/plain' });

  await page.keyboard.press('Tab');
  const afterTab = await page.evaluate(() => {
    const el = document.activeElement;
    return el && el.closest('#playerSkillList') ? 'participant-list' : (el && (el.id || el.tagName));
  });
  await testInfo.attach('active-element-after-tab', { body: String(afterTab), contentType: 'text/plain' });
  expect(afterTab).toBe('participant-list');
});
