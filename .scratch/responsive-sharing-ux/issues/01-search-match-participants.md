# 01: Buscar participantes pelo nome

**O que construir:** permitir localizar participantes por nome na lista longa sem perder escolhas já feitas para a partida.

**Bloqueado por:** Nenhum (pode começar imediatamente).

**Status:** ready-for-agent

- [ ] A busca tem rótulo acessível, funciona por teclado e filtra nomes sem diferenciar maiúsculas/minúsculas.
- [ ] Filtrar, limpar a busca ou não encontrar resultados não altera os cadastros, a seleção existente nem a contagem de participantes.
- [ ] Select All Players mantém seu significado atual e opera sobre todos os jogadores cadastrados, não apenas os resultados filtrados.
- [ ] A busca e os resultados continuam utilizáveis nas larguras celular, tablet e desktop; a lista não cria rolagem horizontal.
- [ ] Teste Playwright pela interface pública cobre filtro, estado vazio, teclado e preservação da seleção.
- [ ] Verificação em Chromium confirma foco visível e uso em 360 px, 390 px, tablet e desktop.

**Referências:** [spec](../spec.md); `GLOSSARY.md`; `tests/browser/players-registration.spec.cjs`.
