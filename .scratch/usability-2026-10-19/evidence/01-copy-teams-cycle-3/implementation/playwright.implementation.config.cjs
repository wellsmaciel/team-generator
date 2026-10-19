const path = require('node:path');
const base = require(path.resolve(process.cwd(), 'playwright.config.cjs'));
module.exports = { ...base,
  testDir: path.resolve(process.cwd(), 'tests/browser'),
  outputDir: path.join(__dirname, 'results'),
  reporter: [['list'], ['json', { outputFile: path.join(__dirname, 'results.json') }], ['html', { outputFolder: path.join(__dirname, 'report'), open: 'never' }]]
};
