# Coordenação entre Codex e Claude por hooks

## Regra vigente — tarefas 04 e 05 (atualizada em 21/10/2026)

Esta é a única regra em vigor para 04 e 05. Tickets, plano, índices, resumo de continuidade, hook e README do relé só resumem ou apontam para esta seção; se algum texto divergir, vale esta. Seções marcadas como histórico abaixo não se aplicam.

**Escopo:** somente 04 e depois 05, uma por vez. Sem 06/07 e sem publicação do site. Push, PR e merge de cada tarefa e a release final estão autorizados nos termos de "Depois do commit" abaixo (decisão do usuário em 21/10/2026). O usuário autorizou chamadas externas do Claude CLI ao provedor configurado, incluindo o conteúdo necessário do repositório; sem bypass de permissões nem background sem isolamento. Preparação comprovada na [evidência de preparação](../../.scratch/mobile-first-planning/evidence/automation-2026-10-20/preparation.md).

### Papéis

- **Sessão raiz (Codex raiz ou a sessão interativa do usuário):** abre cada sessão do Claude CLI pelo runner (`run-claude.cjs`), com a política de permissões da etapa, e acompanha só com leitura; não edita enquanto uma sessão delegada roda. Não aprova nem dispara commit por avaliação própria: só abre o chat de revisão e commit quando o ticket termina com o marcador de pronto.
- **Claude, sessão TDD:** prepara um teste/RED por ciclo, escreve a passagem `## Passagem Claude → Codex`, verifica independentemente cada GREEN e atualiza ticket e documentação de continuidade. Nunca faz staging nem commit.
- **Codex CLI (chamado pelo hook):** implementa o mínimo pedido na última passagem, executa o teste e as regressões pertinentes e registra `## Passagem Codex -> Claude`. Nunca faz staging nem commit.
- **Claude, chat de revisão e commit (chat novo):** executa o `/ecc:code-review` e, no mesmo chat, logo em seguida, faz o commit da tarefa se a revisão passar.

### Modelos e esforço (fixos)

Decisão do usuário em 21/10/2026, vale para todas as sessões de 04 e 05 e não pode depender de padrões de configuração:

| Quem | Modelo | Esforço | Onde está fixado |
| --- | --- | --- | --- |
| Claude (sessão TDD e chat de revisão e commit) | Sonnet 5.5 (`claude-sonnet-5-5`) | `medium` | `run-claude.cjs`: `--model claude-sonnet-5-5 --effort medium` |
| Codex CLI (chamado pelo hook) | Luna 6.0 (`gpt-6-luna`) | `medium` | `.claude/hooks/codex-relay-stop.sh`: `-m gpt-6-luna -c model_reasoning_effort="medium"` |

O Codex raiz abre sempre o Claude pelo runner, sem trocar esses parâmetros; o hook roda dentro dessa sessão. O padrão global do Codex (`~/.codex/config.toml`: `gpt-6.1-sol`, `medium`) e o padrão do Claude (`sonnet`) não são usados e não foram alterados. Conferência: o evento `init` do log do runner mostra o modelo do Claude (`claude-sonnet-5-5`); o log de eventos do Codex em `.claude/codex-relay/logs/` deve ser conferido na primeira execução. Se o runner ou o hook perderem esses parâmetros, parar e corrigir antes de seguir. Mudar modelo ou esforço exige decisão do usuário e atualização desta tabela.

### Ordem do fluxo

1. O Codex raiz grava o ticket da tarefa em `.claude/codex-relay/active-ticket.txt` e abre a sessão TDD do Claude.
2. O Claude escreve o RED e termina o turno com uma passagem `→ Codex`. O hook Stop chama o Codex CLI.
3. O Codex implementa e registra o GREEN. O hook devolve o controle ao mesmo Claude, que verifica de forma independente. Os passos 2 e 3 se repetem a cada ciclo.
4. Com todos os critérios comprovados, o Claude atualiza ticket e continuidade, lista os arquivos candidatos ao commit e termina o ticket com uma seção que não é passagem (por exemplo `## Pronto para revisão e commit`), contendo `TASK04_READY_FOR_CONDITIONAL_COMMIT` ou `TASK05_READY_FOR_CONDITIONAL_COMMIT`. O hook fica inerte e a sessão termina.
5. O Codex raiz abre um **chat novo** do Claude com a política e o prompt do chat de revisão e commit (`.claude/codex-relay/commit-chat-policy.json` e `.claude/codex-relay/commit-chat-prompt.md`, arquivos locais fora do git).
6. Nesse chat, o Claude executa o `/ecc:code-review`, registra o resultado no ticket e, se aprovado, faz o commit logo depois.
7. Depois do commit da 04, o mesmo chat troca `active-ticket.txt` para o ticket 05 e termina; o Codex raiz abre a sessão TDD da 05, que começa registrando o hash da 04 no ticket 04. Depois do commit da 05, o chat cria `.claude/codex-relay/disabled` e a automação termina.

