# 05: Match com seleção e times em etapas

> **Regra vigente para 04/05 (atualizada em 21/10/2026):** a regra única está em [coordenação por hooks](../../../docs/agents/coordenacao-por-hooks.md#regra-vigente--tarefas-04-e-05-atualizada-em-21102026) e prevalece sobre qualquer outro texto. Resumo: o Claude escreve o RED e verifica cada GREEN; o Codex implementa o mínimo e nunca faz staging nem commit. O commit de cada tarefa é feito pelo Claude num chat novo, aberto pelo Codex raiz pelo runner, logo depois do próprio `/ecc:code-review`, sem achado crítico, alto ou médio. Uma tarefa por vez (04, depois 05); sem 06/07 e sem publicação do site. Push, PR e merge de cada tarefa, depois do commit validado, cabem à sessão raiz; a release sai uma vez, depois da 05. Passagens e critérios antigos que mandam parar antes do commit estão superados para 04/05.

**What to build:** o organizador seleciona participantes e quantidade, gera os times e revisa/compartilha os resultados em duas etapas claras de Match, preservando o trabalho ao navegar.

**Blocked by:** 04 — Players e navegação responsiva.

**Status:** implementada e verificada em 21/10/2026 (ciclos 1–13); pronta para o chat de revisão e commit. A 04 foi commitada em `04adc65` (merge `804dea5`).

## Critérios de aceitação

- [x] Confirmar comportamento/interface pública do primeiro ciclo; RED antes de cada mudança mínima, seguido de verificação independente, sem escrever todos os testes de uma vez.
- [x] Match é a área principal. Sem cadastros, orientação e Add players levam a Players; com cadastros, Select players mostra seleção inicialmente vazia ao abrir/recarregar, sem persistir a partida.
- [x] Em Select players, mostrar nome, nota e goleiro com checkbox; toda a linha permite selecionar/desmarcar sem acionamento duplo. Edit e Delete ficam em Players. Preservar Select All Players, contagem e estados habilitado/desabilitado.
- [x] Quantidade e geração vêm após a seleção, com ordem DOM e teclado coerentes. Gerar com sucesso abre Teams; impedimentos de geração mantêm o usuário no contexto correto e comunicam o problema.
- [x] Teams oferece os times em cartões, nova composição, prévia com aceitar/desfazer, trocas, cópia manual e Copy teams; manter funções e regras existentes. Times lado a lado quando couber e empilhados no celular.
- [x] Voltar à seleção ou alternar Players/Match, sem mudança real, preserva participantes, quantidade e times. Mudanças reais invalidam resultados e compartilhamento; cancelar edição/exclusão preserva. Navegar não resolve uma prévia pendente silenciosamente.
- [x] Preservar regras de tamanho, goleiros, equilíbrio e trocas, avisos, estados de decisão, fallback manual e proteção contra confirmação obsoleta de cópia. Não alterar algoritmo nem acrescentar persistência.
- [x] Conferir foco ao mudar de etapa, ao gerar, ao invalidar resultados e ao desabilitar Select All Players; mensagens e ações continuam acessíveis por teclado/toque conforme ambiente disponível.
- [x] Conferir 360/390, tablet e desktop com listas/nomes longos; nav fixa sem cobrir controles. Reexecutar regressões afetadas e registrar a origem e limitações das evidências.
- [x] Manter o formato atual do texto compartilhado nesta entrega; mudança com marcadores pertence à 06.
- [x] Atualizar registros e instruções; verificação independente concluída; terminar o ticket com o marcador `TASK05_READY_FOR_CONDITIONAL_COMMIT` para o chat de revisão e commit, conforme a regra vigente. Não iniciar 06 nem publicar automaticamente.

Referência e limites: [plano aprovado](../../../docs/plano-mobile-first.md). Usar a lógica real existente, não os atalhos da demonstração. Preservar dados/evidências e nomes literais. Interface/código/comentários/testes em inglês; registros em português.

## Seam escolhido e plano de fatias (Claude, 21/10/2026)

**Seam (já aprovado em `docs/desenvolvimento-tdd.md`, sem nova confirmação):** navegador real (Chromium via Playwright, contexto isolado e servidor local próprio), exercitado só por cliques, teclado e resultados renderizados (papéis, rótulos e textos acessíveis). Não acessa funções privadas nem o estado interno. Cobre: o que a pessoa vê e consegue fazer. Não cobre: aparelho físico, toque real, algoritmo (que continua nos scripts Node de regressão).

**Arquivo novo:** `tests/browser/match-selection-and-teams.spec.cjs` (um teste novo por ciclo). Specs existentes só mudam, pelo fluxo público, quando o novo layout exigir, preservando suas asserções de comportamento.

**Fatias verticais previstas (uma por ciclo; a ordem pode mudar se a descoberta justificar):**

1. Match sem cadastros mostra orientação e o controle **Add players**, que leva a Players (RED genuíno: o controle não existe).
2. O aplicativo abre em Match (área principal, como a prévia aprovada, que inicia em "select").
3. Select players: linha mostra nome, nota e goleiro; clicar em qualquer ponto da linha marca/desmarca uma única vez.
4. Etapas: gerar com sucesso abre Teams e esconde a seleção; **Back to selection** volta preservando seleção e quantidade.
5. Impedimentos de geração mantêm o usuário em Select players com mensagem.
6. Teams: cartões lado a lado quando couber, empilhados no celular; nova composição, trocas e cópia dentro de Teams.
7. Navegar Players/Match e voltar à seleção sem mudança real preserva tudo; mudança real invalida; navegar não resolve prévia pendente.
8. Foco ao mudar de etapa, gerar, invalidar e desabilitar Select All Players.
9. Aceitação de layout (360, 390, 768, 1280) com nomes longos, nav sem cobrir controles.

Comportamento que já existe (seleção inicial vazia, Edit/Delete só em Players, Select All Players, regras de times) entra como teste de aceitação/regressão, declarado como tal, sem RED fabricado.


## Passagem Claude → Codex

**Ciclo 1 da tarefa 05 — Match sem cadastros (RED genuíno).**

**Seam aprovado:** navegador real (Playwright/Chromium, contexto isolado), só cliques e resultados renderizados; ver "Seam escolhido e plano de fatias" neste ticket.

**Teste novo:** `tests/browser/match-selection-and-teams.spec.cjs` — `Match without registered players shows guidance and an Add players control that leads to Players`.

**Comando exato:**

```text
npx.cmd --no-install playwright test tests/browser/match-selection-and-teams.spec.cjs --project=desktop --reporter=line --trace=off
```

**RED observado (21/10/2026):** 1 falhou. `expect(locator).toBeVisible() failed`, `getByText('No players registered yet. Add players to set up a match.', { exact: true })`, `element(s) not found` (linha 10 do spec). Falha de comportamento ausente, não de preparação: o Match atual, sem cadastros, só mostra a lista vazia e controles, sem orientação nem controle para ir a Players.

**GREEN mínimo pedido:**

- Em Match, quando `players` está vazio, exibir o parágrafo exato `No players registered yet. Add players to set up a match.` e um botão `Add players` (texto exato, `type="button"`).
- Clicar em `Add players` leva a Players (reaproveitar `showArea('players')`: `aria-current="page"` em Players, Player Name visível).
- Com pelo menos um cadastro, a orientação e o botão ficam ocultos (atualizar ao adicionar/excluir cadastros, em todos os pontos que já re-renderizam a lista).

**Arquivos prováveis:** `index.html`, `script.js`; `styles.css` só se necessário para o botão seguir o padrão visual existente.

**Limites:** não mudar o algoritmo, a persistência nem o formato do texto compartilhado; não alterar Select All Players, contagem, nem esconder os demais controles de Match; não implementar as próximas fatias (abrir em Match, etapas, linha clicável). Não editar testes. Não fazer staging nem commit. Rodar o teste novo e os specs existentes afetados (`npx.cmd --no-install playwright test --project=desktop --reporter=line --trace=off`) e os quatro scripts Node (`initial-team-balance`, `manual-player-swaps`, `regenerate-teams`, `share-team-text`), e registrar `## Passagem Codex -> Claude`.

<!-- relay-draft-sha256: 7d5084609058fa7bbe9a45a13375d203752970d95c7cb59149034097dd6ae6f0 -->

## Passagem Codex -> Claude

**Ciclo 1 da tarefa 05 — GREEN mínimo: orientação para Match sem cadastros.**

**Implementação:** `index.html` contém o parágrafo exato `No players registered yet. Add players to set up a match.` e o botão `Add players` (`type="button"`), ambos inicialmente ocultos. Ao renderizar `playerSkillList`, `script.js` mostra ambos somente quando a lista de jogadores está vazia. Esse ponto de renderização é chamado na inicialização e após adicionar/editar e excluir; clicar no botão reaproveita `showArea('players')`.

**Arquivos alterados nesta passagem:** `index.html`, `script.js` e este ticket. Nenhum teste foi editado.

**Comandos exatos e resultados:**

```text
npx.cmd --no-install playwright test tests/browser/match-selection-and-teams.spec.cjs --project=desktop --reporter=line --trace=off
```

Resultado: exit 0; 1 passou.

```text
npx.cmd --no-install playwright test --project=desktop --reporter=line --trace=off
```

Resultado: exit 0; 38 passaram, 4 ignorados (42 no total).

```text
node tests/initial-team-balance.test.cjs
```

Resultado: exit 0; passou.

```text
node tests/manual-player-swaps.test.cjs
```

Resultado: exit 0; passou (458 casos ordenados e regressões descritas pelo script).

```text
node tests/regenerate-teams.test.cjs
```

Resultado: exit 0; passou (714 cenários e regressões descritas pelo script).

```text
node tests/share-team-text.test.cjs
```

Resultado: exit 0; passou.

`git diff --check` também terminou sem erros.

**Limites:** não alterados algoritmo, persistência, formato do texto compartilhado, Select All Players, contagem nem os demais controles de Match. Não foram implementadas fatias futuras. Verificação foi Playwright/Chromium desktop e scripts Node; sem aparelho físico/toque real. Há outras alterações locais preexistentes no workspace, que foram preservadas. Sem staging ou commit.


## Passagem Claude → Codex

**Verificação independente do ciclo 1 (Claude, 21/10/2026):** diff conferido (`index.html` + `script.js`, mínimo, sem mexer em algoritmo/persistência/texto compartilhado); suíte desktop reexecutada por mim: 38 aprovados, 4 ignorados, 0 falhas. Ciclo 1 aceito.

**Ciclo 2 da tarefa 05 — o aplicativo abre em Match (RED genuíno).** Match é a área principal; a prévia aprovada inicia na etapa de seleção.

**Seam aprovado:** navegador real (Playwright/Chromium), cliques e resultados renderizados.

**Teste novo:** `tests/browser/match-selection-and-teams.spec.cjs` — `the app opens on Match, the main area, with Players one tap away`.

**Comando exato:**

```text
npx.cmd --no-install playwright test tests/browser/match-selection-and-teams.spec.cjs --project=desktop --reporter=line --trace=off
```

**RED observado:** 1 falhou (o do ciclo 1 segue passando). `expect(locator).toHaveAttribute('aria-current','page')` no botão Match: recebido ausente (`null`), linha 22 do spec. Hoje a página abre em Players.

**GREEN mínimo pedido:** ao carregar, a área visível é Match, com `aria-current="page"` em Match e sem em Players; Players fica oculta (campo Player Name oculto) até clicar em Players. Basta inverter o estado inicial (`hidden`/`aria-current` no `index.html`, ou `showArea('match')` na carga); não mudar a navegação nem o comportamento de `showArea`.

**Arquivos prováveis:** `index.html` e/ou `script.js`.

**Limites:** não editar testes; se algum spec existente depender de abrir em Players sem clicar em Players, **não o altere**: liste os nomes dos que falharam na sua passagem e deixe a adaptação (pelo fluxo público, preservando asserções) comigo. Não implementar fatias futuras (etapas, linha clicável). Sem staging/commit. Rodar o spec novo, a suíte desktop inteira (`npx.cmd --no-install playwright test --project=desktop --reporter=line --trace=off`) e os quatro scripts Node; registrar `## Passagem Codex -> Claude`.

<!-- relay-draft-sha256: fb77454af1dff8693ab70832499d9e3b4ef291974f3472b8b32611e59634f1fa -->

## Passagem Codex -> Claude

**Ciclo 2 da tarefa 05 — GREEN mínimo: Match como área inicial.**

**Implementação:** `index.html` agora inicia com `matchArea` visível e `matchNavigation` com `aria-current="page"`; `playersArea` inicia oculta e `playersNavigation` sem `aria-current`. `showArea` e o comportamento da navegação não foram alterados. Nenhum teste foi editado.

**RED recebido:** o teste `the app opens on Match, the main area, with Players one tap away` falhava porque Match não tinha `aria-current="page"` e Players era a área visível.

**Comandos exatos e resultados:**

```text
npx.cmd --no-install playwright test tests/browser/match-selection-and-teams.spec.cjs --project=desktop --reporter=line --trace=off
```

Resultado: exit 0; 2 passaram (incluindo o ciclo 1 e o teste do ciclo 2).

```text
npx.cmd --no-install playwright test --project=desktop --reporter=line --trace=off
```

Resultado: exit 1; 23 passaram, 16 falharam e 4 foram ignorados (43 no total). Os 16 testes que falharam por timeout:

- `copy-teams-button.spec.cjs`: `clicking Copy teams copies the current shareable text and confirms only after success`; `clipboard rejection offers manual copying without losing the displayed teams or players`; `a pending less-balanced preview hides Copy teams and clears a previous copy status`; `Copy teams copies the currently displayed composition after undo, accept and a manual swap`; `a copy in progress does not apply a late success message after the composition changes`; `a missing clipboard API offers manual copying without losing the displayed teams or players`; `a copy in progress does not apply a late error message after the composition changes`; `confirming a manual swap after a successful copy clears the previous success message`; `an immediately applied regeneration without a pending decision clears the previous success message`; `regenerating after an invalidating selection change does not resurface the old copy confirmation`; `Copy teams copies literal HTML-looking names as plain text, without interpreting them`.
- `copy-teams-presentation.spec.cjs`: `the Copy teams button is reachable by Tab, shows a visible focus style and activates by Enter and Space`.
- `full-keyboard-order.spec.cjs`: `Tab visits registration, participants, team count/generation and sharing controls in document order, with visible focus`.
- `generate-after-participants.spec.cjs`: `positions the team count input and Generate Teams button after the participant list and before the results, in both DOM and visual order`.
- `pending-deletion.spec.cjs`: `confirming deletion during a worse preview clears the match and allows a new generation`.
- `share-keyboard.spec.cjs`: `keyboard actions and real copy and paste preserve teams after undo, accept and swap`.

Conforme o handoff, esses specs não foram alterados; a adaptação pelo fluxo público fica para Claude.

```text
node tests/initial-team-balance.test.cjs
```

Resultado: exit 0; passou (equilíbrio C1 12/20, participantes, tamanhos, avisos e texto compartilhado).

```text
node tests/manual-player-swaps.test.cjs
```

Resultado: exit 0; passou (458 casos ordenados e regressões listadas pelo script).

```text
node tests/regenerate-teams.test.cjs
```

Resultado: exit 0; passou (714 cenários e regressões listadas pelo script).

```text
node tests/share-team-text.test.cjs
```

Resultado: exit 0; passou.

```text
git diff --check
```

Resultado: exit 0; sem erros.

**Limites:** alteração deste ciclo restrita ao estado inicial em `index.html`; não alterados o algoritmo, a persistência, a navegação ou o comportamento de `showArea`. Sem staging/commit. A execução foi Playwright/Chromium desktop e scripts Node; sem aparelho físico ou toque real. O workspace contém alterações e evidências locais preexistentes, preservadas.


## Passagem Claude → Codex

**Verificação independente dos ciclos 1 e 2 (Claude, 21/10/2026):** diffs de `index.html`/`script.js` conferidos (mínimos). O ciclo 2 quebrou 6 specs antigos só porque assumiam abrir em Players; adaptei-os pelo fluxo público (um clique em Players depois de `page.goto('/')`, nos helpers/testes de `copy-teams-button`, `copy-teams-presentation`, `full-keyboard-order`, `generate-after-participants`, `pending-deletion`, `share-keyboard`), sem tocar nas asserções. Suíte desktop reexecutada por mim: 39 aprovados, 4 ignorados, 0 falhas. Ciclos 1 e 2 aceitos.

**Ciclo 3 da tarefa 05 — a linha inteira de Select players marca/desmarca (RED genuíno).**

**Seam aprovado:** navegador real (Playwright/Chromium), cliques e resultados renderizados.

**Teste novo:** `tests/browser/match-selection-and-teams.spec.cjs` — `in Select players, tapping anywhere on a row toggles that player exactly once`. Cadastra Ana (4) e Beto (5, goleiro), abre Match, confere que a linha de Beto mostra nome, nota e "Goalkeeper" (isso já existe e passa), clica na extremidade direita da linha (longe do checkbox e do texto) e espera marcado e `Selected for this match: 1 / 2`; um segundo clique desmarca (`0 / 2`), o que prova acionamento único.

**Comando exato:**

```text
npx.cmd --no-install playwright test tests/browser/match-selection-and-teams.spec.cjs --project=desktop --reporter=line --trace=off
```

**RED observado:** 1 falhou (os 2 anteriores passam). `expect(locator).toBeChecked() failed` — Expected: checked, Received: unchecked, linha 42 do spec. Hoje só o texto dentro do `<label>` aciona o checkbox; o resto da linha não.

**GREEN mínimo pedido:** em `#playerSkillList > li`, a área inteira da linha (não só o texto) marca/desmarca o checkbox, **uma única vez por clique** (sem duplo acionamento: clicar no checkbox, no texto ou no espaço vazio alterna uma vez). Preferência: fazer o `<label>` ocupar toda a largura/altura da linha por CSS (`display:block`/`flex`, padding movido da `li` para o label), o que mantém o comportamento nativo e o teclado. Evitar handler JS de clique na `li` somado ao label (causaria acionamento duplo). Manter o texto `nome - nota (Goalkeeper)` e o rótulo acessível atuais (`Ana - 4`).

**Arquivos prováveis:** `styles.css` (e `script.js` só se imprescindível).

**Limites:** não editar testes; não alterar contagem, Select All Players, invalidação de times ou algoritmo; não implementar etapas nem Back to selection. Rodar o spec novo, a suíte desktop inteira e os quatro scripts Node; registrar `## Passagem Codex -> Claude`. Sem staging/commit.

<!-- relay-draft-sha256: 71d7ee39905dd48294958083f1c65468313634c455954610e474d8c8650e98f2 -->

## Passagem Codex -> Claude

**Ciclo 3 da tarefa 05 — GREEN mínimo: a linha inteira seleciona uma única vez.**

**Implementação:** `styles.css` remove os marcadores dos itens de `#playerSkillList` e faz o `label` ocupar toda a largura da linha como flexível, com alinhamento vertical, padding e altura mínima de 44px. A ativação continua nativa pelo `label` e checkbox; nenhum handler adicional foi adicionado. Nome, nota, indicação de goleiro e rótulo acessível não foram alterados. Nenhum teste foi editado.

**RED recebido e reproduzido:** o teste `in Select players, tapping anywhere on a row toggles that player exactly once` falhou em `toBeChecked()` após o clique na extremidade direita da linha (esperado checked, recebido unchecked); os outros dois testes do spec passaram.

**Comandos exatos e resultados:**

```text
npx.cmd --no-install playwright test tests/browser/match-selection-and-teams.spec.cjs --project=desktop --reporter=line --trace=off
```

Resultado após a mudança: exit 0; 3 passaram.

```text
npx.cmd --no-install playwright test --project=desktop --reporter=line --trace=off
```

Resultado: exit 0; 40 passaram, 4 ignorados (44 no total).

```text
node tests/initial-team-balance.test.cjs
```

Resultado: exit 0; passou.

```text
node tests/manual-player-swaps.test.cjs
```

Resultado: exit 0; passou (458 casos ordenados e regressões descritas pelo script).

```text
node tests/regenerate-teams.test.cjs
```

Resultado: exit 0; passou (714 cenários e regressões descritas pelo script).

```text
node tests/share-team-text.test.cjs
```

Resultado: exit 0; passou.

```text
git diff --check
```

Resultado: exit 0; sem erros.

**Arquivos alterados nesta passagem:** `styles.css` e este ticket. Os demais arquivos alterados e evidências locais preexistentes foram preservados. Sem staging ou commit.

**Limites:** verificação Playwright/Chromium desktop e scripts Node; sem aparelho físico ou toque real. Nenhuma alteração em contagem, Select All Players, invalidação de times, algoritmo, etapas ou navegação.

## Verificação Claude do ciclo 3 e parada por decisão de produto (21/10/2026)

**Ciclo 3 aceito.** Diff conferido: só `styles.css` (label em `flex`, largura total, altura mínima 44 px) sem handler JS adicional, logo sem acionamento duplo. Reexecutei a suíte desktop: 40 aprovados, 4 ignorados, 0 falhas.

**Parada antes do ciclo 4 (etapas):** surgiu uma decisão de produto que o plano e a prévia aprovada não definem. Os critérios exigem que **Voltar à seleção preserve participantes, quantidade e times** e que cada etapa tenha sua função, mas não dizem **como a pessoa volta de Select players para o resultado preservado (Teams) sem gerar de novo**. A prévia só vai de Teams para a seleção ("Back to selection") e da seleção para Teams por "Generate Teams". Hoje, com times existentes, o botão de gerar vira "Generate another composition" e pode aplicar uma nova composição sem pedir decisão; usá-lo como caminho de volta alteraria os times em silêncio.

**Pergunta única ao usuário:** depois de **Back to selection** com os times preservados e a seleção inalterada, qual caminho leva de volta aos mesmos times sem regerar: (a) um botão extra **View teams** na etapa Select players; (b) o botão **Match** da navegação (hoje volta à última etapa vista, que seria Select players, então não serve sozinho); ou (c) outro? Recomendo (a), um botão **View teams** visível só enquanto existem times válidos.

Nenhum teste do ciclo 4 foi escrito e nenhuma passagem `→ Codex` pendente existe; o relé fica inerte até a resposta.

## Decisão do usuário (21/10/2026)

Resposta à pergunta única da parada antes do ciclo 4: depois de Back to selection, com os times preservados e a seleção inalterada, o caminho de volta aos mesmos times sem regerar é um botão **View teams** na etapa Select players, visível somente enquanto existem times válidos. Não altera os times. O botão Match da navegação mantém o comportamento atual (volta à última etapa vista). Decisão registrada pela sessão raiz; a sessão TDD segue com o ciclo 4.

## Passagem Claude → Codex

**Ciclo 4 da tarefa 05 — duas etapas: gerar abre Teams, Back to selection volta (RED genuíno).** Interface pública já aprovada (prévia e critérios); sem nova confirmação.

**Seam aprovado:** navegador real (Playwright/Chromium), cliques e resultados renderizados.

**Teste novo:** `tests/browser/match-selection-and-teams.spec.cjs` — `generating teams opens Teams and hides the selection, and Back to selection restores the selection and team count`. Cadastra 6 jogadores, usa Select All Players, define 3 times, confere o título `Select players` visível e `Teams` oculto, gera, e espera: título `Teams` visível, 3 cartões `Players Team N`, `Select players`, Select All Players, `Number of teams` e a lista de seleção ocultos. Clica `Back to selection` e espera: `Select players` visível, `Teams` oculto, `Number of teams` = 3, `Selected for this match: 6 / 6` e 6 checkboxes marcados.

**Comando exato:**

```text
npx.cmd --no-install playwright test tests/browser/match-selection-and-teams.spec.cjs --project=desktop --reporter=line --trace=off
```

**RED observado:** 1 falhou (os 3 anteriores passam). `getByRole('heading', { name: 'Select players', exact: true })` → `toBeVisible()` falhou, `element(s) not found` (linha 79 do spec). Comportamento ausente: não existem etapas nem esses títulos.

**GREEN mínimo pedido:**

- Dois grupos em Match: etapa **Select players** (título `h2` exato `Select players`; contém a lista de seleção, Select All Players, contagem, `Number of teams`, ajuda e o botão de gerar) e etapa **Teams** (título `h2` exato `Teams`; contém os cartões de times, `Back to selection` e, por ora, o que já existe de avisos/prévia/trocas/compartilhamento). Só uma etapa visível por vez (`hidden`).
- Ao abrir/recarregar a página, a etapa é Select players.
- `Generate Teams` com sucesso (times válidos renderizados) abre Teams. Impedimentos de geração e a mensagem `teamsStatus` ficam para o ciclo 5: aqui só garantir que o caminho de sucesso mude de etapa.
- `Back to selection` (botão, `type="button"`, texto exato) volta a Select players **sem apagar** participantes, quantidade nem times (`teams`, `previousTeams`, `selectedPlayers`, valor de `teamCount` ficam intactos; não chamar `clearTeamsAfterChange`).
- Manter os textos e ids existentes dos controles que os specs atuais usam; não mover o botão `Generate another composition`/prévia para Teams neste ciclo se isso quebrar specs (essa reorganização é o ciclo 6): se o botão de gerar precisar ficar visível dentro de Teams para os specs atuais passarem, deixe-o onde for mínimo e **liste** o que ficou assim na sua passagem.

**Arquivos prováveis:** `index.html`, `script.js` (e `styles.css` só se necessário).

**Limites:** não editar testes; se algum spec existente quebrar por causa da nova navegação de etapas, **não o altere**: liste os nomes dos que falharam e deixe a adaptação comigo. Não alterar algoritmo, persistência, formato do texto compartilhado, Select All Players nem a invalidação. Não implementar `View teams`, impedimentos, trocas de foco nem layout (ciclos seguintes). Sem staging/commit. Rodar o spec novo, a suíte desktop inteira (`npx.cmd --no-install playwright test --project=desktop --reporter=line --trace=off`) e os quatro scripts Node (`initial-team-balance`, `manual-player-swaps`, `regenerate-teams`, `share-team-text`); registrar `## Passagem Codex -> Claude`.

## Passagem Codex -> Claude

**Ciclo 4 da tarefa 05 — GREEN mínimo: Select players e Teams.**

**Implementação:** `index.html` agora organiza Match nas etapas `Select players` e `Teams`, com apenas uma visível por vez. A etapa Teams contém os times renderizados, avisos, prévia, trocas e compartilhamento existentes, além de `Back to selection`. Após geração bem-sucedida, `script.js` abre Teams. Voltar apenas alterna `hidden` e preserva participantes, quantidade, times e seleção. Para manter os specs existentes que acionam `#btnTeams` depois de gerar, o botão é movido para o slot de ações de Teams após a geração e volta ao slot da seleção ao retornar; essa é a única exceção de localização entre as etapas. Nenhum teste foi editado.

**RED recebido:** o novo teste falhava porque não havia títulos nem etapas Select players/Teams.

**Comandos exatos e resultados:**

```text
npx.cmd --no-install playwright test tests/browser/match-selection-and-teams.spec.cjs --project=desktop --reporter=line --trace=off
```

Resultado: exit 0; 4 passaram, incluindo o fluxo novo de gerar e voltar.

```text
npx.cmd --no-install playwright test --project=desktop --reporter=line --trace=off
```

Resultado: não concluído. A primeira execução iniciou a suíte (45 testes; a saída chegou ao teste 10 durante a janela de espera inicial). Tentativas de repetir falharam no `globalSetup` com `Error: listen EADDRINUSE: address already in use 127.0.0.1:51806`. O listener permaneceu ativo e o ambiente negou acesso à inspeção/encerramento do processo. Portanto, não há resultado final da suíte nem lista confiável de specs que possam ter falhado; nenhum spec foi alterado.

```text
node tests/initial-team-balance.test.cjs
```

Resultado: exit 0; passou (balanceamento inicial C1 12/20 e verificações indicadas pelo script).

```text
node tests/manual-player-swaps.test.cjs
```

Resultado: exit 0; passou (458 casos e regressões indicadas pelo script).

```text
node tests/regenerate-teams.test.cjs
```

Resultado: exit 0; passou (714 cenários e regressões indicadas pelo script).

```text
node tests/share-team-text.test.cjs
```

Resultado: exit 0; passou.

```text
git diff --check
```

Resultado: exit 0; sem erros.

**Limites:** não foram alterados algoritmo, persistência, formato do texto compartilhado, Select All Players ou invalidação. Sem impedimentos novos, `View teams`, ajustes de foco ou layout. Playwright/Chromium desktop; sem aparelho físico/toque real. A suíte desktop completa permanece pendente porque o servidor de testes em `127.0.0.1:51806` continuou ocupado fora do controle desta execução. Sem staging/commit.

## Passagem Claude → Codex

**Verificação independente do ciclo 4 (Claude, 21/10/2026):** diff conferido (`index.html`, `script.js`): etapas `Select players`/`Teams`, `showMatchStage`, `Back to selection` só alterna `hidden` e move `#btnTeams` entre slots, sem limpar estado. Reexecutei a suíte desktop (o servidor de testes estava livre na minha execução): com o código do Codex, 35 aprovados, 4 ignorados e **6 falhas**, todas por navegação de etapas e não por defeito: `copy-teams-button:310`, `copy-teams-presentation:51`, `full-keyboard-order:3`, `generate-after-participants:12`, `select-all-players:62` e `pending-deletion:3`. Adaptei cinco pelo fluxo público, sem tocar nas asserções de comportamento: `Back to selection` antes de mudar a seleção (`copy-teams-button`, `select-all-players`); medidas de posição de lista, quantidade e gerar tomadas na seleção e a dos resultados em Teams (`generate-after-participants`); ordem de Tab de Teams a partir de `Back to selection` (`copy-teams-presentation`); `full-keyboard-order` passa a focar `Generate another composition` por `focus()` em vez de esperar foco automático (foco ao mudar de etapa é do ciclo 8). Suíte desktop depois das adaptações: 40 aprovados, 4 ignorados, 1 falha (`pending-deletion`), que é o comportamento do ciclo 5. Ciclo 4 aceito.

Observação para o ciclo 6 (não pedir agora): o `index.html` tem um `</div>` sobrando depois de `swapControls` e um `<h2>List of Team and Players</h2>` ao lado do `Teams`; arrumar quando reorganizar Teams.

**Ciclo 5 da tarefa 05 — mudança real que invalida os times traz Match de volta a Select players (RED genuíno).** Interface pública já aprovada; sem nova confirmação.

**Teste novo:** `tests/browser/match-selection-and-teams.spec.cjs` — `a real change that invalidates the teams brings Match back to Select players with the reason visible`. Cadastra 5, seleciona todos, gera (Teams), vai a Players, exclui Ana (confirma o diálogo) e volta a Match: espera `Select players` visível, `Teams` oculto, o texto exato `Match settings or registration changed. Generate teams again.` **visível**, e `Selected for this match: 4 / 4`. Depois gera de novo, volta à seleção (a mensagem fica oculta), desmarca um jogador e espera a mesma mensagem visível na seleção.

**Comando exato:**

```text
npx.cmd --no-install playwright test tests/browser/match-selection-and-teams.spec.cjs --project=desktop --reporter=line --trace=off
```

**RED observado:** 1 falhou (os 4 anteriores passam). `getByRole('heading', { name: 'Select players', exact: true })` → `toBeVisible()`, `element(s) not found` (linha 113): depois da exclusão, Match reabre em Teams.

**GREEN mínimo pedido:**

- Quando uma mudança real invalida os times (`clearTeamsAfterChange` com times existentes: marcar/desmarcar, Select All Players que adiciona, editar/excluir/adicionar cadastro, mudar a quantidade), a etapa visível de Match passa a ser Select players (`showMatchStage('selection')`), de modo que `Match` mostre a seleção.
- A mensagem de invalidação `Match settings or registration changed. Generate teams again.` deve ficar **visível na etapa Select players** quando os times são invalidados. Texto exato, `role="status"`, em lugar da seleção (por exemplo, um status próprio da seleção ou mover `teamsStatus` conforme for mínimo). Ela some ao gerar com sucesso e não aparece quando não havia times para invalidar. Os avisos de geração de Teams (`updateTeamWarnings`) continuam em Teams.
- Se `#teamsStatus` continuar sendo o elemento usado por `pending-deletion` e `copy-teams-button` (`toHaveText` da mensagem), preserve esse id com a mensagem; liste o que mudar.

**Arquivos prováveis:** `index.html`, `script.js`.

**Limites:** não editar testes; liste os que falharem. Não implementar impedimentos de geração (ciclo 6), `View teams`, foco, layout. Não alterar algoritmo, persistência, formato do texto compartilhado. Sem staging/commit. Rodar o spec novo, a suíte desktop inteira (o servidor local pode ficar ocupado: se `EADDRINUSE`, registre; eu reexecuto) e os quatro scripts Node; registrar `## Passagem Codex -> Claude`.

## Passagem Codex -> Claude

**Ciclo 5 da tarefa 05 — GREEN mínimo: invalidar times retorna à seleção com o motivo visível.**

**Implementação:** quando `clearTeamsAfterChange` encontra times existentes, limpa os times e seus controles, coloca a mensagem exata `Match settings or registration changed. Generate teams again.` no status `role="status"` de id `teamsStatus`, move esse mesmo elemento para `Select players` e mostra essa etapa. Se não havia times, retorna sem mostrar a mensagem ou mudar de etapa. Uma geração válida limpa a mensagem e move `teamsStatus` de volta a `Teams`, onde `updateTeamWarnings` continua exibindo os avisos. O id `teamsStatus` foi preservado para os testes e scripts existentes. Nenhum teste foi editado.

**RED recebido:** o teste novo falhava porque, após excluir uma inscrição enquanto havia times, Match reabria em Teams. Reproduzido antes da implementação.

**Comandos exatos e resultados finais:**

```text
npx.cmd --no-install playwright test tests/browser/match-selection-and-teams.spec.cjs --project=desktop --reporter=line --trace=off
```

Resultado: exit 0; 5 passaram, incluindo o ciclo 5.

```text
npx.cmd --no-install playwright test --project=desktop --reporter=line --trace=off
```

Resultado: exit 0; 42 passaram, 4 ignorados (46 no total). Nenhum spec falhou.

```text
node tests/initial-team-balance.test.cjs
```

Resultado: exit 0; passou (balanceamento inicial C1 12/20, participantes, tamanhos, avisos e texto compartilhado; DOM simulado).

```text
node tests/manual-player-swaps.test.cjs
```

Resultado: exit 0; passou (458 casos ordenados e regressões; DOM simulado).

```text
node tests/regenerate-teams.test.cjs
```

Resultado: exit 0; passou (714 cenários e regressões; DOM simulado).

```text
node tests/share-team-text.test.cjs
```

Resultado: exit 0; passou.

```text
git diff --check
```

Resultado: exit 0; sem erros.

**Limites:** verificação Playwright/Chromium desktop e scripts Node; sem aparelho físico/toque real. Não foram alterados impedimentos de geração, `View teams`, foco, layout, algoritmo, persistência ou formato do texto compartilhado. Arquivos alterados nesta passagem: `index.html`, `script.js` e este ticket. Sem staging/commit.

## Passagem Claude → Codex

**Verificação independente do ciclo 5 (Claude, 21/10/2026):** diff conferido: `clearTeamsAfterChange` leva `#teamsStatus` para a etapa de seleção e chama `showMatchStage('selection')`; sem outras mudanças. Suíte desktop reexecutada por mim: 42 aprovados, 4 ignorados, 0 falhas. Ciclo 5 aceito.

**Ciclo 6 da tarefa 05 — impedimentos de geração mantêm o usuário em Select players com o motivo visível (RED genuíno).**

**Teste novo:** `tests/browser/match-selection-and-teams.spec.cjs` — `generation impediments keep the user in Select players and show the reason there`. Cadastra 5 jogadores; gerar sem seleção, com 4 selecionados e 3 times, e com quantidade 1; em cada caso espera o texto exato visível (`Select the players for this match before generating teams.`; `Select at least 2 players per team, or reduce the number of teams (minimum 2 teams).`; `Choose a whole number of teams, starting from 2.`) e que `Select players` siga visível e `Teams` oculto. Por fim, com 5 selecionados e 2 times, gera e abre Teams.

**Comando exato:**

```text
npx.cmd --no-install playwright test tests/browser/match-selection-and-teams.spec.cjs --project=desktop --reporter=line --trace=off
```

**RED observado:** 1 falhou (os 5 anteriores passam). Primeiro impedimento: `getByText('Select the players for this match before generating teams.')` resolveu `<p role="status" id="teamsStatus">` mas **oculto** (`Received: hidden`), linha 111: a mensagem é escrita em `#teamsStatus`, que está na etapa Teams.

**GREEN mínimo pedido:** os impedimentos de `generateTeams()` (nenhum selecionado, quantidade inválida, jogadores insuficientes por time, goleiros demais) escrevem a mensagem em um status **visível na etapa Select players** (mesmo texto, `role="status"`), sem trocar de etapa. Não deixar mensagem velha de impedimento ao gerar com sucesso nem ao abrir Teams. Preservar `#teamsStatus` para quem já o usa com os avisos de Teams (`updateTeamWarnings`) e para a mensagem de invalidação do ciclo 5; o mecanismo exato (status próprio da seleção ou mover o elemento, como no ciclo 5) fica ao seu critério, o mais simples. Se `Generate another composition` com times existentes cair num impedimento, o usuário está em Teams: manter a mensagem acessível em Teams (não mudar o comportamento desse caso neste ciclo).

**Arquivos prováveis:** `index.html`, `script.js`.

**Limites:** não editar testes; liste os que falharem. Não implementar `View teams`, foco, layout nem arrumar o HTML do ciclo 4. Não alterar algoritmo, persistência, formato do texto compartilhado. Sem staging/commit. Rodar o spec novo, a suíte desktop inteira e os quatro scripts Node; registrar `## Passagem Codex -> Claude`.

## Passagem Codex -> Claude

**Ciclo 6 da tarefa 05 — GREEN mínimo: impedimentos visíveis em Select players.**

**Implementação:** adicionado `#generationStatus` (`role="status"`) dentro de Select players. Os quatro impedimentos de `generateTeams()` escrevem nele enquanto Select players está visível; se a geração for acionada em Teams, continuam usando `#teamsStatus` em Teams. Ao gerar com sucesso, a mensagem própria da seleção é limpa antes de abrir Teams. `#teamsStatus` permanece no Teams para avisos e invalidação dos ciclos anteriores. Nenhum teste foi editado.

**RED recebido:** o teste novo falhava porque a mensagem do primeiro impedimento estava em `#teamsStatus`, oculto com Teams. A passagem Claude reportou 1 falha e os 5 testes anteriores passando; o RED não foi reproduzido separadamente nesta execução.

**Comandos exatos e resultados:**

```text
npx.cmd --no-install playwright test tests/browser/match-selection-and-teams.spec.cjs --project=desktop --reporter=line --trace=off
```

Resultado: exit 0; 6 passaram, incluindo o ciclo 6.

```text
npx.cmd --no-install playwright test --project=desktop --reporter=line --trace=off
```

Resultado: exit 0; 43 passaram, 4 ignorados (47 no total). Nenhum teste falhou.

```text
node tests/initial-team-balance.test.cjs
```

Resultado: exit 0; passou (balanceamento inicial, participantes, tamanhos, avisos e texto compartilhado; DOM simulado).

```text
node tests/manual-player-swaps.test.cjs
```

Resultado: exit 0; passou (458 casos ordenados e regressões do script; DOM simulado).

```text
node tests/regenerate-teams.test.cjs
```

Resultado: exit 0; passou (714 cenários e regressões do script; DOM simulado).

```text
node tests/share-team-text.test.cjs
```

Resultado: exit 0; passou.

```text
git diff --check
```

Resultado: exit 0; sem erros.

**Arquivos alterados nesta passagem:** `index.html`, `script.js` e este ticket. As demais alterações locais foram preservadas. Sem staging ou commit.

**Limites:** Playwright/Chromium desktop e scripts Node; sem aparelho físico ou toque real. Não foram alterados algoritmo, persistência, formato do texto compartilhado, layout nem navegação. `#teamsStatus` permanece responsável pelos avisos de Teams e pela mensagem de invalidação. Nenhum spec falhou.

## Passagem Claude → Codex

**Verificação independente do ciclo 6 (Claude, 21/10/2026):** diff conferido: novo `#generationStatus` na seleção para os impedimentos; `showMatchStage('teams')` o limpa; avisos de Teams seguem em `#teamsStatus`. Suíte desktop reexecutada por mim: 43 aprovados, 4 ignorados, 0 falhas. Ciclo 6 aceito.

**Ciclo 7 da tarefa 05 — View teams (decisão do usuário de 21/10/2026) (RED genuíno).** Interface já decidida pelo usuário: botão **View teams** em Select players, visível só enquanto existem times válidos, que volta aos mesmos times sem regerar.

**Teste novo:** `tests/browser/match-selection-and-teams.spec.cjs` — `View teams in Select players returns to the same preserved teams without regenerating, and only while teams exist`. Cadastra 6, seleciona todos e confere `View teams` oculto; gera, guarda o texto de `#teamsContainer` e o valor de `#shareText`; `Back to selection` e `View teams` visível; clica e espera Teams visível, Select players oculto e **exatamente os mesmos** times e texto compartilhado (sem regerar). Depois volta, desmarca um jogador (invalida) e espera `View teams` oculto.

**Comando exato:**

```text
npx.cmd --no-install playwright test tests/browser/match-selection-and-teams.spec.cjs --project=desktop --reporter=line --trace=off
```

**RED observado:** 1 falhou (os 6 anteriores passam). `getByRole('button', { name: 'View teams', exact: true })` → `toBeVisible()`, `element(s) not found`.

**GREEN mínimo pedido:**

- Botão `View teams` (`type="button"`, texto exato) na etapa Select players. Visível somente quando existem times válidos (`teams.length > 0`); oculto antes da primeira geração e depois de qualquer invalidação (`clearTeamsAfterChange`), e atualizado em todo ponto que altera `teams`.
- Clicar chama só `showMatchStage('teams')`: não gera, não chama `findAlternativeTeams`, não altera `teams`, `previousTeams`, status de prévia nem o texto compartilhado. Se houver prévia pendente (`previousTeams !== null`) a prévia continua pendente e visível em Teams (não resolver nada silenciosamente).
- O botão `Match` da navegação mantém o comportamento atual (volta à última etapa vista).

**Arquivos prováveis:** `index.html`, `script.js`.

**Limites:** não editar testes; liste os que falharem. Não implementar foco nem layout. Não alterar algoritmo, persistência, formato do texto compartilhado. Sem staging/commit. Rodar o spec novo, a suíte desktop inteira e os quatro scripts Node; registrar `## Passagem Codex -> Claude`.

## Passagem Codex -> Claude

**Ciclo 7 da tarefa 05  GREEN mínimo: View teams retorna aos times preservados.**

**Implementação:** adicionado o botão `View teams` (`type="button"`) dentro de Select players; a ação chama somente `showMatchStage('teams')`. A visibilidade reflete `teams.length`: começa oculto, aparece após geração válida e é ocultado na invalidação; também é atualizada ao abrir uma etapa e restaurar a composição anterior. A navegação não regenera equipes nem modifica times, prévia pendente ou texto compartilhado. Nenhum teste foi editado.

**RED recebido:** a passagem Claude reportou 1 falha no novo teste porque o botão `View teams` não existia; os 6 testes anteriores passavam. Não reproduzido separadamente nesta execução.

**Comandos exatos e resultados:**

```text
npx.cmd --no-install playwright test tests/browser/match-selection-and-teams.spec.cjs --project=desktop --reporter=line --trace=off
```

Resultado: exit 0; 7 passaram, incluindo o ciclo 7. Nenhum teste falhou.

```text
npx.cmd --no-install playwright test --project=desktop --reporter=line --trace=off
```

Resultado: exit 0; 44 passaram, 4 ignorados (48 no total). Nenhum teste falhou.

```text
node tests/initial-team-balance.test.cjs
```

Resultado: exit 0; passou (balanceamento inicial e verificações indicadas pelo script; DOM simulado).

```text
node tests/manual-player-swaps.test.cjs
```

Resultado: exit 0; passou (458 casos e regressões; DOM simulado).

```text
node tests/regenerate-teams.test.cjs
```

Resultado: exit 0; passou (714 cenários e regressões; DOM simulado).

```text
node tests/share-team-text.test.cjs
```

Resultado: exit 0; passou.

```text
git diff --check
```

Resultado: exit 0; sem erros.

**Limites:** Playwright/Chromium desktop e scripts Node; sem aparelho físico ou toque real. Sem staging/commit. As alterações preexistentes nos arquivos compartilhados foram preservadas.


## Passagem Claude → Codex

**Verificação independente do ciclo 7 (Claude, 21/10/2026):** diff conferido (`index.html`: botão `viewTeams` com `type="button"` e `hidden` na etapa Select players, `onclick="showMatchStage('teams')"`; `script.js`: `viewTeams.hidden = teams.length === 0` em `showMatchStage`, na geração, na invalidação e na restauração). O clique só alterna a etapa, sem gerar nem tocar em `teams`, `previousTeams` ou no texto compartilhado. Suíte desktop reexecutada por mim: 45 aprovados, 4 ignorados, 1 falha, que é o RED do ciclo 9 abaixo. O teste do ciclo 7 passa. Ciclo 7 aceito. O ciclo 8 foi aceitação de comportamento existente (navegação Players/Match sem mudança real preserva times e prévia), sem RED.

**Ciclo 9 da tarefa 05 — o foco acompanha a mudança de etapa (RED genuíno).** Interface pública já aprovada; sem nova confirmação.

**Seam aprovado:** navegador real (Playwright/Chromium), teclado e resultados renderizados (`toBeFocused`).

**Teste novo:** `tests/browser/match-selection-and-teams.spec.cjs` — `focus follows step changes: the opened step heading after generating, going back and viewing teams, and the Generate button after an impediment`. Com um impedimento (nenhum selecionado) o foco permanece em `Generate Teams` (isso já passa). Depois de gerar com sucesso, o foco deve estar no título `Teams`; depois de `Back to selection`, no título `Select players`; depois de `View teams`, de novo em `Teams`.

**Comando exato:**

```text
npx.cmd --no-install playwright test tests/browser/match-selection-and-teams.spec.cjs --project=desktop --reporter=line --trace=off
```

**RED observado (21/10/2026):** 1 falhou, 8 passaram. `expect(getByRole('heading', { name: 'Teams', exact: true })).toBeFocused()` → `Received: inactive` (linha 174 do spec), logo depois de gerar com sucesso. O trecho do impedimento (linha 169) passou.

**GREEN mínimo pedido:**

- Os títulos `#selectPlayersHeading` e `#teamsHeading` recebem `tabindex="-1"` (focáveis por código, fora da ordem de Tab).
- Quando a etapa visível **muda** por ação da pessoa, o foco vai para o título da etapa aberta: geração bem-sucedida a partir de Select players (`Teams`), `Back to selection` (`Select players`) e `View teams` (`Teams`). Um jeito mínimo: `showMatchStage` mover o foco para o título quando a etapa de destino estava oculta antes da chamada.
- **Não** mover o foco quando a etapa já era a visível (por exemplo, `Generate another composition` e outras ações dentro de Teams chamam `showMatchStage('teams')` e devem manter o foco no controle usado), nem nas chamadas a partir de `clearTeamsAfterChange`/invalidação (foco ao invalidar é o ciclo 10, não implementar agora; se o foco no título dessa chamada vier de graça, liste).
- Impedimentos de geração não mudam o foco (continua em `Generate Teams`).

**Arquivos prováveis:** `index.html`, `script.js`.

**Limites:** não editar testes; liste os que falharem. Não alterar algoritmo, persistência, formato do texto compartilhado, Select All Players nem layout. Sem staging/commit. Rodar o spec novo, a suíte desktop inteira (`npx.cmd --no-install playwright test --project=desktop --reporter=line --trace=off`) e os quatro scripts Node (`initial-team-balance`, `manual-player-swaps`, `regenerate-teams`, `share-team-text`); registrar `## Passagem Codex -> Claude`.

<!-- relay-draft-sha256: 81e3138f8c73450a3cabd7e56d697599988ef985a4613a4f229c45223b92cef2 -->


## Passagem Codex -> Claude

**Ciclo 9 da tarefa 05 — GREEN mínimo: o foco acompanha mudanças de etapa.**

**Implementação:** os títulos #selectPlayersHeading e #teamsHeading agora têm tabindex=-1. showMatchStage registra se a etapa de destino estava oculta antes de alternar a visibilidade e, só nessa transição, move o foco para o título correspondente. Assim, gerar com sucesso, Back to selection e View teams focam o destino; chamar a função para a etapa já visível preserva o foco no controle usado. clearTeamsAfterChange passa false para não adiantar o foco ao título durante a invalidação (ciclo 10). Nenhum teste foi editado.

**RED recebido:** a passagem Claude registrou 1 falha e 8 aprovações no spec; o foco estava inativo no título Teams logo após gerar com sucesso. RED não reproduzido separadamente nesta execução.

**Comandos exatos e resultados:**

```text
npx.cmd --no-install playwright test tests/browser/match-selection-and-teams.spec.cjs --project=desktop --reporter=line --trace=off
```
Resultado: exit 0; 9 passaram, incluindo foco após gerar, voltar e abrir Teams.

```text
npx.cmd --no-install playwright test --project=desktop --reporter=line --trace=off
```
Resultado: exit 0; 46 passaram, 4 ignorados (50 no total); nenhuma falha.

```text
node tests/initial-team-balance.test.cjs
```
Resultado: exit 0; passou (balanceamento inicial, participantes, tamanhos, avisos e texto compartilhado; DOM simulado).

```text
node tests/manual-player-swaps.test.cjs
```
Resultado: exit 0; passou (458 casos ordenados e regressões; DOM simulado).

```text
node tests/regenerate-teams.test.cjs
```
Resultado: exit 0; passou (714 cenários e regressões; DOM simulado).

```text
node tests/share-team-text.test.cjs
```
Resultado: exit 0; passou.

```text
git diff --check
```
Resultado: exit 0; sem erros.

**Limites:** verificação Playwright/Chromium desktop e scripts Node; sem aparelho físico/toque real. Nenhum teste falhou. Alterações desta passagem em index.html, script.js e neste ticket; alterações locais preexistentes nos dois arquivos de código foram preservadas. Sem staging ou commit.


## Passagem Claude → Codex

**Verificação independente do ciclo 9 (Claude, 21/10/2026):** diff conferido: `tabindex="-1"` nos dois títulos; `showMatchStage(stage, moveFocus = true)` foca o título só quando a etapa de destino estava oculta; `clearTeamsAfterChange` passa `false`. Suíte desktop reexecutada por mim: 46 aprovados, 4 ignorados, 0 falhas. Ciclo 9 aceito.

**Ciclo 10 (aceitação, sem RED, declarado):** foco ao invalidar. Teste `invalidating the teams keeps focus on the control the person used and never pulls it to a heading` passa sem mudança de código (checkbox e campo de quantidade mantêm o foco; ao excluir em Players e voltar por Match, o foco fica no botão Match). Ciclo 10 aceito.

**Ciclo 11 da tarefa 05 — Teams em cartões: lado a lado quando couber, empilhados no celular, título único (RED genuíno).** Interface pública já aprovada; sem nova confirmação.

**Seam aprovado:** navegador real (Playwright/Chromium), medidas de caixa renderizadas e foco.

**Teste novo:** `tests/browser/match-selection-and-teams.spec.cjs` — `Teams shows one card per team, side by side when they fit and stacked on phones, with long names and a single step heading`. Cadastra 6 jogadores (dois com nome longo sem espaços de 35 letras), 3 times, gera. Espera: foco no título `Teams`; **um único** `h2` direto em `#teamsStage`; 3 cartões em `#teamsContainer > section`; em 1280 os três na mesma linha, da esquerda para a direita; em 768 ao menos os dois primeiros na mesma linha; em 390 e 360 empilhados na mesma coluna, dentro da tela; sem rolagem horizontal em nenhuma largura.

**Comando exato:**

```text
npx.cmd --no-install playwright test tests/browser/match-selection-and-teams.spec.cjs --project=desktop --reporter=line --trace=off
```

**RED observado:** 1 falhou, 10 passaram. `expect(locator('#teamsStage > h2')).toHaveCount(1)` → Expected 1, Received 2 (linha 238): existe o `<h2>List of Team and Players</h2>` duplicado. As asserções de layout vêm depois e não rodaram; hoje `.team` é um bloco `flex` de largura total dentro de `#teamsContainer`, então os cartões empilham em 1280 e a falha deve aparecer ali assim que o título for removido. Informe nas suas verificações se a falha de layout se confirmou.

**GREEN mínimo pedido:**

- Remover o `<h2>List of Team and Players</h2>` e arrumar o HTML da etapa: apagar os `</div></section></section>` sobrando depois de `swapControls` (o markup tem fechamentos a mais), de modo que `teamsStage` e o `main`/containers fechem corretamente. Nenhum texto, id ou ordem de controles existentes muda. Nenhum spec existente usa o título removido (conferi).
- `#teamsContainer` vira uma grade de cartões: várias colunas quando couber (por exemplo `display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap`), uma coluna no celular; cada `.team` como cartão legível, coerente com os cartões escuros já usados em Players/Match (reaproveitar as variáveis/estilos existentes), sem estourar a largura com nomes longos (`overflow-wrap: anywhere` onde precisar).
- Manter os conteúdos do cartão (`Players Team N (n)`, lista, `Skill total - Team N`).

**Arquivos prováveis:** `index.html`, `styles.css`.

**Limites:** não editar testes; liste os que falharem. Não alterar `script.js` salvo imprescindível (se mudar, diga por quê), algoritmo, persistência, formato do texto compartilhado nem comportamento de foco. Não implementar ainda o desabilitar do Select All Players nem o layout da etapa Select players. Sem staging/commit. Rodar o spec novo, a suíte desktop inteira (`npx.cmd --no-install playwright test --project=desktop --reporter=line --trace=off`) e os quatro scripts Node (`initial-team-balance`, `manual-player-swaps`, `regenerate-teams`, `share-team-text`); registrar `## Passagem Codex -> Claude`.

<!-- relay-draft-sha256: 67a98f10f9df2d3638090acb562b4fd3a60a9334df2f3f4c8609761831fd5af5 -->


## Passagem Codex -> Claude

**Ciclo 11 da tarefa 05 — GREEN mínimo: Teams em cartões responsivos, com título único.**

**Implementação:** removido o título duplicado “List of Team and Players”. A estrutura fecha #container dentro de Select players e mantém fechamentos corretos para Teams e Match. #teamsContainer usa grade responsiva de cartões escuros; em telas estreitas fica em uma coluna. `.team` e o conteúdo quebram nomes longos. Os cartões mantêm “Players Team N (n)”, a lista de jogadores e “Skill total - Team N”. Nenhum teste foi editado; `script.js` não foi alterado.

**RED recebido:** Claude reportou 1 falha e 10 aprovações: `#teamsStage > h2` tinha 2 títulos em vez de 1. A falha de layout ainda não havia sido observada porque asserções de layout vinham depois dessa falha. Não reproduzi o RED antes da implementação. No GREEN, todas as asserções de layout passaram.

**Comandos exatos e resultados:**

```text
npx.cmd --no-install playwright test tests/browser/match-selection-and-teams.spec.cjs --project=desktop --reporter=line --trace=off
```
Resultado: exit 0; 11 passaram, incluindo título único, três cartões em linha em 1280, pelo menos dois em linha em 768, cartões empilhados em 390 e 360, nomes longos e ausência de rolagem horizontal.

```text
npx.cmd --no-install playwright test --project=desktop --reporter=line --trace=off
```
Resultado: exit 0; 48 passaram, 4 ignorados (52 no total). Nenhum teste falhou.

```text
node tests/initial-team-balance.test.cjs
node tests/manual-player-swaps.test.cjs
node tests/regenerate-teams.test.cjs
node tests/share-team-text.test.cjs
git diff --check
```
Resultado: todos exit 0; quatro scripts passaram (balanceamento e verificações indicadas; 458 casos de troca; 714 cenários de regeneração; texto compartilhado) e diff check sem erros.

**Arquivos desta passagem:** `index.html`, `styles.css` e este ticket. `script.js` e testes não foram alterados nesta passagem. Sem staging ou commit.

**Limites:** verificação em Playwright/Chromium desktop, com larguras de viewport simuladas, e scripts Node com DOM simulado quando indicado; sem aparelho físico ou toque real. Os quatro testes desktop ignorados permaneceram ignorados. Alterações preexistentes no workspace foram preservadas.

## Verificação Claude dos ciclos 9 a 13 e fechamento (21/10/2026)

**Ciclo 9 (foco ao mudar de etapa) — aceito.** Diff conferido: `tabindex="-1"` nos dois títulos; `showMatchStage(stage, moveFocus = true)` só foca o título quando a etapa de destino estava oculta; `clearTeamsAfterChange` passa `false`.

**Ciclo 8 (aceitação, sem RED) — registro que faltava.** Teste `switching between Players and Match without a real change keeps the teams and never resolves a pending preview`: navegar Players/Match, ou voltar à seleção e usar View teams, preserva times e prévia pendente (`Generate another composition` continua desabilitado; Undo composition funciona depois). Passa sem mudança de código.

**Ciclo 10 (aceitação, sem RED) — foco ao invalidar.** Teste `invalidating the teams keeps focus on the control the person used and never pulls it to a heading`: desmarcar por teclado e mudar a quantidade por teclado mantêm o foco no controle usado, com a mensagem de invalidação visível; ao excluir em Players e voltar por Match, o foco fica no botão Match. Passa sem mudança de código.

**Ciclo 11 (RED genuíno → GREEN do Codex) — Teams em cartões.** RED: `#teamsStage > h2` com 2 títulos. GREEN: título duplicado removido, fechamentos de HTML corrigidos, `#teamsContainer` em grade `repeat(auto-fit, minmax(220px, 1fr))` e uma coluna a partir do breakpoint de celular, cartões escuros e quebra de nomes longos. Diff de `index.html` e `styles.css` conferido; `script.js` não mudou neste ciclo. As asserções de layout (1280, 768, 390, 360, nomes longos, sem rolagem horizontal) passaram no GREEN; a falha de layout em si não foi observada isoladamente antes dele (a asserção do título falhava primeiro), limitação registrada.

**Ciclo 12 (aceitação, sem RED) — desabilitar Select All Players.** Teste `Select All Players by keyboard, even when it invalidates teams, leaves focus free and Tab reaches the first participant`: com times existentes e seleção parcial, Enter em Select All Players invalida, volta à seleção com o motivo visível, desabilita o botão e o próximo Tab cai na lista de participantes. Complementa o teste de clique de `integrated-flow.spec.cjs`. Passa sem mudança de código.

**Ciclo 13 (aceitação de layout, sem RED).** Teste `Select players and Teams fit every width with long names, and the fixed navigation never covers a focused control`: 1280, 768, 390 e 360 com nomes longos sem espaços; sem rolagem horizontal; linhas dentro da tela; Tab por todos os controles de Select players e de Teams sem nenhum sob a navegação. Três falhas iniciais eram erros do meu teste (clique em botão já desabilitado, caixa da navegação medida uma vez, medida antes da rolagem suave do Bootstrap assentar), corrigidos no próprio teste sem afrouxar a asserção. Não revelou defeito do produto.

**Execuções finais (mesma sessão, por mim):**

- `npx.cmd --no-install playwright test --project=desktop --reporter=line --trace=off`: 50 aprovados, 4 ignorados, 0 falhas (54 no total).
- `node tests/initial-team-balance.test.cjs`, `node tests/manual-player-swaps.test.cjs` (458 casos), `node tests/regenerate-teams.test.cjs` (714 cenários), `node tests/share-team-text.test.cjs`: todos passaram.
- `git diff --check`: sem erros.

**Cobertura dos critérios:** orientação e Add players (ciclo 1); abrir em Match e seleção vazia ao recarregar (ciclo 2 e `players-registration`); linha inteira e Edit/Delete só em Players (ciclo 3 e `mobile-players-navigation`); Select All Players e contagem (`select-all-players`, ciclo 12); quantidade e geração depois da seleção (`generate-after-participants`, `full-keyboard-order`); etapas e impedimentos (ciclos 4–6); View teams (ciclo 7); navegação sem mudança real, invalidação por mudança real e cancelar edição (ciclos 8, 5 e `players-registration`); regras de times, trocas, avisos, cópia e fallback manual (specs existentes adaptados só pelo fluxo público e quatro scripts Node); foco (9, 10, 12); layout 360/390/768/1280 (11 e 13); formato do texto compartilhado intacto (`share-team-text`, sem mudança em `script.js` de formatação).

**Origem e limitações das evidências:** Chromium via Playwright com viewports simulados; sem aparelho físico, sem toque real e sem leitor de tela. A mensagem de invalidação é movida entre etapas dentro de uma região `role="status"`; o anúncio real por leitor de tela não foi verificado. Os 4 testes ignorados são por desenho (projetos de largura estreita onde o spec não se aplica).

**Arquivos preexistentes não-05:** `.scratch/mobile-first-planning/issues/04-responsive-players-navigation.md` (registro do commit da 04) e `docs/agents/issue-tracker.md`, `docs/jornada-do-usuario.md`, `docs/pendencias.md`, `docs/roadmap.md`, `docs/visao-do-produto.md` (planejamento mobile first de 20/10/2026, ainda dizem "não implementado") ficam fora da lista de candidatos, conforme a regra vigente, salvo decisão em contrário no chat de revisão.

## Pronto para revisão e commit

**Arquivos candidatos ao commit (caminhos explícitos):**

- `index.html`
- `script.js`
- `styles.css`
- `tests/browser/match-selection-and-teams.spec.cjs`
- `tests/browser/copy-teams-button.spec.cjs`
- `tests/browser/copy-teams-presentation.spec.cjs`
- `tests/browser/full-keyboard-order.spec.cjs`
- `tests/browser/generate-after-participants.spec.cjs`
- `tests/browser/pending-deletion.spec.cjs`
- `tests/browser/select-all-players.spec.cjs`
- `tests/browser/share-keyboard.spec.cjs`
- `docs/tarefas.md`
- `docs/proximo-chat.md`
- `docs/README.md`
- `docs/plano-mobile-first.md`
- `.scratch/mobile-first-planning/issues/04-responsive-players-navigation.md` (registro do hash da 04)
- `.scratch/mobile-first-planning/issues/05-match-selection-and-teams.md`

Fora da lista: evidências e rascunhos em `.scratch/` (arquivos locais de automação), `.claude/codex-relay/**` e os docs preexistentes citados acima.

## Resultado da revisão e do commit — chat de revisão e commit, Claude (21/10/2026)

**Revisão:** skill instalada `ecc:code-review` (modo local), executada neste chat (`claude-sonnet-5-5`, Bash liberado). Lidos por inteiro: `index.html`, `script.js` (639 linhas), `styles.css`, `match-selection-and-teams.spec.cjs`, os sete specs adaptados (`copy-teams-button`, `copy-teams-presentation`, `full-keyboard-order`, `generate-after-participants`, `pending-deletion`, `select-all-players`, `share-keyboard`), `docs/tarefas.md`, `docs/proximo-chat.md`, `docs/README.md`, `docs/plano-mobile-first.md`, o ticket 04 (cabeçalho, trecho final e registro do hash por busca) e deste ticket o cabeçalho/critérios e o trecho final; as passagens históricas do meio não foram relidas. Buscas: sem `console.log`, `debugger`, TODO/FIXME, `eval`, credenciais; `innerHTML` só em leituras de teste; nomes de jogadores só por `textContent`/`createTextNode`. `git diff --check` limpo. Verificação do root: 150 aprovados, 12 ignorados por desenho, 0 falhas; quatro scripts Node aprovados (não reexecutados neste chat).

**Decisão: APPROVE — 0 CRITICAL, 0 HIGH, 0 MEDIUM.**

**LOW e disposição:**
1. `generateTeams` com ~60 linhas: código herdado, ampliado só para direcionar mensagens e abrir Teams. Sem ação.
2. Ordem de títulos em Select players (`h2` > `h3` "Added players" > `h3` > `h2` "Click to Generate Teams"): estrutura herdada. Sugerir na 07.
3. Sem `<main>` e `onclick` inline em `index.html`: padrão herdado. Sugerir na 07.
4. Verde `#b5ee7a` repetido em `styles.css`. Sem ação; reavaliar na 07.
5. `docs/tarefas.md` ("Próxima ação" ainda cita o chat da 04) e `docs/proximo-chat.md` (contagem intermediária 110/10 da 04, marcada como histórico): texto de continuidade desatualizado, sem efeito no produto; só o registro do ticket pode ser editado entre revisão e commit. A sessão raiz atualiza ao fechar a 05.
6. A mensagem de invalidação é movida entre etapas dentro de `role="status"`; o anúncio por leitor de tela não foi verificado (já registrado como limite acima).

**Commit:** staging apenas dos caminhos da lista acima, `git diff --cached --check`, sem `--no-verify`. O hash fica na resposta do chat e no `git log`.

TASK05_READY_FOR_CONDITIONAL_COMMIT
