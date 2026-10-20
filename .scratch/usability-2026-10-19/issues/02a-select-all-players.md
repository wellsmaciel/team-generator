# 02a: Select All Players

**Entrega:** facilitar a seleção de todos os jogadores cadastrados para a partida, preservando o ajuste individual. Entrega adicional entre a tarefa 02 e a tarefa 03 da segunda rodada; não renumerar nem reutilizar o histórico do ticket 02 concluído.

**Blocked by:** tarefa 02 concluída.

**Status:** done — fechado em 20/10/2026 após testes e revisão do usuário (ver "Fechamento do ticket 02a" ao final). Dois ciclos TDD concluídos e verificados; limitações explícitas nas passagens.

## Escopo autorizado em 20/10/2026

O usuário escolheu Select All Players como próxima entrega e autorizou reaproveitar a passagem automática Codex/Claude. Somente este ticket pode ser trabalhado. Tarefa 03 (validação integrada) continua posterior. Preservar integralmente os registros e evidências da tarefa 02.

Parar em **“Pronto para revisão do usuário antes do commit”**. O usuário quer executar seus testes e revisar arquivos antes do commit. Não executar staging, commit, push, PR, merge, release ou publicação, nem iniciar outra tarefa automaticamente.

## Primeiro ciclo confirmado — 20/10/2026

- Interface pública: Playwright, contexto isolado, cadastro sintético pela interface, botão localizado por papel e nome acessível `Select All Players`.
- Comportamento: botão acima da lista de participantes seleciona todos os cadastrados, atualiza a contagem e permite desmarcar jogadores individualmente em seguida.
- Cobertura deste ciclo: checkboxes e contagem renderizados após seleção em lote e ajuste individual; sem consultar funções ou estado interno.
- Limite: não comprova invalidação de times existentes/prévia, comportamento sem jogadores ou com todos já selecionados, nem apresentação e teclado completos. Esses detalhes precisam ser alinhados antes dos respectivos ciclos.

## Critérios e preparação

- [x] Confirmar primeiro comportamento/interface com o usuário e registrar a resposta antes de escrever teste. — Após explicar o fluxo automático e a proposta acima, o usuário respondeu: “Pode ser, pode iniciar então.”
- [x] Claude prepara um teste e comprova RED real; Codex implementa o mínimo; Claude verifica independentemente. — Primeiro ciclo concluído (ver passagens de 20/10/2026).
- [x] Entregar seleção em lote e ajuste individual conforme comportamento confirmado. — `Select All Players` + `selectAllPlayers()`; teste novo passa em desktop, 360 e 390.
- [x] Definir e verificar os casos de seleção parcial, todos selecionados e cadastro vazio, um comportamento por ciclo quando exigir mudança. — Ciclo 2 (RED→GREEN): desabilitado sem cadastrados/com todos marcados, habilitado ao desmarcar. Seleção parcial coberta pelos ciclos 1 e 2.
- [x] Documentar o botão (README.md "How to use"/"Current scope", docs/jornada-do-usuario.md, docs/proximo-chat.md, docs/tarefas.md e este ticket) ao fechar os ciclos; responsável: Claude, após o GREEN do ciclo 2. — Feito.
- [x] Combinar e verificar invalidação de resultados/prévia quando a seleção realmente mudar, preservando as regras existentes e Copy teams. — Decisão do usuário: evitar limpar times à toa (botão desabilitado). Quando adiciona alguém, limpa como qualquer mudança (aceitação, teste novo).
- [x] Conferir rótulo, teclado/foco e apresentação em celular simulado, tablet e PC. Distinguir simulação de aparelho físico. — Tab+Enter e capturas em desktop, 360, 390 e 768 (simulação).
- [x] Preservar cadastros, seleção inicial vazia sem persistência, quantidade de times, algoritmo e demais comportamentos existentes. Não acrescentar desmarcar todos nem novas funcionalidades sem autorização. — Sem mudança em cadastro, algoritmo ou persistência.
- [x] Executar regressões pertinentes, registrar evidências leves e limites e atualizar documentação de continuidade.
- [x] Concluir verificação independente e parar para testes/revisão do usuário antes do commit.

