# EspecificaÃ§Ã£o: hierarquia das opÃ§Ãµes de partilha

**Estado:** done

## Problema

Depois de gerar os times, o organizador vÃª trÃªs opÃ§Ãµes de partilha, mas o destaque visual e os rÃ³tulos nÃ£o explicam bem a diferenÃ§a entre elas. O link do WhatsApp parece um link comum azul e a cÃ³pia recebe o destaque verde; alÃ©m disso, â€œTeams to copyâ€ descreve apenas uma das utilizaÃ§Ãµes do texto apresentado.

## SoluÃ§Ã£o

Manter as trÃªs aÃ§Ãµes porque atendem a contextos diferentes: partilha pelo seletor do dispositivo, atalho direto para uma mensagem preparada no WhatsApp e cÃ³pia para qualquer destino. Dar destaque Ã  partilha geral quando disponÃ­vel, apresentar o WhatsApp como atalho secundÃ¡rio com aparÃªncia intencional, e manter a cÃ³pia como alternativa secundÃ¡ria. Explicar que o WhatsApp abre um rascunho para o organizador escolher o destinatÃ¡rio e enviar; chamar o texto visÃ­vel de prÃ©-visualizaÃ§Ã£o da mensagem.

## HistÃ³rias de usuÃ¡rio

1. Como organizador, quero abrir as opÃ§Ãµes nativas do meu dispositivo para partilhar a mensagem por qualquer aplicaÃ§Ã£o disponÃ­vel.
2. Como organizador que usa WhatsApp, quero abrir uma mensagem jÃ¡ preparada para escolher o destinatÃ¡rio e confirmar o envio.
3. Como organizador, quero copiar diretamente a mesma mensagem para a usar em qualquer aplicaÃ§Ã£o ou canal.
4. Como organizador, quero ver que as trÃªs aÃ§Ãµes partilham os mesmos detalhes da partida e nomes dos jogadores, sem notas de habilidade.
5. Como organizador, quero identificar a prÃ©-visualizaÃ§Ã£o da mensagem sem associÃ¡-la apenas Ã  cÃ³pia.
6. Como utilizador de telemÃ³vel, tablet ou desktop, quero controles com hierarquia clara, bom contraste, foco visÃ­vel e Ã¡reas de toque adequadas.

## DecisÃµes de implementaÃ§Ã£o

- Manter os trÃªs fluxos e a lÃ³gica existente de partilha, link WhatsApp, cÃ³pia e recuperaÃ§Ã£o manual.
- O botÃ£o nativo Ã© a aÃ§Ã£o principal quando `navigator.share` estÃ¡ disponÃ­vel; permanece oculto quando nÃ£o estÃ¡.
- O atalho WhatsApp terÃ¡ estilo secundÃ¡rio consistente com a paleta da aplicaÃ§Ã£o, sem a cor azul padrÃ£o de hiperlink.
- `Copy teams` continua disponÃ­vel com feedback de sucesso/erro, mas deixa de disputar o destaque da aÃ§Ã£o principal.
- Atualizar o texto de ajuda para distinguir a partilha nativa, o rascunho WhatsApp e a cÃ³pia; manter explÃ­cito que notas de habilidade nÃ£o sÃ£o incluÃ­das.
- Renomear o rÃ³tulo do campo para `Message preview`; a mensagem apresentada e enviada permanece igual.
- Preservar as dimensÃµes responsivas atuais e garantir alvo mÃ­nimo de 44 Ã— 44 px e foco visÃ­vel para as trÃªs aÃ§Ãµes.
- ClassificaÃ§Ã£o semÃ¢ntica: refinamento visual/copy compatÃ­vel com versÃ£o patch `1.8.1`; nÃ£o altera comportamento, algoritmo ou dados da partida.

## DecisÃµes de teste

- Usar a interface pÃºblica com Playwright, a costura jÃ¡ aprovada, em desktop, tablet e telemÃ³vel.
- Confirmar que suporte nativo mostra a aÃ§Ã£o geral e que a ausÃªncia de suporte nÃ£o afeta WhatsApp nem cÃ³pia.
- Confirmar por papÃ©is acessÃ­veis os rÃ³tulos das trÃªs aÃ§Ãµes e da prÃ©-visualizaÃ§Ã£o, sem inspecionar estado interno.
- Confirmar por estilos computados ou geometria observÃ¡vel que WhatsApp nÃ£o fica azul padrÃ£o, todas as aÃ§Ãµes tÃªm alvo mÃ­nimo de 44 px, e teclado/foco continua funcional.
- Confirmar que os links de WhatsApp e a aÃ§Ã£o de cÃ³pia continuam a usar o mesmo texto atual, incluindo detalhes opcionais e sem notas/totais.
- Reutilizar `match-details-share.spec.cjs`, `copy-teams-button.spec.cjs` e os testes de partilha por teclado.

## Fora de escopo

- Remover uma das trÃªs aÃ§Ãµes ou alterar os respetivos comportamentos.
- Alterar conteÃºdo, codificaÃ§Ã£o, seleÃ§Ã£o de destinatÃ¡rio ou envio de mensagens.
- Adicionar login, banco de dados, sincronizaÃ§Ã£o ou persistÃªncia da partida.
- Alterar algoritmo, times, cadastro de jogadores ou o formato do conteÃºdo partilhado.

## Notas adicionais

- A decisÃ£o de manter as trÃªs aÃ§Ãµes foi validada na crÃ­tica UX: a partilha nativa, o atalho WhatsApp e a cÃ³pia direta resolvem contextos diferentes, embora o WhatsApp possa tambÃ©m aparecer no seletor nativo.
- O glossÃ¡rio define Mensagem da partida como o conteÃºdo comum aos canais de partilha; nÃ£o Ã© necessÃ¡ria uma ADR, pois a hierarquia visual Ã© reversÃ­vel e nÃ£o altera os comportamentos.
- A costura de verificaÃ§Ã£o pela interface pÃºblica em Playwright, incluindo desktop/tablet/telemÃ³vel, jÃ¡ tinha sido aprovada pelo utilizador.
