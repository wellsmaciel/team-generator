# Revisão final — `ecc:code-review` (modo local), tarefa 04

**Data:** 21/10/2026. **Skill:** `ecc:code-review` instalada, executada DEPOIS das últimas mudanças de código (ciclo 16 + teste de aceitação de tablet 768) e da atualização da documentação de continuidade. **Fase 1:** `git diff --name-only HEAD` (21 arquivos rastreados) mais os arquivos novos não rastreados. **Fase 2:** cada arquivo de aplicação/suporte/spec lido por inteiro, incluindo `script.js` completo (607 linhas, não só `renderPlayers`/diff) e os dois specs novos.

`code-review.md` (mesma pasta) permanece como evidência HISTÓRICA. Sua nota LOW 5 ("a prévia só define o celular; tablet/desktop são consultivos") **estava errada**: a prévia aprovada tem variante Desktop (`.tg-columns` = grade `minmax(0,1.5fr) minmax(0,1fr)`, roster à esquerda e formulário à direita no mesmo topo). Isso não é limitação de ambiente nem nota consultiva: era uma disposição aprovada que faltava. Foi corrigida pelo ciclo 16 (ver abaixo). O MEDIUM daquele relatório (documentação desatualizada) também reapareceu e foi tratado de novo nesta rodada.

## Decisão: APPROVE

0 CRITICAL, 0 HIGH, 0 MEDIUM abertos. Os achados abaixo foram corrigidos ou têm disposição explícita; nenhum está pendente.

## Achados desta rodada e disposição

| # | Sev. | Local | Achado | Disposição |
|---|---|---|---|---|
| 1 | HIGH (especificação, já resolvido) | `styles.css` | Players empilhava roster e formulário em tablet/desktop e campos ficavam estreitos, contra a disposição Desktop aprovada | **Corrigido** (ciclo 16, RED observado antes): `@media (min-width: 768px)` com `#playersArea:not([hidden])` em grade 1,5fr/1fr, `align-items: start`, `gap: 20px`; campos e botão a 100% do painel (≥ 44 px); roster em coluna única. A exclusão `:not([hidden])` preserva a navegação por `hidden`. Phone inalterado |
| 2 | MEDIUM (testes, resolvido) | `mobile-players-navigation.spec.cjs` | Dois testes nossos codificavam premissas erradas: lista visualmente ACIMA do formulário em qualquer largura (ciclo 11) e várias colunas também em Players (ciclo 5) | **Corrigido, não removido**: ordem DOM lista→formulário em todas as larguras (`compareDocumentPosition`), "acima" só no celular; várias colunas só nos participantes de Match; coluna única do roster verificada no teste novo do workspace. Contraste/opacidade, nomes literais, toque, foco e overflow mantidos. Registrado nos comentários do spec e na passagem do ticket como erro nosso, não requisito do usuário |
| 3 | MEDIUM (cobertura, resolvido) | specs | O critério de aceitação do ticket pedia tablet com teclado/foco e nomes longos, mas só havia navegação superior testada a 1280 | **Adicionado** guarda de aceitação a 768×1024 (barra no topo, alternância, sem cobrir conteúdo, sem overflow, Tab: Edit/Delete das linhas antes de `pName`→`pSkill`→checkbox→`btnPs`, com nome longo). É emulação de viewport, **não aparelho físico**; passou de primeira por ser guarda de regressão, não RED |
| 4 | MEDIUM (docs, resolvido) | `docs/README.md`, `proximo-chat.md`, `tarefas.md`, `plano-mobile-first.md`, `agents/coordenacao-por-hooks.md` | Ainda apresentavam "implementação não iniciada / configurar hooks" como próxima ação | **Corrigido**: estado atual de 21/10/2026 no topo; texto de 20/10/2026 rotulado "Histórico" e preservado; proveniência preexistente (`preexisting-docs.patch`/`preexisting-status.txt`) citada. Contador real do relé registrado |
| 5 | LOW | `script.js` `generateTeams` (53 linhas) e `renderPlayers` (ramos por `id`) | Função > 50 linhas e ramificação por id de lista | **Sem ação, por mérito**: `generateTeams` não foi tocada pela 04 (código herdado, coberto por 714 + 458 casos Node); refatorar na 04 ampliaria o diff sem requisito. `renderPlayers` só ganhou um ramo (`registeredPlayerList`) em vez de misturar o antigo bloco Edit/Delete no ramo de seleção; a reorganização de Match é a 05 |
| 6 | LOW | `styles.css` | Verde de referência `#b5ee7a` repetido (nav, botão primário, links, foco, accent) | **Sem ação, por mérito**: variável CSS seria só refatoração; os testes fixam o valor computado, e a mudança custaria um ciclo do relé sem requisito. Reavaliar na 07 |
| 7 | LOW | `tests/browser/players-registration.spec.cjs:38` | Altura de toque ≥ 24 px é fraca | **Sem ação**: é o piso de tablet/desktop; o requisito de ≥ 44 px do celular é afirmado nos testes dos ciclos 12/13 |
| 8 | LOW | `copy-teams-button.spec.cjs` | Preparação (cadastrar + selecionar) repetida em vários testes | **Sem ação**: estilo herdado do HEAD; a 04 só trocou a navegação; helpers pertencem a uma limpeza de testes fora do escopo |
| 9 | LOW | `tests/browser/server.cjs:18-21` | Indentação do callback inconsistente | **Sem ação**: já existia no HEAD, fora do diff da 04 |
| 10 | LOW | `index.html` | Sem landmark `<main>` e handlers inline `onclick` (herdado) | **Sem ação**: não requisito da 04; inline handlers são o padrão herdado do projeto. Sugerir na 07 |

