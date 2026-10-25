const PLAYERS_STORAGE_KEY = 'team-generator.players';
let canSavePlayers = true;
let players = loadPlayers();
let teams = [];
let previousTeams = null;
let shareTextVersion = 0;
let playerBeingEdited = null;
const selectedPlayers = new Set();

for (const id of ['matchLocation', 'matchDate', 'matchTime']) {
  document.getElementById(id).addEventListener('input', renderShareText);
}
document.getElementById('playerSearch').addEventListener('input', renderMatchPlayers);

function showArea(area) {
  const target = document.getElementById(area === 'players' ? 'playersArea' : 'matchArea');
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setCurrentArea(area);
}

function setCurrentArea(area) {
  for (const name of ['players', 'match']) {
    const button = document.getElementById(name + 'Navigation');
    if (name === area) button.setAttribute('aria-current', 'location');
    else button.removeAttribute('aria-current');
  }
}

function syncVisibleAreas() {
  document.getElementById('playersArea').hidden = false;
  document.getElementById('matchArea').hidden = false;
}
syncVisibleAreas();

function updateCurrentAreaFromScroll() {
  const matchArea = document.getElementById('matchArea');
  const matchThreshold = window.innerHeight * 0.52;
  setCurrentArea(matchArea.getBoundingClientRect().top <= matchThreshold ? 'match' : 'players');
}

window.addEventListener('scroll', updateCurrentAreaFromScroll, { passive: true });
window.addEventListener('resize', updateCurrentAreaFromScroll);

function showMatchStage(stage, moveFocus = true) {
  const showTeams = stage === 'teams';
  const stageElement = document.getElementById(showTeams ? 'teamsStage' : 'selectPlayersStage');
  const stageWasHidden = stageElement.hidden;
  if (showTeams) document.getElementById('generationStatus').textContent = '';
  document.getElementById('viewTeams').hidden = teams.length === 0;
  document.getElementById('selectPlayersStage').hidden = showTeams;
  document.getElementById('teamsStage').hidden = !showTeams;
  document.getElementById(showTeams ? 'teamsActionSlot' : 'teamGenerateSlot')
    .appendChild(document.getElementById('btnTeams'));
  setCurrentArea('match');
  if (moveFocus && stageWasHidden) {
    document.getElementById(showTeams ? 'teamsHeading' : 'selectPlayersHeading').focus();
  }
}

function isValidPlayer(player) {
  return player !== null && typeof player === 'object' &&
    typeof player.name === 'string' && player.name.trim().length > 0 &&
    Number.isInteger(player.score) && player.score >= 1 && player.score <= 10 &&
    (player.isGoalkeeper === undefined || typeof player.isGoalkeeper === 'boolean');
}

function loadPlayers() {
  try {
    const savedPlayers = localStorage.getItem(PLAYERS_STORAGE_KEY);
    if (savedPlayers === null) return [];

    const players = JSON.parse(savedPlayers);
    if (!Array.isArray(players) || !players.every(isValidPlayer)) {
      throw new Error('Invalid saved players');
    }
    // Older saved players do not have a fixed goalkeeper flag.
    return players.map(function (player) {
      return { ...player, isGoalkeeper: player.isGoalkeeper ?? false };
    });
  } catch {
    canSavePlayers = false;
    document.getElementById('storageStatus').textContent =
      'Could not load saved players. Existing saved data will not be overwritten. New players will only be available on this page; try reloading it.';
    return [];
  }
}

function savePlayers() {
  if (!canSavePlayers) return;

  try {
    localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(players));
    document.getElementById('storageStatus').textContent = 'Players saved in this browser.';
  } catch {
    document.getElementById('storageStatus').textContent =
      'Could not save players in this browser. Players are still available on this page, but changes may be lost when reloading.';
  }
}

