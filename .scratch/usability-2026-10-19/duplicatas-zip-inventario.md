# Inventário de ZIPs duplicados — evidência do ticket "Copy teams" (rodada usability-2026-10-19)

Gerado em 2026-10-19 a pedido do usuário, para subsidiar a decisão de exclusão específica antes do commit da evidência Playwright dos ciclos 1–3. Não implica exclusão automática — cada par listado aqui exige aprovação explícita antes de qualquer remoção, conforme `docs/agents/gestao-de-arquivos.md`.

## Como foi verificado

- Todos os `.zip` em `.scratch/usability-2026-10-19/evidence/` foram comparados por hash MD5 de conteúdo (não por nome ou tamanho).
- Total de ZIPs: 34 (~70 MiB). Conteúdo único: 19. Pares duplicados: **15**.
- Para cada par, o hash é idêntico porque o relatório HTML do Playwright (`*-report/data/<hash>.zip`) embute uma cópia exata do `trace.zip` que já existe na pasta de resultados brutos (`*-results/<teste>/trace.zip`) da mesma execução.
- Confirmado por inspeção que `*-report/index.html` referencia o hash do arquivo em `report/data/` diretamente (abre o trace viewer a partir dali). O arquivo em `*-results/.../trace.zip` não é referenciado pelo relatório já gerado — é a saída bruta do test runner.

**Recomendação por par: preservar o lado `*-report/data/<hash>.zip`; o lado `*-results/<teste>/trace.zip` é o candidato seguro à remoção**, pois remover a cópia referenciada pelo relatório quebraria o trace viewer do HTML já gerado.

Total recuperável se os 15 "candidatos a remover" forem excluídos: **31.680.827 bytes (≈30,2 MiB)**.

## Os 15 pares

