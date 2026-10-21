// Diagnostic for the tablet "Teams to copy" focus finding: prints the focused textarea box against the viewport.
// Usage: node diagnose-focus.cjs <label>   (label only names the printed run; nothing is written to disk)
const path = require('node:path');
process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.join(__dirname, '..', '..', '..', 'playwright-browsers');
const { chromium } = require('@playwright/test');
const startServer = require('../../../../tests/browser/server.cjs');

(async () => {
  const label = process.argv[2] || 'run';
  const stop = await startServer();
  const browser = await chromium.launch();
  for (const [width, height] of [[768, 1024], [1280, 720]]) {
    const page = await (await browser.newContext({ viewport: { width, height } })).newPage();
    await page.goto('http://127.0.0.1:51806/');
    await page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Players' }).click();
    for (const [name, score] of [['Ana', 3], ['Beto', 4], ['Caio', 5], ['Dani', 6]]) {
      await page.getByLabel('Player Name', { exact: true }).fill(name);
      await page.getByLabel('Player Skill', { exact: true }).fill(String(score));
      await page.getByRole('button', { name: 'Add Player', exact: true }).click();
    }
    await page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: 'Match' }).click();
    await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
    await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
    await page.getByLabel('Teams to copy').focus();
    await page.waitForTimeout(1500);
    const result = await page.evaluate(() => {
      const rect = document.getElementById('shareText').getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, innerWidth, innerHeight, scrollY: window.scrollY };
    });
    console.log(label, width + 'x' + height, JSON.stringify(result));
    await page.close();
  }
  await browser.close();
  await stop();
})();
