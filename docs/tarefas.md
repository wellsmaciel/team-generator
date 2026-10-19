# Tarefas e continuidade

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

O usuário aprovou [o plano da segunda rodada](plano-2026-10-19.md). Os três tickets estão publicados em `.scratch/usability-2026-10-19/issues/`, separados da primeira rodada. Atualização em 19/10/2026: **tarefa 01 (Copy teams) concluída**, com 8 ciclos de lógica mais verificação de apresentação/teclado, todos implementados e verificados independentemente — ver o [fechamento no ticket](../.scratch/usability-2026-10-19/issues/01-copy-teams-button.md#fechamento-da-tarefa-01). Tarefas 02 e 03 ainda não iniciadas nesta continuidade. O usuário ampliou a sequência para incluir **Select All Players após a tarefa 02 e antes da tarefa 03**; ticket próprio e comportamentos/interfaces ainda serão preparados e confirmados antes de implementar. Ver o [mapa da jornada e prioridades](jornada-do-usuario.md).

| Segunda rodada | Ticket | Dependências | Estado |
| --- | --- | --- | --- |
| 01 | [Copy teams](../.scratch/usability-2026-10-19/issues/01-copy-teams-button.md) | Nenhuma nova | Concluída |
| 02 | [Gerar após conferir participantes](../.scratch/usability-2026-10-19/issues/02-generate-after-player-selection.md) | Nenhuma nova | Próxima entrega |
| Nova entrega, ticket a preparar | Select All Players | Depois da tarefa 02, antes da tarefa 03 | Não iniciada |
| 03 | [Validar a rodada e atualizar a passagem](../.scratch/usability-2026-10-19/issues/03-validate-usability-round.md) | 01, 02 e Select All Players | Não iniciada |

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
