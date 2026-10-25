# Especificação: melhorar a partilha e a orientação responsiva

**Status:** ready-for-agent
**Aprovação:** escopo de três entregas e seam Playwright público aprovados pelo usuário em 25/10/2026.

## Problem Statement

Quem organiza uma partida pode ter de procurar participantes em uma lista extensa, alternar entre apps para partilhar os times no celular e lembrar quais dados ficam salvos. A interface não oferece busca. A partilha atual por link do WhatsApp e cópia funciona, mas não oferece o seletor nativo do dispositivo. O cadastro reaparece apenas no mesmo navegador, enquanto detalhes da partida não sobrevivem a um recarregamento.

## Solution

Adicionar busca acessível que filtre a lista de participantes sem mudar a seleção, permitir uso opcional do seletor nativo de partilha quando disponível e explicitar junto aos controles que o cadastro fica neste navegador e os detalhes da partida são temporários. Preservar o link do WhatsApp, a cópia, a seleção manual, a mensagem compartilhada e as regras existentes dos times.

## User Stories

1. Como organizador com muitos jogadores cadastrados, quero buscar por nome para encontrar rapidamente um participante.
2. Como organizador, quero que a busca não altere quem já selecionei para a partida, para poder filtrar e comparar opções sem perder meu progresso.
3. Como organizador, quero que uma busca sem resultados explique que não encontrou participantes, para distinguir uma lista vazia de um erro.
4. Como organizador, quero usar o teclado e um rótulo acessível para buscar, para operar a seleção sem depender de ponteiro ou tela tátil.
5. Como organizador, quero que o estado e o total de participantes selecionados continuem corretos quando filtro nomes, para confiar na preparação da partida.
6. Como organizador no celular ou tablet compatível, quero abrir as opções de partilha do dispositivo para enviar os times pelo app de minha preferência.
7. Como organizador, quero continuar podendo abrir o WhatsApp diretamente, para escolher manualmente um contato ou grupo.
8. Como organizador, quero que o seletor nativo, o link do WhatsApp e Copy teams usem a mesma mensagem atual, incluindo os detalhes preenchidos e sem notas, totais ou funções.
9. Como organizador, quero manter a cópia e a seleção manual quando o seletor nativo não estiver disponível ou falhar, para sempre ter uma alternativa.
10. Como organizador, quero que cancelar o seletor nativo não seja tratado como envio bem-sucedido, para o app não sugerir que a mensagem foi enviada.
11. Como organizador, quero ver junto ao cadastro que os jogadores ficam salvos somente neste navegador, para não esperar sincronização, conta ou backup remoto.
12. Como organizador, quero saber perto dos detalhes da partida que eles são temporários e se perdem ao recarregar, para decidir se preciso anotar essas informações em outro lugar.
13. Como organizador, quero que o aviso sobre armazenamento continue visível quando já há jogadores cadastrados, para não depender de mensagens temporárias após salvar.
14. Como organizador, quero usar as mesmas melhorias em celular, tablet e desktop, mantendo legibilidade, acesso por teclado e alvos de toque adequados.

## Implementation Decisions

- Manter o produto estático em HTML, CSS e JavaScript; não criar serviço de conta, armazenamento remoto ou banco de dados.
- A busca filtra a lista por nome sem alterar cadastro, seleção existente nem o escopo atual do botão Select All Players.
- Exibir uma ação para a partilha nativa somente quando `navigator.share` estiver disponível no navegador. Ela recebe o título do app e exatamente o texto já apresentado em Teams to copy.
- Tratar o cancelamento da folha de partilha como cancelamento normal, sem confirmação de sucesso. Se a folha não puder abrir por outro motivo, explicar as opções de WhatsApp e cópia já disponíveis.
- Preservar o link `wa.me`, Copy teams e a área de seleção manual como caminhos explícitos, sem abrir destinos automaticamente após um erro/cancelamento.
- Tornar sempre visível a informação de que o cadastro fica no navegador atual e colocar aviso de temporariedade junto aos detalhes da partida.
- Não alterar algoritmo, cadastro, formato da mensagem, regras de goleiro ou armazenamento existentes.
- Tratar este conjunto aditivo como uma release menor única: `1.7.0` para `1.8.0`. Não adicionar incrementos por ticket; atualizar `package.json`, `package-lock.json` e rodapé em conjunto após validação.

## Testing Decisions

- Seam aprovado: interface pública no Chromium com Playwright, observando rótulos, conteúdo, visibilidade, foco, seleção e efeitos de partilha. Não acoplar testes a funções privadas.
- Busca: cadastrar nomes conhecidos pela tela, filtrar por trechos/capitalização, conferir estado sem resultados, seleção antes/depois do filtro, total e fluxo por teclado.
- Partilha: conferir que a ação nativa recebe o mesmo texto exibido e o mesmo texto codificado no link do WhatsApp; simular capacidade indisponível, cancelamento e falha de abertura sem enviar mensagem ou publicar dados externos.
- Persistência: conferir que os avisos permanecem visíveis em celular, tablet e desktop, que cadastro continua salvo no mesmo navegador e que detalhes não são salvos ao recarregar.
- Usar os projetos Playwright existentes para desktop e telas estreitas e acrescentar verificações específicas para tablet nos testes existentes ou em um caso dedicado, sem depender de aplicativo WhatsApp real.
- Executar regressões de Node e a suíte de navegador completa após as fatias, além da validação visual em tamanhos representativos, incluindo navegação por teclado e ausência de rolagem horizontal.
- Resultado simulado do browser automatizado não deve ser descrito como teste físico ou como envio real de mensagem.

## Out of Scope

- Login por email ou conta Google, banco de dados externo, backend, sincronização entre aparelhos e backup remoto.
- Abrir um aparelho WhatsApp real, selecionar um contato e confirmar o envio.
- Alterar a geração ou o equilíbrio dos times, dados persistidos, conteúdo/privacidade da mensagem ou idioma do aplicativo.
- Refazer o visual inteiro do produto; preservar cores, tipografia e componentes existentes.

## Further Notes

- Vocabulário do domínio permanece: organizador, jogador cadastrado, participante da partida, nota de habilidade e time.
- Não surge conceito de domínio novo que justifique mudança do glossário ou ADR. A jornada e a arquitetura devem registrar a nova folha de partilha e a orientação de persistência quando a implementação estiver concluída.
- A avaliação UX e seus limites estão arquivados em `.impeccable/critique/2026-10-25T09-52-23Z__index-html.md`.

