// Run with: node tests/regenerate-teams.test.cjs
// Uses the page's HTML handlers with a simulated DOM, not a real browser.
const assert = require('node:assert/strict');
const { setup } = require('./manual-player-swaps.test.cjs');

function installTeams(page, groups) {
  page.run(`teams = ${JSON.stringify(groups)}.map(ids => ({
    players: ids.map(id => players[id]), capacity: ids.length,
    totalScore: ids.reduce((sum, id) => sum + players[id].score, 0)
  })); renderTeams(); updateTeamWarnings();`);
}

function seedRandom(page, seed) {
  page.run(`Math.random = (() => { let seed = ${seed}; return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  }; })();`);
}

// Exhaust valid size/team/goalkeeper combinations in this range and repeat
// generation, accepting or undoing previews, with duplicate names in every case.
let scenarios = 0;
for (let count = 4; count <= 16; count++) {
  for (let teamCount = 2; teamCount <= Math.floor(count / 2); teamCount++) {
    for (let goalkeepers = 0; goalkeepers <= teamCount; goalkeepers++) {
      const page = setup(count, goalkeepers, teamCount);
      seedRandom(page, count * 100 + teamCount * 10 + goalkeepers);
      for (let turn = 0; turn < 3; turn++) {
        const before = page.snapshot();
        const beforeKey = page.run('compositionKey(teams)');
        const difference = page.run('scoreDifference(teams)');
        const warnings = page.elements.teamsStatus.textContent;
        page.choose(0, 1);
        page.click('generateTeams()');
        assert.notEqual(page.run('compositionKey(teams)'), beforeKey);
        page.checkInvariants();
        assert.equal(page.elements.firstSwapPlayer.value, '');
        const worse = page.run('scoreDifference(teams)') > difference;
        assert.equal(page.elements.alternativeControls.hidden, !worse);
        assert.equal(page.elements.btnTeams.disabled, worse);
        assert.equal(page.elements.swapControls.hidden, worse);
        if (worse) {
          const preview = page.snapshot();
          page.click('generateTeams()');
          page.choose(0, 1);
          page.click('confirmPlayerSwap()');
          assert.equal(page.snapshot(), preview, 'Pending preview must block regeneration and swaps');
          if (turn % 2) {
            page.click('acceptAlternative()');
            assert.equal(page.snapshot(), preview);
          } else {
            page.click('undoAlternative()');
            assert.equal(page.snapshot(), before, 'Undo restores team labels, member order, capacities and sums');
            assert.equal(page.elements.teamsStatus.textContent, warnings);
          }
          assert.equal(page.run('previousTeams'), null);
          assert.equal(page.elements.swapControls.hidden, false);
          assert.equal(page.elements.btnTeams.disabled, false);
          page.checkInvariants();
        }
        scenarios++;
      }
    }
  }
}

const worse = setup(4, 0, 2, [1, 2, 3, 4]);
seedRandom(worse, 7);
const original = worse.snapshot();
assert.equal(worse.run('scoreDifference(teams)'), 0);
worse.click('generateTeams()');
assert.equal(worse.run('scoreDifference(teams)'), 2);
assert.match(worse.elements.alternativeStatus.textContent, /increased from 0 to 2/);
worse.click('undoAlternative()');
assert.equal(worse.snapshot(), original);
worse.click('generateTeams()');
const accepted = worse.snapshot();
worse.click('acceptAlternative()');
worse.click('undoAlternative()');
assert.equal(worse.snapshot(), accepted, 'There is no general undo history');

const equal = setup(4, 0, 2, [5, 5, 5, 5]);
assert.equal(equal.run('compositionKey(teams)'),
  equal.run('compositionKey([...teams].reverse().map(t => ({ ...t, players: [...t.players].reverse() })))'),
  'Reordering teams and names is not a different composition');
equal.click('generateTeams()');
assert.match(equal.elements.alternativeStatus.textContent, /New composition applied/);
assert.equal(equal.run('previousTeams'), null);
equal.checkInvariants();

const better = setup(4, 0, 2, [1, 2, 3, 4]);
installTeams(better, [[0, 1], [2, 3]]);
seedRandom(better, 3);
better.click('generateTeams()');
assert.equal(better.run('scoreDifference(teams)'), 0);
assert.equal(better.run('previousTeams'), null);
better.checkInvariants();

