# 01: Clarificar as aÃ§Ãµes de partilha dos times

**O que construir:** tornar claras e consistentes as trÃªs formas de partilhar os times em qualquer tamanho de ecrÃ£, mantendo a partilha do dispositivo, o atalho WhatsApp, a cÃ³pia e as suas alternativas de recuperaÃ§Ã£o.

**Bloqueado por:** Nenhum (pode comeÃ§ar imediatamente).

**Status:** done

- [x] A partilha do dispositivo tem destaque principal quando suportada; continua escondida quando o navegador nÃ£o a suporta.
- [x] WhatsApp tem estilo secundÃ¡rio nÃ£o azul padrÃ£o, abre a mensagem preparada e explica que o organizador escolhe o destinatÃ¡rio e confirma o envio.
- [x] A cÃ³pia permanece disponÃ­vel como aÃ§Ã£o secundÃ¡ria e mantÃ©m confirmaÃ§Ã£o de sucesso/falha e recuperaÃ§Ã£o por seleÃ§Ã£o manual.
- [x] A prÃ©-visualizaÃ§Ã£o tem rÃ³tulo adequado a todos os destinos, mantendo o conteÃºdo partilhado sem notas de habilidade e totais.
- [x] O comportamento, os rÃ³tulos acessÃ­veis, o foco e alvos de toque sÃ£o verificados pela interface pÃºblica em desktop, tablet e telemÃ³vel.
- [x] A versÃ£o patch e o registo de lanÃ§amento seguem o formato usado nas versÃµes anteriores.

**ReferÃªncias:** `../spec.md`; `GLOSSARY.md`; sessÃ£o de crÃ­tica Impeccable dual-agent para `index.html`.


**Evidência:** suíte Playwright completa: 192 aprovados, 12 ignorados, 0 falhas (desktop, 360 px e 390 px); quatro scripts Node aprovados; capturas verificadas em 390, 768 e 1280 px. Limitação: compartilhamento do dispositivo e handoff WhatsApp simulados no Chromium; sem envio real em aparelho.
