const { test, expect } = require('@playwright/test');

const mainNavigation = page => page.getByRole('navigation', { name: 'Main', exact: true });

test('Match without registered players shows guidance and an Add players control that leads to Players', async ({ page }) => {
  await page.goto('/');
  const nav = mainNavigation(page);
  await nav.getByRole('button', { name: 'Match', exact: true }).click();

  await expect(page.getByText('No players registered yet. Add players to set up a match.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Add players', exact: true }).click();

  await expect(nav.getByRole('button', { name: 'Players', exact: true })).toHaveAttribute('aria-current', 'location');
  await expect(nav.getByRole('button', { name: 'Match', exact: true })).not.toHaveAttribute('aria-current', 'location');
  await expect(page.getByLabel('Player Name', { exact: true })).toBeVisible();
});

test('in Select players, tapping anywhere on a row toggles that player exactly once', async ({ page }) => {
  await page.goto('/');
  const nav = mainNavigation(page);
  await nav.getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score, goalkeeper] of [['Ana', 4, false], ['Beto', 5, true]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    if (goalkeeper) await page.getByLabel('Fixed goalkeeper (plays only in goal)', { exact: true }).check();
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await nav.getByRole('button', { name: 'Match', exact: true }).click();

  const row = page.locator('#playerSkillList > li').nth(1);
  await expect(row).toContainText('Beto');
  await expect(row).toContainText('5');
  await expect(row).toContainText('Goalkeeper');
  const checkbox = row.getByRole('checkbox');
  const status = page.locator('#selectionStatus');
  await expect(checkbox).not.toBeChecked();
  await expect(status).toHaveText('Selected for this match: 0 / 2');

  // Click on the far right of the row, well away from the checkbox and the player text.
  const box = await row.boundingBox();
  await row.click({ position: { x: box.width - 6, y: box.height / 2 } });
  await expect(checkbox).toBeChecked();
  await expect(status).toHaveText('Selected for this match: 1 / 2');

  await row.click({ position: { x: box.width - 6, y: box.height / 2 } });
  await expect(checkbox).not.toBeChecked();
  await expect(status).toHaveText('Selected for this match: 0 / 2');
});

