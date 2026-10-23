# Dúvidas abertas e ideias adiadas

**Estado atual — 23/10/2026:** as tarefas 04–07 e a rodada de UX foram concluídas. Local/data/horário opcionais para a partida atual e compartilhamento via WhatsApp também foram implementados; veja o [resumo](proximo-chat.md). As demais pendências e ideias abaixo continuam sem aprovação ou implementação, exceto quando o texto registra explicitamente uma entrega concluída.

## Registro histórico — estado após o fechamento da etapa 05

Atualizado em 18/10/2026: implementação e critérios essenciais dos tickets 01 a 05 concluídos. As evidências combinam testes Node/DOM simulado, navegador integrado, capturas/relatos do usuário e seis testes Playwright em desktop e larguras 360/390. Consulte o [relatório final](../.scratch/remaining-work/evidence/2026-10-18-playwright-03/resultado.md) e o [roteiro](testes-manuais-etapa-05.md) para a origem de cada aprovação.

Limitações de validação registradas separadamente: B9 não executado por falta de celular físico; toque e teclado móvel não comprovados. A colagem passou em editor local em outra página do navegador, sem teste em aplicativo nativo como Bloco de Notas ou Word. Essas limitações não foram marcadas como testes aprovados e não reabrem os critérios essenciais concluídos.

## Decisões confirmadas e limites do escopo

1. **Algoritmo inicial — implementado e verificado:** distribuir primeiro os goleiros em times diferentes e depois os demais por nota decrescente, priorizando a menor soma entre os times com vaga. As capacidades diferem no máximo em 1 participante; vagas extras ficam nos primeiros times e empates favorecem o primeiro elegível. Depois, aplicar a melhor troca entre jogadores da mesma função que reduza estritamente a diferença entre maior/menor soma, até nenhuma troca desse tipo melhorar. Não há garantia de ótimo global. C1 foi corrigido por TDD e conferido no navegador.
2. **Gerar novamente — implementado e verificado:** alternativa menos equilibrada exige aviso e aceitar/desfazer. Qualquer aumento na diferença entre a maior e a menor soma identifica piora. Não há limite fixo de participantes movimentados nem histórico geral. A tarefa 03 usa 64 distribuições completas e enumeração de trocas simples válidas, sem garantia de ótimo global. Critérios de navegador concluídos na etapa 05; ausência de alternativa e piora de um ponto permanecem identificadas como cobertura controlada dos testes simulados.
3. **Aviso de quantidade — implementado e verificado:** o aviso aparece quando o total não é divisível pela quantidade de times, preservando os avisos de goleiros. A1/A2/B5 comprovaram os tamanhos e avisos no navegador, incluindo 15/3, 15/2 e 10/3. Ticket 01 concluído.
4. **Limites — resolvido:** confirmado na continuidade: pelo menos 2 times e pelo menos 2 participantes por time, contando goleiros. Assim, são necessários ao menos 4 selecionados; o máximo de times é a parte inteira da quantidade de selecionados dividida por 2.
5. **Alterações após gerar — resolvido:** confirmado na continuidade: ao salvar uma edição, confirmar a exclusão de jogador, marcar/desmarcar participantes ou mudar a quantidade de times, limpar os times gerados e pedir nova geração. Cancelar a edição ou a exclusão mantém os times.
6. **Continuidade da partida:** a seleção, os detalhes e os times da partida atual são temporários e reiniciam ao recarregar. Persistir ou salvar partidas para uso futuro ainda não foi aprovado.
7. **Trocas com goleiro:** estão confirmadas trocas entre jogadores de linha e entre goleiros. Permitir transferir um goleiro para um time sem goleiro, compensando a troca por alguém da linha, não foi discutido nem aprovado.
8. **Exibição no compartilhamento:** omissão das notas por padrão está confirmada; um botão para incluí-las não está confirmado.
9. **Tarefas e verificações — concluídas no escopo essencial:** tickets 01 a 05 concluídos com reaproveitamento das evidências, sem bateria duplicada. Regressões Node preservadas e reexecutadas. Playwright instalado como dependência de desenvolvimento por autorização explícita do usuário; seis testes de aceitação passaram. Isso não autoriza outras instalações por padrão. TDD continua obrigatório para novas correções e funcionalidades autorizadas; ver [procedimento](desenvolvimento-tdd.md). Os testes adicionados para comportamento existente não são um novo ciclo TDD.

## Correção concluída na etapa 05 — equilíbrio inicial

C1 implementado por TDD: a regressão falhou com diferença 10 antes da alteração e passou com diferença 8 depois. A primeira geração com cinco jogadores de linha de notas `10, 10, 10, 1, 1` agora produz somas 12/20, tamanhos 3/2 e todos os selecionados uma vez. A conferência no navegador também passou, sem regenerar ou trocar manualmente para obter o resultado. Evidências no ticket 05 e no roteiro. Essa correção está concluída e não exige ótimo global.

## Ajustes de interface apontados no teste manual — resolver depois

Atualização: o usuário aprovou esses dois ajustes na segunda rodada de 19/10/2026, descrita no [plano da segunda rodada](plano-2026-10-19.md). **Copy teams concluído em 19/10/2026** (tarefa 01); **reposicionamento de Generate Teams concluído em 20/10/2026** (tarefa 02). Os parágrafos abaixo preservam a origem como ideias inicialmente adiadas; não reabrir entregas concluídas.

Em 18/10/2026, o usuário testou manualmente a tarefa 04 em navegador real e confirmou a exibição e a cópia/colagem do texto dos times sem notas ou totais. Apontou:

- Adicionar um botão Copy teams para facilitar a cópia, especialmente no celular.
- Avaliar mover Generate Teams para depois da lista de jogadores marcados para jogar, pois atualmente aparece antes dela.

Na origem, o usuário pediu somente registrar e resolver depois. Os ajustes foram aprovados e entregues na segunda rodada. O compartilhamento e seus critérios essenciais anteriores foram concluídos no ticket 04 da primeira rodada; esses registros não reabrem entregas antigas.

## Melhoria solicitada em 19/10/2026 — seleção em lote

**Select All Players:** registrado a pedido do usuário no [mapa da jornada](jornada-do-usuario.md), após um teste manual em que precisou marcar individualmente os 15 jogadores. Entregue no ticket 02a em 20/10/2026: seleciona todos e permite ajustes individuais, ficando desabilitado sem cadastrados ou com todos selecionados. Validado na tarefa 03. Preservar esse comportamento na nova interface; não inclui desmarcar todos ou persistência da seleção.

## Adiado para além da primeira versão

- Regras próprias de outros esportes: futsal é a referência inicial.
- Avaliação por vários atributos: foi escolhida uma nota única.
- Compartilhar como imagem: foi escolhido texto para copiar e colar.
- Login, sincronização entre aparelhos, backend e banco externo: armazenamento local atende à necessidade inicial.

Esses adiamentos não significam compromisso de implementação futura.

## Ideias sem aprovação

Backup por exportação/importação, histórico de partidas, nomes personalizados de times, reservas e revezamento automático não fazem parte do escopo confirmado. O compartilhamento básico pelo WhatsApp já foi implementado; integrações além do link de mensagem pré-preenchida não foram aprovadas. Algumas ideias nem foram propostas na entrevista; não tratá-las como pedidos do usuário.

## Confirmação antes do plano final

As tarefas anteriores estão encerradas. Persistência da partida, trocas mistas e opção de compartilhar notas continuam sem aprovação. Não reabrir decisões confirmadas sem um conflito concreto.
