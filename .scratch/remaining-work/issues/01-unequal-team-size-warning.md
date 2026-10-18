# 01: Avisar sobre times com quantidades diferentes

**What to build:** o organizador recebe um aviso em inglês quando a quantidade de participantes não permite times do mesmo tamanho, sem impedir a geração válida. A diferença de tamanho continua sendo no máximo 1 participante.

**Blocked by:** None (can start immediately).

**Status:** completed

- [x] Total não divisível pela quantidade de times apresenta aviso claro sobre tamanhos diferentes.
- [x] 15 participantes em 3 times não apresentam esse aviso; 15 em 2 apresentam, com tamanhos 8 e 7. Quantidade par também avisa quando não divisível, como 10 em 3.
- [x] Geração continua respeitando mínimo de 2 participantes por time, seleção e goleiros; o aviso não substitui os avisos de goleiros.
- [x] Ao gerar uma divisão igual ou limpar o resultado por uma alteração, não permanece aviso desatualizado de tamanhos diferentes.
- [x] Verificar casos divisíveis e não divisíveis, apresentar o aviso no fluxo real da página e registrar evidências e limitações.
- [x] Atualizar o registro de conclusão e o resumo de continuidade, preservando os cadastros salvos.

## Implementação e evidências — 18/10/2026

- `script.js`, em `generateTeams`: acrescentado aviso em inglês à lista existente quando `selected.length % teamCount !== 0`, após as validações e a geração. O texto explica que os tamanhos diferem em um participante. A geração e os avisos de goleiros permanecem no mesmo fluxo.
- `node --check script.js`: passou.
- Execução em Node.js do código atual com DOM e armazenamento simulados: passaram 1.407 combinações válidas, com 4 a 30 participantes, todas as quantidades válidas de times e de goleiros. Conferidos aviso por divisibilidade, mínimo de 2 por time, diferença máxima de 1, inclusão exclusiva dos selecionados sem duplicação, limite de 1 goleiro por time e coexistência dos avisos de goleiros.
- Exemplos conferidos: 15/3 → 5, 5, 5 sem aviso de tamanho; 15/2 → 8, 7 com aviso; 10/3 → 4, 3, 3 com aviso.
- Conferida a remoção do aviso ao mudar seleção ou quantidade de times, salvar edição e confirmar exclusão; cancelar edição preserva os times. Nova geração divisível substitui o aviso anterior. Seleção vazia, mínimo insuficiente e excesso de goleiros continuam impedindo geração.
- Cadastros antigos sem `isGoalkeeper` carregaram na simulação. Geração e seleção não escreveram no armazenamento; apenas salvar edição e excluir fizeram as duas gravações esperadas. Nenhum cadastro real foi acessado ou alterado. Não houve mudança na persistência, algoritmo ou identidade dos jogadores, instalação de dependências, commit ou publicação.

## Limitação e próximo passo

Evidência parcial de navegador reaproveitada da etapa 05, caso A1 aprovado em 18/10/2026: capturas do usuário mostram 5/2 com tamanhos 3/2 e avisos simultâneos de tamanhos diferentes e falta de goleiros. O usuário confirmou que desmarcar Eva removeu os resultados e avisos; novas capturas mostram 4/2 com tamanhos 2/2 e somente aviso de falta de goleiros. Origem: capturas e relato, sem controle direto do navegador. Permanecem os casos 15/3, 15/2 e 10/3 de A2 e as demais pendências de apresentação/invalidação do roteiro; status não alterado para concluído.

Não concluída: falta a conferência no fluxo real da página. A ferramenta de controle informou inventário de navegadores vazio e `Browser is not available: iab` ao tentar abrir um navegador. Os resultados acima são simulados, sem validação visual em navegador ou celular.

Para finalizar, abrir `index.html` em navegador e conferir 15/3, 15/2 e 10/3 com os tamanhos descritos, coexistência dos avisos de goleiros e remoção do aviso após mudar seleção ou quantidade de times. Usar cadastro de teste em ambiente separado para preservar os dados existentes. Registrar o resultado e só então concluir o critério pendente e o ticket.


## Navegador acessível e validação direta — 18/10/2026

O servidor confirmado pelo usuário carregou no navegador integrado em http://127.0.0.1:51805/. Nova aba com cadastro inicialmente 0/0; somente dados sintéticos nesta origem. A limitação anterior de acesso não se aplica a esta retomada. Evidência completa: [relatório de navegador](../evidence/2026-10-18-browser-02/resultado.md).

A1 preservado. **Aprovados nesta execução: A2, A3, A5, A6, B1, B4, B5 e C1 no navegador.** A2: 15/3 → 5/5/5, somas 24/23/23; 15/2 → 8/7, somas 35/35; 10/3 → 4/3/3, somas 18/18/19. C1 passou pela primeira geração, 12/20, sem regenerar/trocar.

A4, A7–A9, B2/B3/B6–B8 permanecem parciais nos limites do relatório: cancelamento/aceitação controlada de exclusão, persistência específica da exclusão, exclusão durante decisão, colagem em editor local e percurso completo de selects pelo teclado ainda pendentes. Houve cópia real por Ctrl+A/C com clipboard exato após desfazer/aceitar/trocar e nomes literais; não equivale a colagem. Diálogo de Delete Ana expirou no controle; o cadastro sintético apareceu removido e foi recriado, sem considerar cancelamento aprovado ou diagnosticar defeito funcional.

Desktop 1280×720; tela estreita simulada 360×800 e 390×844, viewport restaurado. Fundo e áreas visíveis conferidos, sem rolagem horizontal nos estados testados. Versão do navegador não exposta; aparelho físico não testado. Nenhum código/teste alterado ou regressão reexecutada nesta retomada; TDD/regressões anteriores preservados. Sem instalação, commit, publicação ou contato externo. Servidor do usuário mantido. Ticket 01 concluído; 02–04 continuam aguardando lacunas. Etapa 05 continua aberta.

Próximo passo: A4 manual, cancelar exclusão de registro sintético mantendo times/texto/escolhas de troca. Depois preencher as demais lacunas, uma por vez. Não retomar A2 como se ainda não tivesse sido executado.
