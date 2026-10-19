# Roteiro de testes manuais para concluir a etapa 05

> **Fechamento em 18/10/2026:** A1–A9, B1–B8 e C1 aprovados pelas evidências combinadas. Playwright concluiu as lacunas com 6 testes em Chromium 156.0.8078.4, desktop e larguras 360/390. Tickets 01–05 concluídos. B9 não executado por falta de celular físico: limitação separada e condicional. Colagem verificada em editor local de outra página do navegador; aplicativo nativo externo não testado. [Relatório final](../.scratch/remaining-work/evidence/2026-10-18-playwright-03/resultado.md). Registros parciais abaixo são históricos.

## Roteiro e registros históricos da execução encerrada

As referências a “próximo passo”, “pendente” ou “estado vigente” nos registros cronológicos abaixo descrevem o momento de cada teste. Foram superadas pelo fechamento destacado no início deste arquivo. Não são instruções para retomar a etapa 05 ou repetir casos aprovados. Preserve a origem das evidências e a limitação B9; o [índice atual](tarefas.md) e o [resumo](proximo-chat.md) orientam a continuidade.

**Complemento manual histórico — B6, cancelar exclusão durante prévia:** em 18/10/2026, o usuário respondeu “sim tudo certo” à conferência de selecionar os quatro cadastros de teste (notas 2/3/4/5), gerar 2 times, solicitar outra composição e cancelar Delete no diálogo. Confirmados prévia, aviso de piora e botões Accept/Undo preservados. Origem: relato do usuário na sessão isolada :5500. B6 permanecia parcial naquele momento: faltava confirmar exclusão durante prévia, conferir limpeza completa e nova geração com entradas válidas. A lacuna foi encerrada posteriormente, conforme o relatório final; o relato anterior permanece preservado.

**Último resultado manual — B3 aprovado:** em 18/10/2026, usuário confirmou “sim” após recarregar no mesmo endereço/sessão isolada :5500: Ana continuou ausente; Bruno (2), Carla (3), Diego (4) e Eva (5) preservados; seleção 0/4 e nenhum time, texto ou controle de partida restaurado. Com as evidências integradas anteriores de preservação de nomes/notas/funções/edições e recarga durante prévia, completa B3. Origem deste complemento: relato do usuário. Próxima lacuna: B6, cancelar e depois confirmar exclusão durante decisão pendente, em testes separados. Usar os quatro cadastros atuais (notas 2/3/4/5) para recriar prévia pior sem reconstruir dados já testados.

**Último resultado manual — B2 aprovado:** o usuário respondeu “sim, desapareceu” à conferência explícita após Delete de Ana → OK: Ana removida, seleção 3/4, times, Share teams e Swap players removidos. Origem: relato na sessão isolada em :5500, em 18/10/2026. Com os resultados anteriores de edição/seleção/cancelamentos do relatório integrado e de A4, completa B2. Próximo subcritério: B3, recarregar no mesmo endereço e conferir Ana ausente, quatro cadastros restantes preservados, seleção 0/4 e nenhum estado de partida restaurado. Persistência dessa exclusão ainda não comprovada.

Atualização mais recente: **A4 aprovado**. Após as capturas do diálogo de exclusão e do cadastro preservado, o usuário respondeu “sim” à pergunta explícita sobre texto de Share teams e duas escolhas de troca permanecerem iguais ao cancelar a exclusão. Evidência combinada: capturas e relato na sessão isolada manual em :5500, mais cancelamento de edição já comprovado no relatório do navegador integrado. Próxima lacuna: B2, confirmação controlada de exclusão de cadastro sintético selecionado e invalidação; depois conferir persistência dessa exclusão em B3. Nenhuma nova falha ou alteração de código.

Atualização de A4 por capturas do usuário: primeira imagem mostra diálogo `Delete this player from the registration? ana - 1` na origem `127.0.0.1:5500`, com OK/Cancel. Na segunda, diálogo fechado, Ana permanece cadastrada/selecionada, seleção 4/5 e time 1 diego/ana com soma 5. Evidência visual compatível com cancelamento, sem exclusão observada; origem diferente do teste integrado em :51805, sem presumir cadastro compartilhado. Texto de Share teams, segundo time e escolhas de troca não aparecem no recorte. A4 ainda parcial; próxima pergunta verifica texto e duas escolhas preservados. Navegador/versão e dimensões efetivas desta sessão manual continuam não informados.

