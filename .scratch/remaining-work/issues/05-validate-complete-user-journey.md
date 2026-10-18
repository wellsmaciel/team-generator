# 05: Validar a jornada completa no navegador e no celular

> Estado vigente após acesso ao servidor em 18/10/2026: A2/A3/A5/A6/B1/B4/B5/C1 aprovados no navegador; A1 preservado. Etapa 05 aberta. Ver relatório e lacunas no registro final; resultados pendentes nas seções anteriores são históricos.

> Estado vigente em 18/10/2026: A1 aprovado; A2 aguardando execução manual. Navegador integrado controlável, porém aplicativo local inacessível (HTTP expirou; file:// bloqueado). Ver o registro de retomada ao final, que substitui os próximos passos históricos. C1 e regressões anteriores preservados; etapa 05 aberta. Servidor temporário encerrado após as tentativas.

**What to build:** entregar a jornada integrada, verificável em navegador real e em tela de celular, corrigindo problemas encontrados no fluxo e registrando instruções de uso que correspondem ao produto entregue.

**Blocked by:** implementação de 01 a 04, já disponível. As conferências de navegador ainda pendentes desses tickets serão feitas junto desta validação e podem usar as mesmas evidências. Não exigir encerramento prévio dos quatro tickets para executar os testes integrados.

**Status:** completed

> **Fechamento em 18/10/2026:** critérios essenciais concluídos pelas evidências anteriores, relatos manuais e Playwright. [Relatório final](../evidence/2026-10-18-playwright-03/resultado.md). Seis testes aprovados em 1280×720, 360×800 e 390×844: exclusão durante prévia, limpeza, geração posterior, selects por teclado e colagem em editor local de outra página. C1 e regressões preservados; regressões Node reexecutadas. Sem alteração do aplicativo ou de cadastros reais. Celular físico e editor nativo externo não testados, com limites separados no relatório. Registros parciais abaixo são históricos.


Complemento manual de B6 em 18/10/2026: usuário confirmou que cancelar Delete durante prévia preservou composição, aviso de piora e Accept/Undo. Falta confirmar exclusão durante decisão, limpeza completa e geração após recompor entradas válidas. B6 permanece parcial; origem do complemento é relato na sessão isolada :5500. Sem nova falha ou alteração de código.

Complemento manual de B3 em 18/10/2026: usuário confirmou recarga no mesmo endereço :5500 com Ana ausente, quatro cadastros/notas preservados, seleção 0/4 e ausência de estado de partida. Persistência da exclusão comprovada; B3 aprovado junto às demais evidências do relatório integrado. Próxima lacuna B6, cancelamento e confirmação de exclusão durante prévia, um teste por vez. Nenhuma alteração de código; etapa ainda aberta.

Complemento manual de B2 em 18/10/2026: após orientar Delete de Ana → OK em cadastro sintético, usuário confirmou “sim, desapareceu” para remoção de Ana, seleção 3/4 e limpeza de times/texto/controles. B2 aprovado junto às evidências anteriores de edição e A4; relato na origem :5500. Falta conferir persistência dessa exclusão em B3 por recarga no mesmo endereço. Etapa permanece aberta, sem alteração de código.

Complemento manual em 18/10/2026: A4 aprovado. Capturas do diálogo Delete de ana (1) e da página após cancelamento mostram cadastro/seleção/time preservados; usuário confirmou texto e duas escolhas de troca inalterados. Cancelar edição já comprovado no relatório integrado. Origem manual :5500, distinta da execução integrada :51805. Próxima lacuna B2: confirmação controlada de exclusão de cadastro sintético, seguida de persistência em B3. Nenhuma alteração de código ou defeito confirmado; demais aprovações preservadas.

Ambiente de teste isolado confirmado pelo usuário (“sim” à pergunta sobre janela anônima ou perfil separado); modalidade e demais metadados não informados. A2 primeira parte proposta: 15 selecionados sem goleiros em 3 times, com soma geral conhecida 70. Aguardando resultado, sem novos critérios aprovados. Dados e expectativas registrados no roteiro.

**A1 aprovado em 18/10/2026:** capturas finais confirmaram geração após desmarcar Eva: seleção 4/5, diego/ana e carla/bruno, tamanhos 2/2, somas 5/5, Eva excluída, sem aviso de tamanhos diferentes, aviso de falta de goleiros nos dois times. Texto correto sem notas/totais e controles de troca reapareceram. Somado aos resultados anteriores, completa A1; metadados do ambiente e critérios de layout/cópia continuam separados. Próximo caso A2, após confirmar sessão isolada. Registros parciais abaixo são históricos.

Resultado parcial de A1 relatado na retomada de 18/10/2026: dois times com somas 8 e 7, total 15. Integrantes, tamanhos, avisos, texto e segunda parte ainda pendentes. Evidência do usuário, sem observação direta pelo agente; registro detalhado no roteiro. Nenhum critério completo foi marcado com esse relato.

Complemento por captura do usuário: integrantes e tamanhos 3/2 confirmados (eva/bruno/ana e diego/carla), todos uma vez; Share teams corresponde aos grupos e à ordem, sem notas/totais. Avisos não aparecem no recorte; próxima conferência são os dois avisos simultâneos. Segunda parte de A1 e metadados do ambiente continuam pendentes. Evidência visual da captura, sem interação direta com o navegador; A1 ainda parcial.

Segunda captura de A1 confirmou simultaneamente os avisos de tamanhos diferentes e falta de goleiros nos times 1 e 2. Primeira parte comprovada; falta desmarcar Eva, conferir invalidação e gerar com quatro. Fim do aviso cortado na imagem: registrar para conferir recorte/layout em B7/B8, sem diagnóstico de defeito ainda. Detalhes no roteiro; A1 completo segue pendente.

Relato seguinte confirmou invalidação ao desmarcar Eva: times, texto/controles e avisos antigos removidos, seleção 4/5 e orientação para gerar novamente. A1 aguarda apenas a geração com quatro e conferência de tamanhos 2/2, participantes corretos e avisos correspondentes. Origem: relato do usuário; critérios gerais da etapa continuam abertos.

Retomada em 18/10/2026: o usuário solicitou condução manual de um teste por vez caso o navegador permaneça inacessível. Nova tentativa retornou inventário vazio e `Browser is not available: iab`. A1 (primeira parte: cinco selecionados em dois times) está aguardando relato no roteiro. Preservadas as evidências anteriores, C1 por TDD e regressões; nenhum novo critério aprovado nesta retomada. Corrigir novas falhas por TDD e concluir apenas com critérios essenciais comprovados, separando limitações restantes.

- [x] Revisar as implementações e evidências de 01 a 04 e concluir suas conferências restantes durante esta validação, aproveitando cada resultado sem duplicar a execução.
- [x] Verificar cadastro, notas inválidas, goleiro, nomes iguais, edição e cancelamento, confirmação de exclusão, persistência após recarregar e seleção vazia após reabrir.
- [x] Conferir apenas selecionados nos times, mínimo de 2 times e 2 pessoas por time, diferença máxima de 1, totais corretos, excesso/falta de goleiros e aviso de tamanhos diferentes.
- [x] Conferir trocas válidas e bloqueios, nova composição, aviso para qualquer piora, aceitar e restauração exata ao desfazer. Conferir invalidação após mudanças e ausência de controles pendentes obsoletos.
- [x] Copiar o texto manualmente e conferir que corresponde à composição aceita, sem notas individuais nem totais, inclusive após trocas e desfazer.
- [x] Conferir imagem de fundo, formulários, listas e controles em navegador real, com largura de desktop e celular. Registrar navegador e dimensões; distinguir simulação de tela pequena de teste em aparelho físico.
- [x] Executar verificações repetíveis das principais restrições e corrigir falhas encontradas dentro do escopo. Registrar qualquer impedimento de acesso ao navegador sem alegar validação visual realizada.
- [x] Corrigir por TDD a primeira geração para o caso de 5 jogadores de linha, notas `10, 10, 10, 1, 1`, em 2 times: obter `[10, 1, 1]` e `[10, 10]`, com somas 12/20 e diferença 8, em vez de 21/11 e diferença 10. Não exigir ordem de pessoas de mesma nota ou títulos de times. Red/green comprovado em DOM simulado e primeira geração também aprovada no navegador.
- [x] Atualizar instruções de uso e limitações reais; registrar as evidências, o estado final e o resumo para continuidade. Não publicar o site nem contatar o grupo de teste.

## Correção de equilíbrio autorizada na etapa 05 — implementada e verificada no navegador

O usuário autorizou incluir nesta tarefa a melhoria da primeira geração após confirmar o cenário abaixo. Implementada por TDD em 18/10/2026; evidências desta execução ao final do ticket.

Entrada: cinco pessoas distintas, todas selecionadas, todas de linha, com notas `10, 10, 10, 1, 1`, em dois times. Antes da correção, a ordem decrescente produzia `[10, 10, 1]` (21, três pessoas) e `[10, 1]` (11, duas pessoas). O time menor não recebia primeiro os dois jogadores de nota 1; essa explicação anterior estava incorreta. A composição válida `[10, 1, 1]` (12) contra `[10, 10]` (20) reduz a diferença de 10 para 8.

O método anterior respeita os limites de tamanho e goleiros, mas deixa passar esse equilíbrio melhor. A decisão nova é melhorar a primeira geração dentro desta tarefa; não exigir ótimo global em todos os cadastros, nem mudar as regras de tamanhos, goleiros ou trocas manuais.

- [x] Antes de escrever o teste, combinar com o usuário a interface pública da geração a exercitar, conforme a skill TDD. Confirmado: evento de Generate Teams e resultados renderizados em DOM simulado.
- [x] Registrar um teste de regressão determinístico que exerça a primeira geração real, sem depender de gerar outra composição ou de trocas manuais. Observar falha com diferença 10 antes da correção, esperada 8; não reproduzir o algoritmo para calcular a expectativa.
- [x] Implementar uma melhoria com término definido, preservando capacidades e restrições, e documentar seus limites. Se houver fase de ajustes após o greedy, aceitar somente ajustes que reduzam a diferença entre a maior e a menor soma; não piorar a composição inicial nessa fase.
- [x] Verificar que os cinco selecionados aparecem uma vez, tamanhos são 3 e 2, somas são 12 e 20 e a soma geral continua 32. Manter cadastro, seleção e armazenamento intactos. Evidência simulada.
- [x] Preservar distribuição de goleiros, mínimo por time e identidade de pessoas de mesmo nome/nota. Não acrescentar trocas manuais mistas não aprovadas. Regressões simuladas passaram.
- [x] Verificar integração com regeneração, comparação de piora, aceitar/desfazer, avisos e texto compartilhável. Reexecutar regressões afetadas e registrar evidências de falha inicial e passagem após correção, sem rebaixar os critérios existentes. Evidência simulada; pendências de navegador continuam no roteiro.
- [x] Conferir o caso C1 do roteiro em navegador quando houver acesso e atualizar a descrição do algoritmo nos documentos para corresponder à implementação final. C1 aprovado nesta retomada; descrição correspondente já presente em docs/regras-dos-times.md.

## Conferência das dependências — 18/10/2026

Registro histórico da tentativa inicial. A revisão posterior abaixo substitui o bloqueio entre a conferência dos tickets de origem e a validação integrada; as evidências continuam válidas como registros do que foi e não foi executado.

Na tentativa inicial, o usuário autorizou começar pela verificação do acesso ao navegador e pelas pendências das tarefas 01 a 04, em ambiente separado do cadastro real. Foram lidos os documentos indicados, os cinco tickets e o código daquela versão. Os tickets 01 a 04 estavam em `implemented-awaiting-browser-verification`: recursos implementados, mas sem conferências completas no fluxo real. Naquele momento o registro tratava a tarefa 05 como ainda não iniciada; a revisão abaixo corrige essa organização para validação parcial em conjunto.

- `cua.getState()` retornou `apps: []` e `browsers: []`. A tentativa de criar uma aba `iab` em `about:blank` retornou `Browser is not available: iab`.
- Reexecutados com sucesso: `node --check script.js`, `node tests/manual-player-swaps.test.cjs` (458 pares e casos adicionais), `node tests/regenerate-teams.test.cjs` (714 cenários e casos adicionais) e `node tests/share-team-text.test.cjs`. São testes com DOM/armazenamento simulados em Node.js, sem navegador real.
- `git diff --check` passou; houve apenas aviso de futura conversão de LF para CRLF em `index.html`.
- Nenhuma conferência visual, cópia manual, dimensão de tela ou aparelho físico foi validado pelo agente nesta tentativa. Nenhum cadastro real foi acessado ou alterado. Nenhuma alteração no aplicativo, instalação, commit, publicação ou contato externo foi realizado.

Próximo passo atualizado: seguir o roteiro revisado para as conferências restantes de 01 a 04 junto da tarefa 05, com acesso disponível ou relatos do usuário, identificando a origem da evidência. Não repetir casos já comprovados sem falha, mudança de código ou detalhe faltante.

## Conferência manual das dependências relatada pelo usuário — em andamento

Evidências relatadas pelo usuário nesta conversa, sem observação direta do agente. Foi orientado uso de janela anônima no computador; navegador, dimensões e uso efetivo dessa janela ainda não foram informados. Não é evidência de aparelho físico celular.

1. Com Ana (1), Bruno (2), Carla (3) e Diego (4), sem goleiros, todos selecionados e 2 times, o usuário confirmou dois participantes por time, sem repetição, soma 5 em cada, aviso de falta de goleiro nos dois times, ausência de aviso de tamanhos diferentes e Share teams com títulos e nomes sem notas/totais.
2. Ao gerar outra composição, confirmou aviso de piora, botões Accept composition e Undo composition, Share teams e Swap players ocultos e botão de geração desabilitado. Valores exatos da piora não foram informados.
3. Ao desfazer, relatou a mensagem Previous composition restored. Após pergunta explícita, confirmou retorno aos times originais com soma 5 por time e reaparecimento de Share teams e Swap players. Não confirmou separadamente o estado final do botão de geração, a remoção dos controles de decisão ou o conteúdo exato do texto compartilhável restaurado.

4. O usuário confirmou o cenário orientado de gerar outra composição e aceitar: permanência da alternativa, mensagem New composition accepted., reaparecimento de Share teams e Swap players e texto correspondente aos times aceitos sem notas/totais.
5. Confirmou troca manual entre jogadores de times diferentes, atualização dos integrantes e somas, manutenção de duas pessoas por time e sincronização de Share teams sem notas/totais.
6. Ao escolher dois jogadores do mesmo time, relatou Choose players from different teams. Em pergunta separada, confirmou times, somas e texto compartilhável inalterados.
7. Confirmou cancelamento de uma troca entre times: ambos os campos retornaram a Choose a player, preservando times, somas e texto compartilhável.

8. Confirmou cadastrar Eva (5), sem goleiro: times anteriores, Share teams e Swap players desapareceram, apareceu orientação para gerar novamente e Eva entrou desmarcada, mantendo os quatro anteriores selecionados.

Nenhum ticket foi concluído com esses resultados parciais. Selecionar Eva e gerar dois times foi proposto, mas ainda não houve relato do resultado.

## Continuidade solicitada pelo usuário

O usuário pediu para registrar os próximos testes em Markdown em vez de continuar a sequência na conversa. O [roteiro de testes manuais](../../../docs/testes-manuais-etapa-05.md) reúne as pendências dos tickets 01 a 04, a validação integrada, os resultados esperados e o modelo para registrar evidências. Começar pelo caso A1. Não interpretar a criação do roteiro como execução ou conclusão da etapa 05.

A orientação posterior do usuário é TDD a partir de agora, incluindo correções encontradas nesta etapa; não esperar concluir a etapa 05. Ver [procedimento de desenvolvimento](../../../docs/desenvolvimento-tdd.md). Nenhuma mudança de aplicativo ou teste novo foi realizada nesta revisão documental.

## Revisão do roteiro e do bloqueio de validação — 18/10/2026

- As implementações 01 a 04 já estão disponíveis. O bloqueio anterior exigia terminar conferências de navegador antes de executar justamente a etapa que reúne essa validação. Ajustado para permitir testes integrados e reaproveitar seus resultados nos tickets de origem, sem declará-los concluídos antecipadamente.
- O roteiro agora distingue relatos já confirmados de detalhes restantes, com mapa de cobertura por ticket. Começar por A1; não repetir troca válida, bloqueio de mesmo time, cancelamento ou mensagens já confirmadas só para refazer toda a sequência.
- Ainda faltam os casos não executados e detalhes parciais, inclusive divisibilidade, goleiros, igualdade/melhoria, restauração/cópia exatas, cadastro/persistência, limites, invalidação durante decisão e teclado/tela estreita. Teste físico em celular depende de disponibilidade e deve ser identificado separadamente.
- Nenhum critério foi marcado nesta revisão e nenhuma verificação de navegador foi executada. As passagens de testes automatizados acima são resultados anteriores, não reexecuções desta revisão.
- Para correções futuras: confirmar comportamento/interface de teste, observar teste falhar primeiro e só depois corrigir, conforme TDD. Não iniciar nova funcionalidade nem os ajustes adiados por conta desta orientação.

## Execução de C1 por TDD e continuidade — 18/10/2026

- O usuário confirmou: “Confirmo essa interface”, para acionar Generate Teams e conferir a saída renderizada em DOM simulado. Usada a infraestrutura existente sem dependências novas, sem testar funções privadas no novo teste.
- **Red:** `node tests/initial-team-balance.test.cjs`, antes de alterar `script.js`, falhou em `First generation should reduce the score difference to 8`, com `actual: 10`, `expected: 8`. A primeira execução após a correção passou os critérios de equilíbrio e revelou dois padrões de texto de aviso incorretos no teste; foram ajustados para as mensagens existentes, sem alterar mensagens do aplicativo.
- **Green:** o mesmo comando passou com somas 12/20, diferença 8, tamanhos 3/2, cinco nomes distintos preservados uma vez, sexto cadastro não selecionado excluído, seleção preservada, avisos simultâneos, texto sem notas e nenhuma gravação no armazenamento.
- A causa era a distribuição greedy com capacidades, que parava mesmo havendo uma troca estritamente melhor. A correção examina pares de mesma função em times distintos, aplica a melhor redução da diferença máxima/mínima e repete até nenhuma melhorar. Capacidades e goleiros são preservados. A diferença inteira diminui em cada passo e limita a quantidade de passos. Não há ótimo global, movimentos de funções diferentes nem passos neutros nessa melhoria inicial. Regeneração e troca manual mantêm suas regras.
- **Regressões:** sintaxe, trocas (458 pares e casos adicionais), regeneração (714 cenários e casos adicionais), compartilhamento e `git diff --check` passaram. O Git apenas avisou sobre futura conversão LF/CRLF de `index.html`, não alterado nesta execução.
- O teste antigo de compartilhamento falhou intermitentemente antes e depois da alteração: nomes repetidos permitiam grupos diferentes com texto idêntico, contrariando sua asserção de texto diferente. Ajustado somente o cadastro do cenário de aceitar/desfazer para nomes distintos. Asserções preservadas, cobertura de nomes repetidos mantida nos demais cenários; 20 execuções consecutivas passaram após o ajuste. Não se trata de falha comprovada no produto.
- **Navegador:** nova consulta retornou `apps: []`, `browsers: []`; tentativa de abrir `iab` em `about:blank` retornou `Browser is not available: iab`. A/B e C1 no navegador não foram executados nesta sessão; nenhuma evidência de layout, teclado, controles nativos, cópia/colagem ou celular foi acrescentada. Relatos anteriores permanecem válidos nos limites já registrados.
- Atualizados README, regras, roteiro, tarefas e resumo de continuidade. Sem instalação, alteração de cadastros reais, commit, publicação ou contato externo. Status geral permanece `in-progress-awaiting-remaining-browser-verification`; tickets 01–04 continuam aguardando evidências restantes.

## Retomada com navegador integrado — 18/10/2026

- Leitura dos três documentos solicitados realizada. A1 continua aprovado; C1 por TDD e regressões anteriores preservados. A2 continua aguardando execução, sem resultado presumido.
- Controle do navegador integrado disponível nesta sessão: inventário apresentou ChatGPT in-app browser e a criação de uma aba about:blank retornou estado acessível. Isso comprova controle da aba, mas não acesso ao aplicativo.
- Preparado servidor temporário vinculado somente a 127.0.0.1:51805, com raiz no projeto e sem publicar o site. O endereço seria uma origem de teste separada; a página não carregou e nenhum cadastro foi criado, lido ou alterado pelo navegador.
- A navegação para http://127.0.0.1:51805 expirou (net::ERR_CONNECTION_TIMED_OUT). A conferência HTTP pelo terminal também falhou; após permissão de rede concedida e reinício do servidor, a tentativa Node continuou com connect ETIMEDOUT. Não há evidência de defeito do aplicativo nesses erros de acesso.
- A abertura direta do HTML por file:// foi rejeitada pela política do navegador, que permite somente HTTP/HTTPS. Não foi tentado contornar esse bloqueio.
- A2–A9, B1–B8 e C1 de navegador não foram executados nesta retomada. B9 também não executado: nenhum aparelho físico disponível ao agente. Sem comprovação nova de layout, teclado, cópia/colagem, persistência ou controles nativos. Navegador integrado identificado pelo inventário; versão e dimensões do aplicativo não obtidas, pois a página não abriu. Host Windows; não inferir sistema do navegador remoto.
- Sem alterações em código/testes, instalação, commit, publicação ou contato externo. Nenhuma nova falha funcional foi confirmada, portanto nenhum ciclo TDD novo foi iniciado e as regressões anteriores não são apresentadas como reexecuções desta sessão.
- Status geral permanece in-progress-awaiting-remaining-browser-verification; nenhum critério essencial adicional foi marcado.
- Próximo passo manual: A2 primeira parte na sessão isolada já confirmada. Manter Ana (1), Bruno (2), Carla (3), Diego (4), Eva (5); adicionar Player 06–15 com notas 6,7,8,9,10,1,2,3,4,5, todos sem goleiro. Selecionar os 15 e gerar 3 times. Conferir 5/5/5, cada selecionado uma vez, somas individuais corretas e total geral 70, ausência de aviso de tamanho e falta de goleiros nos três times. Aguardar relato antes de avançar a 15/2 ou 10/3. Registrar origem do relato separadamente da observação direta.


## Navegador acessível e validação direta — 18/10/2026

O servidor confirmado pelo usuário carregou no navegador integrado em http://127.0.0.1:51805/. Nova aba com cadastro inicialmente 0/0; somente dados sintéticos nesta origem. A limitação anterior de acesso não se aplica a esta retomada. Evidência completa: [relatório de navegador](../evidence/2026-10-18-browser-02/resultado.md).

A1 preservado. **Aprovados nesta execução: A2, A3, A5, A6, B1, B4, B5 e C1 no navegador.** A2: 15/3 → 5/5/5, somas 24/23/23; 15/2 → 8/7, somas 35/35; 10/3 → 4/3/3, somas 18/18/19. C1 passou pela primeira geração, 12/20, sem regenerar/trocar.

A4, A7–A9, B2/B3/B6–B8 permanecem parciais nos limites do relatório: cancelamento/aceitação controlada de exclusão, persistência específica da exclusão, exclusão durante decisão, colagem em editor local e percurso completo de selects pelo teclado ainda pendentes. Houve cópia real por Ctrl+A/C com clipboard exato após desfazer/aceitar/trocar e nomes literais; não equivale a colagem. Diálogo de Delete Ana expirou no controle; o cadastro sintético apareceu removido e foi recriado, sem considerar cancelamento aprovado ou diagnosticar defeito funcional.

Desktop 1280×720; tela estreita simulada 360×800 e 390×844, viewport restaurado. Fundo e áreas visíveis conferidos, sem rolagem horizontal nos estados testados. Versão do navegador não exposta; aparelho físico não testado. Nenhum código/teste alterado ou regressão reexecutada nesta retomada; TDD/regressões anteriores preservados. Sem instalação, commit, publicação ou contato externo. Servidor do usuário mantido. Ticket 01 concluído; 02–04 continuam aguardando lacunas. Etapa 05 continua aberta.

Próximo passo: A4 manual, cancelar exclusão de registro sintético mantendo times/texto/escolhas de troca. Depois preencher as demais lacunas, uma por vez. Não retomar A2 como se ainda não tivesse sido executado.
