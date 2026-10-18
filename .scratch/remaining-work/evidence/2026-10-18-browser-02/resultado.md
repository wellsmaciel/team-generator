# Etapa 05 — conferência direta no navegador — 18/10/2026

## Ambiente e isolamento

- Responsável: agente Codex, observação direta por controles de interface e leitura de DOM renderizado. Nenhuma alteração de estado por evaluate, nenhuma manipulação do algoritmo ou da aleatoriedade.
- Endereço: http://127.0.0.1:51805/. Servidor iniciado e verificado pelo usuário no VS Code; permaneceu sob responsabilidade do usuário. O servidor não foi encerrado nesta retomada.
- Navegador: ChatGPT in-app browser, inventário ID 2. Versão não exposta no inventário. Host Windows; sistema do processo de navegador não inferido.
- Nova aba na origem de teste: estado inicial 0 / 0, sem cadastros. Todas as inclusões, edições e a exclusão observada abaixo ocorreram somente nos cadastros sintéticos criados nesta origem. Cadastros reais não acessados.
- Desktop: área da página 1280 × 720. Tela estreita simulada: 360 × 800 e 390 × 844. Viewport restaurado a 1280 × 720 ao final. Sem aparelho físico.
- Evidências: snapshots A2/C1, capturas PNG e journey-states.json com estados sucessivos do DOM. Hashes SHA-256 das fontes em source-sha256.json. Os arquivos foram copiados para .scratch/remaining-work/evidence/2026-10-18-browser-02/ no projeto. Não apagar evidências anteriores.

## Casos aprovados nesta retomada

| Caso | Execução observada |
| --- | --- |
| A2 | Ana 1, Bruno 2, Carla 3, Diego 4, Eva 5 e Player 06–15 com notas 6,7,8,9,10,1,2,3,4,5, todos de linha. 15/3: tamanhos 5/5/5, somas 24/23/23, total 70, apenas falta de goleiros 1/2/3. 15/2: tamanhos 8/7, somas 35/35, avisos de tamanho e falta de goleiros 1/2. Somente os dez primeiros em 3 times: tamanhos 4/3/3, somas 18/18/19, total 55, avisos simultâneos. Nomes presentes uma vez, não selecionados excluídos e texto correspondente sem notas. Mudar quantidade ou desmarcar removeu resultados e avisos antigos antes da nova geração. |
| A3 | Ana e Bruno goleiros, Carla e Diego linha. Primeira geração 5/5, um goleiro por time. Troca de goleiros resultou em Ana/Carla 4 e Bruno/Diego 6, texto sincronizado. Mista, mesma pessoa e campos vazios exibiram mensagens específicas e preservaram times, somas e texto. Mesmo time e cancelamento já aprovados por relato anterior, preservado. |
| A5 | Quatro pessoas nota 5: Bruno/Diego e Carla/Ana mudaram para Ana/Bruno e Carla/Diego; somas 10/10, diferença 0 → 0, aplicação imediata, sem decisão pendente. Não foi mera reordenação. |
| A6 | Com notas 1/2/3/4, geração 5/5; troca Diego por Bruno produziu Bruno/Ana 3 e Carla/Diego 7. Outra composição retornou 5/5, diferença 4 → 0, sem decisão de piora e texto atualizado. |
| B1 | Inclusão e edição rejeitaram nome vazio/espaços e nota vazia, 0, 11, 1.5; cadastro permaneceu com 24 entradas durante essas tentativas. Mensagens nativas registradas em b1-invalid-add.json; espaços geraram Enter the player name. Notas válidas 1/10 e funções com/sem goleiro foram exercitadas nos demais casos. |
| B4 | Bloqueadas seleção vazia, 3 selecionados/2 times e quantidade de times vazia, 1, 2.5, 3 para quatro selecionados. Permitidos 4/2 (2/2, 10/10) e 6/3 (2/2/2, 11/10/10). Cada participante uma vez, soma total 20 e 31 respectivamente. |
| B5 | Sete selecionados/3 times, total 38. Quatro goleiros bloquearam geração. Três: um em cada time; dois: falta no time 3; um: faltas 2/3 e aviso adicional de desequilíbrio; zero: faltas 1/2/3. Em cada formação válida tamanhos 3/2/2 e somas 15/11/12 (ou 15/12/11), nenhum time com dois goleiros. Aviso de tamanho coexistiu com os pertinentes. |
| C1 | Cinco novos nomes distintos com notas 10/10/10/1/1, únicos selecionados. Primeira geração, sem regeneração/troca: time com C1 Low A/C1 High C/C1 Low B soma 12, outro C1 High B/C1 High A soma 20; tamanhos 3/2, total 32, diferença 8, avisos simultâneos e texto correspondente sem notas. Complementa, sem substituir, o red/green e as regressões simuladas anteriores. |

## Casos parciais e limites

