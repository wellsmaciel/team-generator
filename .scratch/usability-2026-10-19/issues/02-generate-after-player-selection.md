# 02: Gerar depois de conferir os participantes

**What to build:** na segunda rodada, posicionar configuração da quantidade de times e geração depois da lista de participantes e antes dos resultados. A ordem visual e de teclado deve permitir conferir a seleção antes de gerar.

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] Antes de escrever testes, confirmar comportamento e interface pública com o usuário. Usar TDD: observar falha de um comportamento esperado antes de alterar a página, um ciclo por vez.
- [ ] Ordem do fluxo e DOM: cadastro, lista/seleção de participantes, quantidade de times/geração e resultados. Não simular a mudança apenas reposicionando elementos por CSS.
- [ ] Preservar rótulos, quantidade escolhida, contagem, validações, mensagens, primeira geração, nova composição, prévia e aceitar/desfazer.
- [ ] A navegação por Tab/setas e o foco continuam coerentes e visíveis. Não criar IDs duplicados ou controles de geração independentes com estados divergentes.
- [ ] Conferir desktop, larguras 360/390, listas e nomes longos, sem cortes que impeçam usar os controles. A lista longa pode exigir rolagem normal; não introduzir rolagem automática ou redesenho geral não solicitado.
- [ ] Preservar regras de tamanho/goleiros/equilíbrio, cadastro salvo, seleção e invalidação; não alterar o algoritmo nem acrescentar persistência.
- [ ] Testar pela interface pública com Playwright a ordem dos controles e o percurso de teclado, além da geração após selecionar pessoas. Conferir visualmente os viewports sem depender de nomes de funções internas.
- [ ] Reexecutar regressões relevantes Node/Playwright. Se Copy teams já estiver implementado, preservar seu comportamento e acessibilidade.
- [ ] Registrar red/green, verificações e limites, atualizar status, instruções e resumo de continuidade. Não iniciar outra tarefa, commit, PR ou release automaticamente.