### Chat de revisão e commit

- **Revisão:** o `/ecc:code-review` instalado (modo local), executado pelo próprio Claude nesse chat. Commit só com **0 crítico, 0 alto e 0 médio**. Achados baixos podem ficar, desde que cada um tenha a decisão registrada no relatório da revisão.
- **Com achado crítico, alto ou médio:** não commitar. Registrar os achados e, se a correção couber ao Codex, escrever uma passagem `→ Codex`. Depois de verificar a correção, executar o `/ecc:code-review` de novo, completo, antes de qualquer commit.
- **Arquivos:** staging somente dos caminhos explícitos da lista de candidatos do ticket revisados nesse chat. Nada de `git add -A`, `.`, curingas de pasta ou `-f` em arquivos ignorados. Documentação preexistente fica fora, salvo se a lista do ticket a incluir. A única edição permitida entre a revisão e o commit é o registro do resultado da revisão no ticket.
- **Antes do commit:** `git diff --cached --check` e conferência de que todo caminho de `git diff --cached --name-only` está na lista. Sem `--no-verify`.
- **Mensagem:** um commit por tarefa, no padrão do repositório, com a linha `Co-Authored-By` do Claude. Exemplo: `feat: add responsive players navigation (task 04)`.
- **Validação do commit:** `git show --stat HEAD` e `git status --short`, confirmando que só ficaram de fora alterações não relacionadas. Informar o hash completo na resposta.
- **Hash:** um commit não pode conter o próprio hash. O hash da 04 é registrado no ticket 04 pela sessão TDD da 05 e entra, revisado, no commit da 05. O hash da 05 fica na resposta do chat e no `git log`.

### Depois do commit (somente a sessão raiz)

Decisão do usuário em 21/10/2026: depois do commit validado de cada tarefa, a sessão raiz (nunca a sessão TDD, o Codex CLI ou o chat de revisão e commit):

1. cria o branch da tarefa **antes** de abrir o chat de commit (por exemplo `feat/responsive-players-navigation`, `feat/match-selection-and-teams`), partindo do `main` atualizado;
2. depois do commit validado, faz `git push -u origin <branch>` e abre o PR para o `main` com descrição no tom dos PRs anteriores (resumo, validação com números reais, limites, sem notas de uso interno);
3. faz o merge com commit de merge (`gh pr merge --merge`), atualiza o `main` local com `git pull --ff-only` e só então abre a sessão TDD da tarefa seguinte, partindo do `main` atualizado.

**Release:** uma só, `v1.4.0`, depois do merge da 05 (a 04 deixa o Match em estado intermediário). Ela inclui subir `package.json`, `package-lock.json` e o texto de versão do rodapé do `index.html` para 1.4.0 em um commit pequeno e próprio de versão, revisado com `git diff` antes do PR, e `gh release create v1.4.0` sobre o commit de merge, com notas no tom das releases anteriores. Continuam proibidos: 06/07 e publicação do site.

### Paradas

Se faltar decisão do usuário ou acesso, ou se um critério continuar bloqueado, parar sem commit incompleto e registrar o motivo. Decisões novas de produto ou interface exigem uma pergunta por vez; interfaces públicas já aprovadas não precisam de nova confirmação. Aceitação de comportamento existente não exige RED artificial. Passagens e critérios antigos com "sem commit", "parar antes do commit" ou "não iniciar a próxima tarefa" descrevem só aquele momento e não se aplicam a 04/05.

### Limitações conhecidas

A proibição de commit para o Codex é uma instrução no prompt do hook; o hook não a bloqueia tecnicamente. Os locks (`writer.lock` e `foreground-owner.lock`) só serializam participantes deste protocolo. O hook aceita passagens com `→ Codex` ou `-> Codex`. O push, o PR, o merge e a release não passam pelo hook nem pelo chat de commit: são da sessão raiz. Se uma chamada do Codex falhar, o hook não repete a mesma passagem e avisa o Claude; para tentar de novo, escrever uma passagem `→ Codex` nova.

## Estado — rodada mobile first

**Estado em 21/10/2026:** o relé Codex ↔ Claude por hooks foi preparado e comprovado (evidência de preparação de 20/10/2026) e executou os ciclos 1–16 da tarefa 04 (contador real do relé: 19 de teto interno 24, que é um limite de segurança contra falta de progresso, não um orçamento de produto; capturas não o incrementam). A 04 aguarda o chat de revisão e commit do Claude (a tentativa de commit de 21/10/2026 terminou em erro de API, sem commit); a 05 não foi iniciada. Ver [plano](../plano-mobile-first.md).

