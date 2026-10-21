# Revisão ecc:code-review — tarefa 04 (21/10/2026)

**Ferramenta:** Skill instalada `ecc:code-review`, modo local (alterações não commitadas). Revisor: Claude, na mesma sessão que preparou os testes; a verificação de execução é independente do Codex, que implementou. Sem chamada a GitHub nem publicação.

**Escopo lido por completo:** `index.html`, `script.js` (diff e `renderPlayers`), `styles.css`, `tests/browser/server.cjs` (diff), os dois specs novos e os diffs dos specs adaptados; diffs de `docs/` e `package`-sem-mudança confirmados. Bootstrap `vendor/bootstrap-5.3.3/` verificado por `cmp` e cabeçalho (v5.3.3, MIT) em registro anterior.

## Achados

### CRITICAL
Nenhum. Nomes de jogadores entram por `textContent`/`createTextNode`; `aria-label` via `setAttribute`; nenhum `innerHTML` novo. Nenhum segredo, caminho dinâmico ou dependência nova. A rota nova de `server.cjs` é uma entrada exata em lista fechada.

### HIGH
Nenhum.

### MEDIUM
1. **Estado da documentação desatualizado** (`docs/tarefas.md` mostrava a 04 "Planejada" e o ticket dizia `planned`). **Corrigido nesta rodada** (ver ticket e `docs/tarefas.md`). Sem pendência.

### LOW (consultivos; sem ação nesta entrega)
1. Os dois testes de contraste repetem a fórmula de luminância WCAG dentro de `page.evaluate`. É duplicação aceitável: cada bloco roda no navegador e a fórmula é literal de propósito, para não reproduzir o CSS.
2. Alguns testes de navegador passam de 50 linhas por causa de percursos. Aceitável para especificações de comportamento.
3. A hierarquia de títulos de Match (`h2` aninhado antes de `h3`) é anterior a esta entrega; a 05 reestrutura Match.
4. `showArea` e os botões usam `onclick` inline, coerente com o padrão atual do projeto. Sem mudança.
5. Em tablet e desktop, os campos de Add player seguem estreitos e centralizados; a prévia aprovada só define o celular.
6. Fim de linha: Git avisa LF→CRLF em três documentos; comportamento preexistente do repositório, sem alteração de conteúdo.

**Nenhum `console.log`, TODO, FIXME ou `debugger` nos arquivos de produto e de teste.**

## Validação

| Verificação | Resultado |
| --- | --- |
| Suíte de navegador completa (desktop, 360, 390) | 109 aprovados, 8 ignorados por desenho, 0 falhas |
| `initial-team-balance` | aprovado |
| `manual-player-swaps` (458 casos) | aprovado |
| `regenerate-teams` (714 cenários) | aprovado |
| `share-team-text` | aprovado |
| Typecheck/lint/build | não existem no projeto; ignorados |

## Decisão

**APPROVE** (somente consultivos LOW; MEDIUM corrigido). Sem achados pendentes bloqueantes.

## Lista explícita de arquivos revisados e candidatos

**Produto (revisados em conteúdo):** `index.html`, `script.js`, `styles.css`, `vendor/bootstrap-5.3.3/bootstrap.min.css`, `vendor/bootstrap-5.3.3/LICENSE`.

**Testes (revisados):** novos `tests/browser/mobile-players-navigation.spec.cjs` e `tests/browser/players-registration.spec.cjs`; adaptados `tests/browser/copy-teams-button.spec.cjs`, `copy-teams-presentation.spec.cjs`, `full-keyboard-order.spec.cjs`, `generate-after-participants.spec.cjs`, `integrated-flow.spec.cjs`, `pending-deletion.spec.cjs`, `select-all-players.spec.cjs`, `server.cjs`, `share-keyboard.spec.cjs`.

**Documentação original da 04 (escrita nesta entrega):** `.scratch/mobile-first-planning/issues/04-responsive-players-navigation.md`; evidências em `.scratch/mobile-first-planning/evidence/04-visual-2026-10-21/` e `.../04-focus-isolation-2026-10-21/`; atualização de estado em `docs/tarefas.md`.

**Documentação PREEXISTENTE à automação (plano aprovado, capturada em `evidence/automation-2026-10-20/preexisting-docs.patch` e `preexisting-status.txt`, não é trabalho da 04):** `docs/README.md`, `docs/agents/coordenacao-por-hooks.md`, `docs/agents/issue-tracker.md`, `docs/jornada-do-usuario.md`, `docs/pendencias.md`, `docs/proximo-chat.md`, `docs/roadmap.md`, `docs/tarefas.md` (que agora também tem a atualização de estado da 04), `docs/visao-do-produto.md`, `docs/plano-mobile-first.md` (novo). A inclusão desse grupo no commit é decisão do passo de commit; foram lidos, não alterados por esta revisão, exceto `docs/tarefas.md`.

**EXCLUIR dos candidatos:** `.scratch/bootstrap-5.3.3-download/` (cache de download), `.scratch/ecc-runtime/` (dependências de execução), `.scratch/playwright-results/` e logs de execução em `.claude/codex-relay/logs/`. Os demais itens de `.scratch/mobile-first-planning/` (prévia, imagens, `issues/05–07`, `evidence/automation-2026-10-20/`) são de planejamento/automação: a seleção fica para o passo de commit; não foram revisados como código de produto.