## Coordenação

Ler `docs/agents/coordenacao-por-hooks.md`, `.claude/codex-relay/README.md`, `docs/desenvolvimento-tdd.md`, a skill `.agents/skills/tdd/SKILL.md` e `docs/agents/gestao-de-arquivos.md`.

A passagem automática existente é genérica e pode apontar para este ticket sem apagar seu código, logs ou os registros anteriores. Primeiro comportamento/interface confirmados; Claude deve comprovar RED e registrar a etapa concreta antes de criar uma passagem `→ Codex`. Não afirmar que houve execução real de ponta a ponta sem evidência.

Explicações/documentação em português; código, comentários, interface e nomes de testes em inglês. Uma pergunta por vez. Nenhuma exclusão de ZIPs autorizada.

## Passagem Claude → Codex (RED do primeiro ciclo, 20/10/2026)

Comportamento confirmado com o usuário: um botão `Select All Players`, acima da lista de participantes, marca todos os cadastrados, atualiza a contagem e permite desmarcar individualmente em seguida.

- **Arquivo e teste:** `tests/browser/select-all-players.spec.cjs`, teste `Select All Players checks every registered player, updates the count and still allows individual unchecking`.
- **Comando:** `PLAYWRIGHT_BROWSERS_PATH=.scratch/playwright-browsers npx --no-install playwright test tests/browser/select-all-players.spec.cjs --reporter=line --trace=off --output=.scratch/playwright-results/task-02a-red` (projetos desktop, narrow-360 e narrow-390).
- **Esperado:** cadastra Ana, Beto, Caio e Dani pela interface; confere `Selected for this match: 0 / 4`; clica no botão `Select All Players` (papel `button`, nome acessível exato); os 4 checkboxes de `#playerSkillList` ficam marcados e `#selectionStatus` mostra `Selected for this match: 4 / 4`; desmarcar Beto deixa os outros três marcados e mostra `3 / 4`.
- **Observado:** 3 falhas, uma por projeto, todas por timeout em `getByRole('button', { name: 'Select All Players', exact: true }).click()`: o botão não existe em `index.html`. Cadastro e a asserção inicial `0 / 4` passaram antes da falha, então não é erro de preparação, sintaxe ou ambiente.
- **Interface usada:** papéis/rótulos públicos (`Player Name`, `Player Skill`, `Add Player`, `Select All Players`) e os ids públicos `#playerSkillList` e `#selectionStatus`; nenhuma função ou estado interno é acessado.
- **O que cobre:** seleção em lote e ajuste individual posterior, pela contagem e pelos checkboxes renderizados.
- **O que NÃO cobre (ciclos futuros, a alinhar com o usuário):** invalidação de times/prévia existentes, cadastro vazio, todos já selecionados, seleção parcial prévia, posição exata do botão, teclado/foco e apresentação em 360/390/tablet.
- **Pedido ao Codex (mínimo):** adicionar em `index.html` o botão `Select All Players` acima de `#playerSkillList` (dentro do bloco "Players and Skills") e, em `script.js`, o handler que marca todos os cadastrados e atualiza a contagem pelo mesmo caminho já usado pelos checkboxes (`selectPlayer`/`updateSelectedPlayerCount`), sem persistir a seleção. Não acrescentar "desmarcar todos", não alterar o algoritmo, cadastro, testes existentes nem este teste. Escopo: somente este comportamento.
- **Comandos de GREEN/regressão a rodar:** o comando acima (deve passar nos 3 projetos) e `node --check script.js`, `node tests/initial-team-balance.test.cjs`, `node tests/manual-player-swaps.test.cjs`, `node tests/regenerate-teams.test.cjs`, `node tests/share-team-text.test.cjs`, `git diff --check`, mais os specs de browser existentes pertinentes.
- **Limites:** Chromium em 1280×720, 360×800 e 390×844; sem celular físico. Nenhum git add/commit/push/PR/release.
- **Estado:** RED comprovado, aguardando implementação mínima do Codex; depois Claude verifica de forma independente.

## Passagem Codex -> Claude

