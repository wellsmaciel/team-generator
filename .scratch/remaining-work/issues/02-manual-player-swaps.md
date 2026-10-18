# 02: Permitir trocas manuais entre times

**What to build:** o organizador escolhe dois participantes de times diferentes e troca suas posições, vendo imediatamente os nomes e as somas atualizados. Esta entrega permite linha por linha e goleiro por goleiro.

**Blocked by:** None (can start immediately).

**Status:** completed

> **Fechamento em 18/10/2026:** critérios essenciais concluídos pelas evidências anteriores, relatos manuais e Playwright. [Relatório final](../evidence/2026-10-18-playwright-03/resultado.md). Seis testes aprovados em 1280×720, 360×800 e 390×844: exclusão durante prévia, limpeza, geração posterior, selects por teclado e colagem em editor local de outra página. C1 e regressões preservados; regressões Node reexecutadas. Sem alteração do aplicativo ou de cadastros reais. Celular físico e editor nativo externo não testados, com limites separados no relatório. Registros parciais abaixo são históricos.


- [x] A interface em inglês permite escolher os dois participantes, confirmar a troca e cancelar sem alterar a composição.
- [x] Trocas de jogadores de linha entre times e trocas de goleiros entre times funcionam e atualizam as somas corretamente.
- [x] Impedir mesmo jogador, dois jogadores do mesmo time e trocas mistas entre goleiro e linha; nenhum time recebe mais de um goleiro.
- [x] Cada selecionado continua aparecendo uma vez, não selecionados continuam fora, tamanhos são preservados e nomes iguais são tratados como pessoas distintas.
- [x] Editar cadastro, excluir, mudar participantes ou quantidade de times limpa também qualquer seleção de troca obsoleta. Não altera cadastro nem persiste times.
- [x] Se já houver escolha pendente de uma composição alternativa, não permitir que uma troca corrompa a composição anterior ou a escolha de aceitar/desfazer; verificar a integração se esse recurso existir.
- [x] Verificar trocas válidas, inválidas e cancelamento, pelo fluxo da página e por verificações repetíveis das restrições, sem exigir uma ordem específica de jogadores.
- [x] Atualizar o registro de conclusão e o resumo de continuidade, preservando funcionalidades existentes.

## Implementação e evidências — 18/10/2026

- `index.html`, `styles.css` e `script.js`: seção `Swap players`, visível após gerar times, com dois campos identificados e botões `Confirm swap` e `Cancel`. As opções mostram time, posição na lista, nome, nota e função; usam índices do cadastro em memória, sem usar o nome como identidade. Nomes continuam inseridos como texto.
- Confirmação valida presença nos times atuais e na seleção, pessoas distintas, times distintos e mesma função antes de alterar qualquer time. Trocas substituem as referências nas posições originais e recalculam as duas somas. Cancelar limpa apenas as escolhas. As escolhas também são limpas após troca, nova geração e invalidação dos times.
- Salvar edição, confirmar exclusão, mudar seleção ou quantidade de times limpa os controles. Cancelar edição/exclusão preserva a composição e as escolhas. Cadastro, seleção e avisos de goleiros/tamanhos não são alterados pela troca; nenhuma persistência de partida foi adicionada.
- Não há composição alternativa nem aceitar/desfazer no código atual; o critério condicional de integração não se aplica nesta entrega. A tarefa 03 deverá bloquear trocas durante uma decisão pendente, ou implementar uma integração que preserve exatamente a composição anterior.
- `node --check script.js` e `git diff --check`: passaram (Git apenas informou conversão futura de LF para CRLF no HTML).
- Verificação repetível sem dependências: `node tests/manual-player-swaps.test.cjs`. Passaram 458 pares ordenados, válidos e inválidos, em cenários 4/2, 6/2, 9/3, 10/3 e 15/3, com zero a três goleiros. Os testes executam o código da página em Node.js com DOM e armazenamento simulados e verificam referências dos participantes, inclusão exclusiva dos selecionados, ausência de duplicação, capacidades preservadas, limite de goleiros, somas e conteúdo renderizado.
- Também passaram campos vazios, pessoa inexistente ou não selecionada, cancelamento, nomes iguais, cadastro antigo sem `isGoalkeeper`, limpeza após mudanças e nova geração, cancelamento de edição/exclusão, preservação dos avisos 15/3, 15/2 e 10/3 e ausência de alterações/gravações do cadastro durante trocas. Os handlers de seleção e os comandos dos botões HTML são exercitados na simulação; isso não representa um navegador real.
- Nenhum cadastro real foi acessado ou alterado. Não houve instalação de dependências, commit ou publicação; as alterações locais anteriores foram preservadas.

