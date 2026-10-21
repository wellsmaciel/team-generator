# Relatório de validação — tarefa 07 (21/10/2026)

**Estado: validada (revisão independente e commit registrados no ticket 07 e no `git log`).** Base: `7f057ca81b673ba9b0588e21cca1d423f3387ca1` (06 preservada, sem reescrita). Única mudança de produto: regra `footer` em `styles.css` (fundo escuro dos cartões, raio e espaçamento), feita pelo Codex após um RED genuíno. O relatório anterior (bloqueado, com as falhas originais) está preservado em `../automation-07-2026-10-21/report07-before-resumption.md`; as falhas aparecem também nos logs brutos desta pasta (`screens/run-20261021124301` e `run-20261021124309`).

## Ambiente, origem das capturas e limites

- Navegador: Chromium do Playwright 1.64.1 (`.scratch/playwright-browsers`), Windows, contexto novo e isolado por teste, dados sintéticos (Ana, Beto, Caio, Dani, Eva, Zeca e um nome de 42 caracteres), servidor local `tests/browser/server.cjs` (porta 51806). Os testes rodam em série; dois comandos de navegador simultâneos disputam a porta (`EADDRINUSE`, ocorrido numa execução do Codex e repetido em série).
- Quatro projetos de **emulação de viewport**: 360×800, 390×844, 768×1024, 1280×720, com cliques e teclado de navegador desktop. Capturas: JPEG q70 do viewport, geradas pelo próprio teste de contraste em `screens/run-<data>/` (origem: Playwright/Chromium emulado).
- **Não testados (condicionais, indisponíveis):** aparelho físico, toque real, teclado móvel, aplicativo nativo, recusa manual real de permissão da área de transferência, mecanismo de zoom do navegador. Reflow = viewport 640×512 e 320×256 CSS px (WCAG 1.4.10 para 200% e 400% de 1280×1024): **layout equivalente, não é o zoom do navegador**. Colagem em editor do navegador não é aplicativo nativo.
- Spec: `acceptance.spec.cjs` (604 linhas); config: `playwright.acceptance.config.cjs`. Sem novas dependências.

## Critérios × evidência

| Critério | Fonte / comando | Resultado | Limite |
| --- | --- | --- | --- |
| Reconciliar 04–06 | Fechamentos dos tickets lidos; lacunas: jornada encadeada nos 4 viewports, contraste em pixels reais, reflow, teclado completo | Lacunas cobertas; bateria antiga não repetida sem motivo, mas a suíte padrão foi reexecutada por causa da mudança no CSS compartilhado | — |
| Jornada pública | Teste `chained journey`: Match vazio → Add players, cadastro, editar/cancelar/excluir (diálogo recusado e aceito), seleção por linha, Select All, desmarcar, quantidade, gerar, Teams | 4 passed (4 viewports) | Sem toque real |
| Voltar/alternar, invalidação, recarga, prévia pendente | Mesmo teste | 4 passed | — |
| Composição, aceitar/desfazer, troca, texto = cartões = Copy teams | Mesmo teste; texto esperado montado dos cartões renderizados; área de transferência real lida após cada etapa | 4 passed | Colagem nativa não testada |
| API ausente/rejeitada/tardia | Reutilizado `tests/browser/copy-teams-button.spec.cjs` (dentro da suíte padrão) | Passou | Controle da fronteira da API, **não** recusa manual real |
| Teclado, foco, alcance | Teste `keyboard only` (corrigido, ver abaixo) | 4 passed | Teclado desktop; sem teclado móvel |
| Reflow | Teste `reflow` (640×512, 320×256 CSS px) | 1 passed (só no desktop, por desenho; 3 skipped nos demais projetos) | Não é zoom do navegador |
| Navegação inferior não cobre | Percurso de Tab (cobertura por `elementFromPoint`) + capturas | Passou | — |
| Contraste | Teste `contrast` | RED prévio (tablet/desktop) → GREEN (4 projetos) | Ver seção abaixo |
| Capturas inspecionadas | Execuções finais `run-20261021125717` (360), `125732` (390), `125746` (768), `125758` (1280) | Ver seção abaixo | Capturas não provam teclado/toque |
| Regressões | Suíte padrão `npx --no-install playwright test` (Codex e Claude, ambos) + 4 scripts Node | **156 passed, 12 skipped**; Node: 4 passaram | Os 12 skips são os testes por projeto já existentes (a suíte pós-06 tinha o mesmo 156/12) |

Aceitação final (config de 4 projetos), rodada por Codex e por Claude: **13 passed, 3 skipped** = 4 jornada + 4 teclado + 4 contraste + 1 reflow; os 3 skips são o reflow nos projetos de celular e tablet, que define seus próprios viewports e roda uma vez.

## Contraste: método, RED e GREEN

