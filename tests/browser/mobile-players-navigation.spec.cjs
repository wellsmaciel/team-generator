const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { test, expect } = require('@playwright/test');

test('Bootstrap styles load locally, allowing the page’s Google Fonts requests', async ({ page }) => {
  const external = [];
  page.on('request', request => {
    const url = request.url();
    if (!/^(http:\/\/127\.0\.0\.1:51806\/|file:|data:|blob:|about:)/.test(url)) external.push(url);
  });
  const bootstrapBlue = () => page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--bs-blue').trim());

  await page.goto('/');
  expect(await bootstrapBlue()).not.toBe('');

  await page.goto(pathToFileURL(path.resolve(__dirname, '..', '..', 'index.html')).href);
  expect(await bootstrapBlue()).not.toBe('');
  await expect(page.getByRole('navigation', { name: 'Main', exact: true })).toBeVisible();

  expect(external.filter(url => !/^https:\/\/fonts\.(?:googleapis|gstatic)\.com\//.test(url))).toEqual([]);
});

test('scrolling between Players and Match updates the current navigation location', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main', exact: true });
  const playersTab = nav.getByRole('button', { name: 'Players', exact: true });
  const matchTab = nav.getByRole('button', { name: 'Match', exact: true });

  for (let index = 1; index <= 20; index++) {
    await page.getByLabel('Player Name', { exact: true }).fill(`Scroll Player ${index}`);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill('5');
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }

  for (const viewport of [{ width: 390, height: 844 }, { width: 1920, height: 1080 }]) {
    await page.setViewportSize(viewport);
    const scrollToAndSettle = async top => page.evaluate(top => new Promise(resolve => {
      window.scrollTo({ top, behavior: 'instant' });
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    }), top);
    await scrollToAndSettle(0);
    await expect(playersTab).toHaveAttribute('aria-current', 'location');
    await expect(page.locator('#playersArea')).toBeVisible();
    await expect(page.locator('#matchArea')).toBeVisible();

    const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    await scrollToAndSettle(maxScroll);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await expect(matchTab).toHaveAttribute('aria-current', 'location');
    await expect(playersTab).not.toHaveAttribute('aria-current', 'location');

    await scrollToAndSettle(0);
    await expect(playersTab).toHaveAttribute('aria-current', 'location');
    await expect(matchTab).not.toHaveAttribute('aria-current', 'location');
  }
});

test('navigating between Players and Match marks the current section and keeps the match state', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main', exact: true });
  const playersTab = nav.getByRole('button', { name: 'Players', exact: true });
  const matchTab = nav.getByRole('button', { name: 'Match', exact: true });

  await playersTab.click();
  await expect(playersTab).toHaveAttribute('aria-current', 'location');
  await expect(matchTab).not.toHaveAttribute('aria-current', 'location');

  for (const [name, score] of [['Ana', 4], ['Beto', 5], ['Caio', 6], ['Dani', 7]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }
  await expect(page.getByRole('button', { name: 'Generate Teams', exact: true })).toBeVisible();

  await matchTab.click();
  await expect(matchTab).toHaveAttribute('aria-current', 'location');
  await expect(playersTab).not.toHaveAttribute('aria-current', 'location');
  await expect(page.getByLabel('Player Name', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
  await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
  const shareText = page.getByLabel('Teams to copy');
  await expect(shareText).toBeVisible();
  const generated = await shareText.inputValue();
  const selection = await page.locator('#selectionStatus').textContent();
  expect(selection).toContain('4 / 4');

  await playersTab.click();
  await expect(playersTab).toHaveAttribute('aria-current', 'location');
  await expect(page.getByLabel('Player Name', { exact: true })).toBeVisible();
  await expect(shareText).toBeVisible();

  await matchTab.click();
  await expect(matchTab).toHaveAttribute('aria-current', 'location');
  await expect(shareText).toBeVisible();
  await expect(shareText).toHaveValue(generated);
  await expect(page.locator('#selectionStatus')).toHaveText(selection);
  await expect(page.getByLabel('Number of teams', { exact: true })).toHaveValue('2');
});

test('Players lists registrations with Edit and Delete while the Match list only offers selection', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main', exact: true });
  await nav.getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['Ana', 4], ['Beto', 5]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }

  for (const name of ['Ana', 'Beto']) {
    await expect(page.getByRole('button', { name: `Edit ${name}`, exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: `Delete ${name}`, exact: true })).toBeVisible();
  }

  await nav.getByRole('button', { name: 'Match', exact: true }).click();
  await expect(page.locator('#playerSkillList .player-name')).toHaveText(['Ana', 'Beto']);
  await expect(page.locator('#playerSkillList .player-score')).toHaveText(['4', '5']);
  await expect(page.locator('#playerSkillList').getByRole('button', { name: /^(Edit|Delete) /i })).toHaveCount(0);
});

test('on tablet and desktop widths the Match participant names and scores stay in aligned columns without horizontal overflow', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main', exact: true });
  await nav.getByRole('button', { name: 'Players', exact: true }).click();
  const names = ['Alexandra Montgomery-Fitzgerald', 'Bartholomew Winterbottom', 'Christopher Vandenberg', 'Dominika Featherstone', 'Eva', 'Fabio', 'Gabi', 'Hugo'];
  for (const [index, name] of names.entries()) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(index + 1));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }

  for (const [width, height] of [[768, 1024], [1280, 720]]) {
    await page.setViewportSize({ width, height });
    for (const [area, list] of [['Players', '#registeredPlayerList'], ['Match', '#playerSkillList']]) {
      await nav.getByRole('button', { name: area, exact: true }).click();
      const rows = page.locator(`${list} > li`);
      await expect(rows).toHaveCount(names.length);
      if (area === 'Match') {
        const nameLefts = await page.locator('#playerSkillList .player-name').evaluateAll(items =>
          items.map(item => Math.round(item.getBoundingClientRect().left)));
        const scoreRights = await page.locator('#playerSkillList .player-score').evaluateAll(items =>
          items.map(item => Math.round(item.getBoundingClientRect().right)));
        expect(new Set(nameLefts).size, `player names align at ${width}px`).toBe(1);
        expect(new Set(scoreRights).size, `player skills align at ${width}px`).toBe(1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
  }
});

test('Players and Match content sits on dark, nearly opaque cards with readable text over the photo background', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main', exact: true });
  await nav.getByRole('button', { name: 'Players', exact: true }).click();
  await page.getByLabel('Player Name', { exact: true }).fill('Ana');
  await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill('5');
  await page.getByRole('button', { name: 'Add Player', exact: true }).click();

  for (const [area, selectors] of [
    ['Players', { card: '#playersArea > div:nth-of-type(1)', texts: ['h2', '#registeredPlayerList li'] }],
    ['Players', { card: '#playersArea > div:nth-of-type(2)', texts: ['h2', 'label[for="pName"]'] }],
    ['Match', { card: '#matchArea', texts: ['h2', 'h3', '#playerSkillList li'] }],
  ]) {
    await nav.getByRole('button', { name: area, exact: true }).click();
    const result = await page.evaluate(({ card, texts }) => {
      const parse = value => value.match(/[\d.]+/g).map(Number);
      const luminance = ([r, g, b]) => {
        const channel = v => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
        return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
      };
      const [r, g, b, a = 1] = parse(getComputedStyle(document.querySelector(card)).backgroundColor);
      // Worst case: the card is composited over a white photo pixel.
      const blended = [r, g, b].map(v => v * a + 255 * (1 - a));
      const cardLuminance = luminance(blended);
      const contrasts = texts.map(selector => {
        const element = document.querySelector(`${card} ${selector}`);
        const [tr, tg, tb] = parse(getComputedStyle(element).color);
        const textLuminance = luminance([tr, tg, tb]);
        const [lighter, darker] = [Math.max(textLuminance, cardLuminance), Math.min(textLuminance, cardLuminance)];
        return (lighter + 0.05) / (darker + 0.05);
      });
      return { alpha: a, contrasts };
    }, selectors);
    expect(result.alpha, `${area} card opacity`).toBeGreaterThanOrEqual(0.85);
    for (const contrast of result.contrasts) expect(contrast, `${area} text contrast`).toBeGreaterThanOrEqual(4.5);
  }
});