function renderPlayers(id, visiblePlayers, showScores = false) {
  const list = document.getElementById(id);
  list.replaceChildren();
  visiblePlayers.forEach(function (player) {
    const item = document.createElement('li');
    const playerName = player.name + (player.isGoalkeeper ? ' (Goalkeeper)' : '');
    item.textContent = playerName;
    if (id === 'playerSkillList') {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = selectedPlayers.has(player);
      checkbox.addEventListener('change', function () {
        selectPlayer(player, checkbox.checked);
      });
      label.appendChild(checkbox);
      const name = document.createElement('span');
      name.className = 'player-name';
      name.textContent = playerName;
      label.appendChild(name);
      const score = document.createElement('span');
      score.className = 'player-score';
      score.textContent = String(player.score);
      label.appendChild(score);
      item.replaceChildren(label);
    }
    if (id === 'registeredPlayerList') {
      const registeredName = document.createElement('span');
      registeredName.className = 'registered-player-name';
      registeredName.textContent = playerName;
      const registeredScore = document.createElement('span');
      registeredScore.className = 'player-score';
      registeredScore.textContent = showScores ? String(player.score) : '';
      item.replaceChildren(registeredName, registeredScore);
      const editButton = document.createElement('button');
      editButton.type = 'button';
      editButton.textContent = 'Edit';
      editButton.setAttribute('aria-label', 'Edit ' + player.name);
      editButton.addEventListener('click', function () {
        editPlayer(player);
      });
      item.appendChild(document.createTextNode(' '));
      item.appendChild(editButton);
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.textContent = 'Delete';
      deleteButton.setAttribute('aria-label', 'Delete ' + player.name);
      deleteButton.addEventListener('click', function () {
        deletePlayer(player);
      });
      item.appendChild(document.createTextNode(' '));
      item.appendChild(deleteButton);
    }
    list.appendChild(item);
  });
  if (id === 'playerSkillList') {
    updateSelectedPlayerCount();
    const hasNoPlayers = players.length === 0;
    document.getElementById('playerListColumns').hidden = hasNoPlayers;
    document.getElementById('noPlayersGuidance').hidden = !hasNoPlayers;
    document.getElementById('addPlayersFromMatch').hidden = !hasNoPlayers;
    if (!hasNoPlayers && visiblePlayers.length === 0) {
      const emptyResult = document.createElement('li');
      emptyResult.setAttribute('role', 'status');
      emptyResult.textContent = 'No players found.';
      list.appendChild(emptyResult);
    }
  }
  if (id === 'registeredPlayerList') {
    const hasRegisteredPlayers = players.length > 0;
    document.getElementById('registeredPlayersEmptyState').hidden = hasRegisteredPlayers;
    document.getElementById('playersArea').classList.toggle('has-registered-players', hasRegisteredPlayers);
  }
}

function renderMatchPlayers() {
  const query = document.getElementById('playerSearch').value.trim().toLowerCase();
  const visiblePlayers = query
    ? players.filter(player => player.name.toLowerCase().includes(query))
    : players;
  renderPlayers('playerSkillList', visiblePlayers, true);
}

function updateSelectedPlayerCount() {
  document.getElementById('selectionStatus').textContent =
    'Selected for this match: ' + selectedPlayers.size + ' / ' + players.length;
  document.getElementById('btnSelectAllPlayers').disabled = selectedPlayers.size === players.length;
}

function selectPlayer(player, selected) {
  if (selected) {
    selectedPlayers.add(player);
  } else {
    selectedPlayers.delete(player);
  }
  clearTeamsAfterChange();
  updateSelectedPlayerCount();
}

function selectAllPlayers() {
  players.forEach(function (player) {
    selectPlayer(player, true);
  });
  renderMatchPlayers();
}

renderMatchPlayers();
renderPlayers('registeredPlayerList', players, true);

