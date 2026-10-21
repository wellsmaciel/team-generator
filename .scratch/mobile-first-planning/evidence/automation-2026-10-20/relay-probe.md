# Sonda de retorno do relé

Preparação exclusivamente operacional. Não alterar aplicativo, testes, documentos do produto ou cadastros. Nenhum staging/commit permitido nesta sonda. Nenhum RED artificial.

## Passagem Claude → Codex — sonda de retorno

Esta seção é o envelope preparado por Codex raiz para a sonda operacional, não um teste de produto preparado por Claude. Claude será acionado para confirmar o início, e o hook existente deverá encaminhar este envelope ao Codex CLI.

Codex CLI: leia somente este ticket, confirme que a chamada chegou e acrescente `## Passagem Codex → Claude — sonda recebida` com `RELAY_CODEX_RETURN_ACK`, sem alterar outros arquivos. Não execute testes, comandos Git de escrita, produto ou nova tarefa. Esta sonda é aceitação de infraestrutura, não TDD.

Claude: após receber o retorno do hook, leia esta sonda e confirme na resposta `RELAY_ROUNDTRIP_ACK` se encontrar o marcador real. Não escreva nova passagem → Codex. Não iniciar implementação.

## Passagem Codex → Claude — sonda recebida

RELAY_CODEX_RETURN_ACK

- Responsável: Codex. Chamada recebida e envelope lido integralmente; confirmação registrada neste ticket.
- RED/GREEN: não se aplica; sonda de aceitação de infraestrutura, sem teste de produto ou RED artificial. Nenhum teste executado.
- Arquivo alterado: somente este ticket, com acréscimo desta passagem.
- Comandos executados (PowerShell):
  - `Get-Content -LiteralPath 'docs/agents/coordenacao-por-hooks.md'`
  - `Get-Content -Encoding UTF8 -LiteralPath '.scratch/mobile-first-planning/evidence/automation-2026-10-20/relay-probe.md', 'docs/agents/gestao-de-arquivos.md', '.agents/skills/tdd/SKILL.md'`
  - `Get-Content -Encoding UTF8 -LiteralPath '.scratch/mobile-first-planning/evidence/automation-2026-10-20/relay-probe.md'`
- Edição: ferramenta `apply_patch`, apenas para acrescentar esta seção; leitura final para conferir o marcador gravado.
- Limites: nenhum comando Git, implementação, publicação ou nova tarefa. Este registro confirma o recebimento pelo Codex; o retorno completo ainda depende da confirmação de Claude com `RELAY_ROUNDTRIP_ACK`. Claude deve ler o marcador e responder, sem nova passagem → Codex.
