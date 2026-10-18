# TDD a partir da revisão da etapa 05

## Complemento do fechamento da etapa 05

O usuário confirmou testes pela interface pública em navegador real (cliques, teclado, diálogos e resultados renderizados) e instalação do Playwright como dependência de desenvolvimento. Essa interface foi usada em `tests/browser/` para concluir as lacunas do roteiro, com contextos isolados e servidor local próprio. Os comportamentos existentes passaram sem correção do aplicativo: são verificações de aceitação, não um ciclo red/green novo. O TDD anterior de C1 permanece preservado. Para uma nova falha funcional, observar o teste falhar antes de alterar o aplicativo, mantendo o procedimento abaixo.

## Decisão do usuário

Usar TDD a partir de agora em correções e novas funcionalidades, inclusive nas correções eventualmente descobertas na etapa 05. Esta orientação substitui a intenção anterior de esperar terminar a etapa 05. Não autoriza novas funcionalidades nem instalações de dependências.

As verificações anteriores e a suíte já existente continuam úteis como regressão. Não descrevê-las retroativamente como TDD: é necessário ter observado a falha antes da implementação da mudança.

## Procedimento para a próxima mudança de código

Seguir a skill `.agents/skills/tdd/SKILL.md` e suas referências. Antes de escrever um teste novo, apresentar ao usuário o comportamento e a interface pública que será exercitada, com uma linha sobre o que o teste cobre e o que não cobre. Confirmar essa escolha com uma pergunta por vez, como exige a skill: “Before writing any test, write down the seams under test and confirm them with the user.”

Na revisão documental inicial não havia interfaces novas aprovadas. Na execução de C1 em 18/10/2026, o usuário confirmou acionar Generate Teams e verificar resultados renderizados em DOM simulado. Essa interface foi usada em `tests/initial-team-balance.test.cjs`, com red observado antes da correção e green depois. Não interpretar essa confirmação como aprovação automática de outras interfaces.

1. Selecionar um comportamento concreto do escopo autorizado. Para defeito, registrar passos, esperado e observado.
2. Escrever um teste desse comportamento pela interface previamente combinada. Não testar nomes de funções privadas ou reproduzir o algoritmo dentro da expectativa.
3. Executar e observar a falha correspondente ao comportamento ausente/incorreto. Erro de sintaxe ou preparação quebrada não comprovam a falha de comportamento.
4. Implementar somente a mudança necessária para esse teste passar.
5. Executar o teste e a regressão relevante, registrando comandos e resultados antes/depois. Depois seguir para o próximo comportamento, um ciclo por vez.
6. Conferir no navegador o que depender de interação real, controles nativos, área de transferência, teclado e apresentação. DOM simulado não comprova esses aspectos.

Para problema estritamente visual, propor uma verificação que de fato detecte o problema e combinar a abordagem antes de programar. Se a cobertura automatizada adequada não estiver disponível, explicitar a limitação e alinhar com o usuário; não criar teste artificial nem declarar TDD com base apenas numa inspeção posterior.

Não produzir todos os testes de uma vez para só depois implementar tudo. Nesta skill, refatorações ficam para a revisão; não ampliar a correção com reorganizações desnecessárias.

## Ferramentas existentes e registros

Há testes sem dependências executáveis com Node.js:

```text
node tests/manual-player-swaps.test.cjs
node tests/regenerate-teams.test.cjs
node tests/share-team-text.test.cjs
```

São verificações com DOM e armazenamento simulados. Reaproveitar a infraestrutura quando ela cobrir a interface aprovada, sem assumir que todo teste novo deve acessar o estado interno da aplicação. A escolha de limites públicos merece atenção porque a suíte atual também inspeciona estados internos; não copiar esse padrão automaticamente.

Mudanças apenas em roteiro, documentação e registros de evidência não exigem testes de código artificiais. Não escrever testes só para provar que um documento contém uma frase. Verificar referências e coerência dos registros.

Ao fechar uma correção: registrar comportamento/interface aprovados, evidência da falha inicial, correção, teste passando, regressão e limitações de navegador. Os registros devem permanecer em português; código, comentários, interface e novos nomes de testes continuam em inglês.