*Histórico (20/10/2026, superado):* o usuário aprovou o desenho e a divisão das tarefas 04–07 e pediu a documentação do plano/tickets; naquela data a implementação não havia começado e o acionamento inicial ainda precisava ser configurado e testado.

*Histórico (20/10/2026, superado):* o mecanismo anterior fazia Claude → Codex CLI → Claude; naquele momento, o início automático ainda precisava ser comprovado. A preparação foi concluída e evidenciada depois. A regra vigente para as tarefas 04/05 está no topo.

*Histórico (superado para 04/05):* a regra anterior exigia confirmação de novos comportamentos/interfaces e parada para revisão do usuário antes de cada commit, sem iniciar a próxima tarefa. A autorização vigente substitui essa parada somente para 04 e 05: usar as interfaces já aprovadas sem reconfirmação, fazer o commit separado de cada tarefa somente por Claude após todos os gates e iniciar 05 após validar o commit de 04. A automação termina após validar o commit de 05. As autorizações abaixo para tarefas anteriores são históricas.

Acordo registrado em 20/10/2026. Pasta vigente: `C:\VSC Projects\team-generator`.

## Escopo e estado

O usuário definiu o trabalho por tarefa, com passagens automáticas entre Codex e Claude por hooks. A autorização anterior abrangia somente o restante da tarefa 02 da segunda rodada: [gerar depois de conferir os participantes](../../.scratch/usability-2026-10-19/issues/02-generate-after-player-selection.md).

*Histórico (20/10/2026):* os hooks estavam sendo preparados por Claude; este documento registra o acordo de coordenação e, por si só, não comprova instalação ou funcionamento. O funcionamento foi comprovado depois, nos logs do relé e na evidência de preparação. Não substituir o relé por outra implementação automática.

*Histórico (20/10/2026):* a preparação do Codex CLI terminou e estava testada, mas ainda não ativada para a tarefa 02. O usuário acessa o Codex pela extensão do VS Code; o CLI por trás dela (`@openai/codex`, pacote npm oficial) foi instalado nesta máquina e já estava autenticado com o mesmo login ("Logged in using ChatGPT"). Os arquivos de configuração eram:

- Hook: `.claude/hooks/codex-relay-stop.sh`, acionado via `Stop` em `.claude/settings.local.json` (arquivo local, fora do git — `.claude/` inteiro já está no `.gitignore`).
- Estado e documentação do mecanismo: `.claude/codex-relay/` (ver `README.md` ali dentro para cada arquivo).
- Comando de inicialização (ligar o relé para a tarefa 02): gravar o caminho do ticket em `.claude/codex-relay/active-ticket.txt`, uma linha: `.scratch/usability-2026-10-19/issues/02-generate-after-player-selection.md`.
- Forma de interromper: criar o arquivo vazio `.claude/codex-relay/disabled` (chave geral, mais rápida) ou apagar `active-ticket.txt` (desliga só esta tarefa). Nenhum dos dois precisa editar `settings.local.json`.

*Histórico (20/10/2026, superado):* o hook só age quando a última seção `## Passagem ...` é uma passagem nova `→ Codex`; então chama `codex exec` e traz Claude de volta para verificar. O teste com stub comprovou detecção, deduplicação e teto de segurança. Naquele momento ainda não havia chamada real ponta a ponta. A ativação e o retorno reais foram comprovados depois, conforme a evidência de preparação citada acima; a regra de commit vigente para 04/05 está no topo.

**Encerramento 20/10/2026:** a tarefa 02 foi concluída sem execução real do relé, pois não surgiu RED genuíno depois da preparação. A autorização desta coordenação terminou com ela. O arquivo local `active-ticket.txt` ainda aponta para o ticket 02, mas o hook fica inerte porque a última seção do ticket não é uma passagem `→ Codex`.

*Histórico (segunda rodada):* aplicar o mesmo processo a outra tarefa exige que o usuário escolha e autorize essa tarefa. A fila era: tarefa 02 → Select All Players → validação integrada. Concluir uma tarefa não autoriza iniciar a próxima.

## Papéis e passagens

- Claude prepara o teste de um comportamento pela interface pública combinada, observa o RED e registra a passagem.
- Codex confere o RED, implementa a mudança mínima autorizada, executa o teste e as regressões pertinentes e registra o GREEN e seus limites.
- Claude verifica independentemente a mudança e os resultados. Se houver defeito dentro do escopo, registra evidência para o próximo ciclo.
- Verificação de comportamento já existente é aceitação/regressão; não fabricar RED. Seguir a [orientação TDD](../desenvolvimento-tdd.md) e a skill do projeto. Não repetir confirmações já dadas; decisões de produto ou interfaces novas ainda precisam ser combinadas com o usuário.

