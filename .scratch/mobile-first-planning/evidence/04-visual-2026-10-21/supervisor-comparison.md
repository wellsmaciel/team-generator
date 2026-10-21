# Comparação visual de Codex — 21/10/2026

Capturei o produto real e a prévia aprovada em contextos Playwright isolados, abrindo arquivos locais. Script capture.cjs foi revisado e executado pelo Codex raiz após o fim da sessão Claude; não houve edição simultânea. O script agora aceita uma etiqueta simples de snapshot e recusa sobrescrever uma pasta de evidência anterior. A permissão do Claude foi ampliada apenas para esse comando específico, não para Node/shell genérico.

Evidência em before-final-controls/: Players e Match a 360/390/768/1280; measurements.json; prototype-players-390.png. Medidas: sem overflow horizontal nas quatro larguras; navegação inferior com 60px, botões de 44px em telefone; superior com botões de 30px em tablet/desktop. Verde atual e primário presentes após ciclos 8–10. Nenhuma prova de aparelho ou teclado móvel físico.

## Achado de disposição ainda não resolvido

A imagem aprovada de Players mostra o título Players, depois um cartão Registered players com linhas/alvos de ação confortáveis, depois um cartão Add player com campos largos e botão amplo. A imagem do produto mostra o formulário antes da lista, ambos num único cartão, campos estreitos e Edit/Delete com aparência padrão e pouco espaço. Não basta corrigir cores para declarar a disposição aprovada concluída.

Este é um critério já aprovado do plano, não funcionalidade nova. Próximo passo: Claude prepara um teste público significativo para a ordem lista → formulário; Codex ajusta somente composição/estilo mantendo IDs, handlers e lógica existentes. Depois um comportamento por ciclo para o conforto dos campos/ações e indicadores de foco/seleção, conforme referência. Se mudar a estrutura dos cartões, preservar as verificações de opacidade/contraste no cartão real em vez de exigir a antiga forma interna do wrapper; não apagar/reduzir asserções de legibilidade.

Match continua intermediário na 04. Etapas Select players/Teams, linha toda selecionável, estado vazio e área inicial Match pertencem à 05 e não são antecipados. Não copiar dados ou atalhos demonstrativos da prévia para lógica real.

O ciclo 10 foi verificado por Claude: 96 aprovados, 6 ignorados por desenho, 0 falhas e quatro Node aprovados. A falha do Codex CLI foi capacidade do modelo após aplicar a regra; não é teste aprovado desse encerramento incompleto. Verificação independente de Claude está no ticket. Nenhum commit autorizado antes do fechamento integral/revisão ECC.
