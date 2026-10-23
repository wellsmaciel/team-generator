const { test, expect } = require('@playwright/test');

test('optional match details appear before teams and update without changing the generated teams', async ({ page }) => {
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Main', exact: true });
  await navigation.getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['Ana', 4], ['Bia', 5], ['Caio', 6], ['Duda', 7]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }

  await navigation.getByRole('button', { name: 'Match', exact: true }).click();
  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();

  const location = page.getByLabel('Match location', { exact: true });
  const date = page.getByLabel('Match date', { exact: true });
  const time = page.getByLabel('Match time', { exact: true });
  const shareText = page.getByLabel('Teams to copy', { exact: true });
  const initialText = await shareText.inputValue();
  const initialTeams = await page.locator('#teamsContainer').innerText();

  await expect(shareText).toHaveValue(initialText);
  expect(initialText).not.toMatch(/Location:|Date:|Time:/);

  await location.fill('Riverside Court');
  await date.fill('2026-11-07');
  await time.fill('18:30');
  const withDetails = await shareText.inputValue();
  expect(withDetails).toMatch(/^Location: Riverside Court\nDate: 2026-11-07\nTime: 18:30\n\nTeam 1/m);
  expect(withDetails).toContain(initialText);

  await date.fill('');
  const withoutDate = await shareText.inputValue();
  expect(withoutDate).toContain('Location: Riverside Court');
  expect(withoutDate).not.toContain('Date:');
  expect(withoutDate).toContain('Time: 18:30');

  await location.fill('Harbour Park');
  await expect(shareText).toHaveValue(withoutDate.replace('Riverside Court', 'Harbour Park'));
  expect(await page.locator('#teamsContainer').innerText()).toBe(initialTeams);

  await page.reload();
  await expect(page.getByLabel('Match location', { exact: true })).toHaveValue('');
  await expect(page.getByLabel('Match date', { exact: true })).toHaveValue('');
  await expect(page.getByLabel('Match time', { exact: true })).toHaveValue('');
  await expect(page.locator('#teamsContainer')).toBeEmpty();
});

test('WhatsApp prepares the current share text while Copy teams remains available', async ({ page }) => {
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Main', exact: true });
  await navigation.getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['Ana', 4], ['Bia', 5], ['Caio', 6], ['Duda', 7]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }

  await navigation.getByRole('button', { name: 'Match', exact: true }).click();
  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await page.getByLabel('Match location', { exact: true }).fill('Riverside Court');
  await page.getByLabel('Match date', { exact: true }).fill('2026-11-07');
  await page.getByLabel('Match time', { exact: true }).fill('18:30');
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();

  const shareText = await page.getByLabel('Teams to copy', { exact: true }).inputValue();
  const whatsapp = page.getByRole('link', { name: 'Share on WhatsApp', exact: true });
  await expect(whatsapp).toBeVisible();
  await expect(whatsapp).toHaveAttribute('href', `https://wa.me/?text=${encodeURIComponent(shareText)}`);
  await expect(whatsapp).toHaveAttribute('target', '_blank');
  await expect(page.getByRole('button', { name: 'Copy teams', exact: true })).toBeVisible();
  expect(shareText).toMatch(/^Location: Riverside Court\nDate: 2026-11-07\nTime: 18:30\n\nTeam 1/m);
  expect(shareText).not.toMatch(/\b(?:score|skill|goalkeeper|total)\b/i);

  await page.getByLabel('Match location', { exact: true }).fill('Harbour Park');
  const updatedText = await page.getByLabel('Teams to copy', { exact: true }).inputValue();
  await expect(whatsapp).toHaveAttribute('href', `https://wa.me/?text=${encodeURIComponent(updatedText)}`);
  expect(updatedText).toContain('Location: Harbour Park');
  await expect(page.getByRole('button', { name: 'Copy teams', exact: true })).toBeVisible();
});
