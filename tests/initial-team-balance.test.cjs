// Run with: node tests/initial-team-balance.test.cjs
// Exercise page selection handlers and Generate Teams; inspect rendered output only.
const assert = require('node:assert/strict');
const { setup } = require('./manual-player-swaps.test.cjs');

const names = ['High A', 'High B', 'High C', 'Low A', 'Low B'];
const page = setup(5, 0, 2, [10, 10, 10, 1, 1], names);
const rendered = page.elements.teamsContainer.children.map(section => ({
  names: section.children[0].children[1].children.map(item => item.textContent),
  total: Number(section.children[1].children[1].textContent),
}));
const totals = rendered.map(team => team.total).sort((a, b) => a - b);
assert.equal(totals[1] - totals[0], 8, 'First generation should reduce the score difference to 8');
assert.deepEqual(totals, [12, 20]);
assert.deepEqual(rendered.map(team => team.names.length).sort(), [2, 3]);
assert.deepEqual(rendered.flatMap(team => team.names).sort(), [...names].sort());
assert.deepEqual(rendered.find(team => team.total === 12).names.filter(name => name.startsWith('Low')).sort(),
  ['Low A', 'Low B']);
assert.match(page.elements.teamsStatus.textContent, /different numbers of players/);
assert.match(page.elements.teamsStatus.textContent, /No fixed goalkeeper in teams: 1, 2/);
assert.equal(page.elements.shareControls.hidden, false);
assert.deepEqual(page.elements.shareText.value.split('\n\n').map(block => block.split('\n')),
  rendered.map((team, index) => ['Team ' + (index + 1), ...team.names]));
assert.equal(page.elements.selectionStatus.textContent, 'Selected for this match: 5 / 6');
assert.equal(page.writes(), 0);
console.log('Passed: first generation balances C1 to 12/20, preserving participants, sizes, warnings and share text (simulated DOM).');
