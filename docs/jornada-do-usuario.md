# Jornada do usuário

## Mapa da jornada e prioridades — atualizado em 19/10/2026

O uso principal é no celular, com suporte também a tablet e PC. A tarefa 01 concluiu lógica e critérios de UX (teclado/apresentação) do Copy teams; viewports simulados em Chromium não substituem aparelho físico.

| Etapa da jornada | Recursos | Estado e ordem do trabalho |
| --- | --- | --- |
| Preparar o cadastro | Cadastrar, editar, excluir e reaproveitar jogadores | Base concluída na primeira rodada |
| Confirmar participantes | Selecionar jogadores individualmente e conferir a contagem | **Select All Players** implementado no ticket 02a (20/10/2026): marca todos os cadastrados; fica desabilitado sem cadastrados ou com todos já marcados, para não apagar times à toa; reabilita ao desmarcar alguém. **Concluído** em 20/10/2026 |
| Configurar e gerar | Quantidade de times, regras de goleiros, tamanhos e equilíbrio | Lógica existente; **tarefa 02 concluída** em 20/10/2026: quantidade de times e geração ficam depois da lista de participantes e antes dos resultados, na ordem visual, DOM e de Tab |
| Rever os times | Regenerar, aceitar/desfazer e trocar jogadores | Existente; preservar nas próximas mudanças |
| Compartilhar | Copy teams e cópia manual | **Tarefa 01 concluída** em 19/10/2026 (8 ciclos de lógica + apresentação/teclado, verificados independentemente); sem lacunas de lógica pendentes, limitações registradas no ticket |
| Conferir a entrega | Validar o fluxo integrado e atualizar a documentação | Tarefa 03, após concluir 01, 02 e Select All Players; não é uma nova rodada de implementação automática |

**Próximo passo confirmado:** tarefas 01 (Copy teams) e 02 (geração após a seleção) concluídas, com fechamento registrado nos tickets. A próxima entrega da ordem aprovada é Select All Players; comportamentos/interfaces de teste serão confirmados com o usuário no início dessa entrega, ainda não iniciada.

**Ordem aprovada da segunda rodada, ampliada pelo usuário em 19/10/2026:** tarefas 01 (Copy teams), 02 (geração após a seleção) e Select All Players (ticket 02a) concluídas; próxima, tarefa 03 (validação integrada). Não iniciar outra entrega automaticamente. Tickets e passagens recentes em [tarefas](tarefas.md) são a referência para o progresso de cada entrega.

**Necessidade registrada para Select All Players:** no teste manual com 15 jogadores, o usuário precisou marcar 15 checkboxes. Um botão com esse nome em inglês deve facilitar a seleção de todos os jogadores cadastrados para a partida, permitindo depois ajustar individualmente quem participa. **Implementado em 20/10/2026 (ticket 02a):** o botão fica acima da lista de participantes. Decisão do usuário após testar: com todos já marcados o clique apagava os times sem mudar a seleção, então o botão fica desabilitado quando não há cadastrados ou todos já estão selecionados. Quando adiciona alguém à seleção, limpa os times como qualquer mudança de seleção. Não inclui botão de desmarcar todos nem persistência da seleção.

## Fluxo confirmado para a evolução

1. Cadastrar nome, nota inteira de 1 a 10 e condição de goleiro fixo.
2. Reaproveitar o cadastro salvo no navegador nas próximas partidas.
3. Editar nome, nota ou condição de goleiro quando necessário. Excluir um cadastro mediante confirmação.
4. Selecionar os jogadores que participarão da partida. Não participar não exclui o cadastro.
5. Escolher a quantidade de times e conferir os avisos e impedimentos.
6. Gerar times conforme as regras de quantidade, goleiros e equilíbrio.
7. Solicitar outra combinação quando possível ou trocar dois jogadores de times diferentes. Recalcular as somas após a troca e preservar as regras de goleiros. Se uma nova geração piorar o equilíbrio das notas, avisar e permitir aceitar ou desfazer, recuperando a composição anterior. A avaliação final do equilíbrio cabe ao organizador.
8. Exibir texto com nomes e times, sem notas individuais nem totais por padrão, para copiar e colar manualmente (seleção + Ctrl+C) ou com o botão Copy teams, com confirmação acessível só após sucesso e orientação manual em caso de falha/ausência da API.

As notas permanecem visíveis na tela do organizador. Não foi confirmado um controle para incluí-las no compartilhamento; a primeira entrega pode manter o texto sempre sem notas, sujeito à revisão final.

## Estado atual

Atualização da continuidade de 18/10/2026: HTML, CSS e JavaScript estão separados. O cadastro salva nome, nota inteira de 1 a 10 e condição de goleiro fixo no navegador, com edição e exclusão mediante confirmação. A lista permite selecionar quem joga, mostra a contagem e mantém o cadastro de quem for desmarcado. A seleção começa vazia ao abrir a página e não é salva. Editar preserva a seleção do jogador; excluir também o remove da seleção. Alterar a seleção, salvar uma edição ou confirmar uma exclusão limpa os times gerados e pede nova geração.

A geração permite escolher pelo menos 2 times, com pelo menos 2 selecionados por time. Distribui goleiros em times diferentes e jogadores de linha por nota decrescente no time com menor soma e vaga, depois faz trocas de mesma função que reduzam estritamente a diferença entre a maior e a menor soma. Garante tamanhos com diferença máxima de 1, impede excesso de goleiros e avisa faltas e tamanhos diferentes. Alterar a quantidade de times também limpa o resultado e pede nova geração.

Trocas manuais, novas composições com aceitar/desfazer e texto para compartilhar sem notas estão implementados. Os critérios essenciais das tarefas 01–05 foram concluídos com evidências Node, navegador, relatos/capturas e Playwright. Celular físico não testado; ver o resumo e o relatório final para as limitações.

A segunda rodada de 19/10/2026 foi aprovada para adicionar Copy teams e posicionar a geração após a seleção, com TDD e validação integrada. **Copy teams está concluído** (tarefa 01), com 8 ciclos de lógica e verificação de apresentação/teclado, todos verificados independentemente; ver o fechamento no ticket. A cópia manual permanece disponível. O reposicionamento da geração (tarefa 02) foi concluído em 20/10/2026; ver o fechamento no ticket 02. Ver o mapa acima e as passagens recentes do ticket 01.

## Dúvidas

Salvar a seleção da partida e ampliar as trocas manuais para goleiro por linha continuam sem aprovação. Os avisos e novas composições já foram entregues; ver [pendências](pendencias.md) para ideias adiadas e [o plano aprovado](plano-2026-10-19.md) para o próximo dia.
