# Ajustes de UX e interface — 22/10/2026

## Aprovação

Após a revisão de UX e aparência, o usuário autorizou a implementação dos pontos prioritários e das observações menores. Depois de revisar o resultado, aprovou as mudanças. Em seguida, observou que a versão do aplicativo havia sumido no celular; a versão foi restaurada e conferida em telas estreitas.

## Mudanças aprovadas

- Removida a foto da quadra do fundo da interface. O fundo agora usa azul petróleo sólido (`#16282f`) e os painéis escuros são opacos, reduzindo interferência visual nas listas.
- A navegação fixa Players/Match acompanha a seção atual durante a rolagem e inicia com Players ativo.
- O formulário explica a escala de habilidade de 1 a 10, e a área dos times informa que as somas são estimativas, sem garantia de equilíbrio.
- Jogadores e habilidades aparecem em colunas alinhadas, sem hífen separando nome e nota. O espaço reservado sem conteúdo foi removido.
- O campo Number of teams ficou compacto, adequado a poucos dígitos.
- Botões e campos receberam estilos coerentes com o tema escuro. Copy teams tem destaque de ação principal; Generate another composition permanece como ação secundária.
- A caixa Teams to copy ficou menor e a instrução de compartilhamento prioriza o botão, mantendo a cópia manual como alternativa.
- Times sem goleiro fixo recebem um aviso visível no respectivo cartão.
- O título foi simplificado para Team Generator. A versão do app permanece visível no rodapé em telas móveis, podendo quebrar para a linha seguinte em larguras estreitas.

## Arquivos

- `index.html`: título, orientação da escala, nota sobre totais, colunas e conteúdo de compartilhamento.
- `styles.css`: fundo, painéis, controles, tipografia auxiliar, navegação, campo de quantidade, caixa de cópia e rodapé.
- `script.js`: atualização da navegação conforme rolagem e avisos nos cartões de times sem goleiro.

## Verificação

Renderização e interações foram conferidas em Chromium com viewports de 390×844 e 1920×1080; a versão no rodapé foi conferida também em 360 e 390 px. A navegação começa em Players, muda para Match ao rolar até essa seção e volta a Players no topo. Não houve rolagem horizontal nas larguras verificadas. A suíte automatizada de testes não foi executada nesta rodada.

O Chromium foi executado sem uma aba visível conectada ao VS Code. Uma revisão compartilhada em navegador visível depende de abrir o app por um servidor local e disponibilizar a aba do Chrome/Edge à integração de navegador da sessão.

## Complemento de testes ? 22/10/2026

Após a revisão do diff, foram adicionadas verificações Playwright para a navegação por rolagem e o aviso de goleiro fixo, e as expectativas de `aria-current` foram atualizadas para location. O ciclo focado de navegação (desktop e viewports estreitas) passou: 15 testes. A execução completa encontrou 133 aprovados, 29 falhos e 12 ignorados. Os casos falhos incluem outras expectativas de testes antigas sobre rótulos, ordem de tabulação, disposição responsiva, fontes externas e posicionamento da navegação; ainda não foram todos reconciliados com os critérios de UX aprovados. Como a implementação de produção já estava presente antes deste ciclo, o aviso por time passou como caracterização, sem um RED?GREEN de implementação retroativo. A primeira tentativa do teste de rolagem não criava overflow e foi descartada; a versão atual cria participantes suficientes e confirma a rolagem real antes de verificar a navegação.

## Diagnóstico das falhas Playwright ? 22/10/2026

A execução anterior (133 aprovados, 29 falhos, 12 ignorados) não revelou defeitos novos no produto. As falhas vieram de expectativas que ainda descreviam o contrato anterior: rótulos com hífen, ordem de foco como se Players/Match fossem abas exclusivas, controles de geração abaixo da lista em desktop, lista Match em múltiplas colunas de linhas, navegação fixa no rodapé e bloqueio de todas as requests externas apesar das fontes Google usadas pela página. A checagem de cor lia durante a transição CSS e agora aguarda o valor final. Os testes foram atualizados para conferir nomes/notas alinhados, ordem real do DOM, painel de geração, navegação sticky no topo e requests externas não relacionadas às fontes. Regressões afetadas passaram em 29/29 verificações focadas. Suíte completa atualizada: 162 aprovados, 12 ignorados, 0 falhos. Nenhuma mudança em código de produção foi necessária; não foi reproduzido defeito de produto nesses casos.

## Falha do GitHub Pages e correção — 22/10/2026

