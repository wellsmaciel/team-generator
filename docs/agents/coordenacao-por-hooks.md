# Coordenação entre Codex e Claude por hooks

Acordo registrado em 20/10/2026. Pasta vigente: `C:\VSC Projects\team-generator`.

## Escopo e estado

O usuário definiu o trabalho por tarefa, com passagens automáticas entre Codex e Claude por hooks. A autorização anterior abrangia somente o restante da tarefa 02 da segunda rodada: [gerar depois de conferir os participantes](../../.scratch/usability-2026-10-19/issues/02-generate-after-player-selection.md).

Os hooks ainda estão sendo preparados por Claude, que está levantando como o usuário acessa as ferramentas. Este documento registra o acordo de coordenação; não comprova instalação, ativação ou funcionamento dos hooks. Não substituir essa preparação por outra implementação automática.

**Atualização 20/10/2026, preparação concluída e testada, ainda não ativada para a tarefa 02.** O usuário acessa o Codex pela extensão do VS Code; o CLI por trás dela (`@openai/codex`, pacote npm oficial) foi instalado nesta máquina e já está autenticado com o mesmo login ("Logged in using ChatGPT"). Arquivos de configuração:

- Hook: `.claude/hooks/codex-relay-stop.sh`, acionado via `Stop` em `.claude/settings.local.json` (arquivo local, fora do git — `.claude/` inteiro já está no `.gitignore`).
- Estado e documentação do mecanismo: `.claude/codex-relay/` (ver `README.md` ali dentro para cada arquivo).
- Comando de inicialização (ligar o relé para a tarefa 02): gravar o caminho do ticket em `.claude/codex-relay/active-ticket.txt`, uma linha: `.scratch/usability-2026-10-19/issues/02-generate-after-player-selection.md`.
- Forma de interromper: criar o arquivo vazio `.claude/codex-relay/disabled` (chave geral, mais rápida) ou apagar `active-ticket.txt` (desliga só esta tarefa). Nenhum dos dois precisa editar `settings.local.json`.

O hook só age quando a última seção `## Passagem ...` do ticket apontado é um `→ Codex` ainda não repassado (por hash); caso contrário não faz nada. Testado com um ticket de teste e um `codex` falso (stub) para comprovar detecção, deduplicação (não repete uma seção já repassada) e o teto de segurança (`max-iterations.txt`, 12 por padrão — não é limite de escopo da tarefa, é só contra um loop sem progresso; a tarefa 02 inteira está autorizada, conforme a seção abaixo). Não houve ainda uma chamada real ao `codex exec` de ponta a ponta; a condição de parada antes do commit está embutida nas instruções enviadas tanto ao Codex quanto na mensagem que traz Claude de volta (regra fixa: nunca `git add`/commit/push/PR/release/publicação), mas a validação completa do ciclo real só ocorre na primeira ativação.

**Encerramento 20/10/2026:** a tarefa 02 foi concluída sem execução real do relé, pois não surgiu RED genuíno depois da preparação. A autorização desta coordenação terminou com ela. O arquivo local `active-ticket.txt` ainda aponta para o ticket 02, mas o hook fica inerte porque a última seção do ticket não é uma passagem `→ Codex`.

Aplicar o mesmo processo a outra tarefa exige que o usuário escolha e autorize essa tarefa. A fila permanece: tarefa 02 → Select All Players → validação integrada. Concluir uma tarefa não autoriza iniciar a próxima.

## Papéis e passagens

- Claude prepara o teste de um comportamento pela interface pública combinada, observa o RED e registra a passagem.
- Codex confere o RED, implementa a mudança mínima autorizada, executa o teste e as regressões pertinentes e registra o GREEN e seus limites.
- Claude verifica independentemente a mudança e os resultados. Se houver defeito dentro do escopo, registra evidência para o próximo ciclo.
- Verificação de comportamento já existente é aceitação/regressão; não fabricar RED. Seguir a [orientação TDD](../desenvolvimento-tdd.md) e a skill do projeto. Não repetir confirmações já dadas; decisões de produto ou interfaces novas ainda precisam ser combinadas com o usuário.

O ticket da tarefa é a referência para o próximo passo, resultados e limites. Cada passagem identifica responsável, comportamento, arquivos, comandos, resultados e pendências. Os hooks devem encaminhar a próxima etapa com base nesse registro, sem confundir uma mensagem de término de turno com conclusão da tarefa inteira.

