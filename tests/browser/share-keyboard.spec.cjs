const { test, expect } = require('@playwright/test');

test('keyboard actions and real copy and paste preserve teams after undo, accept and swap', async ({ page }, testInfo) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['Alex', 1], ['Alex', 2], ['Player 10', 3], ['<b>Sam</b>', 4]]) {
    await page.getByLabel('Player Name', { exact: true }).click();
    await page.keyboard.insertText(name);
    await page.keyboard.press('Tab');
    await expect(page.getByLabel('Estimated skill (1–10)', { exact: true })).toBeFocused();
    await page.keyboard.insertText(String(score));
    await page.keyboard.press('Tab');
    await expect(page.getByRole('checkbox', { name: 'Fixed goalkeeper (plays only in goal)' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Add Player', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
  }
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Match', exact: true }).click();
  const checkboxes = page.locator('#playerSkillList input[type=checkbox]');
  await checkboxes.first().focus();
  for (let index = 0; index < 4; index++) {
    await expect(checkboxes.nth(index)).toBeFocused();
    await page.keyboard.press('Space');
    if (index < 3) {
      await page.keyboard.press('Tab');
    }
  }
  await page.getByLabel('Number of teams').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#btnTeams')).toBeFocused();
  await page.keyboard.press('Enter');
  const originalText = await page.getByLabel('Teams to copy').inputValue();

  async function copyAndPaste(state) {
    const source = page.getByLabel('Teams to copy');
    const expected = await source.inputValue();
    expect(expected.split('\n').filter(line => line && !/^Team [12]$/.test(line)).sort())
      .toEqual(['• <b>Sam</b>', '• Alex', '• Alex', '• Player 10']);
    expect(await page.locator('#teamsContainer b').count()).toBe(0);
    await source.focus();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('ControlOrMeta+C');
    const editor = await page.context().newPage();
    await editor.goto('/clipboard-editor');
    await editor.getByLabel('Pasted text').click();
    await editor.keyboard.press('ControlOrMeta+V');
    await expect(editor.getByLabel('Pasted text')).toHaveValue(expected);
    await testInfo.attach(state + '-pasted-text', { body: await editor.getByLabel('Pasted text').inputValue(), contentType: 'text/plain' });
    await editor.close();
    await page.bringToFront();
  }

  await page.locator('#btnTeams').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#alternativeControls')).toBeVisible();
  await page.getByRole('button', { name: 'Undo composition' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Teams to copy')).toHaveValue(originalText);
  await copyAndPaste('undo');

  await page.locator('#btnTeams').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#alternativeControls')).toBeVisible();
  await page.getByRole('button', { name: 'Accept composition' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#alternativeControls')).toBeHidden();
  await copyAndPaste('accept');

  await page.getByLabel('Teams to copy').focus();
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('First player', { exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#firstSwapPlayer option:checked')).toContainText('Team 1, player 1:');
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Second player', { exact: true })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#secondSwapPlayer option:checked')).toContainText('Team 2, player 1:');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Confirm swap', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#swapStatus')).toContainText('Players swapped');
  await copyAndPaste('swap');
  await page.screenshot({ path: testInfo.outputPath('keyboard-and-share.png'), fullPage: true });
  // Fixed backgrounds are painted only in the viewport of a full-page capture.
  // Keep viewport captures as the evidence of how the page actually appears.
  await page.getByRole('heading', { name: 'Team Generator', exact: true }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath('top-viewport.png') });
  await page.getByRole('button', { name: 'Confirm swap', exact: true }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath('swap-viewport.png') });
});
