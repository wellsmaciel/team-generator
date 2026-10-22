const { test, expect } = require('@playwright/test');

async function registerPlayers(page, players) {
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of players) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
}

test('keeps team count and generation in the Match controls panel and before results in DOM order', async ({ page }) => {
  await page.goto('/');
  await registerPlayers(page, [
    ['Ana', 5],
    ['Beto', 5],
    ['Caio', 5],
    ['Dani', 5],
  ]);

  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Match', exact: true }).click();
  const participants = page.locator('#playerSkillList input[type=checkbox]');
  for (const checkbox of await participants.all()) await checkbox.check();

  const teamCountInput = page.getByLabel('Number of teams', { exact: true });
  // The button's accessible name changes to "Generate another composition" after
  // a successful generation, so the position checks locate it by id instead.
  const generateButton = page.locator('#btnTeams');

  // The desktop layout places participant selection beside generation controls.
  const generationPanelBox = await page.locator('#teamGeneration').boundingBox();
  const teamCountBox = await teamCountInput.boundingBox();
  const generateButtonBox = await generateButton.boundingBox();
  expect(teamCountBox.x).toBeGreaterThanOrEqual(generationPanelBox.x);
  expect(teamCountBox.x + teamCountBox.width).toBeLessThanOrEqual(generationPanelBox.x + generationPanelBox.width);
  expect(generateButtonBox.x).toBeGreaterThanOrEqual(generationPanelBox.x);
  expect(generateButtonBox.x + generateButtonBox.width).toBeLessThanOrEqual(generationPanelBox.x + generationPanelBox.width);

  // Generation opens Teams, where the results follow the generation button.
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  const generateButtonInTeamsBox = await generateButton.boundingBox();
  const resultsBox = await page.locator('#teamsContainer').boundingBox();
  expect(resultsBox.y).toBeGreaterThanOrEqual(generateButtonInTeamsBox.y + generateButtonInTeamsBox.height);

  const domOrder = await page.evaluate(() => {
    const list = document.querySelector('#playerSkillList');
    const teamCountInputElement = document.querySelector('#teamCount');
    const generateButtonElement = document.querySelector('#btnTeams');
    const resultsContainer = document.querySelector('#teamsContainer');
    const isBefore = (first, second) =>
      !!(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);
    return {
      listBeforeTeamCount: isBefore(list, teamCountInputElement),
      listBeforeGenerateButton: isBefore(list, generateButtonElement),
      generateButtonBeforeResults: isBefore(generateButtonElement, resultsContainer),
    };
  });

  expect(domOrder.listBeforeTeamCount).toBe(true);
  expect(domOrder.listBeforeGenerateButton).toBe(true);
  expect(domOrder.generateButtonBeforeResults).toBe(true);
});
