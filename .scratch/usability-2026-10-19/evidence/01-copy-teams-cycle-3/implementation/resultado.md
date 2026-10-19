# Implementação do ciclo 3 — 19/10/2026

Responsável: Codex. Implementação expressamente autorizada pelo usuário após a verificação mais recente de Claude. Skill TDD do projeto como orientação principal; apoio E2E do ECC já consultado. Nenhum teste novo ou alteração do teste existente.

## RED preservado

A [verificação anterior](../verification-2026-10-19/resultado.md) registrou 6 casos aprovados e 3 falhas na linha 82: `#copyStatus` manteve `Teams copied.` ao entrar em prévia pendente. Claude reproduziu a mesma falha em sua última passagem no ticket. Não foi necessário repetir novamente esse RED antes da mudança de uma linha.

## Alteração e GREEN observado

Em `script.js`, no ramo `after > before` de `generateTeams()`, limpar `#copyStatus` imediatamente após guardar os times anteriores e antes de mostrar os controles da decisão. A alteração fica restrita à entrada em prévia pendente. O handler de cópia dos ciclos 1–2 permanece inalterado.

Comando executado:

```powershell
npx.cmd --no-install playwright test --config .scratch/usability-2026-10-19/evidence/01-copy-teams-cycle-3/implementation/playwright.implementation.config.cjs
```

**15 passaram em 16,2s; saída 0**, sem falhas, skips ou retries. Inclui 9 casos dos ciclos 1–3 e 6 regressões de exclusão durante prévia, teclado, aceitar/desfazer, troca e cópia/colagem manual. Chromium no Windows, contextos isolados, desktop 1280×720, narrow-360 360×800 e narrow-390 390×844. A configuração de evidência herda a configuração original e apenas resolve o diretório de testes e separa os caminhos de saída; a configuração original não foi alterada.

Também aprovados:

- `node --check script.js`: sintaxe.
- `node tests/initial-team-balance.test.cjs`: C1 12/20 e preservações.
- `node tests/manual-player-swaps.test.cjs`: 458 pares e casos adicionais.
- `node tests/regenerate-teams.test.cjs`: 714 cenários e casos adicionais.
- `node tests/share-team-text.test.cjs`: conteúdo, decisões, invalidação e armazenamento.
- `git diff --check -- script.js index.html`: sem erros de whitespace.

As quatro regressões Node usam DOM/armazenamento simulados. O resultado detalhado do navegador está em `results.json`, `console.txt` e `report/index.html`; capturas produzidas pelas regressões estão em `results/`. Como nenhum teste falhou, não foram gerados novos traces de falha.

## Preservação e correção textual

Os arquivos de teste, HTML, CSS, configuração, package.json e as evidências dos ciclos 1–2 permaneceram idênticos por SHA256. Nas evidências RED do ciclo 3, somente `verification-2026-10-19/resultado.md` teve a acentuação restaurada; números, comandos, resultados, capturas, traces e manifests foram preservados. O texto histórico continua descrevendo o RED daquela execução.

Restaurada também a seção “Verificação Codex do ciclo 3” no ticket. Os dois registros apontados por Claude foram salvos em UTF-8 e decodificados com validação estrita. A corrupção anterior substituíra letras por `?`; a restauração foi textual, preservando o conteúdo. O manifesto anterior à correção fica em `before-sha256.json`; as alterações esperadas e a conferência estão em `integrity.json`. Manifests históricos não foram reescritos.

## Limites e continuidade

Ciclo 3 GREEN. O teste existente cobre mensagem de sucesso anterior seguida de prévia pendente; não demonstra erro anterior nem resposta assíncrona atrasada. Viewports não comprovam celular físico. A rejeição do ciclo 2 é simulada no limite externo; o ciclo 1 verifica clipboard real com a normalização CRLF/LF já autorizada.

Tarefa inteira permanece aberta. Nenhum avanço para o ciclo 4, commit, PR ou release. A verification-loop do ECC permanece reservada ao fechamento completo, adaptada aos comandos JavaScript existentes, sem impor ferramentas ou comandos não configurados.
