# 03: Gerar outra composição com aceitar ou desfazer

**What to build:** o organizador solicita outra composição válida e pode avaliar alternativas sem perder os times anteriores. Qualquer piora no equilíbrio exige aviso e a escolha entre aceitar a alternativa ou desfazer, restaurando a composição anterior.

**Blocked by:** None (can start immediately).

**Status:** completed

> **Fechamento em 18/10/2026:** critérios essenciais concluídos pelas evidências anteriores, relatos manuais e Playwright. [Relatório final](../evidence/2026-10-18-playwright-03/resultado.md). Seis testes aprovados em 1280×720, 360×800 e 390×844: exclusão durante prévia, limpeza, geração posterior, selects por teclado e colagem em editor local de outra página. C1 e regressões preservados; regressões Node reexecutadas. Sem alteração do aplicativo ou de cadastros reais. Celular físico e editor nativo externo não testados, com limites separados no relatório. Registros parciais abaixo são históricos.


- [x] Após a primeira geração, oferecer outra composição quando possível. Só trocar títulos ou a ordem dos jogadores não conta como composição diferente.
- [x] Não há limite fixo de jogadores movimentados, conforme confirmado. Preservar participantes, mínimo por time, diferença máxima de 1 e no máximo 1 goleiro por time; não acrescentar trocas manuais mistas não aprovadas.
- [x] Sem alternativa válida, informar a limitação e preservar os times. Usar procedimento com término e documentar seus limites de busca; não prometer achar toda alternativa existente se a busca for limitada.
- [x] Comparar a diferença entre a maior e a menor soma da composição atual e da alternativa. Qualquer aumento, mesmo de 1 ponto, exige aviso em inglês e aceitar/desfazer; sem tolerância silenciosa.
- [x] Preservar uma cópia da composição anterior até a escolha. Aceitar aplica a alternativa; desfazer restaura participantes por time, somas e a apresentação correspondente. Não implementar histórico geral.
- [x] Enquanto houver escolha pendente, impedir operações que destruam o estado necessário para restaurar os times. Mudanças de cadastro, seleção ou quantidade de times invalidam a partida e qualquer alternativa pendente, conforme as regras existentes.
- [x] Se trocas já estiverem disponíveis, comparar com a composição atual após as trocas, e não com uma geração antiga. Se houver compartilhamento, não deixar texto com uma alternativa descartada ou ainda não aceita.
- [x] Verificar alternativas melhores, iguais e piores, ausência de alternativa, aceitar/desfazer, nomes iguais e preservação exata das restrições, incluindo o fluxo da página.
- [x] Atualizar o registro de conclusão e o resumo de continuidade. Não persistir a partida nem alterar cadastros salvos.

## Implementação e evidências — 18/10/2026

- Primeira geração preserva `buildTeams`. Depois, o botão passa a `Generate another composition`. Alternativas melhores ou iguais são aplicadas imediatamente. Qualquer aumento em `max(totalScore) - min(totalScore)` mostra uma prévia explicitamente identificada, os valores anterior/novo e `Accept composition` / `Undo composition`.
- A cópia anterior preserva ordem dos times, ordem dos participantes, capacidades e somas, com referências aos mesmos objetos do cadastro. Aceitar mantém a prévia e descarta a cópia; desfazer restaura a cópia e recalcula os avisos da composição restaurada. Sem histórico geral.
- Durante a escolha, nova geração fica desabilitada, controles de troca ficam ocultos/vazios e os handlers bloqueiam novas gerações/trocas. Salvar edição, adicionar cadastro, excluir, mudar seleção ou quantidade de times limpa composição, decisão pendente e controles. Cancelar edição/exclusão mantém a decisão. A comparação parte dos times atuais, inclusive após trocas manuais.
- Identidade usa referência do objeto e índice em memória do cadastro. A chave de composição ignora títulos dos times e ordem interna; nomes iguais não confundem participantes. Só o cadastro continua persistindo; gerar, aceitar, desfazer e trocar não gravam armazenamento. Compartilhamento ainda não existe e não foi implementado.
- `node --check script.js`, `node tests/manual-player-swaps.test.cjs`, `node tests/regenerate-teams.test.cjs` e `git diff --check` passaram. O Git apenas avisa sobre conversão futura de LF para CRLF no HTML.
- Testes repetíveis sem dependências: 458 pares ordenados de troca e 714 cenários de regeneração, abrangendo 4 a 16 participantes, todas as quantidades válidas de times e goleiros nesse intervalo, com três regenerações por configuração e aleatoriedade semeada nos testes. Conferem participantes únicos e selecionados, capacidades, goleiros, totais, listas renderizadas, avisos restaurados, bloqueios pendentes e nenhuma escrita/mutação de cadastro nas ações da partida.
- Casos adicionais verificam melhoria, igualdade, piora real de 0 para 2, piora de exatamente 1 ponto com resultado de busca controlado, aceitar, desfazer exato, ausência de histórico, comparação após troca manual, nomes iguais, dados antigos sem goleiro, invalidação de escolha pendente e movimentação superior a uma troca simples.
- A ausência de alternativa foi testada diretamente na busca com dois times de uma pessoa (entrada defensiva fora dos mínimos da interface) e no fluxo simulado com retorno de busca controlado. Não é um exemplo válido de partida: nas partidas aprovadas há ao menos um jogador de linha por time e uma troca entre dois deles já produz outro agrupamento.
- Nenhum cadastro real foi acessado ou alterado. Sem dependências instaladas, commit ou publicação. Alterações locais anteriores preservadas; nenhuma outra tarefa foi iniciada.

