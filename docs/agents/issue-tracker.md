## Estado atual — 21/10/2026

A rodada mobile first (tarefas 04–07) está concluída. A tarefa 07 foi fechada no commit `e63a27fea080f676bc76e418553b1e59b62ebefa`; o recibo final está em `.scratch/mobile-first-planning/evidence/automation-07-2026-10-21/task07-final-receipt-close.md`. A tag `v1.4.0` fecha as tarefas 04/05; as tarefas 06/07 foram commitadas depois dela. Não há tarefa seguinte autorizada nesta documentação. Para o estado e as ações atuais, consulte [tarefas](../tarefas.md) e [resumo para o próximo chat](../proximo-chat.md).

## Autorização anterior — tarefa 06 (21/10/2026, concluída)

A instrução final do usuário determina encerrar a automação após o commit validado da 06. Executar somente 06 nesta sessão; 07 permanece planejada, sem início automático. A autorização condicional de commits abrange 06/07, mas não autoriza ultrapassar esta parada. Sem push, PR, merge, release ou publicação nesta execução.

Claude prepara um teste por ciclo, comprova RED genuíno e verifica cada GREEN independentemente; Codex implementa o mínimo e nunca faz staging/commit. Aceitação existente dispensa RED artificial. Reutilizar interfaces públicas já confirmadas; decisões novas exigem uma pergunta por vez. Modelos preservados: Claude claude-sonnet-5-5/medium; Codex CLI gpt-6-luna/medium. Sessão raiz somente lê enquanto o runner e o relé executam. Sem background, bypass ou edições concorrentes; locks são cooperativos.

Antes de programar, comprovar início, retorno, interrupção e exclusão de segundo executor, preservando os logs. Se houver falha de acesso/permissão, parar e registrar sem alegar automação ativa. Evidências desta sessão: .scratch/mobile-first-planning/evidence/automation-06-2026-10-21/.

Claude só pode commitar a 06 em chat novo após todos os critérios, verificações obrigatórias, regressões pertinentes, diff completo e revisão instalada /ecc:code-review (confirmar nome; /ecc:codereview não é substituído silenciosamente). Sem achados pendentes ou falhas. Corrigir dentro do escopo com TDD quando aplicável e repetir revisão/verificações afetadas. Listar e revisar caminhos explícitos; excluir alterações preexistentes não relacionadas, sem staging indiscriminado. Registrar revisão, hash e limitações. Marcador de prontidão: TASK06_READY_FOR_CONDITIONAL_COMMIT. Após o commit validado, criar disabled e parar, sem iniciar 07. A parada pré-commit antiga está substituída exclusivamente pela autorização condicional do usuário.

## Registro geral — histórico

# Destino das tarefas

**Rodada mobile first aprovada em 20/10/2026:** tickets em `.scratch/mobile-first-planning/issues/`, numerados **04–07 por decisão explícita do usuário** e em ordem de execução aprovada. Não renumerar nem misturar com 04/05 da primeira rodada. Planejamento publicado não significa implementação iniciada; ver [plano](../plano-mobile-first.md) e [índice vigente](../tarefas.md).

Confirmado pelo usuário: tarefas em Markdown local, uma por arquivo, numeradas em ordem de dependências. Primeira rodada: `.scratch/remaining-work/issues/` (concluída). Segunda rodada aprovada para 19/10/2026: `.scratch/usability-2026-10-19/issues/`. A numeração 01–03 da rodada nova não se refere aos tickets antigos; sempre indicar rodada e caminho completo. Não publicar tickets em GitHub, Linear ou outro serviço sem nova instrução.

As tarefas foram divididas com a skill `to-tickets` e aprovadas na conversa. O índice e os prompts de início ficam em `docs/tarefas.md`. As dependências são escritas em `Blocked by`. `ready-for-agent` significa pronta para execução quando seus bloqueios estiverem concluídos; não significa trabalho iniciado ou finalizado. Ao concluir todos os critérios, mudar para `done` e registrar evidências. Se houver impedimento, registrar o que falta sem marcar como concluída.

Documentos e tarefas em português; código, comentários e interface em inglês. Não criar rótulos ou enviar mensagens para serviços externos nesta configuração.
