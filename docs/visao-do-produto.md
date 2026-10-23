# Visão do produto

## Confirmado

Atender quem organiza partidas e precisa montar times com habilidades próximas. O futsal é a referência inicial; regras específicas de outros esportes não fazem parte do escopo confirmado.

O organizador reaproveita nomes e notas dos jogadores, seleciona os participantes de cada partida e escolhe quantos times formar. Pode ajustar o resultado e compartilhar os nomes sem divulgar as avaliações.

Na partida atual, pode informar local, data e horário opcionais. A mensagem de compartilhamento inclui os detalhes preenchidos antes dos times; ela pode ser copiada ou aberta no WhatsApp para a pessoa escolher o destinatário. Os detalhes não são salvos ao recarregar.

A primeira versão guarda o cadastro no mesmo navegador e aparelho. Não precisa de login, servidor próprio ou banco de dados externo.

Há um possível grupo de teste com 15 jogadores. O usuário pretende contatar seu organizador; o contato e o teste ainda não ocorreram.

## Estado atual

Cadastro persistente com goleiro, edição, exclusão, seleção da partida, vários times, restrições de tamanho/goleiros, avisos, trocas, novas composições com aceitar/desfazer e compartilhamento estão entregues. O texto contém detalhes opcionais da partida e nomes dos times, sem notas/totais. Código e interface estão em inglês. README e resumo documentam evidências e limitações; não há validação em celular físico nem no aplicativo nativo do WhatsApp.

## Evolução mobile first aprovada e implementada

Em 20/10/2026, o usuário aprovou [o plano mobile first](plano-mobile-first.md): Bootstrap, Players/Match, seleção e times em etapas, foto esportiva com cartões legíveis e texto compartilhado com marcadores. A disposição foi aprovada em prévia, com atenção também a tablet e desktop. As tarefas 04–07 foram concluídas em 21/10/2026; ver os resultados e limites no [índice de tarefas](tarefas.md) e no [resumo de continuidade](proximo-chat.md).

## Refinamento de UX aprovado em 22/10/2026

Após a crítica de UX, o usuário aprovou uma rodada de refinamentos visuais e de orientação. A foto esportiva inicialmente aprovada foi removida; o fundo sólido azul petróleo reduz distração atrás dos painéis. A navegação fixa Players/Match acompanha a rolagem também no celular. Jogadores e notas estão alinhados em colunas, os campos e botões seguem o tema escuro, o campo de quantidade de times e a caixa de compartilhamento são compactos, e Copy teams tem prioridade visual. A escala de habilidade e a natureza estimada dos totais estão explicadas; cartões de times também avisam quando não há goleiro fixo. O título foi simplificado, e a versão do aplicativo permanece visível no rodapé móvel. Detalhes e limites de verificação estão em [ajustes de UX e interface](ajustes-ux-2026-10-22.md).

## Limite da promessa

Notas são estimativas. Somas próximas ajudam a montar times, mas não garantem uma partida equilibrada. O produto deve permitir ao organizador usar seu conhecimento por meio de trocas manuais.

## Proposta de avaliação no teste

Observar se o organizador consegue preparar uma partida sem recadastrar todos, se entende os avisos e se precisa de muitas trocas depois da geração. Não foram definidas metas numéricas.
