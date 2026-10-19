# 03: Validar a segunda rodada e atualizar a passagem

**What to build:** entregar o fluxo integrado de selecionar, gerar, trocar, aceitar/desfazer e copiar com os dois ajustes de usabilidade, com instruções e evidências correspondentes ao resultado real.

**Blocked by:** 01: Copiar os times com um botão; 02: Gerar depois de conferir os participantes — ambas desta segunda rodada.

**Status:** ready-for-agent

**Atualização de prioridade aprovada em 19/10/2026:** executar esta validação somente após concluir também Select All Players, inserido pelo usuário depois da tarefa 02. A entrega ainda terá ticket próprio e comportamento/interface confirmados antes da implementação. O fluxo integrado deverá incluir a seleção em lote; ver [mapa da jornada](../../../docs/jornada-do-usuario.md) e [índice de tarefas](../../../docs/tarefas.md). Esta atualização amplia os bloqueios originais e não inicia a tarefa 03.

- [ ] Revisar os resultados e critérios das duas tarefas desta rodada; confirmar que estão concluídas. Não confundir com os tickets 01–05 da primeira rodada, já encerrados.
- [ ] Reaproveitar evidências suficientes, sem repetir todo o roteiro da primeira rodada. Executar regressões Node e Playwright relevantes para a integração.
- [ ] Conferir selecionar participantes, gerar pela nova posição, copiar, trocar, aceitar e desfazer, com texto e feedback de cópia coerentes com a composição atual.
- [ ] Conferir ausência/falha da API de cópia, caminho manual e limpeza/feedback durante mudanças de estado, inclusive operação assíncrona pendente. Identificar testes controlados de API sem apresentá-los como ações manuais reais.
- [ ] Usar dados sintéticos e contextos isolados. Preservar cadastros reais, regras de times, armazenamento e resultados da primeira rodada.
- [ ] Conferir teclado, rótulos, foco e apresentação em desktop e larguras 360/390. Registrar navegador/dimensões e limitações; teste físico depende de disponibilidade e não exige publicar o site.
- [ ] Para falhas que exijam correção, confirmar comportamento/interface, observar teste falhar antes de corrigir e repetir as verificações afetadas. Testes de comportamento já existente são aceitação/regressão; não fabricar red nem chamá-los retroativamente de TDD.
- [ ] Atualizar instruções de uso, índices, status dos tickets, resumo de continuidade e limites conhecidos. Só marcar critérios comprovados; registrar impedimentos específicos em vez de concluir parcialmente sem aviso.
- [ ] Não adicionar Jest/Supertest ou migrar a suíte inteira. Manter código/interface/testes em inglês e documentação em português.
- [ ] Não fazer commit, PR, merge, release, publicação ou contato externo automaticamente; pedir autorização específica quando esse trabalho for solicitado.
