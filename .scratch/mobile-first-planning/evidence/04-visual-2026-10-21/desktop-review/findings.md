# Conferência final de Codex — pendências da 04

O retorno TASK04_READY_FOR_CONDITIONAL_COMMIT e o APPROVE anterior estão superados por esta conferência de especificação. Nenhum staging/commit ocorreu.

## Disposição aprovada de tablet/desktop

A afirmação de que a prévia só define o celular é incorreta. O arquivo aprovado team-generator-preview.html contém uma variante Desktop e usa .tg-columns com grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr). O ramo screen === players usa essa classe para Registered players e Add player. A captura de referência prototype-players-1280.png foi produzida ativando a variante Desktop da prévia (não é um teste do produto): cartões no mesmo y=201, lista em x=32/largura 717,59 e formulário em x=769,59/largura 478,39. O produto em final-layout-confirmed/players-1280.png empilha os cartões e mantém campos de 202/70 px em um cartão de quase a tela inteira.

Critério já aprovado: em telefone, lista antes do formulário empilhados; em largura maior, lista à esquerda e formulário à direita, com campos/botão usando a largura do painel. A ordem DOM lista → formulário é preservada. Não pedir de novo essa decisão ao usuário.

Há também expectativas erradas em testes escritos nesta entrega: o ciclo 11 exige lista visualmente acima do formulário até no desktop, e o ciclo 5 exige múltiplas colunas em ambas as listas inclusive Players. Na prévia Players usa linhas numa única coluna dentro do painel esquerdo; a seleção de Match usa .tg-roster com várias colunas. Corrigir essas expectativas ao contrato realmente aprovado, preservando/substituindo por asserções explícitas de ordem DOM, layout móvel empilhado, dois painéis em largura maior, roster de Players alinhado em uma coluna, múltiplas colunas de participantes em Match, contraste, nomes literais, overflow e teclado. Não remover cobertura para obter aprovação: as expectativas substitutas devem comprovar o layout de referência.

Próximo ciclo de Claude: um teste público do workspace responsivo de Players em 768/1280 com dois painéis e formulário largo. Observar RED válido antes do mínimo HTML/CSS de Codex. Manter todos os comportamentos existentes, sem lógica de Match 05 nem formato 06. Depois verificar independentemente, capturar nova pasta e repetir ECC com fonte correta. Nada de copiar handlers da demonstração.

## Documentação e revisão

docs/proximo-chat.md e os parágrafos atuais de docs/tarefas.md ainda apresentam preparação/implementação não iniciada e a antiga parada de commit. A autorização e os estados atuais precisam ser claros nos documentos de continuidade; arquivar/rotular histórico, não deixar instruções falsas como próxima ação. O snapshot preexisting-docs.patch já preserva a base; distinguir preexistente não significa deixar a continuidade incorreta.

O relatório anterior code-review.md permanece como evidência histórica, mas sua premissa LOW 5 sobre desktop está incorreta. Produzir um relatório novo após o ajuste, com leitura integral dos arquivos alterados de aplicação/suporte/specs e todos os novos arquivos candidatos; a skill ECC manda ler arquivos alterados por completo, não somente trechos renderPlayers/diff de script.js. Não marcar o achado de especificação como simples limitação de ambiente.

O contador real do relé é 18; capturas não o incrementam. O teto interno não é limite do escopo autorizado nem razão para omitir um critério. Teto ajustado a 24 para fechar layout/revisão já aprovados, sem reset/apagar contador ou logs. Parada obrigatória após commit validado da 05 permanece.
