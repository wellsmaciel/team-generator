# Histórico dos prompts e estados parciais — tarefas 01 a 05

Este arquivo preserva o índice anterior sem apagar seus registros. As instruções para retomar etapas abertas abaixo são históricas e foram substituídas pelo fechamento. Estado vigente: tickets 01–05 concluídos no escopo essencial; veja [o índice atual](tarefas.md) e [o resumo](proximo-chat.md). Não executar estes prompts automaticamente.

> **Estado final em 18/10/2026:** tickets 01–05 concluídos. [Relatório final](../.scratch/remaining-work/evidence/2026-10-18-playwright-03/resultado.md). Preservar evidências e limitações; não retomar automaticamente os prompts históricos abaixo. Nenhuma nova funcionalidade autorizada. Celular físico não testado.

> Estado vigente após acesso ao servidor em 18/10/2026: A1 preservado; A2/A3/A5/A6/B1/B4/B5/C1 aprovados no navegador. Ticket 01 concluído. Etapa 05 aberta pelas lacunas descritas no registro final; próximos passos anteriores são históricos.

Divisão aprovada em 18/10/2026, produzida com a skill `to-tickets`. As tarefas 01 a 04 estão implementadas, com conferência no navegador pendente; a tarefa 05 está em validação parcial, com relatos registrados. Não reimplementar 01 a 04.

| Tarefa | Entrega | Dependências |
| --- | --- | --- |
| [01](../.scratch/remaining-work/issues/01-unequal-team-size-warning.md) | Aviso de tamanhos diferentes | Nenhuma |
| [02](../.scratch/remaining-work/issues/02-manual-player-swaps.md) | Trocas manuais | Nenhuma |
| [03](../.scratch/remaining-work/issues/03-regenerate-accept-or-undo.md) | Nova composição com aceitar/desfazer | Nenhuma |
| [04](../.scratch/remaining-work/issues/04-share-team-text.md) | Texto para copiar sem notas | Nenhuma |
| [05](../.scratch/remaining-work/issues/05-validate-complete-user-journey.md) | Validação integrada no navegador e celular | Implementações 01 a 04 já disponíveis; fechar evidências pendentes junto da validação |

Continuidade: seguir o [roteiro manual revisado](testes-manuais-etapa-05.md), que distingue evidências existentes e pendências. Resultados da etapa 05 podem concluir também os critérios de navegador dos tickets anteriores, sem testes duplicados. Usar [TDD a partir de agora](desenvolvimento-tdd.md), inclusive nas correções desta etapa.

## Como usar

Para continuar agora, use o prompt atualizado da tarefa 05 neste mesmo projeto. Os prompts de implementação 01 a 04 abaixo são históricos: seus recursos já existem. A tarefa 05 exige essas implementações, mas não o fechamento prévio das conferências que ela mesma ajudará a concluir. Preservar alterações locais, não executar mudanças simultâneas no mesmo diretório e não repetir evidências já suficientes.

O próximo agente deve confirmar a primeira ação antes de programar e então concluir a tarefa autorizada inteira. Ao terminar, deve atualizar os critérios e o status do ticket, registrar verificações/limitações e atualizar o resumo de continuidade. Nenhum chat depende de ter acesso à conversa anterior; os arquivos são a referência de passagem.

## Chat da tarefa 01

```text
Leia docs/README.md, docs/proximo-chat.md, docs/regras-dos-times.md, docs/pendencias.md e .scratch/remaining-work/issues/01-unequal-team-size-warning.md. Confira o código atual e implemente somente a tarefa 01 inteira, com verificações dos critérios. Explique em português, faça uma pergunta por vez e confirme comigo a primeira ação antes de programar. Código, comentários e interface devem ficar em inglês. Preserve alterações existentes e cadastros salvos. Ao terminar, registre evidências e limitações no ticket, atualize seu status e docs/proximo-chat.md. Não inicie outra tarefa nem faça commit ou publicação sem pedido.
```

## Chat da tarefa 02