GREEN mínimo do primeiro ciclo, 20/10/2026, para o comportamento/interface já confirmados. Checklist do ticket ainda não está integralmente satisfeito; não foram iniciados outros ciclos ou tarefas.

- **Arquivos:** `index.html` recebe o botão `Select All Players`, dentro de "Players and Skills", imediatamente acima de `#playerSkillList`; `script.js` recebe `selectAllPlayers()`, que chama `selectPlayer(player, true)` para cada cadastrado e renderiza a lista pelo caminho existente. A contagem usa `updateSelectedPlayerCount`; não há gravação da seleção nem alteração do algoritmo/cadastro. Testes preservados.
- **RED conferido antes da edição:** 3 falhas, desktop/narrow-360/narrow-390, por timeout no clique do botão ausente, linha 24 do spec. Cadastro e contagem inicial passaram. Saída isolada em `.scratch/playwright-results/task-02a-codex-red`.
- **GREEN:** mesmo teste, sem alteração, passou nos 3 projetos (`3 passed`): quatro checkboxes marcados e contagem `4 / 4`; desmarcar Beto preserva os outros três e mostra `3 / 4`.
- **Comandos exatos de RED/GREEN (PowerShell):**

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH='.scratch/playwright-browsers'; npx --no-install playwright test tests/browser/select-all-players.spec.cjs --reporter=line --trace=off --output=.scratch/playwright-results/task-02a-codex-red
$env:PLAYWRIGHT_BROWSERS_PATH='.scratch/playwright-browsers'; npx.cmd --no-install playwright test tests/browser/select-all-players.spec.cjs --reporter=line --trace=off --output=.scratch/playwright-results/task-02a-codex-red
$env:PLAYWRIGHT_BROWSERS_PATH='.scratch/playwright-browsers'; npx.cmd --no-install playwright test tests/browser/select-all-players.spec.cjs --reporter=line --trace=off --output=.scratch/playwright-results/task-02a-codex-green
```

- **Ambiente:** a primeira tentativa com `npx` não executou Playwright: política do PowerShell bloqueou `npx.ps1`. Usado `npx.cmd` sem mudar política, instalar dependências ou modificar configuração. Essa tentativa não é evidência de RED.
- **Regressões e comandos exatos:**

```powershell
node --check script.js
node tests/initial-team-balance.test.cjs
node tests/manual-player-swaps.test.cjs
node tests/regenerate-teams.test.cjs
node tests/share-team-text.test.cjs
git diff --check
$env:PLAYWRIGHT_BROWSERS_PATH='.scratch/playwright-browsers'; npx.cmd --no-install playwright test tests/browser/copy-teams-button.spec.cjs tests/browser/copy-teams-presentation.spec.cjs tests/browser/full-keyboard-order.spec.cjs tests/browser/generate-after-participants.spec.cjs tests/browser/pending-deletion.spec.cjs tests/browser/share-keyboard.spec.cjs --reporter=line --trace=off --output=.scratch/playwright-results/task-02a-codex-regression
```

- **Resultados:** sintaxe e quatro scripts Node passaram (incluindo 458 casos de troca e 714 cenários de regeneração); `git diff --check` passou, com aviso de normalização LF/CRLF em `docs/agents/coordenacao-por-hooks.md`, alteração local preexistente não editada nesta passagem. Browser: `45 passed`, `5 skipped`, `1 failed` (saída 1).
- **Pendência concreta da regressão:** `full-keyboard-order.spec.cjs:40`, desktop, espera foco em `Ana - 5` no primeiro Tab após `Add Player`. O novo botão antes da lista acrescenta uma parada ao percurso. O teste não contempla esse controle e falha nessa expectativa. Preservado conforme proibição expressa de alterar testes nesta passagem; não contornar removendo o botão da ordem de teclado. Claude deve verificar independentemente e alinhar o ciclo de teclado/ajuste do teste. Evidência em `.scratch/playwright-results/task-02a-codex-regression/full-keyboard-order-Tab-vi-854c3-nt-order-with-visible-focus-desktop/`.
- **Limites:** Chromium em 1280×720, 360×800 e 390×844; sem celular físico ou tablet. Este GREEN não comprova casos vazio/todos selecionados/seleção parcial prévia, invalidação por seleção em lote com resultados/prévia existentes, nem teclado/apresentação completos. O handler herda os efeitos de `selectPlayer`; não foram acrescentadas regras novas para esses casos. Sem refatoração, desmarcar todos ou ampliação de escopo.
- **Preservação:** somente `index.html`, `script.js` e esta seção do ticket foram editados; alterações locais anteriores preservadas. Nenhuma exclusão de evidência, nenhum staging/commit/push/PR/merge/release/publicação.
- **Estado/próximo passo:** GREEN do comportamento solicitado comprovado; regressão de teclado pendente; aguardando verificação independente de Claude. Não marcar o ticket concluído ou iniciar tarefa 03. Ao encerrar todos os critérios e a verificação independente, parar em **“Pronto para revisão do usuário antes do commit”**.

## Passagem Claude — verificação independente do primeiro ciclo (20/10/2026)

- **Diff revisado:** `index.html` ganha `<button type="button" onclick="selectAllPlayers()">Select All Players</button>` em "Players and Skills", acima de `#playerSkillList`. `script.js` ganha `selectAllPlayers()`: chama `selectPlayer(player, true)` para cada cadastrado e re-renderiza a lista pelo caminho existente. Sem persistência, sem mudança de algoritmo, cadastro ou CSS. É o mínimo pedido; nada fora do escopo.
- **Observação sobre `selectPlayer`:** cada chamada executa `clearTeamsAfterChange()`, então o lote limpa times e prévia existentes mesmo se nada mudar na seleção (ex.: todos já selecionados). Isso NÃO foi decidido nem testado neste ciclo; é a pergunta de invalidação listada nos critérios e precisa ser combinada com o usuário antes do próximo ciclo.
- **Ajuste do teste existente (por Claude, não por Codex):** `tests/browser/full-keyboard-order.spec.cjs` esperava Tab de `Add Player` direto para `Ana - 5`. O botão novo é uma parada legítima no percurso; acrescentei a parada em `Select All Players` com foco visível (`outlineStyle !== 'none'`) nessa posição. Nenhuma outra expectativa mudou, e o botão não foi removido da ordem de teclado. Isto é atualização de aceitação por controle novo, não RED fabricado.
- **Comandos e resultados (independentes, Claude):** `node --check script.js`; `node tests/initial-team-balance.test.cjs`; `node tests/manual-player-swaps.test.cjs` (458 casos); `node tests/regenerate-teams.test.cjs` (714 cenários); `node tests/share-team-text.test.cjs` → todos passaram. `git diff --check` → saída 0 (apenas o aviso LF/CRLF preexistente em `docs/agents/coordenacao-por-hooks.md`). Suíte integral Playwright: `npx --no-install playwright test --reporter=line --trace=off --output=.scratch/playwright-results/task-02a-claude-verify` → **49 passaram, 5 ignorados por desenho, 0 falharam** (inclui `select-all-players.spec.cjs` nos 3 projetos e o teste de teclado atualizado, desktop).
- **Relé:** primeira execução real de ponta a ponta: Claude RED → `codex exec` (saída 0) → Codex GREEN → Claude verifica. Evidência: logs em `.claude/codex-relay/logs/` e as passagens acima. O Codex corretamente não alterou testes e sinalizou a falha de Tab em vez de contorná-la.
- **Limites:** Chromium em 1280×720, 360×800 e 390×844; sem celular físico, sem tablet. Este ciclo não cobre cadastro vazio, todos já selecionados, seleção parcial prévia, invalidação de times/prévia pelo lote, nem apresentação/teclado em larguras estreitas.
- **Estado:** primeiro ciclo concluído e verificado. O ticket NÃO está integralmente satisfeito (ciclos de vazio/todos/parcial, invalidação, apresentação e documentação seguem abertos), e cada um exige confirmação do usuário antes de escrever o teste. Por isso não abro nova passagem para Codex e o relé fica inerte. Sem staging, commit, PR ou release.