| # | MD5 | Preservar | Candidato a remover | Tamanho |
| --- | --- | --- | --- | --- |
| 1 | `073af390e7f5eb4bc0e8c5f580191dda` | `evidence/01-copy-teams-cycle-1/red-report/data/ba3c686ff12ede7d0cdac8c2930e3bd4d17d2565.zip` | `evidence/01-copy-teams-cycle-1/red-results/copy-teams-button-clicking-45506-confirms-only-after-success-narrow-390/trace.zip` | 2.147.748 B |
| 2 | `183af0d2087162ab6ee6a9fc8aef1bbc` | `evidence/01-copy-teams-cycle-2/implementation/red-report/data/1656785a8169e8ffc2d855047cbfe3ddb35b118e.zip` | `evidence/01-copy-teams-cycle-2/implementation/red-results/copy-teams-button-clipboar-acc31--displayed-teams-or-players-narrow-360/trace.zip` | 1.862.786 B |
| 3 | `280c47c2fb84517f1cb9a3396f3d1421` | `evidence/01-copy-teams-cycle-2/red-report/data/c4127f1170f33332fdf5f3ce1b66bc1d21db771a.zip` | `evidence/01-copy-teams-cycle-2/red-results/copy-teams-button-clipboar-acc31--displayed-teams-or-players-desktop/trace.zip` | 2.059.149 B |
| 4 | `2c44b51707cd8188211fb68deef73aaa` | `evidence/01-copy-teams-cycle-2/implementation/red-report/data/2a7505ef3fc7a9137dfc6f29de79dd6f5b6639e7.zip` | `evidence/01-copy-teams-cycle-2/implementation/red-results/copy-teams-button-clipboar-acc31--displayed-teams-or-players-narrow-390/trace.zip` | 1.933.948 B |
| 5 | `4a9eb1206344744cf96be202b56952d6` | `evidence/01-copy-teams-cycle-1/after-implementation-report/data/d73d70d39a1f44a11dc926d3aa8c782dca2c7b07.zip` | `evidence/01-copy-teams-cycle-1/after-implementation-results/copy-teams-button-clicking-45506-confirms-only-after-success-narrow-390/trace.zip` | 2.038.602 B |
| 6 | `79a2bd0e92fefcd72e2187046f5aae33` | `evidence/01-copy-teams-cycle-2/red-report/data/0e18784ef4535d07aadd8a661cde78dd7e24368e.zip` | `evidence/01-copy-teams-cycle-2/red-results/copy-teams-button-clipboar-acc31--displayed-teams-or-players-narrow-390/trace.zip` | 2.146.788 B |
| 7 | `8719f452f7b7ef71ec3ddedc2b6abea5` | `evidence/01-copy-teams-cycle-2/red-report/data/4c590e0d9ef84405224cfa899f3ced9e4227033b.zip` | `evidence/01-copy-teams-cycle-2/red-results/copy-teams-button-clipboar-acc31--displayed-teams-or-players-narrow-360/trace.zip` | 1.923.497 B |
| 8 | `960a10a6213a0a4e11369bb6f0796775` | `evidence/01-copy-teams-cycle-3/verification-2026-10-19/report/data/e909a97846849dcf336d9e996cc45dffdb10ff0d.zip` | `evidence/01-copy-teams-cycle-3/verification-2026-10-19/results/copy-teams-button-a-pendin-c8df4-ears-a-previous-copy-status-desktop/trace.zip` | 2.377.021 B |
| 9 | `9b72ab5ceee7b73cfb0d9550cec0b09c` | `evidence/01-copy-teams-cycle-3/verification-2026-10-19/report/data/a3514a8f05084a5e7fdebf45dd0e4a64496e0814.zip` | `evidence/01-copy-teams-cycle-3/verification-2026-10-19/results/copy-teams-button-a-pendin-c8df4-ears-a-previous-copy-status-narrow-390/trace.zip` | 2.305.235 B |
| 10 | `9f0afcaeaeff69b27e5f6030f4ad9aea` | `evidence/01-copy-teams-cycle-1/red-report/data/f3c87e789adfa8d467f2c304d9055184d142bffc.zip` | `evidence/01-copy-teams-cycle-1/red-results/copy-teams-button-clicking-45506-confirms-only-after-success-narrow-360/trace.zip` | 2.065.571 B |
| 11 | `b14b2737b5976cbdee72ae142e537cef` | `evidence/01-copy-teams-cycle-2/implementation/red-report/data/ca2c702db9ce749bb0f31f7b9c06b0a005908db9.zip` | `evidence/01-copy-teams-cycle-2/implementation/red-results/copy-teams-button-clipboar-acc31--displayed-teams-or-players-desktop/trace.zip` | 2.058.914 B |
| 12 | `b8238587345dd2da9f30c0e256799184` | `evidence/01-copy-teams-cycle-1/red-report/data/607595f52b0dae0c5b1b406100076daf92f59949.zip` | `evidence/01-copy-teams-cycle-1/red-results/copy-teams-button-clicking-45506-confirms-only-after-success-desktop/trace.zip` | 2.283.523 B |
| 13 | `eaa15b64a040bf79ee66ccd9d96dc02e` | `evidence/01-copy-teams-cycle-1/after-implementation-report/data/67b11bd2ae800a4a2f2d4e06da30950bd69283c8.zip` | `evidence/01-copy-teams-cycle-1/after-implementation-results/copy-teams-button-clicking-45506-confirms-only-after-success-desktop/trace.zip` | 2.135.187 B |
| 14 | `eb013d4f1c9fb3e19ccd9e2b1880ee9d` | `evidence/01-copy-teams-cycle-1/after-implementation-report/data/929551d6db4c46b15a82b892661424d5e21378bc.zip` | `evidence/01-copy-teams-cycle-1/after-implementation-results/copy-teams-button-clicking-45506-confirms-only-after-success-narrow-360/trace.zip` | 2.038.292 B |
| 15 | `f348077b120a6dadef691fd49ec9d664` | `evidence/01-copy-teams-cycle-3/verification-2026-10-19/report/data/7eb8eee7c1e791c73e84777d4f54d8f58de539e6.zip` | `evidence/01-copy-teams-cycle-3/verification-2026-10-19/results/copy-teams-button-a-pendin-c8df4-ears-a-previous-copy-status-narrow-360/trace.zip` | 2.254.220 B |

Caminhos acima são relativos a `.scratch/usability-2026-10-19/`.

## Status

Lista gerada para apoiar a decisão do time. **Nenhum arquivo foi removido.** A exclusão dos 15 "candidatos a remover" requer aprovação explícita do usuário antes do commit da rodada, conforme acordado. Os 19 ZIPs sem par (conteúdo único) e os demais arquivos de evidência (PNG, HTML, JSON, MD) não entram nesta lista e permanecem preservados integralmente.