test('on phones, keyboard focus never leaves a control hidden behind the fixed navigation', async ({ page }) => {
  test.skip(page.viewportSize().width > 500, 'The fixed bottom bar exists only on phones.');
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main', exact: true });
  await nav.getByRole('button', { name: 'Players', exact: true }).click();
  for (let index = 1; index <= 10; index++) {
    await page.getByLabel('Player Name', { exact: true }).fill(`Player with a rather long registered name ${index}`);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill('5');
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }

  // The registered list precedes the form, so start Tab from the navigation and walk through every row.
  await nav.getByRole('button', { name: 'Match', exact: true }).focus();
  const lastDelete = page.getByRole('button', { name: 'Delete Player with a rather long registered name 10', exact: true });
  let reachedLast = false;
  for (let presses = 0; presses < 40 && !reachedLast; presses++) {
    await page.keyboard.press('Tab');
    // Bootstrap enables smooth scrolling: measure only once the scroll position has settled.
    await page.evaluate(() => new Promise(resolve => {
      let last = -1;
      let stableFrames = 0;
      const tick = () => {
        if (window.scrollY === last) {
          if (++stableFrames >= 6) return resolve();
        } else {
          stableFrames = 0;
          last = window.scrollY;
        }
        requestAnimationFrame(tick);
      };
      tick();
    }));
    const covered = await page.evaluate(() => {
      const active = document.activeElement;
      if (!active || active.closest('nav')) return null;
      const box = active.getBoundingClientRect();
      const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      if (hit === active || active.contains(hit)) return null;
      const describe = element => element ? `${element.tagName.toLowerCase()}#${element.id}` : 'nothing';
      return `${active.textContent.trim()} (top ${Math.round(box.top)}, bottom ${Math.round(box.bottom)}, viewport ${innerHeight}) is covered by ${describe(hit)}`;
    });
    expect(covered, 'focused control is covered by another element').toBeNull();
    reachedLast = await lastDelete.evaluate(element => element === document.activeElement);
  }
  expect(reachedLast).toBe(true);
});

