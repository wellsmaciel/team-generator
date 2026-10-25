const { test, expect } = require('@playwright/test');

test('Message preview lists each player on a bulleted line under the team title, with a blank line between teams', async ({ page }) => {
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Main', exact: true });
  await navigation.getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['Ana', 1], ['Player 10', 2], ['<b>Sam</b>', 3], ['Bia', 4]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await navigation.getByRole('button', { name: 'Match', exact: true }).click();
  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();

  const text = await page.getByLabel('Message preview').inputValue();

  expect(text).toMatch(/^Team 1\n• .+\n• .+\n\nTeam 2\n• .+\n• .+$/);
  expect(text.split('\n').filter(line => line.startsWith('• ')).sort())
    .toEqual(['• <b>Sam</b>', '• Ana', '• Bia', '• Player 10']);
});

// Acceptance of existing behavior: the shared text never exposes scores or goalkeeper roles.
test('Message preview contains only titles, bulleted names and blank separators, without scores or roles', async ({ page }) => {
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Main', exact: true });
  await navigation.getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score, goalkeeper] of [['Ana', 9, true], ['Bia', 8, false], ['Caio', 7, false], ['Duda', 10, false]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('checkbox', { name: 'Fixed goalkeeper (plays only in goal)' }).setChecked(goalkeeper);
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await navigation.getByRole('button', { name: 'Match', exact: true }).click();
  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();

  const lines = (await page.getByLabel('Message preview').inputValue()).split('\n');

  expect(lines.length).toBeGreaterThan(0);
  for (const line of lines) expect(line).toMatch(/^(Team [12]|• (Ana|Bia|Caio|Duda)|)$/);
  expect(lines.filter(line => line.startsWith('• ')).sort()).toEqual(['• Ana', '• Bia', '• Caio', '• Duda']);
});
