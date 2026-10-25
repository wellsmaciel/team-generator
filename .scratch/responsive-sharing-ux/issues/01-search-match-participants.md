# 01: Buscar participantes pelo nome

**O que construir:** permitir localizar participantes por nome na lista longa sem perder escolhas já feitas para a partida.

**Bloqueado por:** Nenhum (pode começar imediatamente).

**Status:** done

- [x] A busca tem rótulo acessível, funciona por teclado e filtra nomes sem diferenciar maiúsculas/minúsculas.
- [x] Filtrar, limpar a busca ou não encontrar resultados não altera os cadastros, a seleção existente nem a contagem de participantes.
- [x] Select All Players mantém seu significado atual e opera sobre todos os jogadores cadastrados, não apenas os resultados filtrados.
- [x] A busca e os resultados continuam utilizáveis nas larguras celular, tablet e desktop; a lista não cria rolagem horizontal.
- [x] Teste Playwright pela interface pública cobre filtro, estado vazio, teclado e preservação da seleção.
- [x] Verificação em Chromium confirma foco visível e uso em 360 px, 390 px, tablet e desktop.

**Evidências:** `npm.cmd run test:browser -- tests/browser/search-participants.spec.cjs` (3/3 projetos passaram; o caso verificou 360, 390, 768 e 1280 px), `npm.cmd run test:browser -- tests/browser/select-all-players.spec.cjs` (9/9 passaram) e `node --check` para `script.js` e `tests/browser/search-participants.spec.cjs`. Browser automatizado Chromium; não houve teste em aparelho físico.

**Referências:** [spec](../spec.md); `GLOSSARY.md`; `tests/browser/players-registration.spec.cjs`.
