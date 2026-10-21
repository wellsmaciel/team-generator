// Task 07 integrated acceptance (existing behavior, no artificial RED). Public UI only: roles, labels, visible text,
// dialogs, geometry and the real browser clipboard. Synthetic data in a fresh browser context per test.
const { test, expect } = require('@playwright/test');

const LONG_NAME = 'Wolfeschlegelsteinhausenbergerdorff Junior';
const ROSTER = [['Ana', 3], ['Beto', 4], ['Caio', 5], ['Dani', 6], ['Eva', 7], [LONG_NAME, 8]];

const navigation = page => page.getByRole('navigation', { name: 'Main', exact: true });
const goTo = (page, area) => navigation(page).getByRole('button', { name: area, exact: true }).click();
const selected = (page, count, total) => expect(page.locator('#selectionStatus'))
  .toHaveText(`Selected for this match: ${count} / ${total}`);
const noHorizontalOverflow = page => page.evaluate(() =>
  document.documentElement.scrollWidth <= document.documentElement.clientWidth);

async function addPlayer(page, name, score) {
  await page.getByLabel('Player Name', { exact: true }).fill(name);
  await page.getByLabel('Player Skill', { exact: true }).fill(String(score));
  await page.getByRole('button', { name: 'Add Player', exact: true }).click();
}

// Names as the organizer sees them in the rendered team cards, per team.
const renderedTeams = page => page.locator('#teamsContainer .team')
  .evaluateAll(cards => cards.map(card => [...card.querySelectorAll('li')].map(li => li.innerText.trim())));

// Expected share text is built from the rendered cards using the approved format from the plan (literal).
async function expectShareTextMatchesRenderedTeams(page) {
  const teams = await renderedTeams(page);
  const expected = teams.map((names, index) => `Team ${index + 1}\n` + names.map(name => `• ${name}`).join('\n')).join('\n\n');
  await expect(page.getByLabel('Teams to copy')).toHaveValue(expected);
  return expected;
}

