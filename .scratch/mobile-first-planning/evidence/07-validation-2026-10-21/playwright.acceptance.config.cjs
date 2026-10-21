// Task 07 acceptance config: the four viewports required by the ticket, same local test server as the main suite.
const path = require('node:path');
const { defineConfig } = require('@playwright/test');

const root = path.join(__dirname, '..', '..', '..', '..');
process.env.PLAYWRIGHT_BROWSERS_PATH ??= path.join(root, '.scratch', 'playwright-browsers');

module.exports = defineConfig({
  testDir: __dirname,
  testMatch: '*.spec.cjs',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  outputDir: path.join(root, '.scratch', 'playwright-results', 'task07-acceptance'),
  reporter: [['list']],
  globalSetup: path.join(root, 'tests', 'browser', 'server.cjs'),
  projects: [
    { name: 'phone-360x800', use: { viewport: { width: 360, height: 800 } } },
    { name: 'phone-390x844', use: { viewport: { width: 390, height: 844 } } },
    { name: 'tablet-768x1024', use: { viewport: { width: 768, height: 1024 } } },
    { name: 'desktop-1280x720', use: { viewport: { width: 1280, height: 720 } } },
  ],
  use: {
    baseURL: 'http://127.0.0.1:51806',
    browserName: 'chromium',
    trace: 'off',
    screenshot: 'off',
  },
});
