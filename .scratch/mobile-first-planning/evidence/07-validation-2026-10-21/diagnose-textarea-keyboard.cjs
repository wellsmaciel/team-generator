// Diagnostic for the tall "Teams to copy" text area: what real key presses do to its visibility at each viewport.
// Usage: node diagnose-textarea-keyboard.cjs   (prints only; nothing is written to disk)
const path = require('node:path');
process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.join(__dirname, '..', '..', '..', 'playwright-browsers');
const { chromium } = require('@playwright/test');
const startServer = require('../../../../tests/browser/server.cjs');

const measure = page => page.evaluate(() => {
  const area = document.getElementById('shareText');
  const rect = area.getBoundingClientRect();
  const visible = Math.max(0, Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0));
  return {
    focused: document.activeElement === area, top: Math.round(rect.top), bottom: Math.round(rect.bottom), innerHeight, scrollY: Math.round(scrollY),
    visibleShare: Number((visible / rect.height).toFixed(2)), innerScrollable: area.scrollHeight > area.clientHeight,
    selection: area.selectionStart + '-' + area.selectionEnd + ' of ' + area.value.length,
  };
});
const settle = page => page.waitForTimeout(700);

(async () => {
  const stop = await startServer();
  const browser = await chromium.launch();
  for (const [width, height] of [[360, 800], [390, 844], [768, 1024], [1280, 720]]) {
    const context = await browser.newContext({ viewport: { width, height } });
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:51806/');
    const nav = page.getByRole('navigation', { name: 'Main' });
    await nav.getByRole('button', { name: 'Players' }).click();
    for (const [name, score] of [['Ana', 3], ['Beto', 4], ['Caio', 5], ['Dani', 6], ['Eva', 7], ['Wolfeschlegelsteinhausenbergerdorff Junior', 8]]) {
      await page.getByLabel('Player Name', { exact: true }).fill(name);
      await page.getByLabel('Player Skill', { exact: true }).fill(String(score));
      await page.getByRole('button', { name: 'Add Player', exact: true }).click();
    }
    await nav.getByRole('button', { name: 'Match' }).click();
    await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
    await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
    await page.getByRole('button', { name: 'Copy teams', exact: true }).focus();
    await page.keyboard.press('Tab');
    await settle(page);
    console.log(`${width}x${height} Tab onto text area:`, JSON.stringify(await measure(page)));
    await page.keyboard.press('Tab');
    await settle(page);
    console.log(`${width}x${height} Tab past:`, JSON.stringify(await measure(page)));
    await page.keyboard.press('Shift+Tab');
    await settle(page);
    console.log(`${width}x${height} Shift+Tab back:`, JSON.stringify(await measure(page)));
    await page.keyboard.press('Control+End');
    await settle(page);
    console.log(`${width}x${height} Ctrl+End:`, JSON.stringify(await measure(page)));
    await page.keyboard.press('Control+Home');
    await settle(page);
    console.log(`${width}x${height} Ctrl+Home:`, JSON.stringify(await measure(page)));
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Control+C');
    const clip = (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n');
    const full = await page.getByLabel('Teams to copy').inputValue();
    console.log(`${width}x${height} Ctrl+A, Ctrl+C equals full text:`, clip === full, `(${full.length} characters)`);
    await context.close();
  }

  // Partly-visible case: the text area focused after a real walk that scrolled it up (Tab past a lower control, Shift+Tab back).
  // Which real scroll keys bring the whole control into view while it stays focused?
  for (const [width, height] of [[360, 800], [390, 844]]) {
    for (const key of ['ArrowUp', 'PageUp', 'ArrowDown', 'PageDown', 'Space', 'Shift+Space', 'Home', 'End']) {
      const context = await browser.newContext({ viewport: { width, height } });
      const page = await context.newPage();
      await page.goto('http://127.0.0.1:51806/');
      const nav = page.getByRole('navigation', { name: 'Main' });
      await nav.getByRole('button', { name: 'Players' }).click();
      for (const [name, score] of [['Ana', 3], ['Beto', 4], ['Caio', 5], ['Dani', 6], ['Eva', 7]]) {
        await page.getByLabel('Player Name', { exact: true }).fill(name);
        await page.getByLabel('Player Skill', { exact: true }).fill(String(score));
        await page.getByRole('button', { name: 'Add Player', exact: true }).click();
      }
      await nav.getByRole('button', { name: 'Match' }).click();
      await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
      await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.getByRole('button', { name: 'Back to selection', exact: true }).focus();
      for (let step = 0; step < 30; step++) {
        await page.keyboard.press('Tab');
        if (await page.evaluate(() => document.activeElement === document.getElementById('shareText'))) break;
      }
      await settle(page);
      await page.keyboard.press('Tab');
      await settle(page);
      await page.keyboard.press('Shift+Tab');
      await settle(page);
      const trace = [JSON.stringify(await measure(page)).replace(/"(innerHeight|selection|innerScrollable)":[^,}]*,?/g, '')];
      for (let press = 0; press < 3; press++) {
        await page.keyboard.press(key);
        await settle(page);
        const state = await measure(page);
        trace.push(`${key} #${press + 1}: top ${state.top}, bottom ${state.bottom}, share ${state.visibleShare}, focused ${state.focused}`);
      }
      console.log(`${width}x${height}`, trace.join(' | '));
      await context.close();
    }
  }
  await browser.close();
  await stop();
})();