// Real clipboard of the isolated browser context (granted permission), not the controlled API boundary.
async function copyAndExpectClipboard(page, expected) {
  await page.getByRole('button', { name: 'Copy teams', exact: true }).click();
  await expect(page.locator('#copyStatus')).toHaveText('Teams copied.');
  // Windows clipboard returns CRLF; the textarea holds LF.
  expect((await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n')).toBe(expected);
}

// Regenerates until the app holds a less balanced preview for a decision (the search is not deterministic).
async function regenerateUntilPending(page) {
  for (let attempt = 0; attempt < 12; attempt++) {
    await page.getByRole('button', { name: 'Generate another composition', exact: true }).click();
    if (await page.locator('#alternativeControls').isVisible()) return;
  }
  throw new Error('No pending preview after 12 regenerations with this fixture');
}

test('chained journey: register, edit, cancel, delete, select, generate, navigate, reload, preview, undo, accept, swap and copy', async ({ page }) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');

  // Empty registry: Match guides to Players.
  await expect(page.getByText('No players registered yet. Add players to set up a match.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Add players', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Registered players', exact: true })).toBeVisible();

  // Register, edit, cancel, edit again and delete (declining first, then accepting).
  for (const [name, score] of [...ROSTER, ['Zeca', 2]]) await addPlayer(page, name, score);
  const roster = page.locator('#registeredPlayerList');
  await expect(roster.locator('li')).toHaveCount(7);
  await page.getByRole('button', { name: 'Edit Zeca', exact: true }).click();
  await page.getByLabel('Player Skill', { exact: true }).fill('9');
  await page.getByRole('button', { name: 'Cancel edit', exact: true }).click();
  await expect(roster.locator('li').filter({ hasText: 'Zeca' })).toContainText('Zeca - 2');
  await page.getByRole('button', { name: 'Edit Zeca', exact: true }).click();
  await page.getByLabel('Player Skill', { exact: true }).fill('9');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(roster.locator('li').filter({ hasText: 'Zeca' })).toContainText('Zeca - 9');
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Delete Zeca', exact: true }).click();
  await expect(roster.locator('li')).toHaveCount(7);
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Delete Zeca', exact: true }).click();
  await expect(roster.locator('li')).toHaveCount(6);
  expect(await noHorizontalOverflow(page)).toBe(true);

  // Select players: row tap, Select All, individual uncheck, team count.
  await goTo(page, 'Match');
  await expect(page.getByRole('heading', { name: 'Select players', exact: true })).toBeVisible();
  await selected(page, 0, 6);
  await page.locator('#playerSkillList li').filter({ hasText: 'Ana - 3' }).locator('label').click();
  await selected(page, 1, 6);
  await page.locator('#playerSkillList li').filter({ hasText: 'Ana - 3' }).locator('label').click();
  await selected(page, 0, 6);
  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await selected(page, 6, 6);
  await expect(page.getByRole('button', { name: 'Select All Players', exact: true })).toBeDisabled();
  await page.locator('#playerSkillList li').filter({ hasText: 'Eva - 7' }).getByRole('checkbox').uncheck();
  await selected(page, 5, 6);
  await expect(page.getByRole('button', { name: 'Select All Players', exact: true })).toBeEnabled();
  await page.getByLabel('Number of teams', { exact: true }).fill('2');
  expect(await noHorizontalOverflow(page)).toBe(true);

  // Generate: Teams opens with exactly the five selected names, once each.
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Teams', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Select players', exact: true })).toBeHidden();
  await expect(page.locator('#teamsContainer .team')).toHaveCount(2);
  expect((await renderedTeams(page)).flat().sort()).toEqual(['Ana', 'Beto', 'Caio', 'Dani', LONG_NAME].sort());
  expect(await noHorizontalOverflow(page)).toBe(true);
  let shown = await expectShareTextMatchesRenderedTeams(page);
  await copyAndExpectClipboard(page, shown);

  // Only navigating preserves the result; Back to selection keeps selection and count.
  const teamsText = await page.locator('#teamsContainer').innerText();
  await goTo(page, 'Players');
  await goTo(page, 'Match');
  expect(await page.locator('#teamsContainer').innerText()).toBe(teamsText);
  await page.getByRole('button', { name: 'Back to selection', exact: true }).click();
  await selected(page, 5, 6);
  await expect(page.getByLabel('Number of teams', { exact: true })).toHaveValue('2');
  await page.getByRole('button', { name: 'View teams', exact: true }).click();
  expect(await page.locator('#teamsContainer').innerText()).toBe(teamsText);

  // Reload keeps only the registrations.
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Select players', exact: true })).toBeVisible();
  await selected(page, 0, 6);
  await expect(page.locator('#teamsContainer')).toBeEmpty();
  await expect(page.locator('#shareControls')).toBeHidden();

  // New match with all six: pending preview survives navigation, then undo and accept keep text coherent.
  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  expect((await renderedTeams(page)).flat().sort()).toEqual(['Ana', 'Beto', 'Caio', 'Dani', 'Eva', LONG_NAME].sort());
  const sixPlayerText = await expectShareTextMatchesRenderedTeams(page);
  await copyAndExpectClipboard(page, sixPlayerText);

  // With these six notes no worse alternative exists, so a new composition is applied at once and clears the old confirmation.
  await page.getByRole('button', { name: 'Generate another composition', exact: true }).click();
  await expect(page.locator('#alternativeControls')).toBeHidden();
  await expect(page.locator('#alternativeStatus')).toContainText('New composition applied');
  await expect(page.locator('#copyStatus')).toHaveText('');
  await expectShareTextMatchesRenderedTeams(page);

  // Dropping two participants invalidates the result; four notes (3, 4, 5, 6) have a single best split,
  // so the next composition waits for a decision.
  await page.getByRole('button', { name: 'Back to selection', exact: true }).click();
  await page.locator('#playerSkillList li').filter({ hasText: 'Eva - 7' }).getByRole('checkbox').uncheck();
  await page.locator('#playerSkillList li').filter({ hasText: LONG_NAME }).getByRole('checkbox').uncheck();
  await selected(page, 4, 6);
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  expect((await renderedTeams(page)).flat().sort()).toEqual(['Ana', 'Beto', 'Caio', 'Dani']);
  const original = await expectShareTextMatchesRenderedTeams(page);

  await regenerateUntilPending(page);
  await expect(page.locator('#shareControls')).toBeHidden();
  const previewText = await page.locator('#teamsContainer').innerText();
  await goTo(page, 'Players');
  await goTo(page, 'Match');
  await expect(page.locator('#alternativeControls')).toBeVisible();
  expect(await page.locator('#teamsContainer').innerText()).toBe(previewText);
  await page.getByRole('button', { name: 'Back to selection', exact: true }).click();
  await page.getByRole('button', { name: 'View teams', exact: true }).click();
  await expect(page.locator('#alternativeControls')).toBeVisible();
  expect(await page.locator('#teamsContainer').innerText()).toBe(previewText);

  await page.getByRole('button', { name: 'Undo composition', exact: true }).click();
  await expect(page.locator('#alternativeControls')).toBeHidden();
  expect(await expectShareTextMatchesRenderedTeams(page)).toBe(original);
  await copyAndExpectClipboard(page, original);

  await regenerateUntilPending(page);
  await page.getByRole('button', { name: 'Accept composition', exact: true }).click();
  await expect(page.locator('#alternativeControls')).toBeHidden();
  const accepted = await expectShareTextMatchesRenderedTeams(page);
  await copyAndExpectClipboard(page, accepted);

  // Valid swap between the first player of Team 1 and the first player of Team 2.
  await page.getByLabel('First player', { exact: true }).selectOption({ index: 1 });
  const options = await page.locator('#secondSwapPlayer option').allTextContents();
  await page.getByLabel('Second player', { exact: true }).selectOption({ index: options.findIndex(text => text.startsWith('Team 2')) });
  await page.getByRole('button', { name: 'Confirm swap', exact: true }).click();
  await expect(page.locator('#swapStatus')).toContainText('Players swapped');
  await expect(page.locator('#copyStatus')).toHaveText('');
  const swapped = await expectShareTextMatchesRenderedTeams(page);
  expect(swapped).not.toBe(accepted);
  await copyAndExpectClipboard(page, swapped);

  // Real change after chained actions invalidates; copy confirmation does not resurface after regenerating.
  await page.getByRole('button', { name: 'Back to selection', exact: true }).click();
  await page.locator('#playerSkillList li').filter({ hasText: 'Ana - 3' }).getByRole('checkbox').uncheck();
  await expect(page.locator('#teamsStatus')).toHaveText('Match settings or registration changed. Generate teams again.');
  await expect(page.locator('#shareControls')).toBeHidden();
  await page.locator('#playerSkillList li').filter({ hasText: 'Ana - 3' }).getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await expect(page.locator('#teamsContainer .team')).toHaveCount(2);
  await expect(page.locator('#copyStatus')).toHaveText('');
  await expectShareTextMatchesRenderedTeams(page);
  expect(await noHorizontalOverflow(page)).toBe(true);
});