function editPlayer(player) {
  playerBeingEdited = player;
  const nameInput = document.getElementById('pName');
  nameInput.value = player.name;
  nameInput.setCustomValidity('');
  document.getElementById('pSkill').value = player.score;
  document.getElementById('pGoalkeeper').checked = player.isGoalkeeper;
  document.getElementById('btnPs').textContent = 'Save changes';
  document.getElementById('btnCancelEdit').hidden = false;
  document.getElementById('editingStatus').textContent = 'Editing: ' + player.name;
  nameInput.focus();
}

function cancelEditing() {
  playerBeingEdited = null;
  document.getElementById('pName').value = '';
  document.getElementById('pName').setCustomValidity('');
  document.getElementById('pSkill').value = '';
  document.getElementById('pGoalkeeper').checked = false;
  document.getElementById('btnPs').textContent = 'Add Player';
  document.getElementById('btnCancelEdit').hidden = true;
  document.getElementById('editingStatus').textContent = '';
}

function deletePlayer(player) {
  const index = players.indexOf(player);
  if (index === -1) return;

  const details = player.name + ' - ' + player.score +
    (player.isGoalkeeper ? ' (Goalkeeper)' : '');
  if (!window.confirm('Delete this player from the registration?\n' + details)) return;

  players.splice(index, 1);
  selectedPlayers.delete(player);
  if (playerBeingEdited === player) cancelEditing();
  clearTeamsAfterChange();
  savePlayers();
  renderMatchPlayers();
  renderPlayers('registeredPlayerList', players, true);
}

function clearTeamsAfterChange() {
  previousTeams = null;
  resetAlternativeControls();
  resetSwapControls();
  resetShareText();
  document.getElementById('copyStatus').textContent = '';
  if (teams.length === 0) return;

  teams = [];
  document.getElementById('viewTeams').hidden = true;
  document.getElementById('btnTeams').textContent = 'Generate Teams';
  document.getElementById('teamsContainer').replaceChildren();
  const status = document.getElementById('teamsStatus');
  status.textContent =
    'Match settings or registration changed. Generate teams again.';
  document.getElementById('selectPlayersStage').appendChild(status);
  showMatchStage('selection', false);
}

// Add a player or save changes to an existing player.
function addOrUpdatePlayer(event) {
  event.preventDefault();

  // Read and validate the form fields.
  const form = document.getElementById('form');
  const nameInput = document.getElementById('pName');
  nameInput.setCustomValidity(nameInput.value.trim() ? '' : 'Enter the player name.');
  if (!form.reportValidity()) return;

  let name = nameInput.value.trim();
  let score = Number(document.getElementById('pSkill').value);

  // Create the player record.
  let newPlayer = {
    name: name,
    score: score,
    isGoalkeeper: document.getElementById('pGoalkeeper').checked,
  };

  if (!isValidPlayer(newPlayer)) return;

  if (playerBeingEdited === null) {
    players.push(newPlayer);
    clearTeamsAfterChange();
  } else {
    const index = players.indexOf(playerBeingEdited);
    players[index] = { ...playerBeingEdited, ...newPlayer };
    if (selectedPlayers.delete(playerBeingEdited)) selectedPlayers.add(players[index]);
    clearTeamsAfterChange();
  }
  savePlayers();

  cancelEditing();

  renderMatchPlayers();
  renderPlayers('registeredPlayerList', players, true);
}

document.getElementById('pName').addEventListener('input', function () {
  this.setCustomValidity('');
});

document.getElementById('teamCount').addEventListener('input', clearTeamsAfterChange);