## Limite obrigatório: parar antes do commit

**Nenhum hook ou agente está autorizado a executar commit.** O ciclo termina quando os critérios da tarefa autorizada estiverem comprovados, as verificações independentes concluídas e os registros atualizados. Informar então: **“Pronto para revisão do usuário antes do commit”** e encerrar a alternância automática.

O usuário analisará os arquivos antes de decidir sobre o commit. Não executar `git add`, commit, PR, merge, release ou publicação automaticamente. Uma autorização histórica de outra entrega não libera essas operações nesta tarefa. Qualquer execução posterior depende de novo pedido explícito do usuário.

Não marcar como aprovado o que não foi verificado. Limitações, como ausência de celular físico, devem continuar explícitas. Se uma pendência impedir a conclusão ou exigir decisão do usuário, registrar o ponto e interromper o ciclo para obter essa decisão.

## Requisitos para a preparação dos hooks

Antes de ativar, registrar os arquivos de configuração, ferramentas/sessões acionadas, comando de inicialização e forma de interromper a automação. Validar que cada passagem chega à ferramenta correta e que a condição de parada antes do commit funciona.

Executar uma etapa por vez, sem os dois agentes editarem os mesmos arquivos simultaneamente. Não repetir indefinidamente uma passagem, iniciar ciclos sem progresso ou ampliar o escopo para contornar um bloqueio. Falhas de acionamento devem ser comunicadas; não alegar que o outro agente foi executado sem evidência.

## Preservação e comunicação

Preservar código, alterações locais, cadastros, testes e evidências, incluindo a entrega concluída de Copy teams. Nenhuma exclusão de ZIPs foi autorizada. Seguir a [política de gestão de arquivos](gestao-de-arquivos.md).

Explicações e registros em português, breves e com uma pergunta por vez quando necessário. Código, comentários, interface e nomes de testes em inglês.

## Autorização anterior — Select All Players (20/10/2026)

Após o commit da tarefa 02, o usuário confirmou a sequência aprovada: [Select All Players, ticket 02a](../../.scratch/usability-2026-10-19/issues/02a-select-all-players.md), depois tarefa 03. Somente o ticket 02a foi autorizado.

Reaproveitar a passagem automática existente trocando o ticket ativo para 02a. Preservar o ticket 02 e seu histórico, configurações e logs; não criar hooks duplicados. O ponteiro ativo não autoriza iniciar código sem cumprir a confirmação e o RED exigidos pela skill tdd.

O limite continua obrigatório: parar antes de staging/commit para o usuário testar e revisar. Não iniciar a tarefa 03 automaticamente.

**Encerramento 20/10/2026:** o ticket 02a foi concluído em dois ciclos TDD. O relé rodou de ponta a ponta nos dois, com uma falha de formato no título de uma passagem, corrigida (ver o ticket). A parada antes do commit funcionou; commit, PR, merge e release foram feitos depois, a pedido explícito do usuário. A autorização terminou com o ticket. O hook fica inerte porque a última seção do ticket não é uma passagem `→ Codex`. Usar o relé na tarefa 03 exige nova autorização.

## Autorização vigente — tarefa 03 (20/10/2026)

Após o commit de Select All Players, o usuário autorizou somente a [tarefa 03 — validação integrada](../../.scratch/usability-2026-10-19/issues/03-validate-usability-round.md), até a revisão anterior ao commit. Dependências 01, 02 e 02a concluídas; seus registros devem ser preservados.

O ponteiro `.claude/codex-relay/active-ticket.txt` passa a indicar o ticket 03. Reutilizar o hook genérico, sem duplicá-lo ou apagar logs anteriores. Aceitação/regressão não exige RED artificial; o hook só deve receber passagem com instrução adequada à etapa real. Correções novas continuam sujeitas à skill tdd e à confirmação de comportamento/interface.

Parar antes de staging/commit para testes e revisão do usuário, sem iniciar outra tarefa. **Encerramento 20/10/2026:** validação concluída com uma passagem Codex → Claude e fechamento por Claude, sem nova passagem `→ Codex` (relé inerte). A parada antes do commit funcionou; commit, PR e merge foram feitos depois, a pedido explícito do usuário. A autorização terminou com a tarefa. Usar o relé em outra tarefa exige nova autorização. Ver o ticket.
