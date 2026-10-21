# Tarefas e continuidade

> **Regra vigente para 04/05 (atualizada em 21/10/2026):** a regra única está em [coordenação por hooks](agents/coordenacao-por-hooks.md#regra-vigente--tarefas-04-e-05-atualizada-em-21102026) e prevalece sobre qualquer outro texto. Resumo: o Claude escreve o RED e verifica cada GREEN; o Codex implementa o mínimo e nunca faz staging nem commit. O commit de cada tarefa é feito pelo Claude num chat novo, aberto pelo Codex raiz pelo runner, logo depois do próprio `/ecc:code-review`, sem achado crítico, alto ou médio. Uma tarefa por vez (04, depois 05); sem 06/07 e sem publicação do site. Push, PR e merge de cada tarefa, depois do commit validado, cabem à sessão raiz; a release sai uma vez, depois da 05. Passagens e critérios antigos que mandam parar antes do commit estão superados para 04/05.

## Próxima rodada — mobile first (planejamento aprovado em 20/10/2026)

Entrevista e disposição da prévia aprovadas pelo usuário, incluindo a divisão abaixo. Ver [plano completo](plano-mobile-first.md). Tickets locais em `.scratch/mobile-first-planning/issues/`; mantida a numeração **04–07 escolhida nesta conversa**, sem confundir com os tickets da primeira rodada. **Estado em 21/10/2026:** a 04 foi implementada e verificada com o relé Codex ↔ Claude (ciclos 1–16); a 05–07 não foram iniciadas. A frase original “nenhuma implementação foi iniciada” descrevia somente a preparação de 20/10/2026.

| Tarefa | Entrega | Dependências | Estado |
| --- | --- | --- | --- |
| [04](../.scratch/mobile-first-planning/issues/04-responsive-players-navigation.md) | Bootstrap, identidade esportiva, navegação responsiva e Players funcional | Preparação do acionamento (concluída em 20/10/2026) | Implementada e verificada em 21/10/2026, incluindo a disposição Desktop aprovada (ciclo 16); a conferência de especificação de 21/10/2026 reabriu a 04 e foi resolvida. Aguarda o chat de revisão e commit do Claude; o hash será registrado no ticket 04 pela sessão TDD da 05 |
| [05](../.scratch/mobile-first-planning/issues/05-match-selection-and-teams.md) | Match com Select players/Teams e estados preservados | 04 | Planejada |
| [06](../.scratch/mobile-first-planning/issues/06-share-text-format.md) | Texto compartilhado com marcadores, sem notas | 05; sequência aprovada | Planejada |
| [07](../.scratch/mobile-first-planning/issues/07-integrated-responsive-validation.md) | Jornada integrada em celular/tablet/desktop e documentação | 04, 05 e 06 | Planejada |

**Próxima ação (21/10/2026):** o Codex raiz abre, pelo runner, o chat de revisão e commit do Claude para a 04 (a tentativa de 21/10/2026 terminou em erro de API, sem commit). Antes, o ticket 04 precisa terminar com o marcador `TASK04_READY_FOR_CONDITIONAL_COMMIT` depois do registro do ciclo 16. Nesse chat o Claude executa o `/ecc:code-review` e, sem achado crítico, alto ou médio, faz o commit logo em seguida; depois troca o ticket ativo para a 05. Depois do commit validado de cada tarefa, a sessão raiz faz push, PR e merge (decisão do usuário em 21/10/2026); a release `v1.4.0` sai depois da 05. Sem 06/07 nem publicação do site; depois do commit da 05, o chat cria o sentinela `disabled` e a automação termina. Ver a [regra vigente](agents/coordenacao-por-hooks.md#regra-vigente--tarefas-04-e-05-atualizada-em-21102026).

*Histórico (20/10/2026, superado):* “preparar e comprovar a passagem automática inicial de Codex para Claude” e “confirmar o primeiro comportamento/interface pública da 04” eram a próxima ação antes de programar; ambas foram cumpridas (ver evidência de preparação e os ciclos do ticket).

A regra original de encerrar cada tarefa em **“Pronto para revisão do usuário antes do commit”** continua valendo para as demais tarefas; para 04/05 foi substituída pela autorização vigente no topo. Sem staging/commit, PR, release ou publicação fora dela. Não iniciar a próxima tarefa sozinho. Preservar o site atual, cadastros, ZIPs, prévia e evidências. Os registros abaixo são de rodadas anteriores, já encerradas.

## Estado vigente em 18/10/2026

As tarefas 01 a 05 da primeira rodada estão concluídas no escopo essencial. Não reabrir seus prompts de implementação nem repetir toda a validação sem alteração ou falha que justifique. Veja o [resumo atual](proximo-chat.md), o [relatório final](../.scratch/remaining-work/evidence/2026-10-18-playwright-03/resultado.md) e o [histórico dos prompts](tarefas-01-05-historico.md).

| Tarefa da primeira rodada | Resultado | Estado |
| --- | --- | --- |
| [01](../.scratch/remaining-work/issues/01-unequal-team-size-warning.md) | Aviso de tamanhos diferentes | Concluída |
| [02](../.scratch/remaining-work/issues/02-manual-player-swaps.md) | Trocas manuais | Concluída |
| [03](../.scratch/remaining-work/issues/03-regenerate-accept-or-undo.md) | Nova composição com aceitar/desfazer | Concluída |
| [04](../.scratch/remaining-work/issues/04-share-team-text.md) | Texto para copiar sem notas | Concluída |
| [05](../.scratch/remaining-work/issues/05-validate-complete-user-journey.md) | Correção C1 e validação integrada | Concluída no escopo essencial |

Celular físico não testado; colagem verificada em editor local em outra página do navegador. Essas limitações estão registradas e não foram convertidas em testes aprovados.

## Próxima rodada: 19/10/2026

O usuário aprovou [o plano da segunda rodada](plano-2026-10-19.md). Os três tickets estão publicados em `.scratch/usability-2026-10-19/issues/`, separados da primeira rodada. Atualização em 19/10/2026: **tarefa 01 (Copy teams) concluída**, com 8 ciclos de lógica mais verificação de apresentação/teclado, todos implementados e verificados independentemente — ver o [fechamento no ticket](../.scratch/usability-2026-10-19/issues/01-copy-teams-button.md#fechamento-da-tarefa-01). Atualização em 20/10/2026: **tarefa 02 concluída** — ver o [fechamento no ticket](../.scratch/usability-2026-10-19/issues/02-generate-after-player-selection.md#fechamento-da-tarefa-02--20102026). **Tarefa 03 concluída em 20/10/2026** — ver o [fechamento no ticket](../.scratch/usability-2026-10-19/issues/03-validate-usability-round.md#fechamento-da-tarefa-03--20102026); segunda rodada encerrada. O usuário ampliou a sequência para incluir **Select All Players após a tarefa 02 e antes da tarefa 03**; **ticket 02a concluído em 20/10/2026** — ver o [fechamento no ticket](../.scratch/usability-2026-10-19/issues/02a-select-all-players.md#fechamento-do-ticket-02a--20102026). Ver o [mapa da jornada e prioridades](jornada-do-usuario.md).

| Segunda rodada | Ticket | Dependências | Estado |
| --- | --- | --- | --- |
| 01 | [Copy teams](../.scratch/usability-2026-10-19/issues/01-copy-teams-button.md) | Nenhuma nova | Concluída |
| 02 | [Gerar após conferir participantes](../.scratch/usability-2026-10-19/issues/02-generate-after-player-selection.md) | Nenhuma nova | Concluída |
| 02a | [Select All Players](../.scratch/usability-2026-10-19/issues/02a-select-all-players.md) | Depois da tarefa 02, antes da tarefa 03 | Concluída |
| 03 | [Validar a rodada e atualizar a passagem](../.scratch/usability-2026-10-19/issues/03-validate-usability-round.md) | 01, 02 e Select All Players (concluídos) | Concluída |

Antes do commit da evidência do ticket 01, revisar o [inventário de ZIPs duplicados](../.scratch/usability-2026-10-19/duplicatas-zip-inventario.md) (15 pares, ~30,2 MiB recuperáveis) e aprovar explicitamente quais arquivos remover.

Seguir a ordem aprovada: 01, 02, Select All Players e 03, um novo chat neste mesmo projeto por entrega. Sempre indicar **segunda rodada** e o arquivo completo, para não confundir com os tickets antigos. Cada chat registra resultado e atualiza o resumo antes da passagem. Status `ready-for-agent` da tarefa 03 não libera execução antes dos bloqueios concluídos.

TDD continua obrigatório: confirmar comportamento/interface a testar, observar a falha e depois implementar a mudança mínima, um comportamento por vez. Aproveitar Playwright e testes Node existentes; não instalar frameworks por padrão nem fabricar falha para testes de comportamento que já existe.

## Prompt — segunda rodada, tarefa 01

```text
Leia docs/README.md, docs/proximo-chat.md, docs/plano-2026-10-19.md, docs/desenvolvimento-tdd.md e .scratch/usability-2026-10-19/issues/01-copy-teams-button.md. Execute somente a tarefa 01 da segunda rodada: Copy teams. A primeira rodada já foi concluída. Explique em português, faça uma pergunta por vez e confirme comigo a primeira ação e os comportamentos/interfaces de teste antes de escrever novos testes ou programar. Use a skill tdd, com um teste falhando antes de cada implementação mínima, Playwright pela interface pública e regressões Node pertinentes. Código, comentários, interface e nomes de testes em inglês. Preserve os cadastros salvos e as alterações existentes. Conclua os critérios, registre evidências/limitações, atualize o status do ticket, instruções e docs/proximo-chat.md. Não inicie outra tarefa nem faça commit, PR ou release sem pedido.
```

## Prompt — segunda rodada, tarefa 02

```text
Leia docs/README.md, docs/proximo-chat.md, docs/plano-2026-10-19.md, docs/desenvolvimento-tdd.md e .scratch/usability-2026-10-19/issues/02-generate-after-player-selection.md. Execute somente a tarefa 02 da segunda rodada: posicionar configuração/geração após a seleção de participantes. A primeira rodada já foi concluída. Explique em português, faça uma pergunta por vez e confirme comigo a primeira ação e os comportamentos/interfaces de teste antes de escrever novos testes ou programar. Use a skill tdd, com falha antes da mudança, Playwright para fluxo e teclado e regressões Node pertinentes. Preserve Copy teams se já estiver entregue, os dados salvos e as alterações locais. Código, comentários, interface e nomes de testes em inglês. Conclua os critérios, registre evidências/limitações, atualize o status do ticket, instruções e docs/proximo-chat.md. Não inicie outra tarefa nem faça commit, PR ou release sem pedido.
```

## Prompt — segunda rodada, tarefa 03

```text
Leia docs/README.md, docs/proximo-chat.md, docs/plano-2026-10-19.md, docs/desenvolvimento-tdd.md e .scratch/usability-2026-10-19/issues/03-validate-usability-round.md. Execute somente a tarefa 03 da segunda rodada, após conferir que as tarefas 01 e 02 desta rodada foram concluídas. Valide a integração reaproveitando evidências suficientes, sem repetir a primeira rodada inteira. Explique em português e faça uma pergunta por vez. Use Node e Playwright pertinentes com dados isolados, teclado e viewports existentes; distinga simulação de celular físico. Para novas correções, confirme comigo comportamento/interface e siga a skill tdd, observando a falha antes de corrigir. Não fabrique red para aceitação de comportamento existente. Preserve dados e alterações locais. Ao concluir, registre evidências/limitações, atualize status, instruções, índices e docs/proximo-chat.md. Não inicie outra tarefa nem faça commit, PR ou release sem pedido.
```
