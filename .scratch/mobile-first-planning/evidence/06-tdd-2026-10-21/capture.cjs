// Task 06 captures: bulleted share text legibility at 360x800, 390x844, 768x1024, 1280x720,
// plus real Copy teams -> paste into the local clipboard editor. Isolated contexts, synthetic data,
// repository test server (loopback). Usage: node capture.cjs <new-label>
const path = require('node:path');
const fs = require('node:fs');
process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.resolve(__dirname, '..', '..', '..', 'playwright-browsers');
const { chromium } = require('@playwright/test');
const startTestServer = require('../../../../tests/browser/server.cjs');

const label = process.argv[2] || 'run';
if (!/^[a-z0-9-]+$/.test(label)) throw new Error('Use a simple label');
const out = path.join(__dirname, label);
fs.mkdirSync(out);
const saved = [
  { name: 'Maximiliano Bartolomeu de Albuquerque-Montenegro Sobrinho Neto', score: 7 },
  { name: 'Player 10', score: 4 }, { name: '<b>Sam</b>', score: 5 },
  { name: 'Carla', score: 3, isGoalkeeper: true }, { name: 'Diego', score: 6 },
  { name: 'Eva', score: 8 }, { name: 'Fabio', score: 2 },
];

(async () => {
  const stop = await startTestServer();
  const browser = await chromium.launch();
  const report = { chromium: browser.version(), viewports: {} };
  try {
    for (const [width, height] of [[360, 800], [390, 844], [768, 1024], [1280, 720]]) {
      const context = await browser.newContext({ viewport: { width, height } });
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      const page = await context.newPage();
      await page.addInitScript(data => {
        if (!sessionStorage.getItem('seeded')) {
          localStorage.setItem('team-generator.players', JSON.stringify(data));
          sessionStorage.setItem('seeded', '1');
        }
      }, saved);
      await page.goto('http://127.0.0.1:51806/');
      await page.getByRole('navigation', { name: 'Main', exact: true }).getByRole('button', { name: 'Match', exact: true }).click();
      await page.getByRole('button', { name: 'Select All Players', exact: true }).click();
      await page.getByRole('button', { name: 'Generate Teams', exact: true }).click();
      const area = page.getByLabel('Teams to copy');
      await area.scrollIntoViewIfNeeded();
      await page.getByRole('button', { name: 'Copy teams', exact: true }).click();
      await page.getByRole('status').filter({ hasText: /copied/i }).waitFor();
      const shown = await area.inputValue();
      const metrics = await page.evaluate(() => {
        const box = document.getElementById('shareText');
        return {
          pageScrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth,
          textareaClientHeight: box.clientHeight, textareaScrollHeight: box.scrollHeight,
          textareaClientWidth: box.clientWidth, fontSize: getComputedStyle(box).fontSize,
        };
      });
      await page.screenshot({ path: path.join(out, `share-${width}.png`) });
      const clipboard = (await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n');
      const editor = await context.newPage();
      await editor.setViewportSize({ width, height });
      await editor.goto('http://127.0.0.1:51806/clipboard-editor');
      await editor.getByLabel('Pasted text').click();
      await editor.keyboard.press('ControlOrMeta+V');
      const pasted = await editor.getByLabel('Pasted text').inputValue();
      await editor.screenshot({ path: path.join(out, `pasted-${width}.png`) });
      report.viewports[width] = {
        height, metrics, shown, clipboardEqualsShown: clipboard === shown,
        pastedEqualsShown: pasted.replace(/\r\n/g, '\n') === shown,
      };
      await context.close();
    }
  } finally {
    await browser.close();
    await stop();
  }
  fs.writeFileSync(path.join(out, 'measurements.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 1));
})();