test('the current navigation button is visibly highlighted with the approved green accent, besides aria-current and its text', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main', exact: true });
  const colors = locator => locator.evaluate(element => {
    const style = getComputedStyle(element);
    return { color: style.color, background: style.backgroundColor };
  });

  for (const [current, other] of [['Players', 'Match'], ['Match', 'Players']]) {
    await nav.getByRole('button', { name: current, exact: true }).click();
    const currentButton = nav.getByRole('button', { name: current, exact: true });
    const otherButton = nav.getByRole('button', { name: other, exact: true });
    await expect(currentButton).toHaveAttribute('aria-current', 'location');
    await expect(currentButton).toHaveCSS('color', 'rgb(181, 238, 122)');
    const currentColors = await colors(currentButton);
    const otherColors = await colors(otherButton);
    // Reference accent from the approved prototype: #b5ee7a.
    expect(currentColors.color, `${current} text colour`).toBe('rgb(181, 238, 122)');
    expect(otherColors.color, `${other} text colour`).not.toBe('rgb(181, 238, 122)');
    expect(currentColors.background, `${current} background`).not.toBe(otherColors.background);
  }
});

test('the primary actions Add Player and Generate Teams use the approved green accent with dark text', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main', exact: true });
  const colors = locator => locator.evaluate(element => {
    const style = getComputedStyle(element);
    return { color: style.color, background: style.backgroundColor };
  });
  const primary = { color: 'rgb(20, 32, 11)', background: 'rgb(181, 238, 122)' };

  await nav.getByRole('button', { name: 'Players', exact: true }).click();
  expect(await colors(page.getByRole('button', { name: 'Add Player', exact: true }))).toEqual(primary);
  await nav.getByRole('button', { name: 'Match', exact: true }).click();
  expect(await colors(page.getByRole('button', { name: 'Generate Teams', exact: true }))).toEqual(primary);
  // Secondary actions stay neutral so the primary action stands out.
  expect((await colors(page.getByRole('button', { name: 'Select All Players', exact: true }))).background).not.toBe(primary.background);
});