Última interação manual após o relatório de navegador: ao orientar A4 (Delete de cadastro sintético → Cancel no diálogo), o usuário respondeu “pronto” e informou `Swap canceled. Teams are unchanged.`. Depois esclareceu “pra cancelar o swap”, confirmando que acionou Cancel de Swap players. Não comprova cancelamento de exclusão; não há falha funcional confirmada. A4 continua parcial. Próxima ação: preencher novamente as duas escolhas de troca, clicar Delete de cadastro sintético e Cancel na janela de confirmação; conferir preservação de cadastro, times, texto e escolhas. Cancelamento de troca permanece aprovado, sem necessidade de repetição.

> Estado vigente após acesso ao servidor em 18/10/2026: A1 preservado; A2/A3/A5/A6/B1/B4/B5/C1 aprovados no navegador. Ticket 01 concluído. Etapa 05 aberta pelas lacunas descritas no registro final; próximos passos anteriores são históricos.

Atualização de infraestrutura: após o impedimento no app Windows, o VS Code iniciou servidor temporário em `http://127.0.0.1:51805/` e confirmou no terminal `HTTP 200 Team Generator: true`. Navegador integrado ainda precisa confirmar acesso; nenhuma nova evidência funcional de A2 foi obtida. Origem de teste separada, sem alteração de cadastros reais. O servidor precisa permanecer ativo. Inventário do navegador nesta sessão VS Code continua vazio.

