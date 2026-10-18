# 04: Preparar texto dos times para compartilhar

**What to build:** o organizador vê um texto selecionável com os nomes agrupados por time, pronto para copiar e colar manualmente. O conteúdo compartilhável não contém notas individuais nem totais.

**Blocked by:** None (can start immediately).

**Status:** completed

> **Fechamento em 18/10/2026:** critérios essenciais concluídos pelas evidências anteriores, relatos manuais e Playwright. [Relatório final](../evidence/2026-10-18-playwright-03/resultado.md). Seis testes aprovados em 1280×720, 360×800 e 390×844: exclusão durante prévia, limpeza, geração posterior, selects por teclado e colagem em editor local de outra página. C1 e regressões preservados; regressões Node reexecutadas. Sem alteração do aplicativo ou de cadastros reais. Celular físico e editor nativo externo não testados, com limites separados no relatório. Registros parciais abaixo são históricos.


- [x] Após gerar, mostrar texto selecionável em formato legível, com títulos dos times em inglês e nomes de todos os participantes, uma vez cada.
- [x] Não incluir notas individuais ou totais no texto. As notas continuam visíveis na área do organizador. Não remover números que façam parte do nome de alguém.
- [x] Não incluir não selecionados, controles de edição/exclusão ou mensagens internas no texto. Nomes devem ser tratados como texto.
- [x] O conteúdo reflete os times atuais após nova geração e, se disponíveis, troca, aceitar e desfazer. Não expor como definitiva uma alternativa ainda aguardando escolha.
- [x] Limpar o resultado também limpa ou oculta o texto para não compartilhar times antigos. Sem times não há composição pronta para copiar.
- [x] Copiar manualmente é suficiente; não acrescentar integração externa, imagem ou opção de incluir notas.
- [x] Conferir seleção e cópia do texto na página e verificar ausência de notas, nomes repetidos e sincronização com o estado atual.
- [x] Atualizar o registro de conclusão e o resumo de continuidade, sem alterar o cadastro salvo.

## Implementação e evidências — 18/10/2026

- Seção Share teams com textarea somente leitura, rótulo e instruções em inglês. Texto com Team 1, Team 2 etc., um nome por linha e separação entre times. Largura limitada ao espaço disponível.
- Conteúdo montado diretamente dos times e atribuído a value: apenas títulos e nomes, sem notas, totais, funções, avisos ou controles. Números e HTML literal nos nomes são preservados. Pessoas distintas com nomes iguais mantêm suas ocorrências.
- Geração, trocas, aceitar e desfazer atualizam o texto. Prévia pendente esvazia e oculta o campo até a decisão. Invalidar os times também limpa e oculta o campo; cancelamentos preservam o estado.
- Passaram node --check script.js e node tests/share-team-text.test.cjs. A nova suíte cobre conteúdo exato, tamanhos iguais/diferentes, goleiros, nomes iguais, números/HTML literal, exclusão de não selecionados, trocas, cancelamentos, busca sem alternativa, composições melhores/iguais/piores, aceitar/desfazer, invalidação e isolamento do armazenamento, com DOM simulado.
- Passaram as suítes existentes: node tests/manual-player-swaps.test.cjs (458 pares e casos adicionais) e node tests/regenerate-teams.test.cjs (714 cenários e casos adicionais). git diff --check passou; arquivos novos também foram conferidos diretamente.
- Nenhum cadastro real foi acessado ou alterado. Sem mudança na persistência, dependências, integração externa, commit ou publicação.

## Limitação e conferência pendente

O inventário de UI retornou apps e browsers vazios. Abrir index.html pelo iab retornou Browser is not available: iab. O agente não conseguiu conferir a página diretamente. Posteriormente, o usuário realizou o teste manual descrito abaixo. O ticket permanece aguardando as demais verificações do fluxo.

## Teste manual realizado pelo usuário — 18/10/2026

O usuário confirmou em navegador real que a seção Share teams aparece com os nomes agrupados por time, sem notas nem totais. Também confirmou que conseguiu selecionar, copiar e colar o texto mantendo os títulos e os jogadores nos times corretos, sem notas nem totais. Evidência relatada pelo usuário; o agente não observou o navegador. Não foi informado se o teste ocorreu em celular.

Durante o teste, o usuário apontou dois detalhes para resolver depois:

- Falta um botão Copy teams para facilitar a cópia, especialmente no celular.
- O botão Generate Teams aparece antes da lista de jogadores marcados para jogar; avaliar movê-lo para depois da lista, permitindo conferir os participantes antes de gerar.

O usuário pediu apenas registrar esses pontos em Markdown e adiar a implementação. Nenhum desses ajustes foi programado. Continuam pendentes os testes manuais de sincronização após trocas e novas composições, aceitar/desfazer, limpeza e largura de celular; por isso o critério de conferência completa continua aberto.

Para concluir: gerar times em sessão de teste com nomes distintos, iguais e contendo números; selecionar Teams to copy, copiar e colar em editor e comparar os agrupamentos e ocorrências, sem notas ou totais. Fazer uma troca e nova geração; conferir campo vazio/oculto durante piora, texto da alternativa após aceitar e texto anterior após desfazer. Mudar seleção, quantidade de times e cadastro para conferir limpeza. Conferir leitura e seleção em largura de celular. Registrar resultados antes de concluir o critério pendente e o ticket.


## Navegador acessível e validação direta — 18/10/2026

O servidor confirmado pelo usuário carregou no navegador integrado em http://127.0.0.1:51805/. Nova aba com cadastro inicialmente 0/0; somente dados sintéticos nesta origem. A limitação anterior de acesso não se aplica a esta retomada. Evidência completa: [relatório de navegador](../evidence/2026-10-18-browser-02/resultado.md).

A1 preservado. **Aprovados nesta execução: A2, A3, A5, A6, B1, B4, B5 e C1 no navegador.** A2: 15/3 → 5/5/5, somas 24/23/23; 15/2 → 8/7, somas 35/35; 10/3 → 4/3/3, somas 18/18/19. C1 passou pela primeira geração, 12/20, sem regenerar/trocar.

A4, A7–A9, B2/B3/B6–B8 permanecem parciais nos limites do relatório: cancelamento/aceitação controlada de exclusão, persistência específica da exclusão, exclusão durante decisão, colagem em editor local e percurso completo de selects pelo teclado ainda pendentes. Houve cópia real por Ctrl+A/C com clipboard exato após desfazer/aceitar/trocar e nomes literais; não equivale a colagem. Diálogo de Delete Ana expirou no controle; o cadastro sintético apareceu removido e foi recriado, sem considerar cancelamento aprovado ou diagnosticar defeito funcional.

Desktop 1280×720; tela estreita simulada 360×800 e 390×844, viewport restaurado. Fundo e áreas visíveis conferidos, sem rolagem horizontal nos estados testados. Versão do navegador não exposta; aparelho físico não testado. Nenhum código/teste alterado ou regressão reexecutada nesta retomada; TDD/regressões anteriores preservados. Sem instalação, commit, publicação ou contato externo. Servidor do usuário mantido. Ticket 01 concluído; 02–04 continuam aguardando lacunas. Etapa 05 continua aberta.

Próximo passo: A4 manual, cancelar exclusão de registro sintético mantendo times/texto/escolhas de troca. Depois preencher as demais lacunas, uma por vez. Não retomar A2 como se ainda não tivesse sido executado.