## Decisão do usuário (20/10/2026)

**Decisão (usuário, 20/10/2026):** ao testar os passos propostos, o usuário viu que clicar em `Select All Players` com todos já marcados apagava os times gerados. Pediu que o botão fique desabilitado nesse caso; Claude propôs desabilitar também sem cadastrados, e o usuário autorizou prosseguir ("ok, voce proessegue com essa mudanca?"). Comportamento do ciclo 2: o botão fica desabilitado quando não há jogadores cadastrados ou quando todos já estão selecionados, e volta a ficar habilitado quando alguém é desmarcado ou cadastrado. Quando falta alguém, continua marcando todos e limpando os times como qualquer mudança real de seleção. Fica descartado o botão habilitado sem efeito.

## Passagem Claude → Codex (RED do ciclo 2, 20/10/2026)

- **Arquivo e teste:** `tests/browser/select-all-players.spec.cjs`, segundo teste `Select All Players is disabled when there are no registered players or everyone is already selected, and enabled again after unchecking someone`.
- **Comando:** `PLAYWRIGHT_BROWSERS_PATH=.scratch/playwright-browsers npx --no-install playwright test tests/browser/select-all-players.spec.cjs --reporter=line --trace=off --output=.scratch/playwright-results/task-02a-cycle2-red`.
- **Esperado:** sem cadastrados o botão está desabilitado; após cadastrar Ana e Beto fica habilitado; após clicar, contagem `2 / 2` e botão desabilitado; desmarcar o primeiro participante habilita o botão de novo.
- **Observado:** 3 falhas (desktop, narrow-360, narrow-390) na primeira asserção, linha 42: `expect(locator).toBeDisabled()`, esperado desabilitado, recebido habilitado. O primeiro teste (ciclo 1) passou nos 3 projetos. A falha é de comportamento ausente, não de preparação.
- **Interface usada:** papel `button` com nome `Select All Players`, rótulos de cadastro e `#selectionStatus`/`#playerSkillList`; nenhum estado interno.
- **Pedido ao Codex (mínimo):** manter o estado `disabled` do botão sincronizado com a seleção, atualizado onde a contagem já é atualizada (`updateSelectedPlayerCount`) e na renderização inicial; desabilitado quando `selectedPlayers.size === players.length` (inclui 0 cadastrados). Use o atributo nativo `disabled`; dê um `id` ao botão se precisar referenciá-lo. Não alterar `clearTeamsAfterChange`, o algoritmo, o cadastro nem acrescentar "desmarcar todos". Não editar testes.
- **Aviso de impacto (não editar):** `tests/browser/full-keyboard-order.spec.cjs` (parada em `Select All Players`) provavelmente falhará, porque o teste seleciona todos antes de percorrer o Tab e o botão ficará desabilitado e fora da ordem. É esperado: Claude ajusta esse teste na verificação. Reporte a falha sem contornar.
- **Comandos de GREEN/regressão:** o comando acima (6 testes devem passar), `node --check script.js`, os quatro `node tests/*.test.cjs`, `git diff --check` e a suíte Playwright completa.
- **Limites:** Chromium 1280×720, 360×800, 390×844; sem celular físico. Não cobre foco após o botão ficar desabilitado nem invalidação de times pelo lote quando falta alguém. Sem git add/commit/push/PR/release.
- **Estado:** RED comprovado; aguardando GREEN do Codex e verificação independente de Claude, que também atualiza a documentação do botão.