> Estado vigente em 18/10/2026: A1 aprovado; A2 aguardando execução manual. Navegador integrado controlável, porém aplicativo local inacessível (HTTP expirou; file:// bloqueado). Ver o registro de retomada ao final, que substitui os próximos passos históricos. C1 e regressões anteriores preservados; etapa 05 aberta. Servidor temporário encerrado após as tentativas.

## Estado e forma de registrar

Orientação mais recente do usuário: continuar as verificações e, enquanto não houver acesso ao navegador, orientar um teste manual por vez na conversa e registrar seus resultados aqui. Substitui o pedido anterior de manter a sequência apenas neste Markdown. Preservar evidências já comprovadas e usar TDD nas correções. Consulte [o procedimento de TDD](desenvolvimento-tdd.md). Em 18/10/2026, C1 foi implementado por TDD e as regressões simuladas passaram; navegador indisponível. Ver registro ao final. As caixas A/B/C abaixo representam conferências de navegador, ainda incompletas.

A etapa 05 está em validação parcial. As implementações 01 a 04 existem; suas pendências de navegador serão verificadas neste mesmo roteiro. Uma evidência pode atender tanto ao ticket de origem quanto à etapa 05. Não é necessário concluir duas rodadas idênticas nem esperar os tickets anteriores fecharem para testar a integração. Eles só serão concluídos quando as evidências correspondentes estiverem completas.

Os resultados já relatados estão no [ticket 05](../.scratch/remaining-work/issues/05-validate-complete-user-journey.md). O agente não observou o navegador. Os testes automatizados existentes usam DOM e armazenamento simulados; não substituem este roteiro.

Use uma sessão de teste separada do cadastro real. Não apague dados reais para preparar os testes. Em janela anônima, recarregar a mesma página permite testar persistência durante a sessão; fechar todas as janelas anônimas pode apagar os dados de teste. Abra sempre pelo mesmo endereço ao testar persistência.

Antes de executar, registre:

- Data e responsável:
- Navegador e versão:
- Sistema operacional:
- Endereço usado para abrir o aplicativo:
- Sessão isolada utilizada:
- Dimensões da área da página em pixels (largura × altura):
- Dispositivo: computador, tela estreita simulada ou celular físico (modelo):

Marque cada caixa somente após conferir todos os resultados esperados. Registre resultado, mensagem de erro e evidência abaixo do caso. Caso não possa executar, deixe pendente e indique o motivo. Ao relatar um problema, informe passos, resultado esperado e resultado observado.

## Onde paramos

Confirmados pelo usuário: geração com Ana (1), Bruno (2), Carla (3) e Diego (4); aviso de piora; desfazer; aceitar; troca válida; bloqueio de troca no mesmo time; cancelamento da troca. Também confirmou cadastrar Eva (5), sem goleiro: resultados e controles antigos sumiram, apareceu orientação para gerar novamente, Eva entrou desmarcada e os quatro anteriores continuaram selecionados.

O último cenário proposto, ainda sem resposta, foi selecionar Eva e gerar dois times. Comece pelo caso A1 se essa sessão ainda estiver aberta.

### Resultados relatados que não precisam ser repetidos sem motivo

| Evidência já registrada | O que falta conferir, sem invalidar o relato anterior |
| --- | --- |
| Quatro jogadores de notas 1, 2, 3, 4: dois por time, somas 5 e 5, sem repetição; avisos e texto inicial corretos | Outros tamanhos e divisibilidade: A1 e A2 |
| Prévia pior exibe aceitar/desfazer, oculta trocas/texto e desabilita geração | Valores exatos e estado final dos controles após desfazer: A7 |
| Desfazer recupera os grupos originais, somas 5 e 5 e seções de troca/compartilhamento | Ordem exata, avisos, texto restaurado e sua cópia manual: A7 |
| Aceitar mantém a alternativa e mostra texto coerente; troca válida atualiza nomes, somas e texto | Cópia/colagem efetiva após essas ações: A8 |
| Troca no mesmo time é bloqueada sem alterações; cancelar troca limpa campos e preserva resultado | Goleiros e outros bloqueios: A3; preservar escolhas ao cancelar edição/exclusão: A4 |
| Adicionar Eva limpa resultado e controles, mantendo os quatro anteriores selecionados e Eva desmarcada | Marcar Eva e gerar: A1; alterações durante decisão pendente: B6 |
| Texto inicial selecionado, copiado e colado corretamente pelo usuário no teste da tarefa 04 | Cópia após ações e nomes especiais: A7 a A9; tela estreita: B8 |

São relatos do usuário, não observação direta do agente. Não há navegador/versão, dimensões ou confirmação de aparelho físico registrados. Completar esses metadados no próximo teste não exige repetir todos os testes anteriores. Reexecutar casos quando houver falha, mudança de código relevante ou detalhe ainda não observado; não marcar um caso inteiro como aprovado com base apenas em parte dele.

### Ordem prática para o que falta

Correção C1 implementada por TDD conforme o ticket 05: a regressão falhou com diferença 10 antes da mudança e passou com diferença 8 depois. A verificação manual C1 continua pendente e complementa o teste automatizado.

1. Registrar o ambiente e executar A1, aproveitando os cinco cadastros se ainda disponíveis.
2. Executar A2 a A6 e A9: divisibilidade, goleiros, bloqueios restantes, igualdade/melhoria e nomes especiais.
3. Em A7 e A8, conferir somente os detalhes e a cópia efetiva ainda não comprovados, recriando o contexto quando necessário.
4. Executar B1 a B6 para as pendências do cadastro, armazenamento, limites e mudanças durante decisão.
5. Executar B7 e B8 para teclado, apresentação e largura de celular; B9 só se houver aparelho e acesso disponíveis.
6. Fechar os tickets usando as evidências compartilhadas, sem nova bateria duplicada.

## A — Pendências dos tickets 01 a 04

Conferências restantes dos recursos implementados. Elas já fazem parte da validação integrada da etapa 05; registrar o resultado uma vez e referenciá-lo nos tickets correspondentes.

- [x] **A1 — Cinco pessoas em dois times.** Selecione Eva junto aos quatro anteriores e gere 2 times. Esperado: tamanhos 3 e 2, todos uma vez, somas totalizando 15, aviso de tamanhos diferentes junto ao de falta de goleiro; Share teams com os cinco nomes nos grupos corretos, sem notas/totais. Depois desmarque Eva: resultado, texto, controles e aviso de tamanho devem desaparecer. Gere novamente com os quatro: tamanhos 2 e 2 sem aviso de tamanho. Aprovado por capturas e relato do usuário em 18/10/2026; metadados do ambiente pendentes, sem comprovação de cópia/colagem ou layout completo.
- [x] **A2 — Divisibilidade com três times.** Em cadastro de teste, prepare 15 pessoas de notas conhecidas, sem goleiros. Selecione todas: 3 times devem ter 5 pessoas cada e nenhum aviso de tamanho; 2 times devem ter 8 e 7 com aviso. Selecione somente 10 e gere 3 times: tamanhos 4, 3 e 3 com aviso. Confira nomes únicos por identidade, exclusão dos não selecionados, somas corretas e coexistência do aviso de falta de goleiro. Mudar seleção ou quantidade de times deve limpar resultados e avisos anteriores.
- [x] **A3 — Trocas com goleiros e bloqueios.** Com Ana (1), Bruno (2), Carla (3), Diego (4), marque Ana e Bruno como goleiros, selecione os quatro e gere 2 times. Troque os dois goleiros: um por time, somas recalculadas e texto sincronizado. Tente goleiro por linha, a mesma pessoa nos dois campos e campos vazios: cada tentativa deve ser bloqueada, sem mudar resultado/texto. O bloqueio de dois jogadores do mesmo time e o cancelamento já foram relatados; repita se houver alteração no código.
- [x] **A4 — Cancelamentos preservam escolhas.** Com times gerados e dois campos de troca preenchidos, abra uma edição e cancele; depois peça uma exclusão e cancele na confirmação. Times, texto e escolhas da troca devem permanecer iguais. Cancelar edição comprovado no relatório de navegador; cancelar exclusão complementado por capturas e confirmação manual do usuário em 18/10/2026.
- [x] **A5 — Alternativa de equilíbrio igual.** Use quatro pessoas com nota 5, sem goleiros, em 2 times. Gere e anote os grupos; gere outra composição. Esperado: agrupamento realmente diferente, somas 10 e 10, aplicação imediata sem aceitar/desfazer, texto atualizado e participantes preservados. Reordenar títulos ou nomes não basta.
- [x] **A6 — Melhoria e comparação após troca.** Com notas 1, 2, 3 e 4 em 2 times, parta de uma divisão de somas 5 e 5. Troque participantes de times distintos para produzir somas 3 e 7. Solicite outra composição: deve melhorar para diferença menor que 4 sem decisão de piora, comparando com a composição após a troca. Confira grupos, somas e texto atualizados.
- [x] **A7 — Detalhes restantes da restauração e cópia.** O retorno aos grupos originais e às somas 5/5 já foi confirmado. Para conferir o restante, recrie o cenário com notas 1, 2, 3 e 4 e registre ordem dos times, integrantes, ordem interna, somas, avisos e texto antes da prévia. Confira o valor anterior/novo da diferença. Ao desfazer, compare a ordem, os avisos e o texto com o registro; os controles de decisão devem desaparecer e a geração voltar a funcionar. Copie o texto, cole em editor local e confira os grupos restaurados sem notas/totais. Não envie a terceiros.
- [x] **A8 — Cópia efetiva após aceitar e trocar.** Aceitar e trocar, com atualização visual do texto, já foram confirmados. Recrie o contexto para copiar/colar o texto após aceitar uma alternativa e após uma troca válida. Compare os grupos colados com os atuais, sem notas/totais. Não é necessário abrir novo registro só para reconfirmar as mensagens já relatadas.
- [x] **A9 — Nomes iguais e texto literal.** Em sessão de teste, use duas pessoas chamadas Alex com notas diferentes, uma pessoa chamada Player 10 e outra chamada <b>Sam</b>. Selecione e gere times; use as posições/time/notas das opções para distinguir os Alex. Confira ambas as ocorrências, sem perda ou duplicação após troca/regeneração; preserve o número em Player 10 e o HTML literal de <b>Sam</b>, sem formatação HTML. Copie/cole e confira os mesmos nomes sem notas/totais.

## B — Validação integrada da etapa 05

Execute estes casos junto com A e reutilize as evidências que atendam ao mesmo comportamento. A divisão A/B serve para organizar o roteiro, não é um bloqueio entre duas fases. Não marque a etapa inteira com base apenas em alguns cenários.

- [x] **B1 — Cadastro e notas inválidas.** Tente nome vazio e só espaços; tente nota vazia, 0, 11 e 1,5 (ou 1.5, conforme o navegador). Nenhuma entrada inválida deve ser cadastrada ou salva. Confira notas válidas 1 e 10 e cadastro com/sem goleiro. Observe as mensagens nativas do navegador.
- [x] **B2 — Edição, exclusão e seleção.** Com times gerados, edite nome, nota e função de um selecionado e salve: preserve seleção, atualize cadastro e invalide partida/texto/controles. Cancele outra edição: preserve os resultados. Exclua apenas um cadastro de teste, confirmando: remova da lista/seleção e invalide partida; cancelar exclusão deve preservar tudo. Edição comprovada no relatório integrado; cancelamento em A4 e exclusão confirmada complementados por capturas/relatos manuais de 18/10/2026.
- [x] **B3 — Persistência.** Registre os cadastros de teste e recarregue no mesmo endereço/sessão. Nomes, notas, funções, edições e exclusões confirmadas devem persistir. Seleção deve voltar vazia; times, texto, escolhas de troca e decisão pendente não devem reaparecer. Repita uma recarga enquanto uma prévia pior está pendente. Relatório integrado comprovou os demais aspectos e recarga durante prévia; persistência de exclusão complementada por relato manual de 18/10/2026 na origem :5500.
- [x] **B4 — Limites de geração.** Teste seleção vazia, somente 3 selecionados para 2 times, quantidade de times vazia, 1, fracionária e maior que metade dos selecionados. Deve impedir geração. Com 4 selecionados/2 times deve permitir; com 6/3 também. Em cada resultado válido, mínimo 2 por time, diferença de quantidade no máximo 1 e soma correta.
- [x] **B5 — Excesso e falta de goleiros.** Prepare ao menos 6 selecionados e 3 times. Com 4 goleiros, impeça geração. Com 3, distribua exatamente um por time; com 2, identifique o time sem goleiro; com 1, identifique os times sem goleiro e avise possível desequilíbrio; com 0, identifique todos sem goleiro. Nunca mais de um por time. Use também um total não divisível para conferir avisos simultâneos.
- [x] **B6 — Invalidação durante decisão.** Gere uma prévia pior com notas 1, 2, 3 e 4. Cancele edição/exclusão: preserve a decisão e a prévia. Recrie esse estado para testar separadamente adicionar cadastro, salvar edição, confirmar exclusão de teste, marcar/desmarcar alguém e mudar número de times: cada mudança confirmada deve limpar times, cópia anterior, aceitar/desfazer, campos de troca e texto compartilhável; nova geração deve funcionar com entradas válidas. Não deve restar aviso de composição antiga.
- [x] **B7 — Teclado e desktop.** Registre navegador e dimensões. Confira imagem de fundo carregada, leitura de textos/avisos, formulários, listas, totais, selects e textarea. Percorra os controles com Tab, veja o foco e execute cadastro, seleção, troca e aceitar/desfazer pelo teclado. Confira seleção/cópia manual do texto. Registre problemas de corte, sobreposição ou controles inacessíveis.
- [x] **B8 — Largura de celular no navegador.** Registre a largura/altura efetivamente usadas (por exemplo 360 × 800 e 390 × 844). Execute cadastro, seleção, geração, troca, prévia/aceitar/desfazer e cópia manual. Confira fundo, leitura, listas, campos e botões sem cortes ou rolagem horizontal que impeça uso. Teste nomes longos nos selects. Identifique como tela estreita simulada, não como celular físico.
- [ ] **B9 — Celular físico, se disponível.** Registre modelo, sistema, navegador e orientação. Abra a versão local por um meio disponível, sem publicar o site só para este teste. Confira toque, teclado numérico, formulários, seleção de participantes, controles de troca/decisão e seleção/cópia/colagem manual em editor local. Se não houver aparelho ou acesso à página, registre a limitação; não alegue teste físico concluído. A emulação deve continuar identificada separadamente.

## C — Correção de equilíbrio incluída na etapa 05

- [x] **C1 — Primeira geração com três notas altas e duas baixas.** Em cadastro de teste, use cinco pessoas distintas, sem goleiros, notas `10, 10, 10, 1, 1`. Selecione todas e gere 2 times pela primeira vez. Antes da correção, a função retornava `[10, 10, 1]` e `[10, 1]`, somas 21 e 11, diferença 10. Após a correção, esperado: `[10, 1, 1]` e `[10, 10]`, somas 12 e 20, diferença 8, com tamanhos 3 e 2 e total 32. Não exigir títulos dos times ou uma ordem específica das pessoas de nota 10. Conferir aviso de tamanhos diferentes, falta de goleiros, texto atualizado sem notas e nenhum selecionado perdido/repetido. Não usar nova geração ou troca manual para fazer o caso passar. A regressão corrigida passou em DOM simulado; registrar a evidência de navegador separadamente. Conferência direta aprovada nesta retomada: somas 12/20 na primeira geração; ver relatório final. O texto de expectativa anterior fica preservado como histórico.

## Limites conhecidos e encerramento

A busca de alternativas é limitada: 64 distribuições e trocas simples válidas, sem garantia de ótimo global. Ausência de alternativa e aviso de piora de exatamente um ponto já foram exercitados com busca controlada nos testes simulados. Não manipule código ou alegue reproduzir esses casos no navegador quando não ocorrerem naturalmente; registre a cobertura simulada separada.

O botão Copy teams e a mudança de posição de Generate Teams permanecem adiados conforme [pendências](pendencias.md). A cópia manual faz parte desta entrega. Não acrescentar recursos para passar neste roteiro.

- [x] Registrar evidências dos casos executados, incluindo limitações e falhas ainda abertas.
- [x] Para cada falha confirmada que exija código, seguir TDD a partir de agora: combinar o comportamento e a interface a testar, observar primeiro o teste falhar pelo motivo esperado, aplicar a correção mínima e repetir os casos afetados. Preservar cadastros e alterações anteriores. Testes existentes ou escritos depois da correção não comprovam um ciclo TDD.
- [x] Reexecutar `node --check script.js`, `node tests/initial-team-balance.test.cjs`, `node tests/manual-player-swaps.test.cjs`, `node tests/regenerate-teams.test.cjs`, `node tests/share-team-text.test.cjs` e `git diff --check` após a correção C1. Passaram em 18/10/2026; novas alterações relevantes exigem nova execução.
- [x] Atualizar os critérios/status dos tickets 01 a 04 apenas quando suas verificações restantes estiverem comprovadas.
- [x] Atualizar instruções de uso (README.md e documentos pertinentes), distinguindo implementação e validação. Atualizados após C1; revisar novamente se houver novas correções.
- [x] Atualizar ticket 05 e docs/proximo-chat.md com estado desta execução e limites: C1 corrigido, etapa ainda em validação parcial. Sem commit, publicação ou contato com terceiros.
- [x] Aplicar TDD a correções desta etapa e funcionalidades futuras, conforme orientação mais recente do usuário. Definir e aprovar o comportamento/interface antes de escrever novos testes. Isso não autoriza novas funcionalidades, o botão de cópia ou a mudança da posição da geração.

### Aproveitamento das evidências para fechar os tickets

| Ticket | Evidências relevantes deste roteiro |
| --- | --- |
| 01 — Tamanhos diferentes | A1, A2 e limpeza em B2/B6 |
| 02 — Trocas | Relatos já registrados, A3, A4, A9, B2/B6 e interação em B7/B8 |
| 03 — Outra composição | Relatos já registrados, A5, A6, detalhes de A7, A9 e B6; limites de busca e casos controlados continuam cobertos separadamente por testes simulados |
| 04 — Compartilhamento | Relato de cópia inicial, A1/A2, A7 a A9 e limpeza/apresentação em B2/B6/B8 |
| 05 — Integração | Conjunto de A/B, comandos de verificação registrados, correções e atualização final das instruções |

Além de A/B, o fechamento do ticket 05 agora exige C1 e a regressão por TDD da primeira geração. Não confundir a reprodução da limitação atual com o teste pós-correção aprovado.

Nenhum status muda para concluído só por existir este mapa. Celular físico indisponível é uma limitação a registrar; não exige publicar o site nem impede executar os testes em tela estreita de navegador real. Eventuais pendências essenciais de navegador/layout continuam explícitas.

## Registro por caso

Copie este bloco para cada caso executado:

```text
Caso:
Data / responsável:
Navegador / versão / dispositivo / dimensões:
Dados e passos executados:
Resultado observado:
Evidência (relato, captura ou observação direta):
Status: passou / falhou / não executado
Limitações ou problema a corrigir:
```

### Execução do agente — 18/10/2026

- **C1 automatizado: passou por TDD**, na interface aprovada pelo usuário: eventos de seleção e Generate Teams com leitura da saída renderizada em DOM simulado. Comando `node tests/initial-team-balance.test.cjs`. Red observado: diferença `10 !== 8`; green: somas 12/20, tamanhos 3/2, total 32, participantes, avisos, seleção e texto corretos, sem gravação. Não marca a caixa C1 de navegador.
- **Regressão simulada: passou.** Trocas: 458 pares e casos adicionais; regeneração: 714 cenários e casos adicionais; compartilhamento, sintaxe e diferenças passaram. Um erro intermitente do teste antigo de compartilhamento foi reproduzido: pessoas homônimas mudavam de grupo com texto idêntico. Usados nomes distintos apenas no cenário que exige texto diferente, preservando asserções e a cobertura de homônimos nos demais. Depois, 20 execuções consecutivas passaram.
- **A1–A9, B1–B8 e C1 no navegador: não executados nesta sessão.** `cua.getState()` retornou `apps: []`, `browsers: []`; abrir `iab` em `about:blank` retornou `Browser is not available: iab`. Sem endereço, navegador/versão ou dimensões a registrar. Relatos anteriores não foram substituídos por evidência simulada.
- **B9: não executado**, sem acesso disponível a aparelho físico. Não houve publicação para viabilizar o teste.
- Próximo passo: quando houver acesso ao navegador, registrar ambiente e continuar A1 em sessão de teste isolada, incluindo C1 corrigido e depois as demais lacunas do roteiro. Manter tickets abertos até a comprovação correspondente.

### Retomada manual autorizada — 18/10/2026

- Nova tentativa de acesso: `cua.getState()` retornou `apps: []`, `browsers: []`; abertura de `iab` retornou `Browser is not available: iab`.
- A pedido do usuário, seguir manualmente um teste por vez, registrando relatos sem apresentá-los como observação direta do agente. Nenhum resultado anterior foi removido ou rebaixado; C1 automatizado e regressões permanecem comprovados nos limites registrados.
- **A1, primeira parte — aguardando relato:** selecionar Ana (1), Bruno (2), Carla (3), Diego (4) e Eva (5), sem goleiros, e gerar 2 times. Conferir tamanhos 3/2, cada nome uma vez, total geral 15, avisos simultâneos e texto com os grupos sem notas/totais. Registrar ambiente informado pelo usuário. Não marcar A1 completo sem conferir depois desmarcar Eva, invalidação e geração com quatro.

#### A1 — relato parcial do usuário — 18/10/2026

- Resultado informado: “2 times com skill 8 e outro com skill 7”. Confirmados dois times, com somas 8 e 7, total geral 15.
- Origem: relato do usuário, sem observação direta do agente.
- Ainda não confirmados: tamanhos 3/2, presença de cada participante uma vez, avisos simultâneos e texto compartilhável. Navegador/versão e uso de sessão isolada não informados. Invalidação ao desmarcar Eva e geração com quatro ainda pendentes.
- Status: parcial; A1 permanece desmarcado. Próxima conferência: integrantes e tamanhos dos dois times.

#### A1 — captura enviada pelo usuário — 18/10/2026

- Evidência visual na captura: seleção 5/5; cadastros ana (1), bruno (2), carla (3), diego (4), eva (5). Time 1 com eva, bruno e ana, soma 8; time 2 com diego e carla, soma 7. Tamanhos 3/2, os cinco participantes uma vez e total geral 15 confirmados.
- Share teams visível com os mesmos grupos e ordem: Team 1 / eva / bruno / ana; Team 2 / diego / carla. Sem notas ou totais no texto exibido. Não comprova cópia/colagem.
- Origem: inspeção da imagem fornecida pelo usuário; não é controle direto do navegador. O recorte não mostra os avisos nem identifica navegador/versão, sessão isolada ou dimensões efetivas da página.
- Status: A1 parcial. Próxima conferência: presença simultânea dos avisos de tamanhos diferentes e falta de goleiros. Depois, desmarcar Eva e conferir invalidação/geração com quatro. Não repetir integrantes, somas ou texto já comprovados sem motivo.

#### A1 — avisos simultâneos confirmados por captura — 18/10/2026

- Segunda captura fornecida pelo usuário mostra simultaneamente o aviso de quantidade não divisível por 2, tamanhos diferindo em um participante e `No fixed goalkeeper in teams: 1, 2`. Também mostra seleção 5/5 e quantidade de times 2.
- Origem: inspeção da imagem enviada; sem controle direto do navegador. O fim da mensagem está cortado na borda direita da imagem; não é possível distinguir recorte de captura de problema de layout. Conferir apresentação em B7/B8 antes de concluir esses critérios, sem declarar falha do aplicativo apenas por esta imagem. Dimensões da imagem não foram tratadas como dimensões efetivas da página; navegador/versão e sessão isolada ainda não informados.
- Primeira parte de A1 comprovada pelo conjunto de capturas e relato. A1 completo permanece pendente: próxima ação é desmarcar Eva e conferir seleção 4/5, remoção de times, texto/controles e avisos antigos; depois gerar novamente com quatro.

#### A1 — invalidação ao desmarcar Eva confirmada — 18/10/2026

- O usuário respondeu “isos mesmo” à conferência explícita de desmarcar Eva sem gerar novamente: times, Share teams, Swap players e avisos anteriores desapareceram; seleção ficou 4/5 e apareceu orientação para gerar novamente.
- Origem: relato do usuário, sem observação direta do navegador pelo agente.
- Status: A1 parcial. Falta somente gerar novamente com Ana (1), Bruno (2), Carla (3) e Diego (4), conferir tamanhos 2/2, participantes uma vez, ausência de aviso de tamanho e permanência do aviso de falta de goleiros nos dois times. Não repetir as partes anteriores já comprovadas.

#### A1 — geração com quatro confirmada; caso aprovado — 18/10/2026

- Duas novas capturas mostram seleção 4/5, Eva desmarcada, 2 times: diego/ana com soma 5 e carla/bruno com soma 5. Dois participantes por time, cada selecionado uma vez e Eva excluída.
- Aparece somente o aviso de falta de goleiros nos times 1 e 2, sem aviso de tamanhos diferentes. Share teams reaparece com Team 1 / diego / ana e Team 2 / carla / bruno, sem notas/totais; Swap players reaparece com campos vazios.
- Origem: inspeção das capturas fornecidas pelo usuário. Com as capturas e o relato anteriores, A1 foi aprovado. Não comprova cópia/colagem efetiva, dimensões da página, navegador/versão ou aparelho físico.
- Próximo passo: confirmar uso de sessão de teste isolada antes de ampliar os cadastros para A2. Não modificar ou apagar cadastros reais. Depois executar A2 em partes, começando por 15 selecionados em 3 times.

#### Ambiente e início de A2 — 18/10/2026

- O usuário confirmou “sim” à pergunta sobre uso de janela anônima ou perfil separado apenas para testes. Sessão isolada confirmada; não especificou qual das duas modalidades. Navegador/versão, sistema, endereço e dimensões efetivas continuam pendentes. Não inferir aparelho físico pelas capturas.
- A2, primeira parte proposta: manter ana (1), bruno (2), carla (3), diego (4), eva (5); cadastrar Player 06–Player 15, com notas respectivamente 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, todos sem goleiro. Selecionar os 15 e gerar 3 times. Esperado: 5 por time, todos uma vez, soma geral 70, sem aviso de tamanhos diferentes e com aviso de falta de goleiros nos três times. Aguardando resultado; não marcar A2 como aprovado.

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

O servidor confirmado pelo usuário carregou no navegador integrado em http://127.0.0.1:51805/. Nova aba com cadastro inicialmente 0/0; somente dados sintéticos nesta origem. A limitação anterior de acesso não se aplica a esta retomada. Evidência completa: [relatório de navegador](../.scratch/remaining-work/evidence/2026-10-18-browser-02/resultado.md).

A1 preservado. **Aprovados nesta execução: A2, A3, A5, A6, B1, B4, B5 e C1 no navegador.** A2: 15/3 → 5/5/5, somas 24/23/23; 15/2 → 8/7, somas 35/35; 10/3 → 4/3/3, somas 18/18/19. C1 passou pela primeira geração, 12/20, sem regenerar/trocar.

A4, A7–A9, B2/B3/B6–B8 permanecem parciais nos limites do relatório: cancelamento/aceitação controlada de exclusão, persistência específica da exclusão, exclusão durante decisão, colagem em editor local e percurso completo de selects pelo teclado ainda pendentes. Houve cópia real por Ctrl+A/C com clipboard exato após desfazer/aceitar/trocar e nomes literais; não equivale a colagem. Diálogo de Delete Ana expirou no controle; o cadastro sintético apareceu removido e foi recriado, sem considerar cancelamento aprovado ou diagnosticar defeito funcional.

Desktop 1280×720; tela estreita simulada 360×800 e 390×844, viewport restaurado. Fundo e áreas visíveis conferidos, sem rolagem horizontal nos estados testados. Versão do navegador não exposta; aparelho físico não testado. Nenhum código/teste alterado ou regressão reexecutada nesta retomada; TDD/regressões anteriores preservados. Sem instalação, commit, publicação ou contato externo. Servidor do usuário mantido. Ticket 01 concluído; 02–04 continuam aguardando lacunas. Etapa 05 continua aberta.

Próximo passo: A4 manual, cancelar exclusão de registro sintético mantendo times/texto/escolhas de troca. Depois preencher as demais lacunas, uma por vez. Não retomar A2 como se ainda não tivesse sido executado.