## Procedimento e limites da busca

1. Amostrar 64 distribuições completas: embaralhar goleiros e seus times de destino, distribuir no máximo um por time e preencher as vagas restantes com jogadores de linha embaralhados. Capacidades são as dos times atuais. Não há teto fixo de pessoas movimentadas.
2. Enumerar todas as trocas simples entre pessoas de times diferentes que preservem o limite de goleiros. A geração pode levar um goleiro a um time sem goleiro; isso não muda as regras dos controles de troca manual, que continuam exigindo a mesma função.
3. Ignorar composições equivalentes e escolher a menor diferença de somas encontrada. Empates mantêm a primeira candidata encontrada. Sem candidatas, preservar times e informar que nenhuma alternativa foi encontrada nesta busca.

A busca termina após 64 amostras e, no máximo, N(N−1)/2 pares de participantes. Não enumera todas as partições possíveis, não garante equilíbrio ótimo nem descoberta de toda alternativa melhor/igual. A enumeração de pares oferece fallback determinístico para variar partidas válidas, mesmo se as amostras repetirem a composição. O custo cresce com o cadastro selecionado: cada candidata copia listas e calcula uma chave ordenada; não houve teste de carga para cadastros grandes. Não há histórico que impeça voltar a uma composição oferecida em uma geração anterior.

## Limitação e próximo passo

Implementação e fluxo HTML verificados com DOM/armazenamento simulados em Node.js. A conferência em navegador real continua pendente: o inventário retornou `apps: []`, `browsers: []`; abrir a página em `iab` retornou `Browser is not available: iab`. Não houve teste visual, em celular ou em aparelho físico. Por isso, o critério que inclui o fluxo real permanece desmarcado e o ticket não está concluído.

Em ambiente isolado do cadastro real, conferir pelo teclado e visualmente: primeira geração; alternativas iguais com quatro notas 5; piora com quatro jogadores de notas 1, 2, 3 e 4; aceitar/desfazer; comparação depois de troca manual; nomes iguais; três times com tamanhos diferentes e goleiros insuficientes; atualização dos avisos após regenerar/desfazer; bloqueio de trocas/nova geração durante a prévia e limpeza ao alterar cadastro/seleção/quantidade de times. Registrar evidências e só então concluir o critério restante. Não iniciar a tarefa 04 automaticamente.


## Navegador acessível e validação direta — 18/10/2026

O servidor confirmado pelo usuário carregou no navegador integrado em http://127.0.0.1:51805/. Nova aba com cadastro inicialmente 0/0; somente dados sintéticos nesta origem. A limitação anterior de acesso não se aplica a esta retomada. Evidência completa: [relatório de navegador](../evidence/2026-10-18-browser-02/resultado.md).

A1 preservado. **Aprovados nesta execução: A2, A3, A5, A6, B1, B4, B5 e C1 no navegador.** A2: 15/3 → 5/5/5, somas 24/23/23; 15/2 → 8/7, somas 35/35; 10/3 → 4/3/3, somas 18/18/19. C1 passou pela primeira geração, 12/20, sem regenerar/trocar.

A4, A7–A9, B2/B3/B6–B8 permanecem parciais nos limites do relatório: cancelamento/aceitação controlada de exclusão, persistência específica da exclusão, exclusão durante decisão, colagem em editor local e percurso completo de selects pelo teclado ainda pendentes. Houve cópia real por Ctrl+A/C com clipboard exato após desfazer/aceitar/trocar e nomes literais; não equivale a colagem. Diálogo de Delete Ana expirou no controle; o cadastro sintético apareceu removido e foi recriado, sem considerar cancelamento aprovado ou diagnosticar defeito funcional.

Desktop 1280×720; tela estreita simulada 360×800 e 390×844, viewport restaurado. Fundo e áreas visíveis conferidos, sem rolagem horizontal nos estados testados. Versão do navegador não exposta; aparelho físico não testado. Nenhum código/teste alterado ou regressão reexecutada nesta retomada; TDD/regressões anteriores preservados. Sem instalação, commit, publicação ou contato externo. Servidor do usuário mantido. Ticket 01 concluído; 02–04 continuam aguardando lacunas. Etapa 05 continua aberta.

Próximo passo: A4 manual, cancelar exclusão de registro sintético mantendo times/texto/escolhas de troca. Depois preencher as demais lacunas, uma por vez. Não retomar A2 como se ainda não tivesse sido executado.