## Limitação e próximo passo

Implementação verificada por simulação; ticket ainda não concluído. O inventário de controle retornou `apps: []` e `browsers: []`. Tentar abrir a página em `iab` retornou `Browser is not available: iab`. Falta conferir os campos nativos, interação e apresentação no fluxo real da página; não houve teste em navegador, celular ou aparelho físico.

Em ambiente de teste separado do cadastro real, cadastrar jogadores com nomes iguais, goleiros e jogadores de linha; selecionar participantes e gerar pelo menos três times (incluindo tamanhos diferentes). Conferir uma troca linha/linha, uma goleiro/goleiro, totais e nomes atualizados, bloqueios de mesma pessoa/time e troca mista, cancelamento sem alteração e limpeza após editar, excluir, desmarcar e mudar a quantidade de times. Conferir uso pelo teclado e apresentação em tela estreita. Registrar a evidência e só então marcar o critério de fluxo real e concluir o ticket. Não iniciar outra tarefa automaticamente.


## Navegador acessível e validação direta — 18/10/2026

O servidor confirmado pelo usuário carregou no navegador integrado em http://127.0.0.1:51805/. Nova aba com cadastro inicialmente 0/0; somente dados sintéticos nesta origem. A limitação anterior de acesso não se aplica a esta retomada. Evidência completa: [relatório de navegador](../evidence/2026-10-18-browser-02/resultado.md).

A1 preservado. **Aprovados nesta execução: A2, A3, A5, A6, B1, B4, B5 e C1 no navegador.** A2: 15/3 → 5/5/5, somas 24/23/23; 15/2 → 8/7, somas 35/35; 10/3 → 4/3/3, somas 18/18/19. C1 passou pela primeira geração, 12/20, sem regenerar/trocar.

A4, A7–A9, B2/B3/B6–B8 permanecem parciais nos limites do relatório: cancelamento/aceitação controlada de exclusão, persistência específica da exclusão, exclusão durante decisão, colagem em editor local e percurso completo de selects pelo teclado ainda pendentes. Houve cópia real por Ctrl+A/C com clipboard exato após desfazer/aceitar/trocar e nomes literais; não equivale a colagem. Diálogo de Delete Ana expirou no controle; o cadastro sintético apareceu removido e foi recriado, sem considerar cancelamento aprovado ou diagnosticar defeito funcional.

Desktop 1280×720; tela estreita simulada 360×800 e 390×844, viewport restaurado. Fundo e áreas visíveis conferidos, sem rolagem horizontal nos estados testados. Versão do navegador não exposta; aparelho físico não testado. Nenhum código/teste alterado ou regressão reexecutada nesta retomada; TDD/regressões anteriores preservados. Sem instalação, commit, publicação ou contato externo. Servidor do usuário mantido. Ticket 01 concluído; 02–04 continuam aguardando lacunas. Etapa 05 continua aberta.

Próximo passo: A4 manual, cancelar exclusão de registro sintético mantendo times/texto/escolhas de troca. Depois preencher as demais lacunas, uma por vez. Não retomar A2 como se ainda não tivesse sido executado.