test('footer links stay readable and underlined on the dark page background', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(() => {
    const parse = value => value.match(/[\d.]+/g).map(Number);
    const luminance = ([r, g, b]) => {
      const channel = v => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
      return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    };
    // Conservative stand-in for the darkened photo behind the footer: a mid-dark grey.
    const background = luminance([38, 38, 38]);
    return [...document.querySelectorAll('footer a')].map(link => {
      const style = getComputedStyle(link);
      const text = luminance(parse(style.color));
      return {
        name: link.textContent,
        contrast: (Math.max(text, background) + 0.05) / (Math.min(text, background) + 0.05),
        underlined: style.textDecorationLine.includes('underline'),
      };
    });
  });
  expect(result.map(link => link.name)).toEqual(['LinkedIn', 'GitHub']);
  for (const link of result) {
    expect(link.contrast, `${link.name} contrast`).toBeGreaterThanOrEqual(4.5);
    expect(link.underlined, `${link.name} underline`).toBe(true);
  }
});

// Corrected expectation: an earlier version required the list to sit visually ABOVE the form at every width. The
// approved contract is list-first DOM order at every size, stacked vertically only on phones; larger screens put the
// two panels side by side (asserted in the Players workspace test).
test('Players keeps the Registered players card before the Add player form in its own card, stacked on phones, as in the approved layout', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main', exact: true });
  await nav.getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['Ana', 7], ['Beto', 5], ['Carla', 3]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }

  await expect(page.getByRole('heading', { name: 'Registered players', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Add player', exact: true })).toBeVisible();

  const layout = await page.evaluate(() => {
    // A card is the nearest ancestor with a nearly opaque background (controls have their own opaque fill).
    const cardOf = element => {
      for (let node = element.parentElement; node; node = node.parentElement) {
        const channels = getComputedStyle(node).backgroundColor.match(/[\d.]+/g).map(Number);
        if ((channels.length === 4 ? channels[3] : 1) >= 0.85) return node;
      }
      return null;
    };
    const heading = text => [...document.querySelectorAll('h2')].find(item => item.textContent.trim() === text);
    const registered = heading('Registered players');
    const add = heading('Add player');
    const list = document.querySelector('#registeredPlayerList');
    const input = document.querySelector('#pName');
    const submit = document.querySelector('#btnPs');
    const registeredCard = cardOf(registered);
    const addCard = cardOf(add);
    const before = (first, second) => Boolean(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING);
    return {
      headingOrder: before(registered, add),
      listBeforeForm: before(list, input),
      listAboveForm: list.getBoundingClientRect().bottom <= add.getBoundingClientRect().top,
      formBelowHeading: input.getBoundingClientRect().top > add.getBoundingClientRect().bottom,
      listInRegisteredCard: cardOf(list) === registeredCard,
      formInAddCard: cardOf(input) === addCard && cardOf(submit) === addCard,
      separateCards: Boolean(registeredCard) && Boolean(addCard) && registeredCard !== addCard
        && !registeredCard.contains(addCard) && !addCard.contains(registeredCard),
    };
  });
  const phone = page.viewportSize().width <= 500;
  // Visually above only where the panels are stacked (phones); beside each other on larger screens.
  expect(layout.listAboveForm, 'list above form').toBe(phone);
  delete layout.listAboveForm;
  expect(layout).toEqual({
    headingOrder: true,
    listBeforeForm: true,
    formBelowHeading: true,
    listInRegisteredCard: true,
    formInAddCard: true,
    separateCards: true,
  });
});

test('on tablet and desktop widths Players shows the roster panel on the left and a wide Add player form panel on the right, list first in the DOM', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'The widths are set by the test itself; one project is enough.');
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();
  const names = ['Ana', 'Maximiliano Bartolomeu de Albuquerque-Montenegro Sobrinho Neto', 'Carla', 'Diego', 'Eva', 'Felipe'];
  for (const [index, name] of names.entries()) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(index + 3));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }

  for (const [width, height] of [[768, 1024], [1280, 720]]) {
    await page.setViewportSize({ width, height });
    const layout = await page.evaluate(() => {
      const panelOf = selector => document.querySelector(selector).closest('#playersArea > div');
      const roster = panelOf('#registeredPlayerList');
      const formPanel = panelOf('#pName');
      const rosterBox = roster.getBoundingClientRect();
      const formBox = formPanel.getBoundingClientRect();
      const inner = formBox.width - 2 * parseFloat(getComputedStyle(formPanel).paddingLeft);
      const controls = ['#pName', '#pSkill', '#btnPs'].map(selector => {
        const box = document.querySelector(selector).getBoundingClientRect();
        return { selector, widthShare: box.width / inner, height: box.height };
      });
      const rows = [...document.querySelectorAll('#registeredPlayerList > li')].map(item => item.getBoundingClientRect());
      return {
        distinctPanels: roster !== formPanel,
        rosterFirstInDom: Boolean(roster.compareDocumentPosition(formPanel) & Node.DOCUMENT_POSITION_FOLLOWING),
        sameTop: Math.abs(rosterBox.top - formBox.top) <= 2,
        rosterLeftOfForm: rosterBox.right <= formBox.left,
        rosterAtLeastAsWide: rosterBox.width >= formBox.width,
        controls,
        rosterSingleColumn: new Set(rows.map(row => Math.round(row.left))).size === 1
          && new Set(rows.map(row => Math.round(row.top))).size === rows.length,
        rowsInsideRosterPanel: rows.every(row => row.left >= rosterBox.left && row.right <= rosterBox.right),
        overflow: document.documentElement.scrollWidth - innerWidth,
      };
    });
    const label = `at ${width}px`;
    expect(layout.distinctPanels, `${label} distinct panels`).toBe(true);
    expect(layout.rosterFirstInDom, `${label} roster before form in the DOM`).toBe(true);
    expect(layout.sameTop, `${label} panels start at the same height`).toBe(true);
    expect(layout.rosterLeftOfForm, `${label} roster panel left of the form panel`).toBe(true);
    expect(layout.rosterAtLeastAsWide, `${label} roster panel at least as wide as the form panel`).toBe(true);
    for (const { selector, widthShare, height } of layout.controls) {
      expect(widthShare, `${label} ${selector} width share of the form panel`).toBeGreaterThanOrEqual(0.95);
      expect(height, `${label} ${selector} height`).toBeGreaterThanOrEqual(40);
    }
    expect(layout.rosterSingleColumn, `${label} roster rows in one column`).toBe(true);
    expect(layout.rowsInsideRosterPanel, `${label} rows inside the roster panel`).toBe(true);
    expect(layout.overflow, `${label} horizontal overflow`).toBeLessThanOrEqual(0);
  }
});

