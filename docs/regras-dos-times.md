# Regras dos times

## Confirmado

### Participantes e habilidade

- O organizador escolhe os participantes a partir do cadastro e informa a quantidade de times, inclusive mais de dois.
- Confirmado na continuidade: pelo menos 2 times, com pelo menos 2 participantes por time, contando goleiros.
- Cada jogador tem uma única nota inteira de 1 a 10, considerando sua função. Não há notas separadas de ataque, defesa ou velocidade.
- A nota do goleiro também entra na soma do time. Um goleiro forte pode ser combinado com jogadores de linha menos fortes.
- A diferença de quantidade entre quaisquer dois times deve ser de no máximo 1 participante, contando goleiros.
- Dentro das restrições, buscar somas de notas próximas. A medida aprovada é a diferença entre a maior e a menor soma dos times; quanto menor, melhor o equilíbrio estimado. O método inicial aprovado distribui primeiro os goleiros em times diferentes e depois os jogadores de linha por nota decrescente no time com menor soma que ainda tenha vaga. As capacidades garantem diferença máxima de 1 participante. Não há promessa de encontrar o melhor resultado matemático.

### Melhoria do equilíbrio inicial implementada por TDD

Implementada em 18/10/2026: após a distribuição inicial, examinar pares de jogadores de times diferentes e da mesma função. Aplicar a troca que mais reduz a diferença entre a maior e a menor soma, repetindo até nenhuma troca desse tipo melhorar estritamente essa medida. Empates mantêm a primeira opção encontrada. Cada passo reduz uma diferença inteira não negativa, garantindo término. Capacidades, participantes e quantidade de goleiros por time são preservados; cadastro e seleção não mudam. Não há garantia de ótimo global: movimentos entre funções, ajustes neutros intermediários e ciclos envolvendo mais de dois jogadores não são explorados nessa fase.

O caso `10, 10, 10, 1, 1`, sem goleiros, em 2 times passou de 21/11 para 12/20, diferença 8 e tamanhos 3/2, pela primeira geração. Regressão em DOM simulado escrita antes da correção, com falha observada `10 !== 8` e passagem posterior. Conferência de primeira geração C1 também aprovada no navegador durante a etapa 05. Ver ticket 05 e roteiro.

### Goleiros fixos

- Goleiro fixo é quem joga exclusivamente no gol; essa condição pertence ao cadastro, podendo ser editada.
- Cada time pode ter no máximo 1 goleiro fixo.
- Havendo tantos goleiros quanto times, distribuir 1 por time.
- Havendo menos goleiros do que times, distribuí-los em times diferentes e avisar quais times precisarão improvisar no gol. Isso não impede a geração.
- Havendo mais goleiros do que times, pedir ao organizador que reduza a seleção de goleiros antes de gerar. Não criar reserva ou revezamento automaticamente.
- Com apenas 1 goleiro fixo, alertar que a partida pode continuar desequilibrada.

### Ajustes e novas combinações

- Permitir trocar dois participantes de times diferentes, atualizando as somas.
- Trocas devem preservar a restrição de no máximo 1 goleiro por time. Foram discutidas trocas entre jogadores de linha ou entre goleiros; outros movimentos não estão confirmados.
- “Gerar novamente” deve oferecer outra composição quando possível. Apenas mudar os nomes ou a ordem dos times não representa uma composição nova.
- Uma nova geração pode piorar o equilíbrio das notas. Nesse caso, avisar o organizador e permitir aceitar a nova composição ou desfazer, recuperando os times anteriores. Preservar a composição anterior até essa escolha.
- O organizador é responsável pela avaliação final do equilíbrio. Isso não elimina as restrições de quantidade de participantes e goleiros.
- A intenção é variar a composição trocando alguns jogadores; a quantidade exata de trocas não foi definida. Não prometer resultado diferente sempre.
- Atualização ao preparar as tarefas: confirmado que a variação pode movimentar jogadores sem limite fixo de quantidade, preservando as restrições. Não é obrigatório limitar a nova geração a poucas trocas.
- Comparar a diferença entre a maior e a menor soma antes e depois da nova geração. Qualquer aumento dessa diferença exige aviso e a escolha de aceitar ou desfazer; não foi aprovada tolerância para piora silenciosa. Exemplo: somas 25, 26 e 27 têm diferença 2; somas 23, 27 e 28 têm diferença 5 e acionam o aviso.

## Exemplos e evolução da decisão

| Participantes | Times | Resultado esperado |
| --- | --- | --- |
| 8 de linha, nenhum goleiro fixo | 2 | 4 de linha por time |
| 8 de linha e 2 goleiros fixos | 2 | 4 de linha e 1 goleiro por time |
| 15 participantes | 3 | 5 participantes por time, respeitando as condições dos goleiros |
| 3 times e 2 goleiros fixos | 3 | Um goleiro em cada um de dois times; aviso para o terceiro |
| 3 times e 4 goleiros fixos selecionados | 3 | Pedir para selecionar apenas 3 goleiros antes de gerar |
| 8 de linha e 1 goleiro fixo | 2 | Times de 5 e 4 participantes; escolher a composição pelas notas |

O exemplo anterior de 3 de linha + goleiro contra 5 de linha foi superado pela regra confirmada depois: diferença de no máximo 1 participante no total.

## Aviso de tamanhos diferentes: implementado e verificado no navegador

Implementado na tarefa 01: avisar em inglês quando o total não for divisível pela quantidade de times, em vez de usar apenas paridade. Quinze participantes em 3 times não exigem esse aviso; em 2 times, sim. A geração válida não é impedida pelo aviso. Cenários comprovados em DOM simulado e no navegador, com evidências A1/A2/B5 da etapa 05.

## Estado atual

Atualização da continuidade: a quantidade de times é configurável e a geração usa somente os selecionados. O código valida pelo menos 2 times e 2 participantes por time, distribui goleiros em times diferentes, impede excesso e avisa quais times precisam improvisar no gol. As capacidades diferem no máximo em 1. Jogadores de linha entram por nota decrescente no time com vaga e menor soma. Em empate, o primeiro elegível é escolhido; as vagas extras ficam nos primeiros times.

O método inicial continua determinístico e agora inclui os ajustes estritamente melhores descritos acima. A tarefa 03 implementou novas composições com 64 distribuições completas aleatórias e enumeração de trocas simples válidas, sem garantir equilíbrio ótimo. Qualquer piora exige aceitar/desfazer, com cópia exata dos times anteriores e bloqueio de trocas/nova geração durante a escolha. As alternativas preservam capacidades e goleiros e podem movimentar qualquer quantidade de participantes. Os limites da busca estão no ticket 03; critérios essenciais verificados na etapa 05, sem prometer ausência de alternativa ou ótimo global no navegador.

Trocas manuais entre times estão implementadas na tarefa 02: linha por linha ou goleiro por goleiro, com confirmação, cancelamento e atualização das somas; verificadas na etapa 05, incluindo teclado e larguras simuladas. A comparação na regeneração usa os times atuais após trocas. O aviso específico de quantidade não divisível também foi verificado no navegador. Celular físico não testado; ver relatório final da etapa 05.
