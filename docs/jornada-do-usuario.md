# Jornada do usuário

## Detalhes da partida e compartilhamento — 23/10/2026

Na etapa Match, o organizador pode informar local, data e horário da partida; os três campos são opcionais. Editá-los atualiza a mensagem sem apagar os times. Os detalhes aparecem antes das equipes e campos vazios são omitidos. **Copy teams** e **Share on WhatsApp** usam exatamente a mesma mensagem. O WhatsApp abre com o texto preenchido; a pessoa escolhe contato ou grupo e envia. Esses dados não persistem após recarregar.

## Guia inicial e tablets — 23/10/2026

Ao abrir o app, o organizador vê o fluxo em três passos: adicionar jogadores com notas estimadas, selecionar participantes e quantidade de times, depois gerar e revisar a sugestão. O botão do guia leva ao formulário de cadastro. A interface não garante equilíbrio: a avaliação final continua com o organizador.

Em tablet retrato (768–899 px), cadastro e Match ficam empilhados para dar largura às listas e controles. Em tablet paisagem (900–1099 px), essas áreas usam duas colunas quando há jogadores cadastrados; os resultados mostram até dois times por linha. Os botões nesse intervalo têm alvos de toque de pelo menos 44 px. Essas dimensões foram verificadas em emulação Chromium, sem validação em iPad físico.

Quando não há jogadores cadastrados, **Registered players** explica que a lista será salva neste navegador e oferece **Add your first player**, que leva o foco ao campo de nome. O estado vazio desaparece ao salvar o primeiro jogador e volta se o último for excluído.

Em telas largas, enquanto o cadastro está vazio, essa orientação ocupa uma faixa curta de largura total acima do formulário. Após o primeiro cadastro, a lista reaparece à esquerda do formulário e seu painel acompanha a altura dos registros. Em tablet retrato e celular os painéis continuam empilhados.

## Evolução mobile first — aprovada em 20/10/2026, entregue em 21/10/2026

Disposição aprovada na prévia: Players para cadastro/edição/exclusão e Match como área principal. Match terá Select players (participantes e quantidade) e Teams (resultado, revisão, troca e compartilhamento). Apenas navegar preserva a partida; alterações reais seguem as invalidações atuais. Cadastro continua salvo no navegador e seleção começa vazia ao recarregar. Sem jogadores, Add players orienta o primeiro uso.

Celular tem navegação inferior e linhas inteiras tocáveis para selecionar; tablet/desktop têm navegação superior e disposição em colunas quando há espaço. Foto esportiva mantida com cartões escuros legíveis. Bootstrap é a base, preservando HTML/CSS/JavaScript e funcionalidades. Texto compartilhado tem marcadores por jogador, linha em branco entre times e nenhuma nota. **Entregue nas tarefas 04–07.** Resultados e limites no [plano](plano-mobile-first.md) e no [índice de tarefas](tarefas.md).

**Ajustes de interface posteriores (21/10/2026):** a seleção em Match agora usa um único título, com nome e habilidade em colunas alinhadas; a contagem e Select All Players ficam juntos. Em telas largas, seleção e configuração de times aparecem lado a lado; no celular, continuam empilhadas e o botão Select All Players fica centralizado. Os resultados usam títulos Team 1, Team 2 e assim por diante. A tipografia usa Barlow Condensed nos títulos e Inter nos textos, com fallbacks do sistema. Esses refinamentos foram feitos após o fechamento formal das tarefas 04–07; não alteram algoritmo, persistência ou regras dos times.

## Mapa da jornada e prioridades — registros da rodada encerrada em 20/10/2026

O uso principal é no celular, com suporte também a tablet e PC. A tarefa 01 concluiu lógica e critérios de UX (teclado/apresentação) do Copy teams; viewports simulados em Chromium não substituem aparelho físico.

| Etapa da jornada | Recursos | Estado e ordem do trabalho |
| --- | --- | --- |
| Preparar o cadastro | Cadastrar, editar, excluir e reaproveitar jogadores | Base concluída na primeira rodada |
| Confirmar participantes | Selecionar jogadores individualmente e conferir a contagem | **Select All Players** implementado no ticket 02a (20/10/2026): marca todos os cadastrados; fica desabilitado sem cadastrados ou com todos já marcados, para não apagar times à toa; reabilita ao desmarcar alguém. **Concluído** em 20/10/2026 |
| Configurar e gerar | Quantidade de times, regras de goleiros, tamanhos e equilíbrio | Lógica existente; **tarefa 02 concluída** em 20/10/2026: quantidade de times e geração ficam depois da lista de participantes e antes dos resultados, na ordem visual, DOM e de Tab |
| Rever os times | Regenerar, aceitar/desfazer e trocar jogadores | Existente; preservar nas próximas mudanças |
| Compartilhar | Copiar ou abrir WhatsApp com detalhes e equipes | **Copy teams** concluído em 19/10/2026; detalhes opcionais e WhatsApp concluídos em 23/10/2026. A pessoa escolhe o destinatário no WhatsApp; aparelho/app nativo não foi testado |
| Conferir a entrega | Validar o fluxo integrado e atualizar a documentação | **Tarefa 03 concluída** em 20/10/2026: fluxo integrado validado sem defeitos; não é uma nova rodada de implementação automática |

