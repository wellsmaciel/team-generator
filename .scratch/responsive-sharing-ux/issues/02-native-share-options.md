# 02: Partilhar times pelas opções nativas do dispositivo

**O que construir:** oferecer a folha nativa de partilha quando o navegador a disponibiliza, mantendo WhatsApp, Copy teams e cópia manual.

**Bloqueado por:** Nenhum (pode começar imediatamente).

**Status:** done

- [x] Quando suportada, a ação nativa abre a folha por interação direta da pessoa e recebe o título e o texto atual da partida.
- [x] A mensagem da folha nativa é idêntica ao texto de Copy teams e ao conteúdo de texto codificado no link do WhatsApp.
- [x] Quando a folha nativa não existe, a ação não aparece e os outros caminhos de partilha permanecem disponíveis.
- [x] Cancelar a folha não mostra sucesso nem abre WhatsApp automaticamente; falha ao abrir mostra orientação para WhatsApp/cópia.
- [x] A ação tem rótulo acessível, foco visível e dimensionamento responsivo em celular, tablet e desktop.
- [x] Teste Playwright simula suporte, cancelamento e erro do navegador sem chamar serviços externos ou enviar mensagens.
- [x] Testes existentes confirmam que o link `wa.me`, Copy teams e a seleção manual preservam a mensagem e as regras de privacidade atuais.

**Evidências:**

- Testes Playwright públicos em `tests/browser/match-details-share.spec.cjs` simulam suporte nativo, texto/título atuais, cancelamento, falha e ausência de suporte. Resultado: 9/9 aprovados em Chromium desktop, 360px e 390px.
- Regressão desktop de `match-details-share.spec.cjs` e `copy-teams-button.spec.cjs`: 16/16 aprovados, incluindo `wa.me`, `Copy teams`, conteúdo sem notas e cópia manual.
- Sem teste físico em aparelho; o seletor nativo foi simulado no navegador e nenhuma mensagem foi enviada.

**Referências:** [spec](../spec.md); [jornada do usuário](../../../docs/jornada-do-usuario.md); `tests/browser/match-details-share.spec.cjs` e `tests/browser/copy-teams-button.spec.cjs`.