O ticket da tarefa é a referência para o próximo passo, resultados e limites. Cada passagem identifica responsável, comportamento, arquivos, comandos, resultados e pendências. Os hooks devem encaminhar a próxima etapa com base nesse registro, sem confundir uma mensagem de término de turno com conclusão da tarefa inteira.

## Regra histórica: parar antes do commit

*Regra anterior, superada somente para as tarefas mobile-first 04/05:* nenhum hook ou agente podia executar commit; o ciclo terminava com “Pronto para revisão do usuário antes do commit”.

Para **04/05**, vale a regra vigente no topo. Para outras tarefas, a parada pré-commit permanece até nova autorização.

Não marcar como aprovado o que não foi verificado. Limitações, como ausência de celular físico, devem continuar explícitas. Se uma pendência impedir a conclusão ou exigir decisão do usuário, registrar o ponto e interromper o ciclo para obter essa decisão.

## Requisitos para a preparação dos hooks

Antes de ativar, registrar os arquivos de configuração, ferramentas/sessões acionadas, comando de inicialização e forma de interromper a automação. Validar que cada passagem chega à ferramenta correta e que a condição de parada da tarefa funciona (parada pré-commit ou, em 04/05, o marcador de pronto para o chat de revisão e commit).

Executar uma etapa por vez, sem os dois agentes editarem os mesmos arquivos simultaneamente. Não repetir indefinidamente uma passagem, iniciar ciclos sem progresso ou ampliar o escopo para contornar um bloqueio. Falhas de acionamento devem ser comunicadas; não alegar que o outro agente foi executado sem evidência.

## Preservação e comunicação

Preservar código, alterações locais, cadastros, testes e evidências, incluindo a entrega concluída de Copy teams. Nenhuma exclusão de ZIPs foi autorizada. Seguir a [política de gestão de arquivos](gestao-de-arquivos.md).

Explicações e registros em português, breves e com uma pergunta por vez quando necessário. Código, comentários, interface e nomes de testes em inglês.

## Autorização anterior — Select All Players (20/10/2026)

Após o commit da tarefa 02, o usuário confirmou a sequência aprovada: [Select All Players, ticket 02a](../../.scratch/usability-2026-10-19/issues/02a-select-all-players.md), depois tarefa 03. Somente o ticket 02a foi autorizado.

Reaproveitar a passagem automática existente trocando o ticket ativo para 02a. Preservar o ticket 02 e seu histórico, configurações e logs; não criar hooks duplicados. O ponteiro ativo não autoriza iniciar código sem cumprir a confirmação e o RED exigidos pela skill tdd.

O limite continua obrigatório: parar antes de staging/commit para o usuário testar e revisar. Não iniciar a tarefa 03 automaticamente.

**Encerramento 20/10/2026:** o ticket 02a foi concluído em dois ciclos TDD. O relé rodou de ponta a ponta nos dois, com uma falha de formato no título de uma passagem, corrigida (ver o ticket). A parada antes do commit funcionou; commit, PR, merge e release foram feitos depois, a pedido explícito do usuário. A autorização terminou com o ticket. O hook fica inerte porque a última seção do ticket não é uma passagem `→ Codex`. Usar o relé na tarefa 03 exige nova autorização.

## Autorização anterior — tarefa 03 (20/10/2026, encerrada)

Após o commit de Select All Players, o usuário autorizou somente a [tarefa 03 — validação integrada](../../.scratch/usability-2026-10-19/issues/03-validate-usability-round.md), até a revisão anterior ao commit. Dependências 01, 02 e 02a concluídas; seus registros devem ser preservados.

O ponteiro `.claude/codex-relay/active-ticket.txt` passa a indicar o ticket 03. Reutilizar o hook genérico, sem duplicá-lo ou apagar logs anteriores. Aceitação/regressão não exige RED artificial; o hook só deve receber passagem com instrução adequada à etapa real. Correções novas continuam sujeitas à skill tdd e à confirmação de comportamento/interface.

Parar antes de staging/commit para testes e revisão do usuário, sem iniciar outra tarefa. **Encerramento 20/10/2026:** validação concluída com uma passagem Codex → Claude e fechamento por Claude, sem nova passagem `→ Codex` (relé inerte). A parada antes do commit funcionou; commit, PR e merge foram feitos depois, a pedido explícito do usuário. A autorização terminou com a tarefa. Usar o relé em outra tarefa exige nova autorização. Ver o ticket.
