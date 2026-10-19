# Política de gestão de arquivos (Claude e Codex)

Guia cruzado para ambos os agentes. Criado em 19/10/2026 a pedido do usuário, depois de confirmar que os "289 arquivos" vistos no diff do editor eram o estado de trabalho não commitado atual (não o repositório inteiro), em grande parte evidências Playwright da rodada 2 em andamento. Complementa [Destino das tarefas](issue-tracker.md); não o substitui.

## Classificação do estado atual (referência, não um inventário permanente)

- **Código-fonte:** `index.html`, `script.js` (raiz do projeto).
- **Testes:** `tests/*.test.cjs` (regressão Node) e `tests/browser/*.spec.cjs` (Playwright), mais `tests/browser/clipboard-editor.html` e `tests/browser/server.cjs` como apoio de teste.
- **Documentação:** `docs/*.md` e `GLOSSARY.md`.
- **Tickets e evidências de rodada:** `.scratch/<nome-da-rodada>/issues/*.md` (tickets) e `.scratch/<nome-da-rodada>/evidence/**` (capturas, relatórios, resultados). Lidos diretamente do disco por Claude e Codex entre sessões; não são descartáveis por padrão.
- **Gerado automaticamente/cache (já no `.gitignore`):** `node_modules/`, `.scratch/npm-cache/`, `.scratch/playwright-browsers/`, `.scratch/playwright-report/`, `.scratch/playwright-results/`.

## Regra central: `.scratch/<rodada>/` é arquivo do projeto, não lixo temporário

A rodada 1 (`.scratch/remaining-work/`) já está commitada no git (46 arquivos, ~7,2 MB) e é referenciada por link em `docs/proximo-chat.md` e outros documentos. Isso é o padrão real do projeto: tickets e evidências de uma rodada concluída são preservados e versionados, não apagados ao final.

**Nenhum agente deve excluir arquivos dentro de `.scratch/<rodada>/issues/` ou `.scratch/<rodada>/evidence/`** sem pedido explícito do usuário identificando o arquivo ou pasta exata. Isso vale mesmo para evidências de ciclos TDD já fechados (RED/GREEN/verificação) — elas documentam o histórico da correção, igual a um commit squashed não preservaria.

## O que pode ser removido sem pedir

- Saída temporária de uma execução que o próprio agente repetiu por engano na mesma passagem (ex.: um segundo `playwright-report` gerado por engano por não ter usado `--output` isolado), antes de registrar qualquer evidência dela em um ticket.
- Arquivos de rascunho pessoal do agente (scratchpad da própria sessão) que nunca foram referenciados em nenhum ticket ou documento.
- Qualquer coisa já listada no `.gitignore` (node_modules, caches de navegador Playwright, resultados/relatórios de execução simples) pode ser apagada do disco com segurança quando precisar de espaço — ela é reconstruída pelos comandos documentados em `docs/proximo-chat.md`/`package.json`.

Fora esses casos, excluir é uma decisão do usuário, não do agente.

## `.gitignore`

Já cobre dependências, caches de teste, configuração local e arquivos de agentes locais. Antes de adicionar uma entrada nova:
- Confirmar que o arquivo é mesmo gerado automaticamente ou local-only (não um ticket, evidência de rodada fechada ou documentação).
- Se for um arquivo com segredo/credencial real (chave de API, token), adicionar ao `.gitignore` imediatamente e avisar o usuário na mesma resposta — não esperar confirmação para isso especificamente, mas nunca apagar o arquivo sem perguntar (pode haver versão anterior sem o segredo a recuperar).
- Este projeto é estático e não usa `.env` nem chaves de API; se isso mudar, revisar esta seção.

## Evidência de TDD: convenção recomendada daqui para frente

A rodada 2 (`.scratch/usability-2026-10-19/evidence/`) está, até 19/10/2026, ~15× mais pesada que a rodada 1 pelo mesmo tipo de tarefa (111 MB vs. 7,2 MB), porque cada etapa de cada ciclo (RED, GREEN, reverificação, regressão) salvou relatório HTML completo + `trace.zip` + `results.json` separados, em vez de um registro consolidado por ticket.

**Recomendação para novos tickets, sujeita a confirmação do usuário quando a situação for ambígua:**
- Preferir texto do resultado do comando (como já é feito nas seções "Passagem..." de cada ticket) como evidência primária.
- Guardar `trace.zip`/relatório HTML completo apenas quando houver uma falha real a investigar depois, ou quando o usuário pedir explicitamente a captura completa — não para toda transição RED→GREEN confirmada por texto.
- Preferir uma pasta de evidência por ticket, não uma por sub-etapa, quando o conteúdo não mudar entre execuções (evitar duplicar o mesmo relatório/trace repetidamente).
- Isso não se aplica retroativamente: não reorganizar ou apagar evidências já geradas nesta rodada por este motivo.

## Comunicação

Qualquer exclusão de arquivo fora das permissões acima, ou qualquer entrada nova no `.gitignore` motivada por segredo real, deve ser relatada ao usuário na mesma resposta em que ocorreu — nunca silenciosamente.
