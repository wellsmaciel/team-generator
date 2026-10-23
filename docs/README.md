# Documentação do produto

**Atualização de UX aprovada (22/10/2026):** revisão prioritária aplicada e aprovada pelo usuário; inclui navegação com estado de rolagem, fundo sólido, controles e resultados mais claros. O registro de alterações e da verificação está em [ajustes de UX e interface](ajustes-ux-2026-10-22.md).

**Estado do produto (24/10/2026):** tarefas mobile first 04–07 e refinamentos de UX de 22/10 estão concluídos. A interface inclui guia inicial de três etapas, estado vazio de jogadores cadastrados, ajustes responsivos para tablets e detalhes opcionais da partida com partilha por WhatsApp. A release `v1.7.0` foi publicada; o resumo e as verificações estão no [registro da sessão](proximo-chat.md). A tarefa 04–07 continua documentada como histórico em [tarefas](tarefas.md) e [plano mobile first](plano-mobile-first.md).

**Detalhes da partida e compartilhamento (23/10/2026):** local, data e horário opcionais são incluídos antes das equipes na mensagem. Copy teams e WhatsApp compartilham o mesmo texto; o WhatsApp recebe texto preenchido para a pessoa escolher contato/grupo. A partida continua temporária e não requer conta ou backend. Veja [jornada](jornada-do-usuario.md), [arquitetura](arquitetura.md) e [resumo](proximo-chat.md).

**Refinamentos posteriores (21/10/2026):** tipografia, seleção de participantes, títulos de times e alinhamento móvel foram ajustados depois do fechamento formal. O resumo e o estado de verificação estão em [proximo-chat.md](proximo-chat.md); os detalhes do fluxo visual estão em [jornada-do-usuario.md](jornada-do-usuario.md).

**Registro da rodada anterior:** base e tarefas 01–05 da primeira rodada foram concluídas no escopo essencial. Na rodada seguinte, Copy teams (01), geração após a seleção (02), Select All Players (02a) e validação integrada (03) foram concluídos em 20/10/2026. A rodada mobile first 04–07, descrita no estado atual acima, foi concluída em 21/10/2026. Celular físico não foi testado. TDD continua obrigatório para correções e novas funcionalidades autorizadas.

- [Visão do produto](visao-do-produto.md)
- [Ajustes de UX e interface aprovados em 22/10/2026](ajustes-ux-2026-10-22.md)
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

**GitHub Pages (22/10/2026):** falha de build causada por bytes Windows-1252 no registro de UX corrigida e integrada pela PR #10; build e deploy subsequentes passaram. Detalhes e prevenção estão no [registro de ajustes de UX](ajustes-ux-2026-10-22.md).

**Guia inicial e layout para tablets (23/10/2026):** a tela inicial agora apresenta o fluxo em três etapas. Em tablet retrato, os painéis ficam empilhados; em paisagem, usam duas colunas. O registro e os limites da verificação estão no [histórico de ajustes de UX](ajustes-ux-2026-10-22.md) e na [jornada do usuário](jornada-do-usuario.md).
