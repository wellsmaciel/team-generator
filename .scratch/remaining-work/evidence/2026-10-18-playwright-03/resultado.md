# Etapa 05 — fechamento com Playwright — 18/10/2026

## Autorização e interface

O usuário confirmou a instalação do Playwright como dependência de desenvolvimento e testes pela interface pública: cliques, teclado, diálogos e saídas visíveis em navegador isolado. A automação começou pela pendência de B6 e depois cobriu as lacunas de colagem e teclado. Nenhum teste acessa variáveis ou funções internas do aplicativo, injeta estado de partida ou substitui aleatoriedade. Os dados são cadastrados pelo formulário.

Os comportamentos já estavam implementados: os testes passaram sem mudar `index.html`, `script.js` ou `styles.css`. São verificações de aceitação de comportamento existente, **não um novo ciclo TDD**. O red/green de C1 anterior permanece registrado, sem alegação retroativa de TDD para estes testes.

## Ambiente e execução

- Windows, Node.js 24.11.1, Playwright Test 1.64.1, Chromium 156.0.8078.4 em modo headless.
- Desktop 1280×720; larguras simuladas 360×800 e 390×844. Cada teste recebe um contexto novo, sem perfil/cadastros do usuário.
- Servidor de teste em `http://127.0.0.1:51806`, somente loopback, limitado aos arquivos do aplicativo e ao editor usado para verificar colagem. Iniciado/encerrado no próprio processo de testes; não utiliza os servidores manuais :5500/:51805.
- O aplicativo continua estático e sem dependências de execução. Instalação autorizada somente para desenvolvimento; cache npm e navegadores ficam em `.scratch`, ignorados pelo Git.
- `npm.cmd run test:browser`: **6 passed (10.4s)**, zero falhas, zero testes ignorados, zero retries. Dois cenários em cada uma das três dimensões.
- Fontes e testes identificados em [source-sha256.json](source-sha256.json). Resultados estruturados em [browser-results/results.json](browser-results/results.json), capturas em `browser-results/` e relatório navegável em [html-report/index.html](html-report/index.html). Evidências arquivadas fora das pastas temporárias sobrescritas pelo próximo teste.

## Pendências comprovadas

| Caso | Evidência nova | Conclusão combinada |
| --- | --- | --- |
| B6 | Quatro cadastros de teste 2/3/4/5; primeira geração e outra composição com prévia pior. Diálogo confirm de Delete Bruno verificado e aceito. Registro removido, seleção 3/3, times/decisão/avisos antigos/texto/trocas limpos, botão habilitado. Inclusão e seleção de Replacement (2) permitem nova geração com os quatro corretos. Passou nas três dimensões. | Completa a confirmação de exclusão durante decisão. Cancelar exclusão já confirmado pelo usuário; demais alterações durante prévia comprovadas no relatório integrado anterior. B6 aprovado. |
| A7 | Prévia pior, Undo por Enter e texto restaurado exatamente; Ctrl+A/C no campo do app, Ctrl+V em editor local de outra página, conteúdo colado exatamente igual. | Detalhes de ordem/avisos/controles constam no relatório integrado. Lacuna de colagem concluída; A7 aprovado. |
| A8 | Accept por Enter; cópia/colagem exata. Troca confirmada por teclado; nova cópia/colagem exata dos grupos atuais. | A8 aprovado, complementando as evidências anteriores de grupos/somas. |
| A9 | Dois Alex, Player 10 e nome literal `<b>Sam</b>` preservados em regeneração/undo/accept/troca e no texto colado. Sem elemento HTML b na lista de times. | Preservação de identidades já verificada no relatório anterior; colagem complementada. A9 aprovado. |
| B7 | Cadastro com Tab/Enter, seleção com Space e Tab passando por Edit/Delete até o próximo checkbox, geração por Tab/Enter. Após o textarea, Tab chega ao primeiro select; ArrowDown escolhe jogador do time 1; Tab e três ArrowDown escolhem jogador do time 2; Tab/Enter confirma a troca. Accept/Undo por Enter; cópia/colagem por atalhos reais. | Completa o percurso de teclado dos selects, sem `selectOption`. Evidência de foco/apresentação complementada pelas capturas anteriores e atuais. B7 aprovado. |
| B8 | Os dois cenários acima passaram também em 360×800 e 390×844, incluindo cadastro, seleção, geração, prévia, decisões, exclusão, troca por teclado e colagem após undo/accept/troca. | Apresentação e nomes longos nos selects já comprovados no relatório anterior. Lacuna de colagem concluída; B8 aprovado como largura simulada, sem alegar aparelho físico. |

As capturas normais do topo e da região de troca foram inspecionadas: fundo carregado, mensagens e campos legíveis nas três larguras, controles de troca utilizáveis. Capturas `fullPage` mostram fundo branco fora da região do viewport por causa do fundo fixo; capturas normais após rolagem mostram o fundo correto. Esse artefato de captura já fora observado no relatório anterior e não foi tratado como defeito do produto.

## Regressões

Passaram novamente, sem alteração no código do aplicativo:

```text
node --check script.js
node tests/initial-team-balance.test.cjs
node tests/manual-player-swaps.test.cjs
node tests/regenerate-teams.test.cjs
node tests/share-team-text.test.cjs
```

C1 passou com 12/20 e diferença 8; trocas: 458 pares e casos adicionais; regeneração: 714 cenários e casos adicionais; compartilhamento passou. `git diff --check` conferido no fechamento, incluindo os arquivos novos de configuração/teste. Os testes Node permanecem simulações e não são reclassificados como navegador real.

## Evidências preservadas e fechamento

- [Relatório integrado anterior](../2026-10-18-browser-02/resultado.md): A2/A3/A5/A6/B1/B4/B5/C1 e partes dos demais casos. A1 aprovado por capturas/relatos anteriores.
- A4, B2 e B3 foram completados com capturas/relatos manuais registrados no roteiro: cancelamento de exclusão, confirmação e persistência da exclusão. Cancelamento de exclusão durante prévia também relatado pelo usuário. Não apresentar esses relatos como execução direta deste teste.
- Com as evidências combinadas, A1–A9, B1–B8 e C1 estão comprovados. Tickets 01–05 concluídos; o roteiro conserva as origens e limites de cada evidência.
- Nenhuma nova falha funcional exigiu correção. Sem commit, publicação ou contato externo. Cadastros reais preservados.

## Limitações separadas

- **B9 não executado:** nenhum celular físico disponibilizado. Tela estreita é simulação; toque e teclado móvel não foram comprovados. O roteiro identifica B9 como condicional, sem exigir publicação do site para realizá-lo.
- Colagem nova verificada em **editor de texto local servido em outra página do navegador**, usando Ctrl+C/Ctrl+V e sem preencher diretamente o destino. Não foi automatizado Bloco de Notas, Word, mensageiro ou outro aplicativo nativo; nenhum texto foi enviado a terceiros.
- Não há garantia de ótimo global na geração, histórico de composições ou cobertura de todos os navegadores. Chrome integrado anterior e Chromium de teste têm evidências separadas.
- Botão de cópia e mudança da posição de Generate Teams continuam adiados, sem implementação nesta etapa.
