# Arquitetura

## Confirmado

Manter HTML, CSS e JavaScript, separando estrutura, aparência e lógica em arquivos próprios. Usar `localStorage`, armazenamento simples do navegador, para reaproveitar o cadastro no mesmo aparelho e navegador.

Framework, backend, banco externo e login não são necessários para as necessidades confirmadas. Framework é uma estrutura pronta para construir aplicações; backend é um programa executado em servidor. Ambos acrescentariam trabalho sem resolver uma necessidade atual de acesso compartilhado.

Confirmado na continuidade de 18/10/2026: código (nomes, comentários e mensagens) e interface em inglês; documentação e explicações ao usuário continuam em português. PT-BR na interface é uma possibilidade futura, sem implementação nesta etapa. A padronização preservou a chave `team-generator.players` e os campos salvos `name`, `score` e `isGoalkeeper`. Os nomes atuais incluem `loadPlayers`, `savePlayers`, `addOrUpdatePlayer`, `buildTeams` e `generateTeams`; nomes em português citados nos registros históricos descrevem versões anteriores.

## Armazenamento

Guardar nomes, notas e condição de goleiro. Limpar os dados do navegador pode apagar o cadastro. Não há sincronização entre aparelhos nem cópia de segurança confirmada.

Proposta: salvar uma lista em JSON, representação textual dos dados, com identificadores estáveis para distinguir jogadores de mesmo nome. Validar os dados ao carregar e ao salvar, e informar falhas de leitura ou gravação. Nomes iguais não devem ser usados como identificador técnico.

Dados de participação, local/data/horário e times ficam apenas na memória enquanto a página estiver aberta; persistir ou salvar partidas continua fora do escopo aprovado. A mensagem é montada no cliente. Copy teams copia esse texto e Share on WhatsApp cria um link `wa.me` com o mesmo texto codificado; o app não envia a mensagem nem acessa contatos, deixando a escolha e o envio para a pessoa.

## Organização proposta, não implementada

```text
index.html              estrutura da página
styles.css              aparência
js/app.js               ações da tela e coordenação
js/players.js           cadastro e validações
js/storage.js           leitura e gravação no navegador
js/teams.js             geração, avaliação e trocas
```

Os nomes e a quantidade de arquivos são sugestões. Evitar criar camadas ou módulos sem necessidade. Separar o cálculo dos times da manipulação da tela facilita verificar as regras sem abrir a interface.

O projeto hoje abre diretamente pelo `index.html`. A escolha entre scripts comuns e módulos JavaScript, que podem exigir servir os arquivos por HTTP, deve ser explicada antes de alterar esse modo de execução. Um servidor estático local só entrega arquivos; não implica criar backend do produto.

Ao mostrar nomes, usar inserção como texto, evitando interpretar conteúdo digitado como HTML. O código atual já usa `textContent` e elementos criados pelo DOM.

## Testes e desenvolvimento com TDD

Estado após a etapa 05: existem quatro scripts de regressão Node com DOM/armazenamento simulados e testes Playwright por interface pública, com navegador isolado e viewports desktop/360/390. Playwright é dependência de desenvolvimento; não adiciona backend ao produto. Os scripts Node atuais não foram migrados para `node:test`. A próxima rodada propõe aproveitar essas ferramentas, sem instalar Jest ou Supertest por padrão; ver [o plano](plano-2026-10-19.md).

Orientação vigente na revisão da etapa 05: usar TDD a partir de agora nas correções e novas funcionalidades autorizadas. Antes de escrever testes novos, confirmar o comportamento e a interface pública exercitada, observar o teste falhar e depois implementar a mudança mínima. Ver [procedimento de TDD](desenvolvimento-tdd.md). As verificações anteriores não comprovam retrospectivamente TDD. A validação visual continua necessária; as recomendações abaixo orientam a cobertura.

Verificar principalmente regras com consequências reais: cada selecionado aparece uma vez; não selecionados ficam fora; tamanhos diferem no máximo em 1; cada time tem no máximo 1 goleiro; goleiros excedentes impedem geração; trocas preservam as regras; texto compartilhável não contém notas.

Verificar também notas fora de 1 a 10, recuperação do cadastro após recarregar, edição, exclusão e dados salvos inválidos. Para combinações alternativas, validar as restrições sem exigir uma ordem exata de jogadores.

Escolher a ferramenta mais simples compatível com o ambiente disponível. Não instalar bibliotecas de teste ou outras dependências sem justificar a necessidade. Não foram executados testes de comportamento nesta etapa documental.

## Quando reavaliar

Sincronização entre aparelhos, vários organizadores usando o mesmo cadastro ou recuperação remota de dados podem justificar servidor e banco externo no futuro. Essas necessidades não foram confirmadas.
