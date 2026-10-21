> **Estado atual (21/10/2026):** tarefa 06 concluída em `7f057ca`; a 07 foi autorizada, executada e validada (validação integrada, uma correção mínima de contraste do rodapé); a revisão independente e o commit condicional exclusivo de Claude ficam registrados no [ticket 07](../.scratch/mobile-first-planning/issues/07-integrated-responsive-validation.md) e no `git log`. Parar após o commit validado da 07. Vale o início de [coordenação](agents/coordenacao-por-hooks.md); avisos anteriores sobre não iniciar 07 são históricos.

> **Histórico (autorização da 06, superada):** executar 06 com TDD e commit condicional exclusivo de Claude; encerrar após o commit validado de 06, sem iniciar 07. Sem push/PR/merge/release/publicação. A regra atual está no início de [coordenação](agents/coordenacao-por-hooks.md). Regras de 04/05 abaixo são históricas.

# Plano aprovado — mobile first, tarefas 04–07

> **Regra vigente para 04/05 (atualizada em 21/10/2026):** a regra única está em [coordenação por hooks](agents/coordenacao-por-hooks.md#regra-vigente--tarefas-04-e-05-atualizada-em-21102026) e prevalece sobre qualquer outro texto. Resumo: o Claude escreve o RED e verifica cada GREEN; o Codex implementa o mínimo e nunca faz staging nem commit. O commit de cada tarefa é feito pelo Claude num chat novo, aberto pelo Codex raiz pelo runner, logo depois do próprio `/ecc:code-review`, sem achado crítico, alto ou médio. Uma tarefa por vez (04, depois 05); sem 06/07 e sem publicação do site. Push, PR e merge de cada tarefa, depois do commit validado, cabem à sessão raiz; a release sai uma vez, depois da 05. Passagens e critérios antigos que mandam parar antes do commit estão superados para 04/05.

**Estado em 21/10/2026:** a tarefa 04 está commitada (`04adc65`, merge `804dea5`); a 05 está concluída (ciclos 1–13, `9f8ae63`, merge `5ded6c5`); a 06 está commitada em `7f057ca` e a 07 está validada, com revisão independente e commit registrados no ticket 07 (a frase original “06 e 07 seguem planejadas” é histórica). A disposição aprovada inclui a variante **Desktop** da prévia (`.tg-columns` com grade 1,5fr/1fr: roster à esquerda, formulário à direita em largura maior; empilhados no celular, ordem DOM lista → formulário). O texto a seguir é o planejamento original de 20/10/2026, mantido como histórico (proveniência: `evidence/automation-2026-10-20/preexisting-docs.patch`).

Aprovado em 20/10/2026 após entrevista e prévia visual. **Planejamento aprovado; implementação não iniciada (histórico — ver o estado acima).** Pasta vigente: `C:\VSC Projects\team-generator`. Base conferida: `8d79efd`, segunda rodada concluída e Git limpo antes da criação da prévia. A numeração 04–07 foi escolhida pelo usuário para esta nova rodada; não corresponde aos tickets da primeira rodada.

## Objetivo e referência aprovada

Organizar a experiência primeiro para celular e aproveitar adequadamente tablet e desktop. Manter o cadastro reaproveitável, a geração, as regras de times e os recursos de revisão/compartilhamento existentes.

A disposição foi aprovada pelo usuário: “Vamos manter essa disposição”. Referência: [prévia navegável](../.scratch/mobile-first-planning/team-generator-preview.html), com capturas de [celular](../.scratch/mobile-first-planning/mobile-selection.png) e [desktop](../.scratch/mobile-first-planning/desktop-teams.png). A prévia usa dados fictícios e interações demonstrativas: não é o aplicativo, não comprova algoritmo, persistência, invalidação ou acessibilidade e não deve substituir a lógica existente. Reproduzir a organização aprovada, não copiar seus atalhos de demonstração. A conferência da prévia confirmou navegação e ausência de erros JavaScript, sem validar o novo produto.

## Decisões confirmadas

- Bootstrap como base, mantendo HTML, CSS e JavaScript. Não migrar para React. Fixar a versão escolhida na implementação; evitar adicionar ferramentas de build sem necessidade concreta.
- Duas áreas: **Players**, para cadastrar, editar e excluir; **Match**, como área principal para organizar a partida.
- Match com duas etapas: **Select players** (seleção e quantidade de times) e **Teams** (resultado, nova composição, decisões, trocas e compartilhamento). Gerar com sucesso leva a Teams; voltar permite rever a seleção.
- Apenas navegar preserva seleção, quantidade de times e resultados. Mudanças reais de participantes ou quantidade invalidam o resultado e exigem geração, conforme a regra atual. Preservar também a invalidação existente ao salvar edição/confirmar exclusão; cancelar não altera o resultado.
- A foto esportiva permanece, com cartões escuros suficientemente opacos e texto legível. A cor de destaque verde e o espaçamento da prévia são a referência visual, ajustáveis quando necessário para contraste e acesso.
- Celular: navegação inferior fixa entre Players e Match. Tablet/desktop: navegação superior e melhor aproveitamento de largura; jogadores em mais colunas e times lado a lado quando houver espaço.
- Em Select players, toda a linha é tocável para marcar/desmarcar. Exibir nome, nota e condição de goleiro junto ao checkbox. Edit e Delete ficam em Players. Preservar Select All Players e seu estado desabilitado sem cadastros/com todos selecionados.
- Sem cadastros, Match mostra orientação e **Add players** levando a Players. Nos acessos seguintes, mostrar cadastros disponíveis e seleção inicialmente vazia, sem persistir a partida.
- Texto compartilhado: título de cada time, um jogador por linha precedido de `• ` e uma linha em branco entre times. Mesmo conteúdo na cópia manual e em Copy teams; nomes literais preservados, sem notas, totais ou indicação de função.
- Código, comentários, interface e novos nomes de testes em inglês; explicações e registros em português, uma pergunta por vez.

## Entregas e dependências

| Tarefa | Entrega verificável | Bloqueios |
| --- | --- | --- |
| [04 — Players e navegação responsiva](../.scratch/mobile-first-planning/issues/04-responsive-players-navigation.md) | Cadastro gerenciável na nova área e acesso a Match, com visual Bootstrap e dados preservados | Preparação da passagem automática (cumprida em 20/10/2026); implementada em 21/10/2026 e commitada em `04adc65` (merge `804dea5`) |
| [05 — Match em etapas](../.scratch/mobile-first-planning/issues/05-match-selection-and-teams.md) | Selecionar, gerar, rever, trocar e compartilhar no novo fluxo, com estados coerentes | 04 |
| [06 — Texto para compartilhar](../.scratch/mobile-first-planning/issues/06-share-text-format.md) | Texto com marcadores correto após todas as ações relevantes | 05; sequência aprovada. Estado em 21/10/2026: concluída e commitada em `7f057ca` |
| [07 — Validação integrada](../.scratch/mobile-first-planning/issues/07-integrated-responsive-validation.md) | Jornada validada e documentação pronta para revisão final | 04, 05 e 06. Estado em 21/10/2026: validada (footer com contraste corrigido); revisão e commit no ticket 07 |

Não fazer uma migração de todas as telas de uma só vez. Cada ticket deve deixar um percurso funcional demonstrável; a tarefa 04 mantém Match utilizável enquanto a 05 reorganiza suas etapas. Alterar um comportamento por ciclo TDD. Se a descoberta técnica exigir nova divisão ou decisão de produto, apresentar ao usuário antes de ampliar o escopo.

## Preparação da passagem automática (histórico de 20/10/2026 — cumprida)

Antes da implementação da tarefa 04, configurar e testar o acionamento inicial do Claude pelo Codex. A passagem existente comprovou Claude → Codex CLI → Claude no 02a; o início por esta conversa ainda não foi resolvido. Não prometer que um arquivo de passagem inicia outra ferramenta por si só.

Reaproveitar o mecanismo existente quando possível, identificar a sessão acionada, registrar comandos/logs e impedir edições simultâneas. Não repetir o modo background que bloqueou escrita por exigir worktree sem preparar o isolamento e o acesso aos arquivos necessários. Se usar isolamento, planejar a preservação das alterações locais e a revisão da integração, sem commit automático. Testar acionamento, retorno, interrupção e parada antes do commit sem modificar o aplicativo. Preservar configurações, histórico e logs anteriores. Essa preparação é pré-requisito da 04, não uma autorização para executar agora.

Depois: Claude prepara teste/RED; Codex implementa o mínimo e executa verificações; Claude verifica independentemente. Aceitação de comportamento existente não exige RED artificial. Quando uma decisão do usuário for necessária, parar com uma pergunta, sem inventar resposta.

## Verificação e limites

Antes de novos testes, combinar comportamento e interface pública conforme a [orientação TDD](desenvolvimento-tdd.md). A aprovação do desenho não confirma automaticamente todos os futuros testes. Playwright pela interface pública e regressões Node pertinentes; não acessar funções privadas nem substituir asserções por snapshots da implementação.

Cobrir celular 360×800/390×844, tablet 768×1024 e desktop 1280×720, listas e nomes longos, teclado, foco e toque quando disponível. Barras fixas não podem esconder controles, mensagens ou campos com teclado aberto; ordem visual e DOM coerentes, zoom/reflow e ações sem depender de hover. Registrar navegador, dimensão e origem de cada evidência. Emulação não comprova aparelho físico. Testar um comportamento novo por ciclo; não acumular todos os testes antes de implementar.

Manter as regras de quantidade/goleiros/equilíbrio, prévia com aceitar/desfazer, trocas, Copy teams, fallback manual e proteção contra feedback assíncrono obsoleto. Navegar não pode aceitar/desfazer uma prévia silenciosamente. Guardar somente os cadastros como hoje; não incluir login, backend, sincronização, desmarcar todos ou funcionalidades adicionais.

Para 04 e 05 vale a [regra vigente](agents/coordenacao-por-hooks.md#regra-vigente--tarefas-04-e-05-atualizada-em-21102026): o Claude faz o commit no chat de revisão e commit, e a 05 começa depois do commit da 04. *Histórico (superado):* o plano original mandava a 06 e a 07 pararem em **“Pronto para revisão do usuário antes do commit”**; foi substituído pelas autorizações condicionais de cada uma (ver [coordenação](agents/coordenacao-por-hooks.md)), que seguem o fluxo de revisão e commit por Claude. Sem push, PR, merge, release ou publicação automática; não iniciar o ticket seguinte sozinho. A autorização anterior para publicar o site não vale como publicação automática desta rodada. Preservar cadastros, alterações locais, ZIPs e todas as evidências, seguindo a [política de arquivos](agents/gestao-de-arquivos.md).

Preferir evidência textual e capturas úteis por tarefa; não multiplicar relatórios/ZIPs. Site publicado e protótipo permanecem separados do aplicativo em implementação.
