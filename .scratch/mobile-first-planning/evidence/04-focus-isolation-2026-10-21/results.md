# Ciclo 7 — isolamento do mínimo em 21/10/2026

Codex raiz executou a passagem preparada por Claude, sem sessão Claude simultânea. Teste de Claude preservado, incluindo espera de seis quadros estáveis após rolagem animada e a asserção original de controle não coberto. O RED prematuro da noite anterior permanece invalidado.

## Experimentos, uma variável por vez

1. Estado inicial (ouvinte focusin + reserva CSS): `npx.cmd --no-install playwright test mobile-players-navigation --project=narrow-360 --reporter=line --trace=off` — 7 aprovados (9,1 s). `node tests/initial-team-balance.test.cjs` — saída 1: document.addEventListener inexistente no DOM simulado.
2. Removido somente o ouvinte de script.js, mantendo CSS: `npx.cmd --no-install playwright test mobile-players-navigation --project=narrow-360 --project=narrow-390 --reporter=line --trace=off` — 14 aprovados (14,8 s). Regressão initial-team-balance voltou a passar.
3. Removida também a reserva CSS, retornando ao comportamento anterior à tentativa do ciclo 7: mesmo comando — 12 aprovados e 2 falhas (14,3 s). Após estabilização, Edit permaneceu atrás da navegação: em 360, top 770/bottom 800, atingindo button#matchNavigation; em 390, top 777/bottom 807, atingindo button#playersNavigation. Capturas preservadas em no-scroll-padding-360.png e no-scroll-padding-390.png. Este é o RED válido do comportamento, confirmado com o teste corrigido, antes de restaurar a solução CSS.
4. Restaurado somente html scroll-padding-bottom: 88px no breakpoint de telefone. Sem ouvinte JavaScript; sem alteração de testes, algoritmo, seleção ou persistência. `npx.cmd --no-install playwright test --reporter=line --trace=off` — saída 0, 81 aprovados, 6 ignorados por desenho, nenhuma falha (1,1 min), em 360/390/desktop. Cinco skips vêm da suíte anterior e um é o novo caso de foco de telefone, inaplicável ao projeto desktop.

Comandos Node separados: initial-team-balance, manual-player-swaps, regenerate-teams e share-team-text — todos saída 0 após remover o ouvinte. Respectivamente C1 12/20, 458 casos de troca, 714 cenários de regeneração e verificações de compartilhamento. São DOM/armazenamento simulados.

Conclusão dos experimentos: a reserva CSS é necessária no Chromium testado; o ouvinte JavaScript não é necessário. Não foi criado GREEN artificial para a medição prematura anterior. Claude ainda precisa verificar independentemente o resultado final. Emulação não comprova aparelho ou teclado móvel físico.
