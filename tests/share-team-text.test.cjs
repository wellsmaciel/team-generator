// Run with: node tests/share-team-text.test.cjs
// Simulates state and DOM values; native selection and clipboard need a browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { setup } = require('./manual-player-swaps.test.cjs');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
assert.match(html, /<section id="shareControls" hidden/);
assert.match(html, /<textarea id="shareText"[^>]*readonly/);
assert.match(html, /<label for="shareText">/);

function checkText(page) {
  const groups = JSON.parse(page.run('JSON.stringify(teams.map(t => t.players.map(p => p.name)))'));
  assert.equal(page.elements.shareControls.hidden, false);
  const blocks = page.elements.shareText.value.split('\n\n');
  assert.deepEqual(blocks.map(block => block.split('\n')),
    groups.map((names, index) => ['Team ' + (index + 1), ...names]));
}

function checkEmpty(page) {
  assert.equal(page.elements.shareControls.hidden, true);
  assert.equal(page.elements.shareText.value, '');
}

// Equal/unequal sizes, multiple teams and goalkeepers. Duplicate names represent
// distinct selected people and must keep their correct number of occurrences.
for (const [count, keepers, teamCount] of [[4, 0, 2], [9, 1, 3], [10, 2, 3], [15, 3, 3]]) {
  const page = setup(count, keepers, teamCount);
  const registration = page.run('JSON.stringify(players)');
  checkText(page);
  assert.equal(page.elements.shareText.value.split('\n').filter(line => line === 'Same name').length, 3);
  assert.ok(!page.elements.shareText.value.includes('Player ' + count), 'Unselected player excluded');
  page.run(`players[0].name = 'Player 007 <b>& "Test"</b>';
    players[1].name = 'Name 10'; renderTeams();`);
  checkText(page);
  assert.ok(page.elements.shareText.value.includes('Player 007 <b>& "Test"</b>'));
  assert.ok(page.elements.shareText.value.includes('Name 10'));
  assert.equal(page.elements.shareText.children.length, 0, 'Names are field values, not parsed markup');
  const pair = JSON.parse(page.run(`JSON.stringify((() => {
    for (const a of teams[0].players) {
      for (const b of teams[1].players) {
        if (a.isGoalkeeper === b.isGoalkeeper) return [players.indexOf(a), players.indexOf(b)];
      }
    }
  })())`));
  const beforeSwap = page.elements.shareText.value;
  page.choose(...pair);
  page.click('confirmPlayerSwap()');
  checkText(page);
  assert.notEqual(page.elements.shareText.value, beforeSwap);
  const afterSwap = page.elements.shareText.value;
  page.click('cancelPlayerSwap()');
  assert.equal(page.elements.shareText.value, afterSwap);
  page.run('findAlternativeTeams = () => null');
  page.click('generateTeams()');
  assert.equal(page.elements.shareText.value, afterSwap);
  // Restore fixture-only name changes before checking that actions did not mutate registration.
  page.run(`players[0].name = 'Same name'; players[1].name = 'Same name'`);
  assert.equal(page.run('JSON.stringify(players)'), registration);
  assert.equal(page.writes(), 0);
  page.run('clearTeamsAfterChange()');
  checkEmpty(page);
  page.run('clearTeamsAfterChange()');
  checkEmpty(page);
}

// A worse alternative must have no shareable text until a decision is made.
for (const decision of ['acceptAlternative()', 'undoAlternative()']) {
  // Distinct names make a changed grouping observable in the copied text.
  const page = setup(4, 0, 2, [1, 2, 3, 4], ['Ana', 'Bruno', 'Carla', 'Diego']);
  const initial = page.elements.shareText.value;
  page.click('generateTeams()');
  assert.notEqual(page.run('previousTeams'), null);
  checkEmpty(page);
  page.run('editPlayer(players[0]); cancelEditing()');
  page.context.window.confirm = () => false;
  page.run('deletePlayer(players[0])');
  checkEmpty(page);
  page.click(decision);
  checkText(page);
  if (decision === 'undoAlternative()') assert.equal(page.elements.shareText.value, initial);
  else assert.notEqual(page.elements.shareText.value, initial);
  assert.equal(page.writes(), 0);
}

// Equal and better compositions apply immediately and update the text.
for (const better of [false, true]) {
  const page = setup(4, 0, 2, better ? [1, 2, 3, 4] : [5, 5, 5, 5]);
  if (better) page.run(`teams = [[0,1],[2,3]].map(ids => ({ players: ids.map(i => players[i]),
    capacity: 2, totalScore: ids.reduce((sum, i) => sum + players[i].score, 0) })); renderTeams()`);
  page.click('generateTeams()');
  assert.equal(page.run('previousTeams'), null);
  checkText(page);
}

for (const pending of [false, true]) {
  for (const change of ['selection', 'teamCount', 'edit', 'delete', 'add']) {
    const page = setup(4, 0, 2, [1, 2, 3, 4]);
    if (pending) page.click('generateTeams()');
    if (change === 'selection') page.run('selectPlayer(players[0], false)');
    if (change === 'teamCount') page.elements.teamCount.listeners.input();
    if (change === 'delete') page.run('deletePlayer(players[0])');
    if (change === 'edit' || change === 'add') {
      if (change === 'edit') page.run('editPlayer(players[0])');
      page.elements.pName.value = 'Updated 99';
      page.elements.pSkill.value = '5';
      page.elements.pGoalkeeper.checked = false;
      page.run('addOrUpdatePlayer({ preventDefault() {} })');
    }
    checkEmpty(page);
    page.click('acceptAlternative()');
    page.click('undoAlternative()');
    checkEmpty(page);
    assert.equal(page.writes(), ['edit', 'delete', 'add'].includes(change) ? 1 : 0);
  }
}
console.log('Share text checks passed: content, swaps, regeneration, decisions, invalidation and storage. Browser copy verification remains separate.');