// Fixed team capacities keep team sizes within one player of each other.
function buildTeams(players, teamCount) {
  const baseSize = Math.floor(players.length / teamCount);
  const extras = players.length % teamCount;
  const result = Array.from({ length: teamCount }, function (_, index) {
    return { players: [], totalScore: 0, capacity: baseSize + (index < extras ? 1 : 0) };
  });
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const goalkeepers = sortedPlayers.filter(player => player.isGoalkeeper);
  const outfieldPlayers = sortedPlayers.filter(player => !player.isGoalkeeper);

  goalkeepers.forEach(function (player, index) {
    result[index].players.push(player);
    result[index].totalScore += player.score;
  });
  outfieldPlayers.forEach(function (player) {
    let destination = null;
    result.forEach(function (team) {
      if (team.players.length < team.capacity && (destination === null || team.totalScore < destination.totalScore)) {
        destination = team;
      }
    });
    destination.players.push(player);
    destination.totalScore += player.score;
  });

  // Improve the initial assignment without changing capacities or goalkeeper counts.
  // Integer score differences strictly decrease, so this local search terminates.
  while (true) {
    let bestSwap = null;
    let bestDifference = scoreDifference(result);
    result.forEach(function (first, firstIndex) {
      result.slice(firstIndex + 1).forEach(function (second, offset) {
        const secondIndex = firstIndex + offset + 1;
        first.players.forEach(function (a, aIndex) {
          second.players.forEach(function (b, bIndex) {
            if (a.isGoalkeeper !== b.isGoalkeeper) return;
            const totals = result.map(team => team.totalScore);
            totals[firstIndex] += b.score - a.score;
            totals[secondIndex] += a.score - b.score;
            const difference = Math.max(...totals) - Math.min(...totals);
            if (difference < bestDifference) {
              bestDifference = difference;
              bestSwap = { first, second, a, b, aIndex, bIndex };
            }
          });
        });
      });
    });
    if (bestSwap === null) break;
    const { first, second, a, b, aIndex, bIndex } = bestSwap;
    first.players[aIndex] = b;
    second.players[bIndex] = a;
    first.totalScore += b.score - a.score;
    second.totalScore += a.score - b.score;
  }
  return result;
}

function renderTeams() {
  const container = document.getElementById('teamsContainer');
  container.replaceChildren();
  teams.forEach(function (team, index) {
    const section = document.createElement('section');
    section.className = 'team';
    const playerSection = document.createElement('div');
    const heading = document.createElement('h3');
    heading.textContent = 'Team ' + (index + 1);
    const list = document.createElement('ul');
    team.players.forEach(function (player) {
      const item = document.createElement('li');
      item.textContent = player.name + (player.isGoalkeeper ? ' (Goalkeeper)' : '');
      list.appendChild(item);
    });
    if (!team.players.some(player => player.isGoalkeeper)) {
      const goalkeeperNote = document.createElement('p');
      goalkeeperNote.className = 'team-warning';
      goalkeeperNote.textContent = 'No fixed goalkeeper';
      goalkeeperNote.setAttribute('role', 'note');
      playerSection.appendChild(heading);
      playerSection.appendChild(goalkeeperNote);
    } else {
      playerSection.appendChild(heading);
    }
    playerSection.appendChild(list);
    const totals = document.createElement('div');
    const scoreHeading = document.createElement('h3');
    scoreHeading.textContent = 'Skill total';
    const totalScore = document.createElement('p');
    totalScore.textContent = team.totalScore;
    totals.appendChild(scoreHeading);
    totals.appendChild(totalScore);
    section.appendChild(playerSection);
    section.appendChild(totals);
    container.appendChild(section);
  });
  renderSwapControls();
  renderShareText();
  document.getElementById('btnTeams').textContent = 'Generate another composition';
}

function resetShareText() {
  shareTextVersion++;
  document.getElementById('shareText').value = '';
  document.getElementById('shareControls').hidden = true;
}

function renderShareText() {
  resetShareText();
  document.getElementById('copyStatus').textContent = '';
  if (teams.length === 0 || previousTeams !== null) return;

  const details = [
    ['Location', document.getElementById('matchLocation').value.trim()],
    ['Date', document.getElementById('matchDate').value],
    ['Time', document.getElementById('matchTime').value],
  ].filter(([, value]) => value).map(([label, value]) => label + ': ' + value);
  const teamText = teams.map(function (team, index) {
    return 'Team ' + (index + 1) + '\n' + team.players.map(player => '• ' + player.name).join('\n');
  }).join('\n\n');
  const shareText = details.length > 0
    ? details.join('\n') + '\n\n' + teamText
    : teamText;
  document.getElementById('shareText').value = shareText;
  document.getElementById('btnShareWhatsApp').href = 'https://wa.me/?text=' + encodeURIComponent(shareText);
  document.getElementById('btnNativeShare').hidden = typeof navigator === 'undefined' || typeof navigator.share !== 'function';
  document.getElementById('shareControls').hidden = false;
}

