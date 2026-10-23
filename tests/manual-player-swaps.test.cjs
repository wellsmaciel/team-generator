// Run with: node tests/manual-player-swaps.test.cjs
// This simulated DOM checks behavior and invariants, not browser layout or native controls.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const source = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

class Element {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.listeners = {};
    this.classList = { toggle() {} };
    this.textContent = '';
    this.value = '';
    this.hidden = false;
  }
  replaceChildren(...children) { this.children = children; this.textContent = ''; }
  appendChild(child) { this.children.push(child); return child; }
  addEventListener(type, handler) { this.listeners[type] = handler; }
  setAttribute() {}
  removeAttribute() {}
  setCustomValidity() {}
  reportValidity() { return true; }
  focus() {}
}

function setup(count = 9, goalkeeperCount = 2, teamCount = 3, scores = [], names = []) {
  const elements = Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)]
    .map(match => [match[1], new Element()]));
  elements.teamCount.value = String(teamCount);
  const saved = Array.from({ length: count + 1 }, (_, index) => ({
    name: names[index] ?? (index < 3 ? 'Same name' : 'Player ' + index),
    score: scores[index] ?? (index * 7) % 10 + 1,
    // Keep an old registration without a goalkeeper field in every fixture.
    ...(index === count ? {} : { isGoalkeeper: index < goalkeeperCount }),
  }));
  let writes = 0;
  const context = vm.createContext({
    document: {
      getElementById: id => { assert.ok(elements[id], 'Missing HTML element: ' + id); return elements[id]; },
      createElement: tagName => new Element(tagName),
      createTextNode: text => ({ textContent: text }),
    },
    localStorage: {
      getItem: () => JSON.stringify(saved),
      setItem: () => { writes++; },
    },
    window: { addEventListener: () => {}, innerHeight: 720, confirm: () => true },
  });
  const run = code => vm.runInContext(code, context);
  run(source);
  const registration = run('JSON.stringify(players)');
  // Invoke the registered selection-change handlers, then the HTML generate button.
  for (const item of elements.playerSkillList.children.slice(0, count)) {
    const checkbox = item.children[0].children[0];
    checkbox.checked = true;
    checkbox.listeners.change();
  }
  const click = handler => {
    assert.ok(html.includes('onclick="' + handler + '"'), 'Missing page action: ' + handler);
    run(handler);
  };
  click('generateTeams()');
  const snapshot = () => run('JSON.stringify(teams.map(t => ({ members: t.players.map(p => players.indexOf(p)), score: t.totalScore, capacity: t.capacity })))');
  const choose = (first, second) => {
    elements.firstSwapPlayer.value = String(first);
    elements.secondSwapPlayer.value = String(second);
  };
  const checkInvariants = () => {
    assert.equal(run('teams.flatMap(t => t.players).length'), count);
    assert.equal(run('new Set(teams.flatMap(t => t.players)).size'), count);
    assert.ok(run('teams.flatMap(t => t.players).every(p => selectedPlayers.has(p))'));
    assert.ok(run('teams.every(t => t.players.length === t.capacity && t.players.filter(p => p.isGoalkeeper).length <= 1 && t.totalScore === t.players.reduce((sum, p) => sum + p.score, 0))'));
    assert.equal(writes, 0, 'Match actions must not write registrations');
    assert.equal(run('JSON.stringify(players)'), registration, 'Swaps must not mutate registrations');
    elements.teamsContainer.children.forEach((section, index) => {
      const team = run(`teams[${index}]`);
      const playerList = section.children[0].children.find(child => child.tagName === 'UL');
      assert.deepEqual(playerList.children.map(item => item.textContent),
        Array.from(team.players, player => player.name + (player.isGoalkeeper ? ' (Goalkeeper)' : '')));
      assert.equal(Number(section.children[1].children[1].textContent), team.totalScore);
    });
  };
  return { elements, context, run, click, choose, snapshot, checkInvariants, writes: () => writes };
}

module.exports = { setup };

