const path = require('node:path');
const { defineConfig } = require('@playwright/test');

process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.join(__dirname, '.scratch', 'playwright-browsers');

module.exports = defineConfig({
  testDir: './tests/browser',
  testMatch: '*.spec.cjs',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  outputDir: '.scratch/playwright-results',
  reporter: [
    ['list'],
    ['json', { outputFile: '.scratch/playwright-results/results.json' }],
    ['html', { outputFolder: '.scratch/playwright-report', open: 'never' }],
  ],
  globalSetup: require.resolve('./tests/browser/server.cjs'),
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 720 } } },
    { name: 'narrow-360', use: { viewport: { width: 360, height: 800 } } },
    { name: 'narrow-390', use: { viewport: { width: 390, height: 844 } } },
  ],
  use: {
    baseURL: 'http://127.0.0.1:51806',
    browserName: 'chromium',
    viewport: { width: 1280, height: 720 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
