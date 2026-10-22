# Documentação do produto

**Estado atual (21/10/2026):** rodada mobile first, tarefas 04–07. A **tarefa 04 está implementada e verificada** (Bootstrap local, navegação Players/Match, workspace de Players em celular e em largura maior, nomes longos, foco, dados preservados), incluindo o ciclo 16, que entregou a disposição Desktop aprovada (roster à esquerda, formulário à direita). Está commitada (`04adc65`, merge `804dea5`). A **tarefa 05** (Match em duas etapas, Select players e Teams) está concluída (`9f8ae63`, merge `5ded6c5`), e a release `v1.4.0` fecha as duas. A **tarefa 06** (texto compartilhado com marcadores `• `) está concluída e commitada em `7f057ca`. A **tarefa 07** (validação integrada em 360×800, 390×844, 768×1024 e 1280×720, em Chromium emulado) está validada e commitada em `e63a27f` em 21/10/2026, com uma correção mínima de contraste do rodapé; resultados, limites e revisão independente estão no [ticket 07](../.scratch/mobile-first-planning/issues/07-integrated-responsive-validation.md) e no relatório da validação, sem aparelho físico, toque, teclado móvel nem zoom real do navegador testados. Ver [plano mobile first](plano-mobile-first.md), [índice de tarefas](tarefas.md) e [resumo para o próximo chat](proximo-chat.md). *Histórico:* o planejamento aprovado em 20/10/2026 (Bootstrap, disposição da prévia, divisão 04–07) está preservado no plano. A segunda rodada abaixo permanece encerrada.

**Refinamentos posteriores (21/10/2026):** tipografia, seleção de participantes, títulos de times e alinhamento móvel foram ajustados depois do fechamento formal. O resumo e o estado de verificação estão em [proximo-chat.md](proximo-chat.md); os detalhes do fluxo visual estão em [jornada-do-usuario.md](jornada-do-usuario.md).

**Registro da rodada anterior:** base e tarefas 01–05 da primeira rodada foram concluídas no escopo essencial. Na rodada seguinte, Copy teams (01), geração após a seleção (02), Select All Players (02a) e validação integrada (03) foram concluídos em 20/10/2026. A rodada mobile first 04–07, descrita no estado atual acima, foi concluída em 21/10/2026. Celular físico não foi testado. TDD continua obrigatório para correções e novas funcionalidades autorizadas.

- [Visão do produto](visao-do-produto.md)
- [Jornada do usuário](jornada-do-usuario.md)
- [Regras dos times](regras-dos-times.md)
- [Arquitetura](arquitetura.md)
- [Roadmap por fases](roadmap.md)
- [Dúvidas abertas e ideias adiadas](pendencias.md)
- [Resumo para o próximo chat](proximo-chat.md)
- [Estado das tarefas e continuidade](tarefas.md)
- [Plano aprovado para 19/10/2026](plano-2026-10-19.md)
- [Plano mobile first aprovado — tarefas 04–07](plano-mobile-first.md)
- [Histórico dos prompts da primeira rodada](tarefas-01-05-historico.md)
- [Roteiro manual revisado da etapa 05](testes-manuais-etapa-05.md)
- [TDD para correções e novas funcionalidades](desenvolvimento-tdd.md)
- [Destino das tarefas em Markdown](agents/issue-tracker.md)
- [Política de gestão de arquivos (Claude e Codex)](agents/gestao-de-arquivos.md)
- [Coordenação entre Codex e Claude por hooks](agents/coordenacao-por-hooks.md)
- [Glossário](../GLOSSARY.md)

## Como interpretar

**Confirmado** significa aceito pelo usuário na entrevista. **Proposta** significa recomendação ainda sujeita a confirmação. **Estado atual** descreve o código, e não o produto desejado. As dúvidas estão centralizadas em `pendencias.md`.

O usuário confirmou as decisões e a primeira rodada de cinco tarefas, já encerrada, e aprovou a segunda rodada de três tarefas. Cada novo chat recebe uma tarefa específica e confirma a primeira ação/comportamentos de teste antes de programar; isso não autoriza implementar todas de uma vez. Sugestões antigas fora desses tickets não viram requisitos por aparecerem nos documentos.
