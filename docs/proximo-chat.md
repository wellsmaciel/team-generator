# Resumo para o próximo chat

> **Regra vigente para 04/05 (atualizada em 21/10/2026):** a regra única está em [coordenação por hooks](agents/coordenacao-por-hooks.md#regra-vigente--tarefas-04-e-05-atualizada-em-21102026) e prevalece sobre qualquer outro texto. Resumo: o Claude escreve o RED e verifica cada GREEN; o Codex implementa o mínimo e nunca faz staging nem commit. O commit de cada tarefa é feito pelo Claude num chat novo, aberto pelo Codex raiz pelo runner, logo depois do próprio `/ecc:code-review`, sem achado crítico, alto ou médio. Uma tarefa por vez (04, depois 05); sem 06/07 e sem publicação do site. Push, PR e merge de cada tarefa, depois do commit validado, cabem à sessão raiz; a release sai uma vez, depois da 05. Passagens e critérios antigos que mandam parar antes do commit estão superados para 04/05.

## Estado atual — 21/10/2026 (tarefa 05)

**Tarefa 05 concluída em 21/10/2026, commitada em `9f8ae63` (merge `5ded6c5`)** (ciclos 1–13, ticket `.scratch/mobile-first-planning/issues/05-match-selection-and-teams.md`): o app abre em Match; sem cadastros há orientação e Add players; a seleção tem linha inteira tocável; Match tem as etapas Select players e Teams, com Back to selection e View teams (decisão do usuário de 21/10/2026); impedimentos de geração aparecem em Select players; mudança real que invalida os times volta à seleção com o motivo visível; o foco acompanha só mudanças reais de etapa; Teams mostra cartões lado a lado quando cabem e empilhados no celular. Verificação independente final: 150 aprovados e 12 ignorados por desenho nos três viewports; na sessão TDD o desktop teve 50 aprovados e 4 ignorados por desenho (Chromium, viewports simulados 360/390/768/1280, sem aparelho físico); quatro scripts Node aprovados. Algoritmo, persistência e formato do texto compartilhado não mudaram. **Próxima ação:** a release `v1.4.0` (versão 1.4.0 no `package.json`, no `package-lock.json` e no rodapé) fecha a rodada das tarefas 04 e 05. Sem 06/07 nem publicação do site sem decisão do usuário; o relé foi desligado (sentinela `disabled`) e a automação desta autorização terminou.

## Estado anterior — 21/10/2026 (tarefa 04, histórico)

**Situação:** a tarefa 04 foi implementada por ciclos TDD (1–16), com Claude escrevendo o RED e Codex o mínimo de HTML/CSS: Bootstrap 5.3.3 local, navegação Players/Match (inferior no celular, superior em telas maiores), roster e formulário de Players, nomes longos, foco, dados preservados. O sinal de pronto anterior foi **rejeitado** pela conferência de especificação (`.scratch/mobile-first-planning/evidence/04-visual-2026-10-21/desktop-review/findings.md`): a prévia aprovada tem variante Desktop com roster à esquerda e formulário à direita, e a nossa afirmação de que ela só definia o celular era falsa. O **ciclo 16** corrigiu isso (grade 1,5fr/1fr a partir de 768 px, roster em coluna única, campos e botão ocupando o painel). Também corrigimos duas expectativas erradas nossas nos testes (ciclos 5 e 11) e acrescentamos um teste de aceitação de tablet 768 (emulação, não aparelho físico). Verificação independente: 110 aprovados e 10 ignorados por desenho no Chromium; quatro scripts Node aprovados; capturas em `evidence/04-visual-2026-10-21/final-layout-responsive/`.

**Próxima ação (histórico, cumprida: a 04 foi commitada em `04adc65` e mergeada em `804dea5`):** o Codex raiz abria, pelo runner, o chat de revisão e commit do Claude para a 04 (a tentativa de 21/10/2026 terminou em erro de API, sem commit). Antes, o ticket 04 precisa terminar com o marcador `TASK04_READY_FOR_CONDITIONAL_COMMIT` depois do registro do ciclo 16. Nesse chat o Claude executa o `/ecc:code-review` e, sem achado crítico, alto ou médio, faz o commit logo em seguida; depois troca o ticket ativo para a 05. Depois do commit validado de cada tarefa, a sessão raiz faz push, PR e merge (decisão do usuário em 21/10/2026); a release `v1.4.0` sai depois da 05. Sem 06/07 nem publicação do site; depois do commit da 05, o chat cria o sentinela `disabled` e a automação termina. Ver a [regra vigente](agents/coordenacao-por-hooks.md#regra-vigente--tarefas-04-e-05-atualizada-em-21102026).

**Proveniência:** documentos preexistentes à automação (planejamento aprovado) estão preservados em `evidence/automation-2026-10-20/preexisting-docs.patch` e `preexisting-status.txt`; este estado atual e as notas datadas de 21/10/2026 são trabalho novo. O texto abaixo sobre “preparação documental” e “configurar hooks” é **histórico** de 20/10/2026 e não é a próxima ação.

## Histórico — planejamento de 20/10/2026 (superado pelo estado atual)

**Planejamento mobile first aprovado — 20/10/2026:** usuário aprovou Bootstrap, disposição da prévia e divisão em tarefas 04–07. Ver [plano](plano-mobile-first.md) e [tickets](tarefas.md). Naquela data, aplicativo, testes, dependências e configuração dos hooks não haviam sido alterados; a preparação do acionamento (início Claude, retorno, interrupção, lock) foi comprovada em seguida, conforme a evidência de preparação citada no topo.

**Limite original:** uma tarefa por vez, com revisão independente. Sem push, PR, merge, release ou publicação automática. Não executar 06–07 sem continuidade explícita do usuário. A parada pré-commit original foi substituída, só para 04/05, pela autorização vigente no topo.

**Tarefa 03 validada — 20/10/2026:** validação integrada executada por Codex (regressões) e Claude (verificação independente, fluxo integrado novo e foco do Select All Players); suíte Chromium com 61 aprovados, 5 ignorados por desenho e 0 falhas; quatro scripts Node aprovados. Nenhum defeito encontrado, nenhum código do aplicativo alterado. Revisada pelo usuário e integrada em `main` por commit, PR e merge a pedido explícito, sem nova release: o aplicativo não mudou e a versão exibida continua `v1.3.0`. Ver `.scratch/usability-2026-10-19/issues/03-validate-usability-round.md`. **Segunda rodada encerrada**; nenhuma tarefa nova está autorizada.

**Tarefas 02 e 02a concluídas — 20/10/2026:** revisadas pelo usuário e entregues nas versões `1.2.0` (geração após a seleção) e `1.3.0` (Select All Players), com commit, PR, merge e release feitos a pedido explícito. O relé Codex ↔ Claude por hooks rodou de ponta a ponta nos dois ciclos do 02a; a autorização da coordenação terminou com o ticket. Ver [acordo e requisitos dos hooks](agents/coordenacao-por-hooks.md).

**Pasta vigente desde 19/10/2026:** `C:\VSC Projects\team-generator`, fora do OneDrive. Preservar a cópia antiga; não trabalhar nela.

Atualizado em 19/10/2026. **Tickets 01 a 05 da primeira rodada concluídos**, com critérios essenciais comprovados. Na segunda rodada, **tarefa 01 (Copy teams) concluída** nesta data — ver fechamento em `.scratch/usability-2026-10-19/issues/01-copy-teams-button.md`. **Tarefa 02 concluída em 20/10/2026** — ver fechamento em `.scratch/usability-2026-10-19/issues/02-generate-after-player-selection.md`. **Select All Players (ticket 02a) concluído em 20/10/2026** — ver fechamento em `.scratch/usability-2026-10-19/issues/02a-select-all-players.md`. **Tarefa 03 concluída em 20/10/2026**; segunda rodada encerrada, sem nova funcionalidade autorizada.

## Plano aprovado para 19/10/2026 — segunda rodada

O usuário aprovou [o plano](plano-2026-10-19.md): Copy teams, posicionar a geração após a lista de participantes e validar a integração. Tickets individuais publicados em `.scratch/usability-2026-10-19/issues/`, usando `to-tickets`. [Índice e prompts](tarefas.md) indicam a rodada e os arquivos completos para não confundir com tarefas antigas.

**Tarefa 01 (Copy teams) concluída em 19/10/2026**, com 8 ciclos de lógica (RED/GREEN, cada um verificado independentemente) mais verificação de apresentação/teclado nas larguras desktop, 360 e 390. Nenhum defeito funcional pendente; limitações explícitas no fechamento do ticket (sem aparelho físico, sem recusa manual real de permissão de clipboard, inventário de ZIPs ainda preservado sem exclusão aprovada).

O fechamento acima refere-se à segunda rodada. Próxima rodada planejada: mobile first, tarefas 04–07, conforme a atualização no início deste documento; ideias antigas não incorporadas ao plano continuam em [pendências](pendencias.md).

O índice de tarefas foi limpo de instruções contraditórias de etapas ainda abertas. Os prompts anteriores foram preservados em [arquivo histórico](tarefas-01-05-historico.md); não retomá-los automaticamente. Playwright já existe e será aproveitado. Os testes Node atuais são scripts com asserções, não uma suíte já migrada para `node:test`. Não adicionar Jest/Supertest nem migrar todos os testes sem necessidade concreta.

Base histórica anterior à segunda rodada: HEAD `2533789a3dcc16686c6e58d4d05655d13e4aa764`, tag `v1.0.0`. A afirmação de working tree limpa e de nenhuma alteração de aplicativo/teste refere-se apenas à preparação documental de 18/10/2026. A segunda rodada acrescentou Copy teams, testes e evidências, conforme o ticket concluído. Em 19/10/2026, o usuário autorizou commit, PR, merge e nova release desta entrega; a versão preparada é `1.1.0`. Em 20/10/2026, o mesmo para a tarefa 02, versão `1.2.0`, e para o ticket 02a, versão `1.3.0`. Consultar Git/GitHub para confirmar o estado da publicação, sem inferi-lo de passagens históricas.

## Evidências e estado final da primeira rodada (histórico)

- [Relatório final de Playwright](../.scratch/remaining-work/evidence/2026-10-18-playwright-03/resultado.md): 6 testes passaram em Chromium 156.0.8078.4, Windows, nas áreas 1280×720, 360×800 e 390×844. Exclusão durante prévia, limpeza completa, geração posterior, selects por Tab/setas, aceitar/desfazer e cópia/colagem verificados pela interface pública.
- [Relatório integrado anterior](../.scratch/remaining-work/evidence/2026-10-18-browser-02/resultado.md): A2/A3/A5/A6/B1/B4/B5/C1 e partes dos demais casos, preservados com sua origem.
- A1 comprovado por capturas/relatos. A4/B2/B3 e cancelamento de exclusão durante prévia completados por capturas/relatos do usuário em sessão isolada :5500; esses relatos não são execução direta do Playwright.
- A7/A8/A9/B6/B7/B8 completados com Playwright. A1–A9, B1–B8 e C1 aprovados no [roteiro](testes-manuais-etapa-05.md).
- C1 corrigido por TDD anteriormente: red com diferença 10, esperada 8; green com 12/20 e tamanhos 3/2. Primeira geração também aprovada no navegador, sem regeneração ou troca manual para fazer passar.
- Reexecutados com sucesso: sintaxe de script.js, C1, 458 pares de trocas e casos adicionais, 714 cenários de regeneração e casos adicionais, compartilhamento. Testes Node continuam classificados como DOM/armazenamento simulados.
- Nesta execução: infraestrutura/testes Playwright, package.json e lockfile adicionados. Nenhum código do aplicativo ou cadastro real alterado; nenhuma nova falha funcional exigiu correção. Testes de comportamento existente são aceitação, não um novo ciclo TDD.
- [Resumo anterior arquivado](../.scratch/remaining-work/evidence/2026-10-18-playwright-03/proximo-chat-antes-do-fechamento.md). Próximos passos parciais em registros antigos são históricos, não trabalho a repetir.

## Reexecução

O aplicativo continua estático, abrindo por index.html e sem dependências de execução. Playwright é dependência de desenvolvimento autorizada. No PowerShell:

```powershell
npm.cmd ci --cache .scratch/npm-cache
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location) '.scratch/playwright-browsers'
npx.cmd --no-install playwright install chromium
npm.cmd run test:browser
```

O servidor de teste usa somente 127.0.0.1:51806, inicia/encerra com os testes e não depende dos servidores manuais :5500/:51805. Cada teste abre contexto vazio, sem perfil real. Relatórios temporários ficam em .scratch/playwright-results e .scratch/playwright-report; cópias do fechamento foram arquivadas junto ao relatório final.

## Limitações separadas

- B9 não executado: sem aparelho físico disponibilizado. Larguras 360/390 são simulações; toque e teclado móvel não foram comprovados. O roteiro considera B9 condicional, sem marcá-lo como teste aprovado.
- Cópia/colagem verificada por Ctrl+C/Ctrl+V em editor de texto local servido em outra página do navegador. Sem colagem em Bloco de Notas/Word ou mensageiro nativo e sem envio a terceiros.
- Geração sem ótimo global: greedy com capacidades e goleiros, seguido de trocas de mesma função que reduzam estritamente a diferença maior/menor soma até nenhuma melhorar. Término por redução inteira. Regeneração mantém 64 distribuições aleatórias e enumeração de trocas simples válidas, sem histórico geral.
- Capturas fullPage com fundo fixo podem mostrar área branca fora do viewport; capturas normais após rolar mostram fundo correto. Não foi diagnosticado defeito do produto por esse artefato.

## Orientações vigentes

- Explicar em português, com respostas curtas; código, comentários, interface e novos nomes de testes em inglês.
- Preservar alterações locais, dados reais e evidências. Sem commit, publicação ou contato com terceiros sem pedido.
- TDD nas próximas correções/funcionalidades autorizadas: confirmar comportamento/interface, observar falha antes de corrigir, sem fabricar red para comportamento já existente. Interface pública de navegador e instalação Playwright aprovadas nesta conversa; ver [procedimento](desenvolvimento-tdd.md).
- Copy teams (tarefa 01) e reposicionamento de Generate Teams (tarefa 02) concluídos. Trabalhar apenas no ticket escolhido. Login/backend/sincronização ou persistência da partida continuam fora do escopo.
- Não retomar entrevista de teste ou repetir etapas comprovadas sem alteração, falha ou pedido do usuário.
