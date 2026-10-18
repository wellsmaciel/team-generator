# Jornada do usuário

## Fluxo confirmado para a evolução

1. Cadastrar nome, nota inteira de 1 a 10 e condição de goleiro fixo.
2. Reaproveitar o cadastro salvo no navegador nas próximas partidas.
3. Editar nome, nota ou condição de goleiro quando necessário. Excluir um cadastro mediante confirmação.
4. Selecionar os jogadores que participarão da partida. Não participar não exclui o cadastro.
5. Escolher a quantidade de times e conferir os avisos e impedimentos.
6. Gerar times conforme as regras de quantidade, goleiros e equilíbrio.
7. Solicitar outra combinação quando possível ou trocar dois jogadores de times diferentes. Recalcular as somas após a troca e preservar as regras de goleiros. Se uma nova geração piorar o equilíbrio das notas, avisar e permitir aceitar ou desfazer, recuperando a composição anterior. A avaliação final do equilíbrio cabe ao organizador.
8. Exibir texto com nomes e times, sem notas individuais nem totais por padrão, para copiar e colar manualmente, por exemplo no WhatsApp.

As notas permanecem visíveis na tela do organizador. Não foi confirmado um controle para incluí-las no compartilhamento; a primeira entrega pode manter o texto sempre sem notas, sujeito à revisão final.

## Estado atual

Atualização da continuidade de 18/10/2026: HTML, CSS e JavaScript estão separados. O cadastro salva nome, nota inteira de 1 a 10 e condição de goleiro fixo no navegador, com edição e exclusão mediante confirmação. A lista permite selecionar quem joga, mostra a contagem e mantém o cadastro de quem for desmarcado. A seleção começa vazia ao abrir a página e não é salva. Editar preserva a seleção do jogador; excluir também o remove da seleção. Alterar a seleção, salvar uma edição ou confirmar uma exclusão limpa os times gerados e pede nova geração.

A geração permite escolher pelo menos 2 times, com pelo menos 2 selecionados por time. Usa o método inicial aprovado de goleiros em times diferentes e jogadores de linha por nota decrescente no time com menor soma e vaga. Garante tamanhos com diferença máxima de 1, impede excesso de goleiros e informa faltas. Alterar a quantidade de times também limpa o resultado e pede nova geração. Não há combinações alternativas, trocas nem conteúdo próprio para compartilhar. As verificações realizadas nesta continuidade usaram página e armazenamento simulados; falta conferir no navegador real.

## Dúvidas

Salvar a seleção da partida e ampliar as trocas para goleiro por linha continuam sem aprovação. O aviso de quantidade não divisível e a ausência de limite fixo de jogadores movimentados em novas composições foram confirmados; suas implementações estão nos tickets. Ver [pendências](pendencias.md).