// A control taller than this (the share text area) may be only partly in view when the browser first focuses it.
const TALL_CONTROL = 150;

// Describes the focused element publicly: what it is, how much of it is in the viewport, whether another element (e.g. the
// fixed navigation) covers the visible part of it, and whether a focus outline is drawn. No scrolling is done here.
function describeFocus(page) {
  return page.evaluate(async tall => {
    // Bootstrap enables smooth scrolling: wait until the scroll position settles before measuring.
    let last = -1;
    for (let wait = 0; wait < 20 && window.scrollY !== last; wait++) {
      last = window.scrollY;
      await new Promise(resolve => setTimeout(resolve, 80));
    }
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const top = Math.max(rect.top, 0), bottom = Math.min(rect.bottom, window.innerHeight);
    const hit = document.elementFromPoint(rect.left + rect.width / 2, (top + bottom) / 2);
    const label = (el.labels && el.labels[0] && el.labels[0].innerText) || el.innerText || el.id || el.tagName;
    return {
      name: label.trim().replace(/\s+/g, ' ').slice(0, 40),
      tall: rect.height > tall,
      insideHorizontally: rect.left >= 0 && rect.right <= window.innerWidth,
      fullyVisible: rect.left >= 0 && rect.right <= window.innerWidth && rect.top >= 0 && rect.bottom <= window.innerHeight,
      share: Math.max(0, bottom - top) / rect.height,
      cutAbove: rect.top < 0,
      box: `left ${Math.round(rect.left)}, right ${Math.round(rect.right)}, top ${Math.round(rect.top)}, bottom ${Math.round(rect.bottom)}, ` +
        `viewport ${window.innerWidth}x${window.innerHeight}, scrollY ${Math.round(window.scrollY)}, page height ${document.documentElement.scrollHeight}`,
      covered: !(hit === el || el.contains(hit) || (hit && hit.contains(el)) || (el.labels && [...el.labels].some(l => l.contains(hit)))),
      outline: style.outlineStyle !== 'none' ? parseFloat(style.outlineWidth) : 0,
      disabled: Boolean(el.disabled),
    };
  }, TALL_CONTROL);
}

