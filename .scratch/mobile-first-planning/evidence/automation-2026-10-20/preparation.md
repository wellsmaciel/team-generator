# Preparação da automação — 20/10/2026

Preparação concluída antes de alterar produto ou testes. HEAD inicial: '8d79efd'. Status e diff documental preexistentes preservados em 'preexisting-*'. Nenhum cadastro, ZIP, protótipo ou evidência anterior foi excluído. Registros iniciais com erro de codificação preservados em 'preparation-initial-encoding.txt'; texto de coordenação corrigido pelo Codex.

## Autorização e permissões

Somente tarefas 04 e 05, nessa ordem, com commits condicionais exclusivos de Claude após todos os critérios, verificações, revisão independente e '/ecc:code-review'. Codex nunca faz staging/commit. Sem 06/07, push, PR, merge, release ou publicação. Autorização externa explícita em 'external-authorization.md'.

Primeira sonda bloqueada por EPERM e retries; primeira escalada rejeitada por falta de autorização específica de envio externo. Usuário autorizou esse envio. Uma sonda de interrupção com ferramentas excessivas foi rejeitada; executor foi restringido a ferramentas de leitura e 'dontAsk', sem edição/shell. Nenhum bypass usado.

## Provas reais

- Início: 'claude-authorized-probe.jsonl', sessão '972db8e3-eac4-4381-8155-4f0a19421d85', resposta 'RELAY_INITIAL_ACK', exit 0. Comando disponível confirmado: '/ecc:code-review'; '/ecc:codereview' ausente. Nenhuma revisão de produto alegada nesta preparação.
- Interrupção/exclusão: 'interruption-and-lock-probe.jsonl', sessão '42d28ad2-45bf-4dae-9f9f-d3f8be5a1051'. Segundo executor recusado com 'RELAY_OWNER_BUSY', exit 73. 'taskkill /PID 49028 /T /F' retornou sucesso para o Claude criado e seus descendentes; fechamento registrado como interrompido. Consulta posterior por Get-Process não encontrou os oito PIDs encerrados. Lock liberado após fechamento. Sonda anterior terminou naturalmente e não conta como prova de interrupção.
- Retorno completo: 'roundtrip-probe.jsonl', sessão '4321ecf4-7d36-4825-876c-6887fcb3203c'. Claude respondeu 'RELAY_CLAUDE_START_ACK'; Stop hook real chamou Codex CLI com sandbox workspace-write; Codex acrescentou seção própria e 'RELAY_CODEX_RETURN_ACK' em 'relay-probe.md'; Claude leu independentemente e respondeu 'RELAY_ROUNDTRIP_ACK'. Executor exit 0, sem permission_denials. Nenhuma nova passagem a Codex: ciclo encerrou naturalmente.
- Logs Codex originais preservados em '.claude/codex-relay/logs/.scratch_mobile-first-planning_evidence_automation-2026-10-20_relay-probe.md-20261020T212448Z.*'; thread '01a15b33-e19e-74e2-8bce-20a10d09bdc0'.

## Configuração e operação

Hook existente '.claude/hooks/codex-relay-stop.sh' reaproveitado, backup em 'codex-relay-stop.before.sh'. Exceção de commit condicional exclusiva de Claude registrada no retorno; proibição para Codex preservada. '.claude/settings.local.json' passado explicitamente ao CLI; propriedade shell redundante retirada. Runner 'run-claude.cjs' em primeiro plano, sem background; 'foreground-owner.lock' impede duas sessões gerenciadas; 'writer.lock' serializa invocações do hook. Codex raiz fica sem editar durante Claude/Codex CLI, com apenas supervisão de leitura. O lock não bloqueia programas externos que não participam deste protocolo.

Dependência ausente do ECC corrigida em pasta de apoio: 'npm.cmd install --prefix .scratch/ecc-runtime --cache .scratch/npm-cache --ignore-scripts --no-audit --no-fund --save-exact js-yaml@4.3.2', versão declarada pelo ECC 2.2.3 local. Runner fornece NODE_PATH para essa pasta e Git Bash explícito. Nenhuma dependência do aplicativo alterada. Sonda de retorno não apresentou a falha js-yaml.

Interromper próximas passagens: criar '.claude/codex-relay/disabled'. Interromper execução atual: SIGINT ao runner ou encerramento da árvore do PID Claude identificado em 'foreground-owner.lock/owner.json'. Não encerrar processos Claude preexistentes sem identificação. Preservar logs e não reaproveitar nomes de saída (runner usa escrita exclusiva).

Avisos de MCP local indisponível apareceram no Codex CLI, mas não impediram a sonda de ACK. Não são testes de produto aprovados. Celular físico e teclado móvel físico ainda não testados. Testes de produto não executados na preparação. As condições reais de commit serão verificadas no fechamento de cada tarefa; a sonda não comprova uma entrega de produto.

## Próxima etapa

Ativar somente o ticket 04; preparar um teste por ciclo pela interface pública de navegador já aprovada, sem repetir decisões de disposição. Depois de 04 integralmente revisada e commitada por Claude, iniciar 05; terminar após commit validado da 05.