async function shareTeamsUsingDevice() {
  const shareStatus = document.getElementById('copyStatus');
  shareStatus.textContent = '';
  try {
    await navigator.share({
      title: 'Team Generator',
      text: document.getElementById('shareText').value,
    });
  } catch (error) {
    if (error && error.name === 'AbortError') return;
    shareStatus.textContent = 'Could not open sharing options. Use WhatsApp or copy teams manually.';
  }
}

async function copyTeamsToClipboard() {
  const copiedVersion = shareTextVersion;
  try {
    await navigator.clipboard.writeText(document.getElementById('shareText').value);
    if (copiedVersion !== shareTextVersion) return;
    document.getElementById('copyStatus').textContent = 'Teams copied.';
  } catch {
    if (copiedVersion !== shareTextVersion) return;
    document.getElementById('copyStatus').textContent =
      'Could not copy teams. Select the text below and copy it manually.';
  }
}

function copyTeams(composition) {
  return composition.map(team => ({ ...team, players: [...team.players] }));
}

function scoreDifference(composition) {
  const totals = composition.map(team => team.totalScore);
  return Math.max(...totals) - Math.min(...totals);
}

// Ignore both team labels and member order, using object identity rather than names.
function compositionKey(composition) {
  return composition.map(team => team.players.map(player => players.indexOf(player))
    .sort((a, b) => a - b).join(',')).sort().join('|');
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function findAlternativeTeams(current) {
  const currentKey = compositionKey(current);
  let best = null;
  let bestDifference = Infinity;
  function consider(candidate) {
    if (compositionKey(candidate) === currentKey) return;
    const difference = scoreDifference(candidate);
    if (difference < bestDifference) {
      best = candidate;
      bestDifference = difference;
    }
  }

  // Sample complete assignments: any number of players may change teams.
  const participants = current.flatMap(team => team.players);
  for (let attempt = 0; attempt < 64; attempt++) {
    const candidate = current.map(team => ({ players: [], totalScore: 0, capacity: team.capacity }));
    const destinations = shuffle(candidate);
    shuffle(participants.filter(player => player.isGoalkeeper)).forEach((player, index) => {
      destinations[index].players.push(player);
    });
    const outfield = shuffle(participants.filter(player => !player.isGoalkeeper));
    candidate.forEach(team => {
      while (team.players.length < team.capacity) team.players.push(outfield.pop());
      team.totalScore = team.players.reduce((sum, player) => sum + player.score, 0);
    });
    consider(candidate);
  }

  // Exhaust all legal single exchanges as a deterministic fallback. This is
  // generation, so a goalkeeper may move to a team without a fixed goalkeeper.
  current.forEach((first, firstIndex) => {
    current.slice(firstIndex + 1).forEach((second, offset) => {
      const secondIndex = firstIndex + offset + 1;
      first.players.forEach((a, aIndex) => {
        second.players.forEach((b, bIndex) => {
          if (a.isGoalkeeper !== b.isGoalkeeper &&
              (a.isGoalkeeper ? second : first).players.some(player => player.isGoalkeeper)) return;
          const candidate = copyTeams(current);
          candidate[firstIndex].players[aIndex] = b;
          candidate[secondIndex].players[bIndex] = a;
          candidate[firstIndex].totalScore += b.score - a.score;
          candidate[secondIndex].totalScore += a.score - b.score;
          consider(candidate);
        });
      });
    });
  });
  return best;
}

function resetAlternativeControls() {
  document.getElementById('alternativeControls').hidden = true;
  document.getElementById('alternativeStatus').textContent = '';
  document.getElementById('btnTeams').disabled = false;
  document.getElementById('btnTeams').textContent = teams.length ? 'Generate another composition' : 'Generate Teams';
}

function acceptAlternative() {
  if (previousTeams === null) return;
  previousTeams = null;
  resetAlternativeControls();
  renderSwapControls();
  renderShareText();
  document.getElementById('alternativeStatus').textContent = 'New composition accepted.';
}

function undoAlternative() {
  if (previousTeams === null) return;
  teams = previousTeams;
  document.getElementById('viewTeams').hidden = teams.length === 0;
  previousTeams = null;
  resetAlternativeControls();
  renderTeams();
  updateTeamWarnings();
  document.getElementById('alternativeStatus').textContent = 'Previous composition restored.';
}

function resetSwapControls() {
  document.getElementById('swapControls').hidden = true;
  document.getElementById('firstSwapPlayer').replaceChildren();
  document.getElementById('secondSwapPlayer').replaceChildren();
  document.getElementById('firstSwapPlayer').value = '';
  document.getElementById('secondSwapPlayer').value = '';
  document.getElementById('swapStatus').textContent = '';
}

function renderSwapControls() {
  resetSwapControls();
  if (teams.length < 2 || previousTeams !== null) return;

  ['firstSwapPlayer', 'secondSwapPlayer'].forEach(function (id) {
    const select = document.getElementById(id);
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Choose a player';
    select.appendChild(placeholder);
    teams.forEach(function (team, teamIndex) {
      team.players.forEach(function (player, playerIndex) {
        const option = document.createElement('option');
        // Registration indexes identify distinct people even when their names match.
        option.value = String(players.indexOf(player));
        option.textContent = 'Team ' + (teamIndex + 1) + ', player ' + (playerIndex + 1) + ': ' +
          player.name + ' - ' + player.score + (player.isGoalkeeper ? ' (Goalkeeper)' : ' (Outfield)');
        select.appendChild(option);
      });
    });
    select.value = '';
  });
  document.getElementById('swapControls').hidden = false;
}

function cancelPlayerSwap() {
  document.getElementById('firstSwapPlayer').value = '';
  document.getElementById('secondSwapPlayer').value = '';
  document.getElementById('swapStatus').textContent = 'Swap canceled. Teams are unchanged.';
}

function confirmPlayerSwap() {
  if (previousTeams !== null) return;
  const status = document.getElementById('swapStatus');
  const firstValue = document.getElementById('firstSwapPlayer').value;
  const secondValue = document.getElementById('secondSwapPlayer').value;
  const firstPlayer = firstValue === '' ? undefined : players[Number(firstValue)];
  const secondPlayer = secondValue === '' ? undefined : players[Number(secondValue)];
  const firstTeam = teams.find(team => team.players.includes(firstPlayer));
  const secondTeam = teams.find(team => team.players.includes(secondPlayer));
  if (!firstTeam || !secondTeam || !selectedPlayers.has(firstPlayer) || !selectedPlayers.has(secondPlayer)) {
    status.textContent = 'Choose two players from the current teams.';
    return;
  }
  if (firstPlayer === secondPlayer) {
    status.textContent = 'Choose two different players.';
    return;
  }
  if (firstTeam === secondTeam) {
    status.textContent = 'Choose players from different teams.';
    return;
  }
  if (firstPlayer.isGoalkeeper !== secondPlayer.isGoalkeeper) {
    status.textContent = 'Swap outfield players with outfield players, or goalkeepers with goalkeepers.';
    return;
  }

  const firstIndex = firstTeam.players.indexOf(firstPlayer);
  const secondIndex = secondTeam.players.indexOf(secondPlayer);
  firstTeam.players[firstIndex] = secondPlayer;
  secondTeam.players[secondIndex] = firstPlayer;
  firstTeam.totalScore = firstTeam.players.reduce((total, player) => total + player.score, 0);
  secondTeam.totalScore = secondTeam.players.reduce((total, player) => total + player.score, 0);
  resetAlternativeControls();
  renderTeams();
  document.getElementById('copyStatus').textContent = '';
  status.textContent = 'Players swapped. Team skill totals updated.';
}

function generateTeams() {
  if (previousTeams !== null) return;
  const status = document.getElementById('teamsStatus');
  const generationStatus = document.getElementById('generationStatus');
  const errorStatus = document.getElementById('teamsStage').hidden ? generationStatus : status;
  if (selectedPlayers.size === 0) {
    errorStatus.textContent = 'Select the players for this match before generating teams.';
    return;
  }
  const teamCountInput = document.getElementById('teamCount');
  const teamCount = Number(teamCountInput.value);
  if (!teamCountInput.reportValidity() || !Number.isInteger(teamCount) || teamCount < 2) {
    errorStatus.textContent = 'Choose a whole number of teams, starting from 2.';
    return;
  }
  if (teamCount > Math.floor(selectedPlayers.size / 2)) {
    errorStatus.textContent = 'Select at least 2 players per team, or reduce the number of teams (minimum 2 teams).';
    return;
  }
  const selected = players.filter(player => selectedPlayers.has(player));
  const goalkeeperCount = selected.filter(player => player.isGoalkeeper).length;
  if (goalkeeperCount > teamCount) {
    errorStatus.textContent = 'Too many fixed goalkeepers. Select no more than ' + teamCount + ' before generating teams.';
    return;
  }
  status.textContent = '';
  generationStatus.textContent = '';
  document.getElementById('teamsStage').appendChild(status);
  resetAlternativeControls();
  if (teams.length) {
    const alternative = findAlternativeTeams(teams);
    if (alternative === null) {
      renderSwapControls();
      document.getElementById('alternativeStatus').textContent =
        'No different valid composition was found in this search. Current teams are unchanged.';
      return;
    }
    const before = scoreDifference(teams);
    const after = scoreDifference(alternative);
    if (after > before) {
      previousTeams = copyTeams(teams);
      document.getElementById('copyStatus').textContent = '';
      document.getElementById('alternativeControls').hidden = false;
      document.getElementById('btnTeams').disabled = true;
      document.getElementById('alternativeStatus').textContent =
        'This preview is less balanced: the difference between the highest and lowest skill totals increased from ' +
        before + ' to ' + after + '. Accept this composition or undo to restore the previous teams.';
    } else {
      document.getElementById('copyStatus').textContent = '';
      document.getElementById('alternativeStatus').textContent =
        'New composition applied. Skill total difference: ' + before + ' → ' + after + '.';
    }
    teams = alternative;
  } else {
    teams = buildTeams(selected, teamCount);
  }
  document.getElementById('viewTeams').hidden = teams.length === 0;
  renderTeams();
  updateTeamWarnings();
  showMatchStage('teams');
}

function updateTeamWarnings() {
  const status = document.getElementById('teamsStatus');
  const selected = teams.flatMap(team => team.players);
  const teamCount = teams.length;
  const goalkeeperCount = selected.filter(player => player.isGoalkeeper).length;
  const warnings = [];
  if (selected.length % teamCount !== 0) {
    warnings.push('Teams have different numbers of players because the selected players cannot be divided equally among ' + teamCount + ' teams. Team sizes differ by one player.');
  }
  const teamsWithoutGoalkeeper = teams.flatMap((team, index) =>
    team.players.some(player => player.isGoalkeeper) ? [] : [index + 1]);
  if (teamsWithoutGoalkeeper.length > 0) {
    warnings.push('No fixed goalkeeper in teams: ' + teamsWithoutGoalkeeper.join(', ') + '. Someone will need to play in goal.');
  }
  if (goalkeeperCount === 1) {
    warnings.push('With only one fixed goalkeeper, the match may still be unbalanced.');
  }
  status.textContent = warnings.join(' ');
}