if (require.main === module) {
let swapCases = 0;
// Check every ordered pair for several equal/unequal sizes and goalkeeper counts.
for (const [count, goalkeepers, teamCount] of [[4, 0, 2], [6, 2, 2], [9, 1, 3], [10, 2, 3], [15, 3, 3]]) {
  const page = setup(count, goalkeepers, teamCount);
  const initial = page.snapshot();
  assert.equal(page.elements.swapControls.hidden, false);
  assert.equal(page.elements.firstSwapPlayer.children.length, count + 1);
  const labels = page.elements.firstSwapPlayer.children.slice(1).map(option => option.textContent);
  assert.equal(new Set(labels).size, count, 'Duplicate names need distinct labels');
  for (let first = 0; first < count; first++) {
    for (let second = 0; second < count; second++) {
      page.run('clearTeamsAfterChange()');
      page.click('generateTeams()');
      const valid = page.run(`players[${first}] !== players[${second}] &&
        teams.find(t => t.players.includes(players[${first}])) !== teams.find(t => t.players.includes(players[${second}])) &&
        players[${first}].isGoalkeeper === players[${second}].isGoalkeeper`);
      page.choose(first, second);
      page.click('confirmPlayerSwap()');
      page.checkInvariants();
      if (valid) {
        assert.notEqual(page.snapshot(), initial);
        const before = JSON.parse(initial);
        const expected = before.map(team => ({ ...team,
          members: team.members.map(id => id === first ? second : id === second ? first : id),
        }));
        const actual = JSON.parse(page.snapshot());
        assert.deepEqual(actual.map(team => team.members), expected.map(team => team.members));
        assert.equal(page.elements.firstSwapPlayer.value, '');
        assert.match(page.elements.swapStatus.textContent, /Players swapped/);
        assert.ok(page.elements.teamsContainer.children.every(section =>
          section.children[1].children.some(child => child.textContent === 'Skill total')));
      } else {
        assert.equal(page.snapshot(), initial);
        assert.match(page.elements.swapStatus.textContent, /Choose|Swap outfield/);
      }
      swapCases++;
    }
  }
}

const page = setup();
const before = page.snapshot();
for (const pair of [['', ''], ['0', ''], ['999', '1'], ['9', '1']]) {
  page.choose(...pair);
  page.click('confirmPlayerSwap()');
  assert.equal(page.snapshot(), before);
  assert.match(page.elements.swapStatus.textContent, /current teams/);
}
page.choose(2, 3);
page.click('cancelPlayerSwap()');
assert.equal(page.snapshot(), before);
assert.equal(page.elements.firstSwapPlayer.value, '');
assert.equal(page.elements.secondSwapPlayer.value, '');
page.checkInvariants();

for (const change of ['selection', 'teamCount', 'edit', 'delete']) {
  const current = setup();
  current.choose(2, 3);
  if (change === 'selection') {
    const checkbox = current.elements.playerSkillList.children[2].children[0].children[0];
    checkbox.checked = false;
    checkbox.listeners.change();
  } else if (change === 'teamCount') {
    current.elements.teamCount.value = '2';
    current.elements.teamCount.listeners.input();
  } else if (change === 'edit') {
    current.run('editPlayer(players[2])');
    current.elements.pName.value = 'Renamed';
    current.elements.pSkill.value = '5';
    current.elements.pGoalkeeper.checked = false;
    current.run('addOrUpdatePlayer({ preventDefault() {} })');
  } else {
    current.run('deletePlayer(players[2])');
  }
  assert.equal(current.run('teams.length'), 0);
  assert.equal(current.elements.swapControls.hidden, true);
  assert.equal(current.elements.firstSwapPlayer.children.length, 0);
  assert.equal(current.elements.secondSwapPlayer.children.length, 0);
  assert.equal(current.elements.firstSwapPlayer.value, '');
  assert.equal(current.elements.secondSwapPlayer.value, '');
  assert.equal(current.elements.swapStatus.textContent, '');
  assert.equal(current.writes(), ['edit', 'delete'].includes(change) ? 1 : 0);
  const afterChange = current.snapshot();
  current.click('confirmPlayerSwap()');
  assert.equal(current.snapshot(), afterChange, 'Stale swaps cannot change cleared teams');
}

const canceled = setup();
canceled.choose(2, 3);
const unchanged = canceled.snapshot();
canceled.run('editPlayer(players[2]); cancelEditing()');
canceled.context.window.confirm = () => false;
canceled.run('deletePlayer(players[2])');
assert.equal(canceled.snapshot(), unchanged);
assert.equal(canceled.elements.firstSwapPlayer.value, '2');
canceled.checkInvariants();
canceled.click('generateTeams()');
assert.equal(canceled.elements.firstSwapPlayer.value, '');
assert.equal(canceled.elements.swapStatus.textContent, '');

for (const [count, teamCount, unequal] of [[15, 3, false], [15, 2, true], [10, 3, true]]) {
  const current = setup(count, 1, teamCount);
  const warning = current.elements.teamsStatus.textContent;
  assert.equal(warning.includes('Teams have different numbers'), unequal);
  assert.match(warning, /No fixed goalkeeper/);
  assert.match(warning, /only one fixed goalkeeper/);
  const members = JSON.parse(current.snapshot());
  current.choose(members[0].members.find(id => id !== 0), members[1].members[0]);
  current.click('confirmPlayerSwap()');
  assert.equal(current.elements.teamsStatus.textContent, warning);
  current.checkInvariants();
}

console.log(`Passed: ${swapCases} ordered swap cases, cancellation, stale choices, duplicate names, legacy data, storage isolation and warning regressions (simulated DOM).`);
}