Verificações da skill: sem credenciais, sem SQL, sem XSS (nomes só via `textContent`, comprovado com `<b>Zé</b> & "Co"`), sem `console.log`, sem TODO/FIXME, sem emoji, sem dependência nova (Bootstrap local, licença incluída), nenhum arquivo > 800 linhas, aninhamento ≤ 4. `script.js` tem 18 linhas novas (área ativa, render do roster); lógica de times e dados preservados.

## Validação (Fase 4) — após o último código/spec

| Verificação | Resultado |
|---|---|
| Suíte Playwright completa (`playwright test --reporter=dot --trace=off`), rodada antes de acrescentar o guarda de tablet 768 | 110 aprovados, 10 ignorados por desenho, 0 falhas, 1,3 min |
| Guarda de tablet 768 (teste novo, rodado isolado) | 1 aprovado |
| `node tests/initial-team-balance.test.cjs` | aprovado |
| `node tests/manual-player-swaps.test.cjs` | aprovado (458 casos) |
| `node tests/regenerate-teams.test.cjs` | aprovado (714 cenários) |
| `node tests/share-team-text.test.cjs` | aprovado |
| Captura `final-layout-responsive` 360/390/768/1280 (script Playwright) | sem rolagem horizontal; navegação inferior 60 px/botões 44 px no celular; superior 30 px em 768/1280; imagens LIDAS |
| Build/lint/typecheck | não existem no projeto (app estático) |

**Suíte completa final, com o guarda de 768 incluído (última execução, após todas as mudanças): 111 aprovados, 12 ignorados por desenho, 0 falhas (1,3 min).** Os quatro scripts Node foram executados depois do último código de produto (ciclo 16) e o guarda de 768 só acrescentou um spec, sem tocar produto.

## Comparação visual (imagens lidas)

- **1280 vs variante Desktop da prévia:** roster à esquerda e Add player à direita, mesmo topo, linhas em coluna única com divisórias e Edit/Delete à direita, campos e botão verde ocupando o painel. Cumprido.
- **768:** mesmas duas colunas proporcionais; nome longo quebra dentro do roster sem empurrar botões; sem overflow.
- **360/390 vs prévia de celular:** roster antes do formulário em cartões separados; linhas e campos largos; barra inferior verde na área atual. Cumprido.
- **Diferenças visuais restantes em relação à prévia (não estruturais, fora dos critérios aprovados do `findings.md`):** cabeçalho de página com marca "Match Day / Team Generator" e título "Players" com subtítulo; títulos de cartão alinhados à esquerda (o produto os centraliza); campos escuros (o produto usa campos brancos padrão); subtexto "Skill N" sob o nome (o produto mostra "Nome - N"). Registradas como diferenças de acabamento para a raiz decidir; não foram tratadas como bloqueio porque os critérios apontados (painéis lado a lado, ordem DOM, empilhamento no celular, campos/botão a largura do painel) estão cumpridos.

## Limitações honestas

Emulação de viewport por Playwright/Chromium, **sem aparelho físico** e sem teclado virtual real; capturas de página inteira mostram o rodapé claro sobre branco no celular por artefato do fundo fixo; Match permanece intermediário (a divisão em etapas é a 05).

## Lista explícita de arquivos candidatos (nada em staging)

**Trabalho da 04:** `index.html`, `script.js`, `styles.css`, `vendor/bootstrap-5.3.3/bootstrap.min.css`, `vendor/bootstrap-5.3.3/LICENSE`; specs `tests/browser/mobile-players-navigation.spec.cjs` e `players-registration.spec.cjs` (novos) e alterados `copy-teams-button`, `copy-teams-presentation`, `full-keyboard-order`, `generate-after-participants`, `integrated-flow`, `pending-deletion`, `select-all-players`, `share-keyboard` e `server.cjs`; ticket 04 e `evidence/04-*` (inclui este relatório e `desktop-review/`).

**Documentação preexistente/planejamento (aprovada antes da automação; base em `evidence/automation-2026-10-20/preexisting-docs.patch` e `preexisting-status.txt`), agora também atualizada com o estado de 21/10/2026:** `docs/README.md`, `docs/proximo-chat.md`, `docs/tarefas.md`, `docs/plano-mobile-first.md` (novo, não rastreado), `docs/agents/coordenacao-por-hooks.md`, `docs/agents/issue-tracker.md`, `docs/jornada-do-usuario.md`, `docs/pendencias.md`, `docs/roadmap.md`, `docs/visao-do-produto.md`. A inclusão no commit é decisão do passo de commit.

**Excluir:** `.scratch/bootstrap-5.3.3-download/`, `.scratch/ecc-runtime/`, `.scratch/playwright-results/`, `.scratch/playwright-report/`, `.claude/codex-relay/logs/`.

## Contagem do relé

Contador real: 19 (18 + o handoff do ciclo 16); o teto interno de 24 é um backstop contra falta de progresso, não um orçamento. Capturas não incrementam.
