# 03: Explicar onde os dados da partida ficam salvos

**O que construir:** manter claras, junto aos controles, as regras de armazenamento local do cadastro e a natureza temporária dos detalhes da partida.

**Bloqueado por:** Nenhum (pode começar imediatamente).

**Status:** done

- [x] O painel de jogadores sempre explica que cadastros ficam apenas neste navegador, mesmo quando a lista está preenchida.
- [x] A área de detalhes da partida explica que local, data e horário são temporários e desaparecem ao recarregar.
- [x] A informação não promete conta, sincronização, banco remoto nem recuperação de dados.
- [x] Avisos continuam legíveis e associados às áreas corretas em celular, tablet e desktop sem prejudicar os controles.
- [x] Teste Playwright confirma visibilidade dos avisos com cadastro vazio e preenchido e verifica a persistência já existente: cadastro reaparece, detalhes não.

**Evidência:** `tests/browser/storage-scope-guidance.spec.cjs` passou no Playwright Chromium em desktop, 360px e 390px; o mesmo fluxo verificou viewport tablet de 820px e ausência de rolagem horizontal nessa largura. O teste confirmou cadastro reaparecendo após recarregar e detalhes da partida vazios. Não houve teste em aparelho físico.

**Referências:** [spec](../spec.md); [arquitetura](../../../docs/arquitetura.md); [jornada do usuário](../../../docs/jornada-do-usuario.md).