**Estado das rodadas:** tarefas 01, 02, 02a (Select All Players) e 03 da rodada de usabilidade concluídas; tarefas 04–07 da rodada mobile first também concluídas. A entrega de detalhes da partida e WhatsApp foi concluída em 23/10/2026; novos trabalhos dependem de pedido do usuário.

**Ordem aprovada da segunda rodada, ampliada pelo usuário em 19/10/2026:** tarefas 01 (Copy teams), 02 (geração após a seleção) e Select All Players (ticket 02a) e tarefa 03 (validação integrada) concluídas; segunda rodada encerrada. Não iniciar outra entrega automaticamente. Tickets e passagens recentes em [tarefas](tarefas.md) são a referência para o progresso de cada entrega.

**Necessidade registrada para Select All Players:** no teste manual com 15 jogadores, o usuário precisou marcar 15 checkboxes. Um botão com esse nome em inglês deve facilitar a seleção de todos os jogadores cadastrados para a partida, permitindo depois ajustar individualmente quem participa. **Implementado em 20/10/2026 (ticket 02a):** o botão fica acima da lista de participantes. Decisão do usuário após testar: com todos já marcados o clique apagava os times sem mudar a seleção, então o botão fica desabilitado quando não há cadastrados ou todos já estão selecionados. Quando adiciona alguém à seleção, limpa os times como qualquer mudança de seleção. Não inclui botão de desmarcar todos nem persistência da seleção.

## Fluxo confirmado para a evolução

1. Cadastrar nome, nota inteira de 1 a 10 e condição de goleiro fixo.
2. Reaproveitar o cadastro salvo no navegador nas próximas partidas.
3. Editar nome, nota ou condição de goleiro quando necessário. Excluir um cadastro mediante confirmação.
4. Selecionar os jogadores que participarão da partida. Não participar não exclui o cadastro.
5. Escolher a quantidade de times e conferir os avisos e impedimentos.
6. Gerar times conforme as regras de quantidade, goleiros e equilíbrio.
7. Solicitar outra combinação quando possível ou trocar dois jogadores de times diferentes. Recalcular as somas após a troca e preservar as regras de goleiros. Se uma nova geração piorar o equilíbrio das notas, avisar e permitir aceitar ou desfazer, recuperando a composição anterior. A avaliação final do equilíbrio cabe ao organizador.
8. Opcionalmente informar local, data e horário; exibir esses dados preenchidos antes dos times, omitindo campos vazios. A mesma mensagem, sem notas individuais nem totais, pode ser copiada com Copy teams ou aberta preenchida no WhatsApp para escolher contato/grupo e enviar.

As notas permanecem visíveis na tela do organizador e não são incluídas no compartilhamento.

## Estado funcional anterior à evolução mobile first — histórico

Atualização da continuidade de 18/10/2026: HTML, CSS e JavaScript estão separados. O cadastro salva nome, nota inteira de 1 a 10 e condição de goleiro fixo no navegador, com edição e exclusão mediante confirmação. A lista permite selecionar quem joga, mostra a contagem e mantém o cadastro de quem for desmarcado. A seleção começa vazia ao abrir a página e não é salva. Editar preserva a seleção do jogador; excluir também o remove da seleção. Alterar a seleção, salvar uma edição ou confirmar uma exclusão limpa os times gerados e pede nova geração.

A geração permite escolher pelo menos 2 times, com pelo menos 2 selecionados por time. Distribui goleiros em times diferentes e jogadores de linha por nota decrescente no time com menor soma e vaga, depois faz trocas de mesma função que reduzam estritamente a diferença entre a maior e a menor soma. Garante tamanhos com diferença máxima de 1, impede excesso de goleiros e avisa faltas e tamanhos diferentes. Alterar a quantidade de times também limpa o resultado e pede nova geração.

Trocas manuais, novas composições com aceitar/desfazer e texto para compartilhar sem notas estão implementados. Os critérios essenciais das tarefas 01–05 foram concluídos com evidências Node, navegador, relatos/capturas e Playwright. Celular físico não testado; ver o resumo e o relatório final para as limitações.

A segunda rodada de 19/10/2026 foi aprovada para adicionar Copy teams e posicionar a geração após a seleção, com TDD e validação integrada. **Copy teams está concluído** (tarefa 01), com 8 ciclos de lógica e verificação de apresentação/teclado, todos verificados independentemente; ver o fechamento no ticket. A cópia manual permanece disponível. O reposicionamento da geração (tarefa 02) foi concluído em 20/10/2026; ver o fechamento no ticket 02. Ver o mapa acima e as passagens recentes do ticket 01.

## Dúvidas

Persistir a partida e ampliar as trocas manuais para goleiro por linha continuam sem aprovação. Os avisos, novas composições e compartilhamento básico por WhatsApp já foram entregues; ideias adiadas estão em [pendências](pendencias.md).