```text
Leia docs/README.md, docs/proximo-chat.md, docs/regras-dos-times.md, docs/pendencias.md e .scratch/remaining-work/issues/02-manual-player-swaps.md. Confira o código atual e implemente somente a tarefa 02 inteira, com verificações dos critérios. Explique em português, faça uma pergunta por vez e confirme comigo a primeira ação antes de programar. Código, comentários e interface devem ficar em inglês. Preserve recursos existentes, alterações locais e cadastros salvos. Ao terminar, registre evidências e limitações no ticket, atualize seu status e docs/proximo-chat.md. Não inicie outra tarefa nem faça commit ou publicação sem pedido.
```

## Chat da tarefa 03

```text
Leia docs/README.md, docs/proximo-chat.md, docs/regras-dos-times.md, docs/pendencias.md e .scratch/remaining-work/issues/03-regenerate-accept-or-undo.md. Confira o código atual e implemente somente a tarefa 03 inteira, com verificações dos critérios. A variação não tem limite fixo de jogadores movimentados; preserve as restrições e exija aceitar/desfazer para qualquer piora na diferença entre a maior e a menor soma. Explique em português, faça uma pergunta por vez e confirme comigo a primeira ação antes de programar. Código, comentários e interface devem ficar em inglês. Preserve recursos existentes, alterações locais e cadastros salvos. Ao terminar, registre evidências e limites da busca no ticket, atualize seu status e docs/proximo-chat.md. Não inicie outra tarefa nem faça commit ou publicação sem pedido.
```

## Chat da tarefa 04

```text
Leia docs/README.md, docs/proximo-chat.md, docs/regras-dos-times.md, docs/pendencias.md e .scratch/remaining-work/issues/04-share-team-text.md. Confira o código atual e implemente somente a tarefa 04 inteira, com verificações dos critérios. O texto deve permitir copiar manualmente os times sem notas individuais nem totais. Explique em português, faça uma pergunta por vez e confirme comigo a primeira ação antes de programar. Código, comentários e interface devem ficar em inglês. Preserve recursos existentes, alterações locais e cadastros salvos. Ao terminar, registre evidências e limitações no ticket, atualize seu status e docs/proximo-chat.md. Não inicie outra tarefa nem faça commit ou publicação sem pedido.
```

## Chat da tarefa 05

Escopo adicional implementado por TDD em 18/10/2026: primeira geração do caso `10, 10, 10, 1, 1` em 2 times passou de diferença 10 (21/11) para 8 (12/20). Regressão em DOM simulado passou; conferência C1 no navegador pendente por indisponibilidade de acesso. Os critérios e evidências estão no ticket 05 e no roteiro. Esta correção não está entre os ajustes de interface adiados.

```text
Leia docs/README.md, docs/proximo-chat.md, docs/testes-manuais-etapa-05.md, docs/desenvolvimento-tdd.md, docs/regras-dos-times.md, docs/pendencias.md e .scratch/remaining-work/issues/05-validate-complete-user-journey.md. As implementações 01 a 04 já existem: valide suas pendências junto da etapa 05 e aproveite as mesmas evidências para fechar os tickets, sem repetir testes já comprovados. Continue pelas verificações que faltam, começando por A1. Não transforme o encerramento dos tickets anteriores em bloqueio para executar estes testes. A partir de agora, use a skill tdd em correções e novas funcionalidades autorizadas: confirme comigo o comportamento e a interface pública a testar antes de escrever testes, observe a falha primeiro e só depois implemente a correção mínima. Não inicie os ajustes adiados nem novas funcionalidades. Distinga simulação, navegador real e celular físico; não afirme verificações não executadas. Explique em português e faça uma pergunta por vez. Código, comentários e interface em inglês. Preserve alterações e cadastros salvos. Ao terminar, registre evidências/limitações, atualize critérios/status dos tickets conforme comprovado, instruções de uso e docs/proximo-chat.md. Sem commit, publicação ou contato com terceiros sem pedido.
```