## Passagem Codex -> Claude

GREEN mínimo do ciclo 2, 20/10/2026. O checklist autorizado ainda não está integralmente satisfeito; esta passagem implementa somente o pedido do último RED, sem iniciar outro ciclo ou tarefa.

- **Arquivos:** `index.html` recebe somente o id `btnSelectAllPlayers` no botão existente; `script.js` sincroniza sua propriedade nativa `disabled` em `updateSelectedPlayerCount()` com `selectedPlayers.size === players.length`. A renderização inicial já chama essa função, assim como as atualizações existentes da lista/seleção. Não houve alteração de cadastro, algoritmo, `clearTeamsAfterChange`, handler de lote ou testes.
- **RED conferido antes da edição:** `3 failed`, `3 passed` (saída 1). O segundo teste falhou nos três projetos na linha 42, `toBeDisabled()`: sem cadastrados, esperado desabilitado, recebido habilitado. O teste do ciclo 1 passou nos três projetos; falha de comportamento, não de preparação. Evidência em `.scratch/playwright-results/task-02a-cycle2-codex-red`.
- **GREEN:** os dois testes, preservados, passaram nos três projetos: `6 passed` (saída 0). Comprovados cadastro vazio, habilitação após cadastrar, seleção em lote com contagem `2 / 2`, desabilitação com todos selecionados e reabilitação após desmarcar alguém. Evidência em `.scratch/playwright-results/task-02a-cycle2-codex-green`.
- **Comandos exatos de RED/GREEN (PowerShell):**

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH='.scratch/playwright-browsers'; npx.cmd --no-install playwright test tests/browser/select-all-players.spec.cjs --reporter=line --trace=off --output=.scratch/playwright-results/task-02a-cycle2-codex-red
$env:PLAYWRIGHT_BROWSERS_PATH='.scratch/playwright-browsers'; npx.cmd --no-install playwright test tests/browser/select-all-players.spec.cjs --reporter=line --trace=off --output=.scratch/playwright-results/task-02a-cycle2-codex-green
```

- **Comandos exatos de regressão:**

```powershell
node --check script.js
node tests/initial-team-balance.test.cjs
node tests/manual-player-swaps.test.cjs
node tests/regenerate-teams.test.cjs
node tests/share-team-text.test.cjs
git diff --check
$env:PLAYWRIGHT_BROWSERS_PATH='.scratch/playwright-browsers'; npx.cmd --no-install playwright test --reporter=line --trace=off --output=.scratch/playwright-results/task-02a-cycle2-codex-regression
```

- **Resultados:** sintaxe e os quatro scripts Node passaram (incluindo 458 casos de troca e 714 cenários de regeneração). `git diff --check` passou, somente com aviso LF/CRLF na alteração local preexistente de `docs/agents/coordenacao-por-hooks.md`, não editada aqui. Suíte Playwright completa: `51 passed`, `5 skipped`, `1 failed` (saída 1).
- **Falha prevista, sem contorno:** `tests/browser/full-keyboard-order.spec.cjs:40`, desktop, espera foco em `Select All Players` após selecionar todos. O botão está nativamente desabilitado e fica fora da ordem de Tab; a expectativa recebe `inactive`. Teste preservado conforme pedido. Claude deve ajustar essa aceitação na verificação independente. Evidência em `.scratch/playwright-results/task-02a-cycle2-codex-regression/full-keyboard-order-Tab-vi-854c3-nt-order-with-visible-focus-desktop/`.
- **Limites:** Chromium em 1280×720, 360×800 e 390×844; sem celular físico ou tablet. Este ciclo não comprova foco após o botão ficar desabilitado nem invalidação de times/prévia pelo lote quando falta alguém. Não declara teclado/apresentação completos ou ticket concluído.
- **Preservação:** somente `index.html`, `script.js` e esta nova seção do mesmo ticket foram editados; alterações locais anteriores e testes preservados. Nenhuma exclusão de evidência, staging, commit, push, PR, merge, release ou publicação.
- **Estado/próximo passo:** GREEN do ciclo 2 comprovado; aguardando verificação independente de Claude, ajuste do teste de teclado e documentação do botão conforme responsabilidade já registrada. Não iniciar outra tarefa. Ao concluir todos os critérios e a verificação independente, parar em **“Pronto para revisão do usuário antes do commit”**.

## Passagem Claude — verificação independente do ciclo 2 e fechamento (20/10/2026)

- **Incidente do relé:** a primeira passagem do ciclo 2 usou o título `## Decisão do usuário e passagem Claude → Codex`; o hook só reconhece títulos que começam com `## Passagem`, então ficou inerte. Corrigido separando `## Decisão do usuário` de `## Passagem Claude → Codex`; depois disso o relé rodou (Codex saiu com código 0). Erro de formato de Claude, não do Codex.
- **Diff do Codex revisado:** `index.html` dá `id="btnSelectAllPlayers"` ao botão; `script.js` acrescenta em `updateSelectedPlayerCount` a linha `btnSelectAllPlayers.disabled = selectedPlayers.size === players.length`, que cobre 0 cadastrados (0 = 0). Mínimo pedido; sem mudança em `clearTeamsAfterChange`, algoritmo, cadastro ou testes.
- **Teste de Tab ajustado (Claude):** `full-keyboard-order.spec.cjs` não marca mais os checkboxes antes; chega ao botão por Tab, confere foco visível, aciona por Enter (4/4, botão desabilitado) e segue para o primeiro participante. Prova ativação por teclado e que o desabilitar não prende o foco. Aceitação, sem RED fabricado.
- **Aceitação adicionada:** `Select All Players clears generated teams when it adds someone to the selection` (5 cadastrados, 4 selecionados, times gerados, botão → 5/5 e compartilhamento some). Passou de primeira; comportamento já existente via `selectPlayer`.
- **Comandos e resultados (Claude):** `node --check script.js`; 4 scripts Node (458 trocas, 714 regenerações); `git diff --check` saída 0 (aviso LF/CRLF preexistente em `docs/agents/coordenacao-por-hooks.md`); `npx --no-install playwright test --reporter=line --trace=off --output=.scratch/playwright-results/task-02a-final` → **55 passaram, 5 ignorados por desenho, 0 falharam**.
- **Visual (aceitação):** 10 jogadores com nomes longos em 1280×720, 360×800, 390×844 e 768×1024: botão visível, dentro da largura, sem rolagem horizontal, habilitado antes e desabilitado após o clique. Capturas em `.scratch/usability-2026-10-19/evidence/02a-select-all-players/visual-check/` (8 PNGs, sem HTML/trace duplicado).
- **Documentação:** `README.md` (passo 3 de uso e escopo atual), `docs/jornada-do-usuario.md`, `docs/tarefas.md`, `docs/proximo-chat.md` e este ticket.
- **Limites:** sem celular físico/teclado móvel (larguras simuladas); sem tablet real; foco após o botão se desabilitar com mouse/toque não foi verificado além do teclado; não há "desmarcar todos". O relé funcionou de ponta a ponta nos dois ciclos, com a falha de formato acima.
- **Estado:** **Pronto para revisão do usuário antes do commit.** Nenhum git add, commit, push, PR, release ou publicação. Tarefa 03 não iniciada; nenhuma nova passagem `→ Codex`, então o relé fica inerte.