test('on phones the Add player fields and button span the card width with comfortable touch heights', async ({ page }) => {
  test.skip(page.viewportSize().width > 500, 'Phone-width comfort check; tablet and desktop keep their own layout.');
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();

  const measures = await page.evaluate(() => {
    const card = document.querySelector('#pName').closest('#playersArea > div');
    const cardInner = card.getBoundingClientRect().width - 2 * parseFloat(getComputedStyle(card).paddingLeft);
    return ['#pName', '#pSkill', '#btnPs'].map(selector => {
      const box = document.querySelector(selector).getBoundingClientRect();
      return { selector, widthShare: box.width / cardInner, height: box.height };
    });
  });
  for (const { selector, widthShare, height } of measures) {
    expect(widthShare, `${selector} width share of the card content`).toBeGreaterThanOrEqual(0.95);
    expect(height, `${selector} height`).toBeGreaterThanOrEqual(44);
  }
});

test('on phones every Edit and Delete button is a comfortable touch target that stays inside the screen', async ({ page }) => {
  test.skip(page.viewportSize().width > 500, 'Phone-width comfort check; tablet and desktop keep their own layout.');
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['Ana', 7], ['Maximiliano Bartolomeu de Albuquerque-Montenegro Sobrinho Neto', 4]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }

  const { width } = page.viewportSize();
  const buttons = page.locator('#registeredPlayerList button');
  await expect(buttons).toHaveCount(4);
  for (const box of await buttons.evaluateAll(items => items.map(item => {
    const { left, right, width: w, height } = item.getBoundingClientRect();
    return { name: item.getAttribute('aria-label'), left, right, w, height };
  }))) {
    expect(box.height, `${box.name} height`).toBeGreaterThanOrEqual(44);
    expect(box.w, `${box.name} width`).toBeGreaterThanOrEqual(44);
    expect(box.left, `${box.name} left edge`).toBeGreaterThanOrEqual(0);
    expect(box.right, `${box.name} right edge`).toBeLessThanOrEqual(width);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
});

