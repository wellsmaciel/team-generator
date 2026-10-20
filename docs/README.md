# Documentação do produto

Estado vigente em 20/10/2026: base e tarefas 01–05 da primeira rodada concluídas no escopo essencial. Na segunda rodada, Copy teams (tarefa 01) e a geração após a seleção de participantes (tarefa 02) foram concluídos com evidências Node e Playwright; a próxima entrega é Select All Players, depois a validação integrada (tarefa 03). Celular físico não foi testado. TDD continua obrigatório para correções e novas funcionalidades.

- [Visão do produto](visao-do-produto.md)
- [Jornada do usuário](jornada-do-usuario.md)
- [Regras dos times](regras-dos-times.md)
- [Arquitetura](arquitetura.md)
- [Roadmap por fases](roadmap.md)
- [Dúvidas abertas e ideias adiadas](pendencias.md)
- [Resumo para o próximo chat](proximo-chat.md)
- [Estado das tarefas e continuidade](tarefas.md)
- [Plano aprovado para 19/10/2026](plano-2026-10-19.md)
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
