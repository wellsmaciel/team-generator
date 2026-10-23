# Roadmap por fases

**Estado atual (23/10/2026):** as fases iniciais, as rodadas de usabilidade, a entrega mobile first, os refinamentos para tablets e detalhes opcionais da partida com compartilhamento por WhatsApp foram concluídos. A release publicada anteriormente é `v1.6.0`; esta entrega está na branch de integração `feat/match-details-whatsapp`. Consulte [tarefas](tarefas.md), [jornada do usuário](jornada-do-usuario.md) e [resumo](proximo-chat.md). As fases abaixo registram o roadmap original e não são uma fila de trabalho atual.

O [mapa da jornada](jornada-do-usuario.md) e o [índice de tarefas](tarefas.md) registram as entregas encerradas. Não há sequência de implementação autorizada neste roadmap.

**Plano histórico da descoberta.** A base descrita nas primeiras fases já foi implementada. A divisão aprovada do trabalho restante está em [tarefas e prompts](tarefas.md), e o estado atual em [resumo de continuidade](proximo-chat.md). As recomendações abaixo registram a proposta inicial e não devem ser executadas novamente nem tratadas como tarefas adicionais.

## Etapa histórica: confirmar e preparar

As decisões principais já foram confirmadas. Antes de fechar o plano, confirmar as prioridades e resolver os bloqueios da geração em [pendências](pendencias.md), sobretudo algoritmo, detalhes das combinações alternativas e limites da quantidade de times. A medida de equilíbrio já foi aprovada.

Primeira tarefa técnica recomendada após confirmação: extrair CSS e JavaScript do `index.html` para arquivos próprios, mantendo o comportamento existente. Conferir cadastro, geração e imagem de fundo. Isso cria uma base pequena e compreensível antes de mudar regras.

## Fase 1: cadastro reaproveitável

Implementar nota de 1 a 10, condição de goleiro, identificadores, armazenamento no navegador, edição, exclusão com confirmação e seleção dos participantes. Conferir que recarregar mantém o cadastro e que desmarcar uma pessoa não a exclui.

## Fase 2: formação dos times

Implementar quantidade configurável de times, limites de tamanho, distribuição de goleiros, impedimento por excesso e avisos. Buscar reduzir a diferença entre a maior e a menor soma, conforme medida aprovada. Verificar as regras com exemplos, incluindo 15 participantes e 3 times.

## Fase 3: revisão e compartilhamento

Implementar trocas válidas, atualização das somas e novas combinações. Quando uma nova geração aumentar a diferença entre a maior e a menor soma, avisar e permitir aceitar ou desfazer, recuperando os times anteriores. Exibir texto selecionável, sem notas individuais nem totais, para copiar e colar manualmente.

## Fase 4: teste com organizador

Revisar o uso no celular e testar a jornada completa com o grupo de 15 jogadores, caso o organizador aceite. Coletar dificuldades e observar se as notas e o equilíbrio calculado ajudam na prática. O contato é uma intenção do usuário, não uma ação já realizada ou autorizada ao agente.

## Pode esperar

Regras específicas de outros esportes, imagens para compartilhar, sincronização, login, backend e banco externo. Ver distinção entre adiamento e ideias não aprovadas em [pendências](pendencias.md).