test('keyboard focus shows a thick green outline and the goalkeeper checkbox uses the green accent, as in the approved prototype', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();
  const green = 'rgb(181, 238, 122)';
  const outline = locator => locator.evaluate(element => {
    const style = getComputedStyle(element);
    return { color: style.outlineColor, style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
  });

  await page.getByLabel('Player Name', { exact: true }).focus();
  await page.keyboard.press('Tab'); // Estimated skill (1–10)
  await page.keyboard.press('Tab'); // Fixed goalkeeper checkbox
  const checkbox = page.getByLabel('Fixed goalkeeper (plays only in goal)', { exact: true });
  await expect(checkbox).toBeFocused();
  expect(await outline(checkbox), 'checkbox focus outline').toEqual({ color: green, style: 'solid', width: 3 });
  expect(await checkbox.evaluate(element => getComputedStyle(element).accentColor), 'checkbox accent').toBe(green);

  await page.keyboard.press('Tab'); // Add Player
  const addPlayer = page.getByRole('button', { name: 'Add Player', exact: true });
  await expect(addPlayer).toBeFocused();
  expect(await outline(addPlayer), 'button focus outline').toEqual({ color: green, style: 'solid', width: 3 });

  await page.getByLabel('Player Name', { exact: true }).focus();
  expect(await outline(page.getByLabel('Player Name', { exact: true })), 'text input focus outline').toEqual({ color: green, style: 'solid', width: 3 });
});

test('each registered player row has no bullet, details on the left, and light-on-dark Edit and Delete on one line at the right, as in the approved prototype', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Players', exact: true }).click();
  for (const [name, score] of [['Ana', 7], ['Maximiliano Bartolomeu de Albuquerque-Montenegro Sobrinho Neto', 4]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }

  const rows = await page.locator('#registeredPlayerList > li').evaluateAll(items => items.map(item => {
    const row = item.getBoundingClientRect();
    const [edit, remove] = [...item.querySelectorAll('button')].map(button => {
      const style = getComputedStyle(button);
      return { box: button.getBoundingClientRect(), color: style.color, background: style.backgroundColor };
    });
    const channels = value => value.match(/[\d.]+/g).map(Number);
    return {
      bullet: getComputedStyle(item).listStyleType,
      sameLine: Math.abs(edit.box.top - remove.box.top) < 2,
      deleteAtRight: row.right - remove.box.right <= 20,
      editBeforeDelete: edit.box.right <= remove.box.left,
      detailsLeftOfActions: item.firstChild.nodeType === Node.TEXT_NODE || item.firstElementChild.tagName !== 'BUTTON',
      textLight: channels(edit.color).slice(0, 3).every(value => value >= 180),
      notDefaultGrey: channels(edit.background).slice(0, 3).join() !== '239,239,239',
      darkBackground: channels(edit.background).slice(0, 3).reduce((sum, value) => sum + value, 0) / 3 <= 90 || (channels(edit.background)[3] ?? 1) < 0.5,
    };
  }));
  expect(rows).toHaveLength(2);
  for (const row of rows) {
    expect(row).toEqual({
      bullet: 'none',
      sameLine: true,
      deleteAtRight: true,
      editBeforeDelete: true,
      detailsLeftOfActions: true,
      textLight: true,
      notDefaultGrey: true,
      darkBackground: true,
    });
  }
});