Método: elementos com texto visível e habilitado; texto contra o fundo resolvido. Cartões escuros (alpha ≥ 0,85): limite conservador sobre **branco** (pior caso). Texto direto na foto (rodapé antes da correção; navegação larga): com o texto oculto, captura dos pixels realmente renderizados sob a área dos glifos, texto contra o pixel **mais claro**; média e p99 são só informativas, nunca substituem o mínimo. Contorno de foco `#b5ee7a` ≥ 3:1 contra o que está atrás do controle (anel de 5 px nos controles com fundo próprio). Texto normal exige 4,5:1; grande, 3:1. O rodapé é amostrado no repouso (página rolada até o fim): a foto é fixa ao viewport e outras rolagens do rodapé não foram varridas.

**RED (antes da mudança do produto):** `npx --no-install playwright test --config …/playwright.acceptance.config.cjs -g contrast --project=tablet-768x1024 --project=desktop-1280x720` → 2 falhas. Esperado ≥ 4,5:1. Observado: 768×1024 texto do rodapé 4,04 / 4,25 / 4,37:1, LinkedIn 3,51 / 3,97:1; 1280×720 texto 4,21:1, `v1.4.0` 4,20–4,21:1, LinkedIn 3,51:1, GitHub 3,46–3,47:1. Brutos: `screens/run-20261021124301/tablet-768x1024-contrast.jsonl`, `screens/run-20261021124309/desktop-1280x720-contrast.jsonl`. Causa: a linha clara da quadra passa sob os links (captura `run-20261021124309/desktop-1280x720-6-footer.jpg`).

**Correção (Codex):** `footer { background: rgba(15, 23, 32, 0.92); border-radius: 12px; padding: 16px; margin: 12px 0; }` em `styles.css`; textos, links, versão, foto e navegação intactos. Escopo: interpretação do root da autorização e do plano existentes ("cor de destaque verde e espaçamento da prévia ajustáveis para contraste e acesso"), não uma nova aprovação atribuída ao usuário.

**GREEN (verificado por Claude, em série):** contraste passou nos 4 projetos; links do rodapé 10,75:1 (limite conservador sobre branco; `run-20261021125717/125732/125746/125758/*-contrast.jsonl`). Nenhum limiar foi reduzido.

## Foco e teclado: harness corrigido

O limiar arbitrário de 75% para controles altos foi removido de `tabThroughPage` (mascarava ~33 px fora do viewport e a mensagem ainda dizia "totalmente visível"). Agora: controles pequenos exigem visibilidade total, sem cobertura e contorno ≥ 2 px; para o controle alto `Teams to copy` o foco nativo parcial é **registrado** (anotação do teste) e o acesso ao controle inteiro precisa vir de teclas reais, sem `scrollIntoView`: Tab adiante + Shift+Tab de volta e, se ainda houver parte fora, ArrowUp/ArrowDown (a área é `readonly` e as setas rolam a página). Também: Tab real até a área, Ctrl+A e Ctrl+C reais, com a área de transferência real igual ao texto completo.

Medido (anotações): 360×800 — 100% no primeiro foco, 43% após Tab/Shift+Tab, inteira após 5 setas; 390×844 — 100%, 50%, inteira após 4 setas; **768×1024 — 89% no primeiro foco** (topo 743, base 1057, viewport 1024, ~33 px fora, sem sobreposição fixa), inteira após Tab/Shift+Tab; 1280×720 — 100% e inteira após Tab/Shift+Tab. Todo o conteúdo é alcançável por teclado: não há defeito de produto de acesso. Diagnósticos: `diagnose-textarea-keyboard.cjs` (só imprime) e `diagnose-focus.cjs` (anterior).

## Inspeção visual (execuções finais, imagens vistas por Claude)

- 360×800 (`run-20261021125717`): `phone-360x800-6-footer.jpg` (rodapé em cartão escuro, texto e links legíveis, navegação inferior fixa sem cobrir), `phone-360x800-2-select-players.jpg` (lista, nome longo quebra, caixa verde, sem estouro), `phone-360x800-3-teams-pending.jpg` (decisão da prévia, cartões, nome longo quebrando).
- 390×844 (`run-20261021125732`): `phone-390x844-6-footer.jpg`.
- 768×1024 (`run-20261021125746`): `tablet-768x1024-6-footer.jpg` (texto de cópia, troca, rodapé em cartão), `tablet-768x1024-2-select-players.jpg` (duas colunas, nome longo sem estouro).
- 1280×720 (`run-20261021125758`): `desktop-1280x720-6-footer.jpg`, `desktop-1280x720-3-teams-pending.jpg`.
- Anterior à correção (RED): `run-20261021124309/desktop-1280x720-6-footer.jpg`. Execuções anteriores permanecem preservadas.
- Observação cosmética herdada (não bloqueante): com nome longo, o "Skill total" dos dois cartões não alinha no tablet.

## Limitações finais (não são testes aprovados)

Aparelho físico, toque real, teclado móvel, app nativo, recusa manual real da área de transferência e zoom real do navegador **não foram executados**. A medição de contraste cobre texto e contorno de foco, não bordas de campos nem rolagens intermediárias do rodapé.