## Fechamento do ticket 02a — 20/10/2026

**Responsável:** Claude, a pedido explícito do usuário de revisar o diff e então fazer commit, PR, merge e release, atualizando a versão exibida no rodapé.

- **Revisão do diff:** `index.html` acrescenta o botão nativo `Select All Players` acima de `#playerSkillList`; `script.js` acrescenta `selectAllPlayers()`, que reutiliza `selectPlayer` (mesma invalidação de qualquer mudança de seleção), e sincroniza `disabled` em `updateSelectedPlayerCount()`. Com o botão desabilitado quando todos já estão marcados, cada clique muda de fato a seleção. Cadastro, persistência, algoritmo e Copy teams intactos. Nenhum problema crítico ou alto encontrado.
- **Rodapé:** a versão exibida passou de `v1.0` para `v1.3.0`, e o elemento inválido `<v1 class="0">` foi trocado por `<span>`. Não havia CSS nem teste associado a ele.
- **Validação final consolidada:** `node --check script.js` e os quatro scripts Node aprovados; `git diff --check` limpo; suíte Playwright integral (desktop/360/390) → 55 passaram, 5 ignorados por desenho, 0 falhou.
- **Limites mantidos:** sem celular físico nem teclado móvel; tablet só por redimensionamento. Quando o botão se desabilita, o foco sai dele; no Chromium o Tab seguinte continua no primeiro participante, mas mouse/toque e outros navegadores não foram verificados. Fica para a tarefa 03. Não há "desmarcar todos".
- **Entrega:** versão `1.3.0`. Próxima entrega da fila: tarefa 03 (validação integrada), não iniciada.