// Acceptance guard for the ticket's tablet criterion (emulated 768x1024 viewport, not a physical tablet): it is
// expected to be green as soon as the responsive workspace exists, so it is not a RED cycle.
test('at tablet width 768 the navigation sits at the top, switches areas, never covers content and Tab walks the roster before the form', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'The width is set by the test itself; one project is enough.');
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main', exact: true });
  await nav.getByRole('button', { name: 'Players', exact: true }).click();
  const longName = 'Maximiliano Bartolomeu de Albuquerque-Montenegro Sobrinho Neto';
  for (const [name, score] of [['Ana', 4], [longName, 7]]) {
    await page.getByLabel('Player Name', { exact: true }).fill(name);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill(String(score));
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }

  for (const area of ['Players', 'Match']) {
    await nav.getByRole('button', { name: area, exact: true }).click();
    await expect(nav.getByRole('button', { name: area, exact: true })).toHaveAttribute('aria-current', 'location');
    const navBox = await nav.boundingBox();
    expect(navBox.y, `${area} navigation at the top`).toBeLessThan(1024 / 4);
    const areaBox = await page.locator(area === 'Players' ? '#playersArea' : '#matchArea').boundingBox();
    expect(areaBox.y, `${area} content starts below the navigation`).toBeGreaterThanOrEqual(navBox.y + navBox.height - 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), `${area} overflow`).toBeLessThanOrEqual(768);
  }

  await nav.getByRole('button', { name: 'Players', exact: true }).click();
  await nav.getByRole('button', { name: 'Match', exact: true }).focus();
  const order = [];
  for (let presses = 0; presses < 9; presses++) {
    await page.keyboard.press('Tab');
    order.push(await page.evaluate(() => document.activeElement.getAttribute('aria-label') || document.activeElement.id || document.activeElement.textContent.trim()));
  }
  expect(order.slice(0, 4)).toEqual(['Edit Ana', 'Delete Ana', `Edit ${longName}`, `Delete ${longName}`]);
  expect(order.slice(4, 8)).toEqual(['pName', 'pSkill', 'pGoalkeeper', 'btnPs']);
});

test('the main navigation stays at the top while scrolling and does not cover content', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Main', exact: true });
  const { width } = page.viewportSize();

  // Long enough content to scroll, so a fixed bar could cover the last controls.
  await nav.getByRole('button', { name: 'Players', exact: true }).click();
  for (let index = 1; index <= 12; index++) {
    await page.getByLabel('Player Name', { exact: true }).fill(`Player ${index}`);
    await page.getByLabel('Estimated skill (1–10)', { exact: true }).fill('5');
    await page.getByRole('button', { name: 'Add Player', exact: true }).click();
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  const initialNavBox = await nav.boundingBox();
  const initialAreaBox = await page.locator('#playersArea').boundingBox();
  expect(initialNavBox.y).toBeGreaterThanOrEqual(0);
  expect(initialAreaBox.y).toBeGreaterThanOrEqual(initialNavBox.y + initialNavBox.height - 1);
  expect(initialNavBox.x).toBeGreaterThanOrEqual(0);
  expect(initialNavBox.x + initialNavBox.width).toBeLessThanOrEqual(width);

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(async () => (await nav.boundingBox()).y).toBeLessThanOrEqual(10);
  const scrolledNavBox = await nav.boundingBox();
  expect(scrolledNavBox.x).toBeGreaterThanOrEqual(0);
  expect(scrolledNavBox.x + scrolledNavBox.width).toBeLessThanOrEqual(width);
});
