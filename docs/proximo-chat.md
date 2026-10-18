# Resumo para o próximo chat

Atualizado em 18/10/2026. **Tickets 01 a 05 concluídos**, com critérios essenciais comprovados. Nenhuma nova funcionalidade está autorizada.

## Evidências e estado final

- [Relatório final de Playwright](../.scratch/remaining-work/evidence/2026-10-18-playwright-03/resultado.md): 6 testes passaram em Chromium 156.0.8078.4, Windows, nas áreas 1280×720, 360×800 e 390×844. Exclusão durante prévia, limpeza completa, geração posterior, selects por Tab/setas, aceitar/desfazer e cópia/colagem verificados pela interface pública.
- [Relatório integrado anterior](../.scratch/remaining-work/evidence/2026-10-18-browser-02/resultado.md): A2/A3/A5/A6/B1/B4/B5/C1 e partes dos demais casos, preservados com sua origem.
- A1 comprovado por capturas/relatos. A4/B2/B3 e cancelamento de exclusão durante prévia completados por capturas/relatos do usuário em sessão isolada :5500; esses relatos não são execução direta do Playwright.
- A7/A8/A9/B6/B7/B8 completados com Playwright. A1–A9, B1–B8 e C1 aprovados no [roteiro](testes-manuais-etapa-05.md).
- C1 corrigido por TDD anteriormente: red com diferença 10, esperada 8; green com 12/20 e tamanhos 3/2. Primeira geração também aprovada no navegador, sem regeneração ou troca manual para fazer passar.
- Reexecutados com sucesso: sintaxe de script.js, C1, 458 pares de trocas e casos adicionais, 714 cenários de regeneração e casos adicionais, compartilhamento. Testes Node continuam classificados como DOM/armazenamento simulados.
- Nesta execução: infraestrutura/testes Playwright, package.json e lockfile adicionados. Nenhum código do aplicativo ou cadastro real alterado; nenhuma nova falha funcional exigiu correção. Testes de comportamento existente são aceitação, não um novo ciclo TDD.
- [Resumo anterior arquivado](../.scratch/remaining-work/evidence/2026-10-18-playwright-03/proximo-chat-antes-do-fechamento.md). Próximos passos parciais em registros antigos são históricos, não trabalho a repetir.

## Reexecução

O aplicativo continua estático, abrindo por index.html e sem dependências de execução. Playwright é dependência de desenvolvimento autorizada. No PowerShell:

```powershell
npm.cmd ci --cache .scratch/npm-cache
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path (Get-Location) '.scratch/playwright-browsers'
npx.cmd --no-install playwright install chromium
npm.cmd run test:browser
```

O servidor de teste usa somente 127.0.0.1:51806, inicia/encerra com os testes e não depende dos servidores manuais :5500/:51805. Cada teste abre contexto vazio, sem perfil real. Relatórios temporários ficam em .scratch/playwright-results e .scratch/playwright-report; cópias do fechamento foram arquivadas junto ao relatório final.

## Limitações separadas

- B9 não executado: sem aparelho físico disponibilizado. Larguras 360/390 são simulações; toque e teclado móvel não foram comprovados. O roteiro considera B9 condicional, sem marcá-lo como teste aprovado.
- Cópia/colagem verificada por Ctrl+C/Ctrl+V em editor de texto local servido em outra página do navegador. Sem colagem em Bloco de Notas/Word ou mensageiro nativo e sem envio a terceiros.
- Geração sem ótimo global: greedy com capacidades e goleiros, seguido de trocas de mesma função que reduzam estritamente a diferença maior/menor soma até nenhuma melhorar. Término por redução inteira. Regeneração mantém 64 distribuições aleatórias e enumeração de trocas simples válidas, sem histórico geral.
- Capturas fullPage com fundo fixo podem mostrar área branca fora do viewport; capturas normais após rolar mostram fundo correto. Não foi diagnosticado defeito do produto por esse artefato.

## Orientações vigentes

- Explicar em português, com respostas curtas; código, comentários, interface e novos nomes de testes em inglês.
- Preservar alterações locais, dados reais e evidências. Sem commit, publicação ou contato com terceiros sem pedido.
- TDD nas próximas correções/funcionalidades autorizadas: confirmar comportamento/interface, observar falha antes de corrigir, sem fabricar red para comportamento já existente. Interface pública de navegador e instalação Playwright aprovadas nesta conversa; ver [procedimento](desenvolvimento-tdd.md).
- Botão Copy teams e reposicionar Generate Teams permanecem adiados. Não iniciar esses ajustes, login/backend/sincronização ou persistência da partida automaticamente.
- Não retomar entrevista de teste ou repetir etapas comprovadas sem alteração, falha ou pedido do usuário.