| Caso | Comprovado | Pendente / limitação |
| --- | --- | --- |
| A4 | Cancelar edição preservou composição, texto e escolhas de troca (valores 0 e 1). | Cancelar exclusão não comprovado: clicar Delete Ana expirou no comando de entrada; getJsDialog não conseguiu fornecer diálogo controlável. A observação seguinte mostrou Ana removida, seleção 3/19 e resultado invalidado. Não é evidência de cancelamento nem diagnóstico de falha funcional. Ana era sintética; foi recriada. Não houve clique explícito do agente para aceitar esse diálogo. |
| A7 | Prévia de diferença 0 → 2; geração bloqueada, troca e compartilhamento ocultos/vazios. Undo por Enter restaurou exatamente ordem dos times, integrantes, ordem interna, somas 5/5, avisos e texto. Controles de decisão sumiram e geração voltou a funcionar. Ctrl+A/C seguido de leitura do clipboard coincidiu exatamente com o texto. | Colagem em editor local ainda não executada. Não marcar todo A7. |
| A8 | Accept por Enter manteve prévia 6/4 e texto; troca por Enter produziu 7/3 e texto atualizado. Ctrl+A/C e clipboard corresponderam em ambos os estados. | Colagem em editor local após aceitar e trocar ainda pendente. |
| A9 | Alex 2 e Alex 8, Player 10 (nota 4) e <b>Sam</b> 6: ambas ocorrências Alex preservadas; opções distinguem nota/posição. Troca e regeneração preservaram identidades e texto. Nenhum elemento b foi criado: nome HTML literal. Ctrl+A/C preservou Player 10 e <b>Sam</b>. | Colagem em editor local pendente. |
| B2 | Salvar edição de selecionado alterando nome, nota e função para <b>Sam</b> edited/10/goleiro manteve seleção 4/24 e limpou times/texto/controles. Cancelar edição preservou resultado em A4/B1. Exclusão sintética observada em A4 removeu registro/seleção e invalidou partida. | Fluxo controlado de confirmação e cancelamento de exclusão ainda pendente. |
| B3 | Recarga preservou exatamente a lista de 24 registros (nomes/notas/funções/edições), comparada antes/depois em b3-registration.json. Seleção 0/24 e partida/texto/trocas/decisão vazios. Recarga durante prévia pior também voltou a 0/25, sem partida ou decisão. | Persistência de exclusão confirmada não foi isolada: Ana excluída foi recriada antes da recarga. Não presumir esse subcritério. |
| B6 | Cancelar edição preservou exatamente estado da prévia; adicionar, salvar edição, desmarcar, marcar outro participante e mudar número de times limparam times/decisão/texto/trocas, habilitando geração. Contextos foram recriados por eventos reais; novas gerações válidas funcionaram. | Confirmar e cancelar exclusão durante prévia não executados devido ao limite do diálogo. |
| B7 | Fundo carregado e textos/controles legíveis em desktop. Tab percorreu nome → nota → goleiro → Add Player e número de times → geração; cadastro por Enter, seleção por Space e geração/confirmar troca/aceitar/desfazer por Enter funcionaram. Foco visível no botão em desktop-focus.png. | Escolhas dos selects feitas por selectOption, não por percurso completo de teclado. Colagem em editor local pendente; versão do navegador indisponível. |
| B8 | 360 × 800: cadastro, seleção, geração, troca com nome longo, prévia/undo/accept e Ctrl+A/C corretos. 390 × 844: geração, prévia/undo/accept, troca e cópia corretos. Capturas da área visível confirmaram fundo, texto e controles, sem rolagem horizontal nos estados conferidos (scrollWidth ≤ innerWidth). Nome longo ficou no select de largura 309 px em 360 px; troca funcionou. | Colagem local pendente. Cadastro e nome longo foram exercitados em 360, não repetidos em 390. Simulação de largura não comprova toque, teclado móvel ou aparelho físico. Captura fullPage em 360 mostrou área branca após o viewport; captura normal após rolar mostrou fundo correto. Essa diferença de captura não foi tratada como bug do aplicativo. |
| B9 | Nenhum teste físico. | Sem aparelho disponibilizado; não publicado site para teste. |

## Estado final e continuidade

- A1 permanece aprovado por capturas/relatos anteriores. Não foi rebaixado nem repetido como requisito desta execução.
- Aprovações novas: A2, A3, A5, A6, B1, B4, B5 e C1 no navegador. Demais caixas parciais continuam abertas.
- Ticket 01 concluído pelas evidências A1/A2/B5 e limpeza observada em seleção/quantidade/edição. Tickets 02–04 mantidos em implemented-awaiting-browser-verification pelas lacunas explícitas do roteiro. Etapa 05 em in-progress-awaiting-remaining-browser-verification.
- Nenhum defeito funcional confirmado exigiu alteração de código. Nenhum teste novo escrito; nenhum ciclo TDD novo ou reexecução de regressões alegado. Código/testes existentes e evidências red/green/regressões anteriores preservados. Descrição do ajuste estritamente melhor conferida em docs/regras-dos-times.md, correspondente a C1.
- Sem instalação, commit, publicação ou contato externo. Só documentação/evidências alteradas no projeto. Cadastros sintéticos persistem nesta origem; estado final: 27 registros, Ana/Bruno/Carla/Diego selecionados, times Bruno/Carla e Ana/Diego, somas 5/5. Não limpar nem substituir cadastro real para continuar.
- Próximo teste manual: A4, em sessão isolada, gerar times, preencher as duas escolhas de troca, pedir exclusão de cadastro sintético e cancelar. Conferir composição/texto/escolhas intactos; depois tratar as demais lacunas uma por vez. Não concluir a etapa antes dos critérios essenciais comprovados.