test('the app opens on Players with the Match workspace one tap away', async ({ page }) => {
  await page.goto('/');
  const nav = mainNavigation(page);

  await expect(nav.getByRole('button', { name: 'Players', exact: true })).toHaveAttribute('aria-current', 'location');
  await expect(nav.getByRole('button', { name: 'Match', exact: true })).not.toHaveAttribute('aria-current', 'location');
  await expect(page.locator('#playersArea')).toBeVisible();
  await expect(page.locator('#matchArea')).toBeVisible();
  await expect(page.getByLabel('Number of teams', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Player Name', { exact: true })).toBeVisible();

  await nav.getByRole('button', { name: 'Match', exact: true }).click();
  await expect(nav.getByRole('button', { name: 'Match', exact: true })).toHaveAttribute('aria-current', 'location');
  await nav.getByRole('button', { name: 'Players', exact: true }).click();
  await expect(nav.getByRole('button', { name: 'Players', exact: true })).toHaveAttribute('aria-current', 'location');
});

test('each generated team without a fixed goalkeeper shows a notice on its card', async ({ page }) => {
  await page.goto('/');
  for (const [name, score] of [['Ana', 4], ['Beto', 5], ['Carla', 6], ['Davi', 7]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }

  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();

  const teamCards = page.locator('#teamsContainer .team');
  await expect(teamCards).toHaveCount(2);
  for (const card of await teamCards.all()) {
    await expect(card.getByText('No fixed goalkeeper', { exact: true })).toBeVisible();
  }
});

async function registerPlayers(page, list) {
  await mainNavigation(page).getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of list) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await mainNavigation(page).getByRole('button', { name: 'Match', exact: true }).click();
}

test('generating teams opens Teams and hides the selection, and Back to selection restores the selection and team count', async ({ page }) => {
  await page.goto('/');
  await registerPlayers(page, [['Ana', 3], ['Beto', 4], ['Carla', 5], ['Davi', 6], ['Eva', 7], ['Fabio', 8]]);
  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await page.getByLabel('Number of teams', { exact: true }).fill('3');

  await expect(page.getByRole('heading', { name: 'Select players', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Teams', exact: true })).toBeHidden();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Teams', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Team \d$/ })).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Select players', exact: true })).toBeHidden();
  await expect(page.getByRole('button', { name: 'Select All Players', exact: true })).toBeHidden();
  await expect(page.getByLabel('Number of teams', { exact: true })).toBeHidden();
  await expect(page.locator('#playerSkillList')).toBeHidden();

  await page.getByRole('button', { name: 'Back to selection', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Select players', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Teams', exact: true })).toBeHidden();
  await expect(page.getByLabel('Number of teams', { exact: true })).toHaveValue('3');
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 6 / 6');
  await expect(page.locator('#playerSkillList').getByRole('checkbox', { checked: true })).toHaveCount(6);
});

test('generation impediments keep the user in Select players and show the reason there', async ({ page }) => {
  await page.goto('/');
  await registerPlayers(page, [['Ana', 3], ['Beto', 4], ['Carla', 5], ['Davi', 6], ['Eva', 7]]);
  const generate = page.getByRole('button', { name: 'Generate Teams', exact: true });
  const teamCount = page.getByLabel('Number of teams', { exact: true });
  const checkboxes = page.locator('#playerSkillList').getByRole('checkbox');
  const stayedInSelection = async () => {
    await expect(page.getByRole('heading', { name: 'Select players', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Teams', exact: true })).toBeHidden();
  };

  await generate.click();
  await expect(page.getByText('Select the players for this match before generating teams.', { exact: true })).toBeVisible();
  await stayedInSelection();

  for (const index of [0, 1, 2, 3]) await checkboxes.nth(index).check();
  await teamCount.fill('3');
  await generate.click();
  await expect(page.getByText('Select at least 2 players per team, or reduce the number of teams (minimum 2 teams).', { exact: true })).toBeVisible();
  await stayedInSelection();

  await teamCount.fill('1');
  await generate.click();
  await expect(page.getByText('Choose a whole number of teams, starting from 2.', { exact: true })).toBeVisible();
  await stayedInSelection();

  await checkboxes.nth(4).check();
  await teamCount.fill('2');
  await generate.click();
  await expect(page.getByRole('heading', { name: 'Teams', exact: true })).toBeVisible();
});

test('View teams in Select players returns to the same preserved teams without regenerating, and only while teams exist', async ({ page }) => {
  await page.goto('/');
  await registerPlayers(page, [['Ana', 3], ['Beto', 4], ['Carla', 5], ['Davi', 6], ['Eva', 7], ['Fabio', 9]]);
  const viewTeams = page.getByRole('button', { name: 'View teams', exact: true });
  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await expect(viewTeams).toBeHidden();

  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Teams', exact: true })).toBeVisible();
  const teamsBefore = await page.locator('#teamsContainer').innerText();
  const shareBefore = await page.locator('#shareText').inputValue();

  await page.getByRole('button', { name: 'Back to selection', exact: true }).click();
  await expect(viewTeams).toBeVisible();
  await viewTeams.click();

  await expect(page.getByRole('heading', { name: 'Teams', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Select players', exact: true })).toBeHidden();
  expect(await page.locator('#teamsContainer').innerText()).toBe(teamsBefore);
  expect(await page.locator('#shareText').inputValue()).toBe(shareBefore);

  // A real change invalidates the teams, so there is nothing left to view.
  await page.getByRole('button', { name: 'Back to selection', exact: true }).click();
  await page.locator('#playerSkillList').getByRole('checkbox').first().uncheck();
  await expect(viewTeams).toBeHidden();
});

test('focus follows step changes: the opened step heading after generating, going back and viewing teams, and the Generate button after an impediment', async ({ page }) => {
  await page.goto('/');
  await registerPlayers(page, [['Ana', 3], ['Beto', 4], ['Carla', 5], ['Davi', 6]]);
  const teamsHeading = page.getByRole('heading', { name: 'Teams', exact: true });
  const selectHeading = page.getByRole('heading', { name: 'Select players', exact: true });
  const generate = page.getByRole('button', { name: 'Generate Teams', exact: true });

  // An impediment keeps the user in place: focus stays on the control they used.
  await generate.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Select the players for this match before generating teams.', { exact: true })).toBeVisible();
  await expect(generate).toBeFocused();

  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await generate.focus();
  await page.keyboard.press('Enter');
  await expect(teamsHeading).toBeFocused();

  await page.getByRole('button', { name: 'Back to selection', exact: true }).click();
  await expect(selectHeading).toBeFocused();

  await page.getByRole('button', { name: 'View teams', exact: true }).click();
  await expect(teamsHeading).toBeFocused();
});

// Acceptance of existing behavior (no RED): invalidation explains itself without stealing focus.
test('invalidating the teams keeps focus on the control the person used and never pulls it to a heading', async ({ page }) => {
  const invalidation = 'Match settings or registration changed. Generate teams again.';
  await page.goto('/');
  await registerPlayers(page, [['Ana', 3], ['Beto', 4], ['Carla', 5], ['Davi', 6]]);
  const selectHeading = page.getByRole('heading', { name: 'Select players', exact: true });
  const firstCheckbox = page.locator('#playerSkillList').getByRole('checkbox').first();
  const teamCount = page.getByLabel('Number of teams', { exact: true });
  const nav = mainNavigation(page);

  // Unchecking a player by keyboard keeps focus on that checkbox.
  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await page.getByRole('button', { name: 'Back to selection', exact: true }).click();
  await expect(selectHeading).toBeFocused();
  await firstCheckbox.focus();
  await page.keyboard.press('Space');
  await expect(page.getByText(invalidation, { exact: true })).toBeVisible();
  await expect(firstCheckbox).not.toBeChecked();
  await expect(firstCheckbox).toBeFocused();

  // Changing the team count by keyboard keeps focus on the number field.
  await page.keyboard.press('Space');
  await expect(firstCheckbox).toBeChecked();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await page.getByRole('button', { name: 'Back to selection', exact: true }).click();
  await teamCount.focus();
  await page.keyboard.press('ArrowUp');
  await expect(teamCount).toHaveValue('3');
  await expect(page.getByText(invalidation, { exact: true })).toBeVisible();
  await expect(teamCount).toBeFocused();

  // Deleting a registration in Players: coming back to Match leaves focus on the Match button.
  await teamCount.fill('2');
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  page.once('dialog', dialog => dialog.accept());
  await nav.getByRole('button', { name: 'Players', exact: true }).click();
  await page.getByRole('button', { name: 'Delete Ana', exact: true }).click();
  await nav.getByRole('button', { name: 'Match', exact: true }).click();
  await expect(selectHeading).toBeVisible();
  await expect(page.getByText(invalidation, { exact: true })).toBeVisible();
  await expect(nav.getByRole('button', { name: 'Match', exact: true })).toBeFocused();
});

// Acceptance of existing behavior (no RED): Select All Players disabling itself never traps keyboard focus.
test('Select All Players by keyboard, even when it invalidates teams, leaves focus free and Tab reaches the first participant', async ({ page }) => {
  await page.goto('/');
  await registerPlayers(page, [['Ana', 3], ['Beto', 4], ['Carla', 5], ['Davi', 6], ['Eva', 7], ['Fabio', 8]]);
  const selectAll = page.getByRole('button', { name: 'Select All Players', exact: true });
  const checkboxes = page.locator('#playerSkillList').getByRole('checkbox');

  for (const index of [0, 1, 2, 3]) await checkboxes.nth(index).check();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await page.getByRole('button', { name: 'Back to selection', exact: true }).click();

  await selectAll.focus();
  await page.keyboard.press('Enter');
  await expect(selectAll).toBeDisabled();
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 6 / 6');
  await expect(page.getByText('Match settings or registration changed. Generate teams again.', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Select players', exact: true })).toBeVisible();

  // Focus is not on a hidden or disabled control: the next Tab lands inside the participant list.
  await page.keyboard.press('Tab');
  const landedInList = await page.evaluate(() => {
    const el = document.activeElement;
    return Boolean(el && el.closest('#playerSkillList'));
  });
  expect(landedInList).toBe(true);
});

// Acceptance of layout (no RED): both Match steps fit 360/390/768/1280 with long names and the navigation never covers a focused control.
test('Select players and Teams fit every width with long names, and the fixed navigation never covers a focused control', async ({ page }) => {
  const longName = 'Wolfeschlegelsteinhausenbergerdorff';
  const roster = [[longName + ' One', 3], ['Beto', 4], ['Carla', 5], [longName + ' Two', 6], ['Eva', 7], ['Fabio', 8]];
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  await registerPlayers(page, roster);
  await page.getByRole('button', { name: 'Match', exact: true }).click();
  const nav = mainNavigation(page);

  const noHorizontalOverflow = () => page.evaluate(() =>
    document.documentElement.scrollWidth <= document.documentElement.clientWidth);
  // Tab through every control of the visible step and require each one to sit outside the navigation box.
  async function expectTabStopsClearOfNavigation() {
    for (let step = 0; step < 14; step++) {
      await page.keyboard.press('Tab');
      // Measure both boxes after each Tab once scrolling settles: the navigation may be fixed or static.
      const box = await page.evaluate(async () => {
        // Bootstrap enables smooth scrolling, so wait until the scroll position stops changing.
        let lastScroll = -1;
        for (let wait = 0; wait < 20 && window.scrollY !== lastScroll; wait++) {
          lastScroll = window.scrollY;
          await new Promise(resolve => setTimeout(resolve, 80));
        }
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const rect = el.getBoundingClientRect();
        const navRect = document.querySelector('nav').getBoundingClientRect();
        return {
          insideNav: Boolean(el.closest('nav')),
          overlaps: rect.bottom > navRect.top && rect.top < navRect.bottom &&
            rect.right > navRect.left && rect.left < navRect.right,
          tag: el.id || (el.tagName + ' "' + el.textContent.trim().slice(0, 30) + '"'),
          detail: 'control bottom ' + Math.round(rect.bottom) + ', navigation top ' + Math.round(navRect.top) +
            ', viewport ' + window.innerWidth + 'x' + window.innerHeight,
        };
      });
      if (box === null || box.insideNav) break;
      expect(box.overlaps, 'a focused control (' + box.tag + ') sits behind the navigation: ' + box.detail).toBe(false);
    }
  }

  for (const width of [1280, 768, 390, 360]) {
    // Reloading keeps the registrations and resets the match, so each width starts from Select players.
    await page.setViewportSize({ width, height: 800 });
    await page.reload();
    await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Select players', exact: true })).toBeVisible();
    expect(await noHorizontalOverflow()).toBe(true);
    for (const row of await page.locator('#playerSkillList > li').all()) {
      const box = await row.boundingBox();
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
    }
    await page.locator('#playerSkillList').getByRole('checkbox').first().focus();
    await expectTabStopsClearOfNavigation();

    await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Teams', exact: true })).toBeFocused();
    expect(await noHorizontalOverflow()).toBe(true);
    await page.getByRole('heading', { name: 'Teams', exact: true }).focus();
    await expectTabStopsClearOfNavigation();
  }
});

test('Teams shows one card per team, side by side when they fit and stacked on phones, with long names and a single step heading', async ({ page }) => {
  const longName = 'Wolfeschlegelsteinhausenbergerdorff';
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  await registerPlayers(page, [[longName + ' One', 3], ['Beto', 4], ['Carla', 5], [longName + ' Two', 6], ['Eva', 7], ['Fabio', 8]]);
  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await page.getByLabel('Number of teams', { exact: true }).fill('3');
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Teams', exact: true })).toBeFocused();

  // Only one level-2 heading names the step; the old duplicate list title is gone.
  await expect(page.locator('#teamsStage > h2')).toHaveCount(1);

  const cards = page.locator('#teamsContainer > section');
  await expect(cards).toHaveCount(3);
  const boxes = async () => Promise.all([0, 1, 2].map(index => cards.nth(index).boundingBox()));
  const noHorizontalOverflow = () => page.evaluate(() =>
    document.documentElement.scrollWidth <= document.documentElement.clientWidth);

  // Wide screens: the three cards share a row, left to right.
  let [first, second, third] = await boxes();
  expect(Math.abs(first.y - second.y)).toBeLessThanOrEqual(2);
  expect(Math.abs(second.y - third.y)).toBeLessThanOrEqual(2);
  expect(second.x).toBeGreaterThan(first.x + first.width - 2);
  expect(third.x).toBeGreaterThan(second.x + second.width - 2);
  expect(await noHorizontalOverflow()).toBe(true);

  // Tablet: at least the first two cards still share a row.
  await page.setViewportSize({ width: 768, height: 900 });
  [first, second] = await boxes();
  expect(Math.abs(first.y - second.y)).toBeLessThanOrEqual(2);
  expect(await noHorizontalOverflow()).toBe(true);

  // Phones: cards stack in one column inside the screen, long names included.
  for (const width of [390, 360]) {
    await page.setViewportSize({ width, height: 800 });
    [first, second, third] = await boxes();
    expect(Math.abs(first.x - second.x)).toBeLessThanOrEqual(2);
    expect(Math.abs(second.x - third.x)).toBeLessThanOrEqual(2);
    expect(second.y).toBeGreaterThan(first.y + first.height - 2);
    expect(third.y).toBeGreaterThan(second.y + second.height - 2);
    for (const box of [first, second, third]) {
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
    }
    expect(await noHorizontalOverflow()).toBe(true);
  }
});

// Acceptance of existing behavior (no RED): navigation never changes the match by itself.
test('switching between Players and Match without a real change keeps the teams and never resolves a pending preview', async ({ page }) => {
  await page.goto('/');
  await registerPlayers(page, [['Bruno', 2], ['Carla', 3], ['Diego', 4], ['Eva', 5]]);
  const nav = mainNavigation(page);
  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await page.getByRole('button', { name: 'Generate another composition', exact: true }).click();
  await expect(page.locator('#alternativeControls')).toBeVisible();
  await expect(page.locator('#alternativeStatus')).toContainText('less balanced');
  const teamsWithPreview = await page.locator('#teamsContainer').innerText();

  await nav.getByRole('button', { name: 'Players', exact: true }).click();
  await nav.getByRole('button', { name: 'Match', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Teams', exact: true })).toBeVisible();
  await expect(page.locator('#alternativeControls')).toBeVisible();
  await expect(page.locator('#alternativeStatus')).toContainText('less balanced');
  await expect(page.locator('#btnTeams')).toBeDisabled();
  expect(await page.locator('#teamsContainer').innerText()).toBe(teamsWithPreview);

  // Going back to the selection and returning also leaves the preview pending.
  await page.getByRole('button', { name: 'Back to selection', exact: true }).click();
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 4 / 4');
  await page.getByRole('button', { name: 'View teams', exact: true }).click();
  await expect(page.locator('#alternativeControls')).toBeVisible();
  expect(await page.locator('#teamsContainer').innerText()).toBe(teamsWithPreview);

  await page.getByRole('button', { name: 'Undo composition', exact: true }).click();
  await expect(page.locator('#alternativeControls')).toBeHidden();
});

test('a real change that invalidates the teams brings Match back to Select players with the reason visible', async ({ page }) => {
  const invalidation = 'Match settings or registration changed. Generate teams again.';
  await page.goto('/');
  await registerPlayers(page, [['Ana', 3], ['Beto', 4], ['Carla', 5], ['Davi', 6], ['Eva', 7]]);
  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Teams', exact: true })).toBeVisible();

  // Deleting a registration while viewing Teams invalidates them.
  page.once('dialog', dialog => dialog.accept());
  await mainNavigation(page).getByRole('button', { name: 'Players', exact: true }).click();
  await page.getByRole('button', { name: 'Delete Ana', exact: true }).click();
  await mainNavigation(page).getByRole('button', { name: 'Match', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Select players', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Teams', exact: true })).toBeHidden();
  await expect(page.getByText(invalidation, { exact: true })).toBeVisible();
  await expect(page.locator('#selectionStatus')).toHaveText('Selected for this match: 4 / 4');

  // Changing the selection after going back also invalidates the teams and says so in place.
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Teams', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Back to selection', exact: true }).click();
  await expect(page.getByText(invalidation, { exact: true })).toBeHidden();
  await page.locator('#playerSkillList').getByRole('checkbox').first().uncheck();
  await expect(page.getByText(invalidation, { exact: true })).toBeVisible();
});
