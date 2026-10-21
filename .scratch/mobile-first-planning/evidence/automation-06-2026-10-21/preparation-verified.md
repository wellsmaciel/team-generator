# Preparação comprovada — tarefa 06, 21/10/2026

A autorização externa explícita de external-authorization.md substitui o bloqueio anterior, preservado em preparation-blocked.md. Claude CLI autenticado na Anthropic, sem envio de credenciais. Base HEAD f117d25; status e patch preexistentes nesta pasta. Sem produto/testes alterados durante preparação.

## Provas

- Início: initial-authorized-v2.jsonl, sessão c7a5ef63-3926-4a2f-bee8-7664c9139b2d, RELAY_INITIAL_ACK, exit 0. Ferramenta Skill não foi exposta nessa sonda de leitura; ela não confirmou a revisão instalada. Arquivo ECC local commands/code-review.md foi encontrado; nome de invocação deve ser confirmado na sessão com Skill antes do fechamento. Nenhuma revisão de produto executada ainda.
- Interrupção: interruption-authorized-early.jsonl, Claude PID 49944. Timer de 2 segundos executou taskkill /T /F com sucesso, fechando a árvore identificada. Runner closed code 1/interrupted true. Consulta posterior não encontrou os PIDs nem locks. A sonda anterior de 15 segundos terminou naturalmente e não conta como interrupção.
- Exclusão de concorrência: os logs registram segundo runner recusado RELAY_OWNER_BUSY/status 73. Root somente leu durante execução. Locks cooperativos não impedem ferramentas externas fora do protocolo.
- Retorno: roundtrip-authorized.jsonl, sessão cc010113-cc49-4154-afbd-50cc9d1c9f75, RELAY_CLAUDE_START_ACK; hook real acionou Codex gpt-6-luna/medium/workspace-write; probe.md recebeu RELAY_CODEX_RETURN_ACK; Claude releu e respondeu RELAY_ROUNDTRIP_ACK; exit 0/sem permission_denials. Logs originais em .claude/codex-relay/logs/, prefixo .scratch_mobile-first-planning_evidence_automation-06-2026-10-21_probe.md-20261021T113912Z.
- A sonda Codex teve duas tentativas de append com erro de aspas PowerShell, corrigidas na própria execução. Nenhum produto alterado. O texto da sonda menciona o bloqueio histórico porque a atualização atual ainda não existia; o bloqueio externo está resolvido por esta autorização/prova.
- Avisos de MCP local indisponível e timeouts de hooks auxiliares de observação foram preservados nos logs. Não impediram o ACK/retorno; não são testes de produto aprovados.

## Operação

Reaproveitados runner foreground e Stop hook, com modelos fixados: Claude claude-sonnet-5-5/medium; Codex gpt-6-luna/medium. Sem bypass/background. foreground-owner.lock/writer.lock serializam o protocolo. disabled pausa novas passagens; timer encerra somente a árvore do Claude criado. Logs anteriores preservados. Hook, helper de append e prompt de commit adaptados para 06. Codex jamais faz staging/commit. Claude só commita em chat novo após todos os gates e revisão ECC instalada sem pendências. Encerrar após commit validado de 06; sem 07/push/PR/merge/release/publicação.

Interface pública reaproveitada: Playwright/Chromium, formulário e Generate Teams, textarea Teams to copy, botão Copy teams, clipboard e editor local. A interface e o formato literal já foram aprovados em docs/desenvolvimento-tdd.md, docs/plano-mobile-first.md e testes/tickets anteriores de compartilhamento. Cobertura de toque/teclado em aparelho físico e colagem em app nativo continua indisponível, sem alegar aprovação.