// A controlled search result isolates the exact one-point warning threshold.
const onePoint = setup(6, 0, 3, [1, 3, 2, 4, 2, 4]);
installTeams(onePoint, [[0, 3], [1, 4], [2, 5]]);
onePoint.run(`findAlternativeTeams = () => [[0,1],[2,3],[4,5]].map(ids => ({
  players: ids.map(id => players[id]), capacity: 2,
  totalScore: ids.reduce((sum, id) => sum + players[id].score, 0)
}));`);
onePoint.click('generateTeams()');
assert.match(onePoint.elements.alternativeStatus.textContent, /increased from 1 to 2/);
assert.equal(onePoint.elements.alternativeControls.hidden, false);
onePoint.checkInvariants();

// Compare against the latest manual swap, preserving that exact state on undo.
const swapped = setup(4, 0, 2, [1, 2, 3, 4]);
installTeams(swapped, [[0, 1], [2, 3]]);
swapped.choose(1, 3);
swapped.click('confirmPlayerSwap()');
assert.equal(swapped.run('scoreDifference(teams)'), 0);
const afterSwap = swapped.snapshot();
swapped.click('generateTeams()');
assert.match(swapped.elements.alternativeStatus.textContent, /increased from 0 to 2/);
swapped.click('undoAlternative()');
assert.equal(swapped.snapshot(), afterSwap);

// No alternative exists for this defensive, below-minimum helper input.
assert.equal(equal.run(`findAlternativeTeams([
  { players: [players[0]], totalScore: 5, capacity: 1 },
  { players: [players[1]], totalScore: 5, capacity: 1 }
])`), null);
const unavailable = setup();
const unchanged = unavailable.snapshot();
unavailable.run('findAlternativeTeams = () => null');
unavailable.click('generateTeams()');
assert.equal(unavailable.snapshot(), unchanged);
assert.match(unavailable.elements.alternativeStatus.textContent, /No different valid composition was found in this search/);
unavailable.checkInvariants();

// Pending snapshots survive cancellations, and are discarded on real changes.
for (const change of ['selection', 'teamCount', 'edit', 'delete', 'add']) {
  const page = setup(4, 0, 2, [1, 2, 3, 4]);
  page.click('generateTeams()');
  assert.notEqual(page.run('previousTeams'), null);
  const preview = page.snapshot();
  page.run('editPlayer(players[0]); cancelEditing()');
  page.context.window.confirm = () => false;
  page.run('deletePlayer(players[0])');
  assert.equal(page.snapshot(), preview);
  assert.notEqual(page.run('previousTeams'), null);
  page.context.window.confirm = () => true;
  if (change === 'selection') page.run('selectPlayer(players[0], false)');
  if (change === 'teamCount') page.elements.teamCount.listeners.input();
  if (change === 'delete') page.run('deletePlayer(players[0])');
  if (change === 'edit' || change === 'add') {
    if (change === 'edit') page.run('editPlayer(players[0])');
    page.elements.pName.value = 'Updated';
    page.elements.pSkill.value = '5';
    page.elements.pGoalkeeper.checked = false;
    page.run('addOrUpdatePlayer({ preventDefault() {} })');
  }
  assert.equal(page.run('teams.length'), 0);
  assert.equal(page.run('previousTeams'), null);
  assert.equal(page.elements.alternativeControls.hidden, true);
  assert.equal(page.elements.btnTeams.disabled, false);
  assert.equal(page.elements.btnTeams.textContent, 'Generate Teams');
  assert.equal(page.elements.alternativeStatus.textContent, '');
  assert.equal(page.elements.swapControls.hidden, true);
  page.click('undoAlternative()');
  page.click('acceptAlternative()');
  assert.equal(page.run('teams.length'), 0, 'Stale decisions cannot restore an invalidated match');
  assert.equal(page.writes(), ['edit', 'delete', 'add'].includes(change) ? 1 : 0);
}

// Show that full sampling can move more than two players, with no fixed cap.
const many = setup(12, 0, 3, Array(13).fill(5));
seedRandom(many, 19);
const key = many.run('compositionKey(teams)');
const pairKeys = many.run(`(() => {
  const keys = new Set();
  teams.forEach((a, i) => teams.forEach((b, j) => {
    if (i >= j) return;
    a.players.forEach((p, x) => b.players.forEach((q, y) => {
      const candidate = copyTeams(teams);
      candidate[i].players[x] = q; candidate[j].players[y] = p;
      keys.add(compositionKey(candidate));
    }));
  })); return keys;
})()`);
many.click('generateTeams()');
assert.notEqual(many.run('compositionKey(teams)'), key);
assert.equal(pairKeys.has(many.run('compositionKey(teams)')), false);
many.checkInvariants();

console.log(`Passed: ${scenarios} regeneration scenarios, better/equal/worse alternatives, one-point warning, exact undo, acceptance, manual-swap baseline, search fallback, invalidation and storage isolation (simulated DOM).`);