// With the read-only share text area focused, ArrowUp/ArrowDown scroll the page (the text itself does not scroll) and focus
// stays on the control. Presses them until the whole control is in view, as a keyboard user would.
async function revealWithScrollKeys(page, name) {
  let state = await describeFocus(page), presses = 0;
  while (state && state.name === name && !state.fullyVisible && presses < 40) {
    await page.keyboard.press(state.cutAbove ? 'ArrowUp' : 'ArrowDown');
    presses++;
    state = await describeFocus(page);
  }
  return { presses, state };
}

// Presses Tab through the page and describes every stop. A tall control is also taken through a real Tab past it and
// Shift+Tab back, and then, if part of it is still outside the viewport, through real scroll keys. Nothing is scrolled by script.
async function tabThroughPage(page) {
  const stops = [];
  // Walk backwards with Shift+Tab until focus leaves the page content, so the forward walk starts at the first control
  // as for a person who has just arrived (the previous mouse click would otherwise be the starting point).
  for (let back = 0; back < 80; back++) {
    await page.keyboard.press('Shift+Tab');
    if (await page.evaluate(() => !document.activeElement || document.activeElement === document.body)) break;
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  for (let step = 0; step < 80; step++) {
    await page.keyboard.press('Tab');
    const stop = await describeFocus(page);
    if (!stop || (stops.length && stop.name === stops[0].name && step > 2)) break;
    if (stop.tall) {
      await page.keyboard.press('Tab');
      await page.keyboard.press('Shift+Tab');
      const back = await describeFocus(page);
      stop.afterRoundTrip = back && back.name === stop.name ? back : null;
      stop.afterScrollKeys = stop.afterRoundTrip && !stop.afterRoundTrip.fullyVisible ? await revealWithScrollKeys(page, stop.name) : null;
    }
    stops.push(stop);
  }
  return stops;
}

function expectUsableStops(stops, expectedNames) {
  const names = stops.map(stop => stop.name);
  for (const expected of expectedNames) expect(names.some(name => name.startsWith(expected)), `Tab reaches "${expected}": ${names.join(' | ')}`).toBe(true);
  for (const stop of stops) {
    expect(stop.insideHorizontally, `"${stop.name}" fits the viewport width when focused (${stop.box})`).toBe(true);
    expect(stop.covered, `"${stop.name}" is not covered by another element when focused`).toBe(false);
    expect(stop.outline, `"${stop.name}" draws a focus outline of at least 2px`).toBeGreaterThanOrEqual(2);
    if (!stop.tall) {
      expect(stop.fullyVisible, `"${stop.name}" is fully visible when focused (${stop.box})`).toBe(true);
      continue;
    }
    // A tall control: native focus may leave part of it outside the viewport. That is recorded as measured, and the
    // complete control must then be reachable with real keys (Tab past and Shift+Tab back, else scroll keys), never by script.
    const roundTrip = stop.afterRoundTrip, keys = stop.afterScrollKeys;
    const final = keys ? keys.state : roundTrip;
    test.info().annotations.push({
      type: 'tall control',
      description: `"${stop.name}" ${Math.round(stop.share * 100)}% in view at first focus (${stop.box}); ` +
        (roundTrip && roundTrip.fullyVisible ? 'wholly in view after Tab past and Shift+Tab back'
          : `${roundTrip ? Math.round(roundTrip.share * 100) : 0}% in view after Tab past and Shift+Tab back, wholly in view after ${keys ? keys.presses : 0} scroll key presses`),
    });
    expect(stop.share, `"${stop.name}" is at least partly in view when first focused (${stop.box})`).toBeGreaterThan(0);
    expect(roundTrip, `"${stop.name}" regains focus after Tab past and Shift+Tab back`).not.toBeNull();
    expect(final && final.name === stop.name && final.fullyVisible, `"${stop.name}" can be brought wholly into view with real keys (${final ? final.box : 'focus lost'})`).toBe(true);
    expect(final.covered, `"${stop.name}" is not covered once wholly in view`).toBe(false);
    expect(final.outline, `"${stop.name}" draws a focus outline of at least 2px once wholly in view`).toBeGreaterThanOrEqual(2);
  }
}

test('keyboard only: every control of Select players and Teams is reachable, visible, uncovered and activates by keyboard', async ({ page }) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await goTo(page, 'Players');
  for (const [name, score] of ROSTER) await addPlayer(page, name, score);
  await goTo(page, 'Match');

  // Select players: the whole step in Tab order. Space toggles a participant, Enter generates.
  expectUsableStops(await tabThroughPage(page), [
    'Players', 'Match', 'Select All Players', 'Ana - 3', 'Beto - 4', 'Caio - 5', 'Dani - 6', 'Eva - 7', LONG_NAME.slice(0, 20),
    'Number of teams', 'Generate Teams',
  ]);
  await page.getByRole('button', { name: 'Select All Players', exact: true }).focus();
  await page.keyboard.press('Enter');
  await selected(page, 6, 6);
  await page.getByRole('checkbox', { name: 'Eva - 7' }).focus();
  await page.keyboard.press('Space');
  await selected(page, 5, 6);
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Teams', exact: true })).toBeFocused();

  // Teams with a pending preview: decision, sharing is hidden, then the full step after undo.
  await regenerateUntilPendingByKeyboard(page);
  expectUsableStops(await tabThroughPage(page), [
    'Players', 'Match', 'Back to selection', 'Accept composition', 'Undo composition',
  ]);
  await page.getByRole('button', { name: 'Undo composition', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#alternativeControls')).toBeHidden();
  expectUsableStops(await tabThroughPage(page), [
    'Players', 'Match', 'Back to selection', 'Generate another composition', 'Copy teams', 'Teams to copy',
    'First player', 'Second player', 'Confirm swap', 'Cancel',
  ]);

  // Copy teams activates by keyboard and copies exactly what the organizer sees.
  const shown = await expectShareTextMatchesRenderedTeams(page);
  await page.getByRole('button', { name: 'Copy teams', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#copyStatus')).toHaveText('Teams copied.');
  expect((await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n')).toBe(shown);

  // The complete text is also reachable by keys: Tab into the text area, select all and copy it with the real shortcuts.
  await page.evaluate(() => navigator.clipboard.writeText('placeholder'));
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Teams to copy')).toBeFocused();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Control+C');
  await expect.poll(async () => (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n')).toBe(shown);
});

// Resolved-color contrast of every visible, enabled text element in the current view.
// Assumptions (reported in the evidence): the photo behind the dark overlay is taken at its LIGHTEST possible value
// (white) under the body's rgba(0,0,0,.5) overlay, then each ancestor background with alpha is composited over it.
// That is a worst-case bound, not a sample of the real photo pixels. Large text (>=24px, or >=18.66px bold) needs 3:1, otherwise 4.5:1.
async function measureTextContrast(page) {
  const results = await measureBounds(page);
  await measureTextOnPhoto(page, results);
  return results;
}

function measureBounds(page) {
  return page.evaluate(() => {
    const parse = value => {
      const match = value.match(/rgba?\(([^)]+)\)/);
      if (!match) return null;
      const parts = match[1].split(/[ ,/]+/).filter(Boolean).map(Number);
      return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
    };
    const over = (top, bottom) => ({
      r: top.r * top.a + bottom.r * (1 - top.a), g: top.g * top.a + bottom.g * (1 - top.a), b: top.b * top.a + bottom.b * (1 - top.a), a: 1,
    });
    const luminance = c => [c.r, c.g, c.b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; })
      .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
    const ratio = (a, b) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);
    function backdrop(el) {
      const layers = [];
      for (let node = el; node && node !== document.body && node !== document.documentElement; node = node.parentElement) {
        const color = parse(getComputedStyle(node).backgroundColor);
        if (color && color.a > 0) { layers.push(color); if (color.a === 1) break; }
      }
      // A dark card (alpha >= 0.85) is bounded conservatively over WHITE, the lightest possible photo pixel.
      // Without such a card the text rests on the photo itself and is sampled from real pixels instead.
      const onPhoto = !layers.some(layer => layer.a >= 0.85);
      let base = onPhoto ? { r: 127.5, g: 127.5, b: 127.5, a: 1 } : { r: 255, g: 255, b: 255, a: 1 };
      if (layers.length && layers[layers.length - 1].a === 1) base = layers.pop();
      return { color: layers.reverse().reduce((below, layer) => over(layer, below), base), onPhoto };
    }
    const results = [];
    const outline = { r: 0xb5, g: 0xee, b: 0x7a, a: 1 };
    for (const el of document.body.querySelectorAll('*')) {
      if (!el.checkVisibility() || el.closest(':disabled') || el.tagName === 'SCRIPT' || el.tagName === 'OPTION') continue;
      const own = [...el.childNodes].some(node => node.nodeType === 3 && node.textContent.trim());
      const isField = el.matches('input:not([type=checkbox]), textarea, select');
      if (!own && !isField) continue;
      const style = getComputedStyle(el);
      const resolved = backdrop(el);
      const background = isField ? parse(style.backgroundColor) : resolved.color;
      const color = parse(style.color);
      const text = over(color, background);
      const size = parseFloat(style.fontSize);
      const large = size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
      const label = (el.id ? '#' + el.id : el.tagName.toLowerCase()) + ' "' + (el.innerText || el.value || '').trim().slice(0, 24) + '"';
      // The focus outline is drawn OUTSIDE the control, so it is compared with what lies behind the control, not its own fill.
      const surroundBackdrop = el.parentElement ? backdrop(el.parentElement) : resolved;
      const surround = surroundBackdrop.color;
      const item = {
        label, ratio: ratio(text, background), needed: large ? 3 : 4.5, outlineRatio: ratio(outline, surround),
        onPhoto: resolved.onPhoto && !isField, outlineOnPhoto: surroundBackdrop.onPhoto && !(resolved.onPhoto && !isField), color,
        inFooter: Boolean(el.closest('footer')),
      };
      item.index = [...document.body.querySelectorAll('*')].indexOf(el);
      results.push(item);
    }
    return results;
  });
}

// Text that rests directly on the photo (footer, tablet/desktop navigation) cannot be bounded by a card colour.
// Method: hide all text, screenshot the real rendered pixels under each element, take the LIGHTEST pixel and compare the
// text colour with it. Measured on the actual Dark_court.jpg rendering at the current viewport, not an assumed grey.
async function measureTextOnPhoto(page, results) {
  const photoItems = results.filter(item => item.onPhoto || item.outlineOnPhoto);
  if (!photoItems.length) return;
  const hide = await page.addStyleTag({ content: '*, *::before, *::after { color: transparent !important; -webkit-text-fill-color: transparent !important; text-decoration-color: transparent !important; }' });
  for (const item of photoItems) {
    // Elements with their own fill (e.g. navigation buttons) are sampled as a 5px ring around the control, which is
    // where the focus outline (3px + 2px offset) is drawn; text elements are sampled under their glyph area.
    const ring = !item.onPhoto;
    const rect = await page.evaluate(({ index, ring, inFooter }) => {
      const el = document.body.querySelectorAll('*')[index];
      // The photo is fixed to the viewport, so the pixels behind an element depend on the scroll position. The footer is
      // sampled at its resting position (page scrolled to the end), which makes the measurement repeatable across runs.
      // Other scroll positions of the footer are not swept.
      if (inFooter) window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
      else el.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      if (ring) {
        const box = el.getBoundingClientRect();
        const x = Math.max(0, Math.floor(box.left) - 5), y = Math.max(0, Math.floor(box.top) - 5);
        return { x, y, width: Math.min(innerWidth - x, Math.ceil(box.width) + 10), height: Math.min(innerHeight - y, Math.ceil(box.height) + 10) };
      }
      // Only the area the glyphs actually occupy (union of this element's own text nodes), not the full block width.
      const range = document.createRange();
      const boxes = [...el.childNodes].filter(node => node.nodeType === 3 && node.textContent.trim())
        .flatMap(node => { range.selectNodeContents(node); return [...range.getClientRects()]; });
      const box = boxes.length ? {
        left: Math.min(...boxes.map(b => b.left)), top: Math.min(...boxes.map(b => b.top)),
        right: Math.max(...boxes.map(b => b.right)), bottom: Math.max(...boxes.map(b => b.bottom)),
      } : el.getBoundingClientRect();
      box.width = box.right - box.left; box.height = box.bottom - box.top;
      return { x: Math.max(0, Math.floor(box.left)), y: Math.max(0, Math.floor(box.top)), width: Math.max(1, Math.ceil(box.width)), height: Math.max(1, Math.ceil(box.height)) };
    }, { index: item.index, ring, inFooter: item.inFooter });
    await page.waitForTimeout(150);
    const png = await page.screenshot({ clip: rect });
    const lightest = await page.evaluate(async base64 => {
      const bitmap = await createImageBitmap(await (await fetch('data:image/png;base64,' + base64)).blob());
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
      const context = canvas.getContext('2d');
      context.drawImage(bitmap, 0, 0);
      const data = context.getImageData(0, 0, bitmap.width, bitmap.height).data;
      const lum = (r, g, b) => [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; })
        .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
      let best = { r: 0, g: 0, b: 0, lum: -1 };
      const all = [];
      for (let i = 0; i < data.length; i += 4) {
        const value = lum(data[i], data[i + 1], data[i + 2]);
        all.push(value);
        if (value > best.lum) best = { r: data[i], g: data[i + 1], b: data[i + 2], lum: value };
      }
      all.sort((a, b) => a - b);
      return { ...best, p99: all[Math.floor(all.length * 0.99)], mean: all.reduce((sum, v) => sum + v, 0) / all.length };
    }, png.toString('base64'));
    const lum = c => [c.r, c.g, c.b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; })
      .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
    const text = { r: item.color.r * item.color.a + lightest.r * (1 - item.color.a), g: item.color.g * item.color.a + lightest.g * (1 - item.color.a), b: item.color.b * item.color.a + lightest.b * (1 - item.color.a) };
    item.outlineRatio = (Math.max(lum({ r: 0xb5, g: 0xee, b: 0x7a }), lightest.lum) + 0.05) / (Math.min(lum({ r: 0xb5, g: 0xee, b: 0x7a }), lightest.lum) + 0.05);
    if (ring) continue;
    item.ratio = (Math.max(lum(text), lightest.lum) + 0.05) / (Math.min(lum(text), lightest.lum) + 0.05);
    const against = backgroundLum => (Math.max(lum(text), backgroundLum) + 0.05) / (Math.min(lum(text), backgroundLum) + 0.05);
    item.sampled = `lightest pixel rgb(${lightest.r},${lightest.g},${lightest.b}) ${item.ratio.toFixed(2)}:1, ` +
      `99th percentile ${against(lightest.p99).toFixed(2)}:1, mean ${against(lightest.mean).toFixed(2)}:1`;
  }
  await hide.evaluate(node => node.remove());
}

// Soft assertions: every state is measured and photographed even when an earlier one falls short.
function expectReadable(results, where) {
  expect.soft(results.length, `${where}: some text was measured`).toBeGreaterThan(5);
  const low = results.filter(item => item.ratio < item.needed);
  expect.soft(low.map(item => `${item.label} ${item.ratio.toFixed(2)}:1 < ${item.needed}:1${item.sampled ? ' (on photo: ' + item.sampled + ')' : ''}`), `${where}: text contrast`).toEqual([]);
  // The focus outline colour must also stand out (3:1) against the card or page it is drawn on.
  const dimOutline = results.filter(item => item.outlineRatio < 3);
  expect.soft(dimOutline.map(item => `${item.label} outline ${item.outlineRatio.toFixed(2)}:1`), `${where}: focus outline contrast`).toEqual([]);
}

const fs = require('node:fs');
const path = require('node:path');
const RUN = 'run-' + new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);

test('contrast of every visible text and the focus outline on Players, Select players and Teams, with screenshots for inspection', async ({ page }, testInfo) => {
  const shots = path.join(__dirname, 'screens', RUN);
  fs.mkdirSync(shots, { recursive: true });
  const snap = (name) => page.screenshot({ path: path.join(shots, `${testInfo.project.name}-${name}.jpg`), type: 'jpeg', quality: 70 });
  await page.goto('/');
  await goTo(page, 'Players');
  for (const [name, score] of [['Ana', 3], ['Beto', 4], ['Caio', 5], [LONG_NAME, 6]]) await addPlayer(page, name, score);
  // Each state is photographed from the top first; measuring scrolls the page to reach elements.
  const top = () => page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  // Measures, keeps the lowest ratios and every text on the photo as raw evidence next to the screenshots, then asserts.
  const checkContrast = async where => {
    const results = await measureTextContrast(page);
    const summary = item => ({ label: item.label, ratio: Number(item.ratio.toFixed(2)), needed: item.needed, sampled: item.sampled });
    const lowest = [...results].sort((a, b) => a.ratio - b.ratio).slice(0, 5).map(summary);
    fs.appendFileSync(path.join(shots, `${testInfo.project.name}-contrast.jsonl`),
      JSON.stringify({ where, lowest, onPhoto: results.filter(item => item.onPhoto).map(summary) }) + '\n');
    expectReadable(results, where);
  };
  await snap('1-players');
  await checkContrast('Players');

  await goTo(page, 'Match');
  await page.locator('#playerSkillList li').filter({ hasText: 'Ana - 3' }).locator('label').click();
  await page.locator('#playerSkillList li').filter({ hasText: 'Beto - 4' }).locator('label').click();
  await top();
  await snap('2-select-players');
  await checkContrast('Select players');

  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  await regenerateUntilPending(page);
  await top();
  await snap('3-teams-pending');
  await checkContrast('Teams with a pending preview');

  await page.getByRole('button', { name: 'Undo composition', exact: true }).click();
  await top();
  await snap('4-teams-share');
  await checkContrast('Teams with sharing and swap');
  await page.getByRole('heading', { name: 'Swap players', exact: true }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await snap('5-swap-controls');
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await snap('6-footer');
});

test('reflow: Players, Select players and Teams stay usable at widths equivalent to 200% and 400% browser zoom, long names included', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-1280x720', 'Sets its own viewport sizes; runs once.');
  // Technique: viewport resize in CSS pixels. 1280x1024 at 200% zoom is 640x512 CSS px and at 400% is 320x256 CSS px
  // (WCAG 1.4.10). This is NOT the browser zoom control: it resizes the layout viewport, device pixel ratio stays 1.
  await page.goto('/');
  await goTo(page, 'Players');
  for (const [name, score] of [['Ana', 3], ['Beto', 4], ['Caio', 5], [LONG_NAME, 6]]) await addPlayer(page, name, score);
  for (const [width, height] of [[640, 512], [320, 256]]) {
    await page.setViewportSize({ width, height });
    await goTo(page, 'Players');
    expect(await noHorizontalOverflow(page), `Players ${width}x${height}: no horizontal scrolling`).toBe(true);
    for (const button of await page.locator('#registeredPlayerList button').all()) {
      const box = await button.boundingBox();
      expect(box.x, `Players ${width}: Edit/Delete start inside`).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, `Players ${width}: Edit/Delete end inside`).toBeLessThanOrEqual(width);
    }
    await goTo(page, 'Match');
    await page.reload();
    await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
    expect(await noHorizontalOverflow(page), `Select players ${width}x${height}: no horizontal scrolling`).toBe(true);
    for (const row of await page.locator('#playerSkillList > li').all()) {
      const box = await row.boundingBox();
      expect(box.x + box.width, `Select players ${width}: rows end inside`).toBeLessThanOrEqual(width);
    }
    // Every control is still reachable: scroll each one into view and require that nothing covers its center.
    for (const control of await page.locator('#matchArea button:visible, #matchArea input:visible').all()) {
      await control.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      const covered = await control.evaluate(el => {
        const rect = el.getBoundingClientRect();
        const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
        return !(hit === el || el.contains(hit) || (el.labels && [...el.labels].some(label => label.contains(hit))));
      });
      expect(covered, `Select players ${width}x${height}: a control is covered after scrolling to it`).toBe(false);
    }
    await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Teams', exact: true })).toBeVisible();
    expect(await noHorizontalOverflow(page), `Teams ${width}x${height}: no horizontal scrolling`).toBe(true);
    const bodyText = await page.locator('#teamsContainer').innerText();
    expect(bodyText).toContain(LONG_NAME);
    for (const card of await page.locator('#teamsContainer .team').all()) {
      const box = await card.boundingBox();
      expect(box.x, `Teams ${width}: card starts inside`).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, `Teams ${width}: card ends inside`).toBeLessThanOrEqual(width);
    }
    await page.getByLabel('Teams to copy').scrollIntoViewIfNeeded();
    const share = await page.getByLabel('Teams to copy').boundingBox();
    expect(share.x + share.width, `Teams ${width}: share text ends inside`).toBeLessThanOrEqual(width);
  }
});

async function regenerateUntilPendingByKeyboard(page) {
  // Five participants (3, 4, 5, 6, 8) may apply a new composition at once, so keep asking until a decision is pending.
  for (let attempt = 0; attempt < 12; attempt++) {
    await page.getByRole('button', { name: 'Generate another composition', exact: true }).focus();
    await page.keyboard.press('Enter');
    if (await page.locator('#alternativeControls').isVisible()) return;
  }
  throw new Error('No pending preview after 12 keyboard regenerations');
}
