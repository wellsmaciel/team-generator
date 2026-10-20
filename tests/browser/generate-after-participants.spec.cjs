const { test, expect } = require('@playwright/test');

async function registerPlayers(page, players) {
  for (const [name, score] of players) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Player Skill', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
}

test('positions the team count input and Generate Teams button after the participant list and before the results, in both DOM and visual order', async ({ page }) => {
  await page.goto('/');
  await registerPlayers(page, [
    ['Ana', 5],
    ['Beto', 5],
    ['Caio', 5],
    ['Dani', 5],
  ]);

  const participants = page.locator('#playerSkillList input[type=checkbox]');
  for (const checkbox of await participants.all()) await checkbox.check();

  const teamCountInput = page.getByLabel('Number of teams', { exact: true });
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  // The button's accessible name changes to "Generate another composition" after
  // a successful generation, so the position check below locates it by id instead.
  const generateButton = page.locator('#btnTeams');

  const participantsListBox = await page.locator('#playerSkillList').boundingBox();
  const teamCountBox = await teamCountInput.boundingBox();
  const generateButtonBox = await generateButton.boundingBox();
  const resultsBox = await page.locator('#teamsContainer').boundingBox();

  expect(teamCountBox.y).toBeGreaterThanOrEqual(participantsListBox.y + participantsListBox.height);
  expect(generateButtonBox.y).toBeGreaterThanOrEqual(participantsListBox.y + participantsListBox.height);
  expect(resultsBox.y).toBeGreaterThanOrEqual(generateButtonBox.y + generateButtonBox.height);

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