A execução [39865267359](https://github.com/wellsmaciel/team-generator/actions/runs/39865267359), disparada após o merge da PR #9, falhou na etapa **Build with Jekyll** ao processar este documento: `invalid byte sequence in UTF-8`. A causa foi a inclusão de um complemento usando bytes Windows-1252 em um arquivo UTF-8; havia também caracteres de controle no texto acrescentado.

O complemento foi normalizado para UTF-8 válido, os caracteres de controle foram corrigidos e todos os Markdown rastreados foram verificados quanto a UTF-8 estrito. A correção foi enviada na [PR #10](https://github.com/wellsmaciel/team-generator/pull/10), commit `3060405` (`fix: normalize UX notes to UTF-8`), e integrada em 22/10/2026. A execução subsequente [39865663151](https://github.com/wellsmaciel/team-generator/actions/runs/39865663151) concluiu com sucesso as etapas de build e deploy do Pages. O deploy corrigiu a publicação; não houve nova release de produto, pois a alteração foi somente documental.

**Prevenção:** ao acrescentar conteúdo Markdown via PowerShell, preservar explicitamente UTF-8 (por exemplo, `Set-Content -Encoding utf8`) e validar bytes com decodificação UTF-8 estrita antes do commit. Evitar redirecionamentos ou `Add-Content` com codificação implícita em Windows PowerShell.

## Guia inicial e layout para tablets — 23/10/2026

A abertura agora mostra um guia de três etapas — cadastrar jogadores, escolher participantes e quantidade de times, gerar e revisar a composição — com o botão **Add your players** levando ao cadastro. A redação descreve a geração como sugestão baseada em notas estimadas, sem prometer equilíbrio garantido.

O CSS adapta o espaço disponível: em 768–899 px, cadastro e Match ficam em coluna única; de 900–1099 px, usam duas colunas quando há jogadores cadastrados. Os resultados de times ficam em até duas colunas nesse intervalo, os controles de troca usam uma grade de duas colunas e os botões recebem alvos de pelo menos 44 px. Em celulares, a explicação do cabeçalho do guia é ocultada para manter a chamada e os três passos compactos.

**Verificação:** o fluxo responsivo foi conferido em Edge/Chromium emulado nos viewports 390×844, 768×1024, 820×1180, 1024×768 e 1280×800, sem rolagem horizontal ou erros de página. Com dados sintéticos, três times foram gerados e exibidos em duas colunas em 1024 px. Os testes Playwright focados no atalho de cadastro e na disposição retrato/paisagem passaram após corrigir o rótulo duplicado do botão e atualizar a expectativa antiga de duas colunas em 768 px. A suíte inteira não foi concluída; uma verificação de requisições externas no Edge detectou URLs injetadas pela extensão Kaspersky, alheias à página. Nenhum iPad físico foi usado.

O cartão **Registered players** agora mostra uma orientação e o atalho **Add your first player** quando o cadastro está vazio. A orientação permanece compacta quando os painéis ficam empilhados. A verificação manual em Chromium confirmou foco no campo de nome, desaparecimento após salvar, retorno após excluir o último registro e ausência de rolagem horizontal em 390×844, 768×1024, 1024×768 e 1280×800. Também foi corrigido o contraste de hover do botão **Add your players** do guia.

## Cadastro vazio em telas largas — 23/10/2026

Com o cadastro vazio, o cartão **Registered players** passa a ocupar uma faixa compacta de largura total acima do formulário; após salvar o primeiro registro, a composição volta a mostrar lista à esquerda e formulário à direita. O cartão da lista acompanha a altura dos registros e não estica até a altura do formulário. Isso remove a coluna curta e o espaço vazio dentro do painel sem alterar o fluxo em retrato ou celular.

**Verificação visual:** Chromium emulado em 390×844, 768×1024, 1024×768 e 1280×800 nos estados vazio e com um jogador. A faixa vazia é de largura total em telas largas; a lista volta a duas colunas a partir de 900 px e acompanha seu conteúdo. Não houve overflow horizontal nem erros de página; o atalho de estado vazio focou `Player Name`. O detector Impeccable não encontrou ocorrências de layout.

**Verificação consolidada (23/10/2026):** o teste Playwright focado na disposição retrato/paisagem passou. A suíte completa executou 174 casos: 159 aprovados e 12 ignorados; três falhas repetidas vieram do teste que fixa a origem `127.0.0.1:51806`, enquanto essa execução usou `127.0.0.1:51807` porque a porta original já estava ocupada. Portanto, essas falhas não indicam defeito do produto, mas deixam esse teste específico sem resultado válido nesta execução. Uma checagem direta em Chromium confirmou o guia, o foco dos atalhos e o ciclo de adicionar/excluir cadastro em 390×844 e 1024×768.

## Release 1.6.0 — 23/10/2026

As novas capacidades de orientação inicial, estado vazio e responsividade justificaram o incremento minor de `1.5.0` para `1.6.0`. `package.json`, `package-lock.json` e a versão exibida no rodapé acompanham a mesma versão. O [PR #11](https://github.com/wellsmaciel/team-generator/pull/11) foi integrado em `main` no commit `b1d1f86762ca8203fcfbd767f32a0dca93544f3b`, e a [release `v1.6.0`](https://github.com/wellsmaciel/team-generator/releases/tag/v1.6.0) foi publicada. O [deploy do GitHub Pages](https://github.com/wellsmaciel/team-generator/actions/runs/39992255524) concluiu com sucesso.
