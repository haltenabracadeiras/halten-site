# BRIEF — Home v2 da Halten Abraçadeiras ("Aperta de verdade")

Home oficial desde 14/10/2026 (antes foi prévia em `/v2`). As peças da v2 ficam nesta pasta (`_dados`, `_partes`, `_fx`, CSS).

## As 7 respostas

1. **O que é e pra quem** — Halten Abraçadeiras: fábrica de abraçadeiras em Cascavel/PR, desde 2022
   (Halten Indústria e Comércio Ltda.). Visitam: compradores de autopeças e distribuidores, oficinas e
   frotas da linha pesada, indústria e o setor agrícola. Eles procuram a abraçadeira certa (por código,
   medida ou aplicação) e um fornecedor em quem possam confiar.
2. **Vibe** — Força bruta / pesados: robusta, noturna, potente, mecânica.
   Referências de fora da internet: pátio de transportadora de madrugada, cabine de Scania, oficina com
   faísca de esmeril.
3. **Caminho** — o aperto (promessa) → onde a Halten trabalha → a linha inteira → quem é a fábrica →
   presença no Brasil → app e catálogo → orçamento.
4. **O que precisa ACREDITAR no final** — "A Halten é uma fábrica séria, de qualidade, em quem eu posso confiar."
5. **Energia e pico** — o pico é **a linha de produtos**.
6. **Movimento-assinatura** — **O aperto**: a rolagem aperta uma abraçadeira (estilo tucho / T-bolt)
   em volta do título. As pontas da fita se aproximam, a porca gira, as letras são comprimidas (eixo de
   largura da fonte) e o medidor mostra o diâmetro real caindo até TRAVAR.
7. **Materiais** — logo SVG, 18 fotos recortadas dos produtos (Supabase), 4 telas do app, mapa do Brasil
   (SVG do site), textos do site atual e dados reais do banco: 18 modelos ativos, 235 códigos nas tabelas
   técnicas, 13 representantes em 12 estados, CNPJ, endereço, horário e contatos.
   Não existem fotos de fábrica, equipe ou caminhões: a página vive sem elas. Os produtos são os heróis,
   sob luz dura e fundo escuro. Nenhum número inventado: tudo vem do banco ou do site atual.

## Jornada em cenas

| # | Cena | VÊ | SENTE | PASSA A ACREDITAR | Energia | Família de efeito |
|---|---|---|---|---|---|---|
| 1 | **O aperto** (fixa, 3 telas) | "APERTA DE VERDADE." enorme dentro de uma cinta de aço solta; medidor "Ø 132,0 mm · solta" | tensão → alívio no TRAVA | "isso segura" | alta | assinatura (cinta + eixo de largura) |
| 1b | **O outdoor do pátio** (13/10) | os banners ativos do admin num outdoor iluminado: refletores acendem piscando, a arte troca como painel de rolo; produto que o banner aponta ganha selo "Lançamento" na esteira | novidade | "eles lançam produto" | média | luz que acende + painel de rolo |
| 2 | **Onde trabalha** | parágrafo gigante, alinhado à esquerda, acendendo palavra a palavra; vibração treme, pressão comprime | peso, ambiente pesado | "é peça para trabalho duro" | calma | texto que se monta (rolagem) |
| 3 | **A linha — PICO** (fixa, 7 telas) | esteira industrial: as 18 abraçadeiras reais param, uma a uma, no portal de medição, com nome gigante, faixa de diâmetro real, nº de códigos e link | vitrine, abundância, precisão | "eles têm a linha completa" | **máxima** | trilho + portal de inspeção |
| 4 | **A fábrica** (fundo vira aço claro) | placa de identificação rebitada (razão social, CNPJ, endereço, 2022) + missão, visão e valores | sobriedade, seriedade | "é empresa de verdade" | calma | fundo que viaja + digitar + revelações |
| 5 | **De Cascavel para o Brasil** (fixa, 3 telas) | rotas saindo de Cascavel e acendendo os 12 estados com representante; contador de estados | alcance, presença | "atendem no Brasil todo" | média | traço SVG + números |
| 6 | **No bolso** (volta a noite) | celular com as telas reais do app trocando com a rolagem; códigos reais flutuando em profundidade | facilidade | "é fácil achar e pedir" | média-baixa | profundidade (paralaxe + ponteiro) |
| 7 | **Fechamento** | "Vamos apertar seu próximo projeto?" + a cinta volta e trava no botão de WhatsApp | decisão | "vou pedir orçamento" | alta | crescer + retorno da assinatura |

**Curva de energia:** alta → calma → **PICO** → calma (clara) → média → média-baixa → alta.
Nenhuma cena repete a família de efeito da vizinha.

**O pico:** a linha de produtos, a cena fixa mais longa (7 telas). Esteira com parada (como uma esteira
indexada de fábrica): cada peça para no portal, é "medida" (cotas de desenho técnico com a faixa real de
diâmetro) e segue.

**Movimento-assinatura:** O aperto (abertura) + retorno no fechamento, em volta do botão de orçamento.

## Identidade

- Paleta: noite asfalto `#090C0F`, chassi `#10151A`, tinta `#E9EDF0`, tinta suave `#8E9AA6`,
  aço claro `#D6DBDF` (ato claro) e **um acento só: azul Halten `#1C9BD7`** (medidor travado,
  leituras do pico, botão principal).
- Tipografia: **Archivo** variável (eixo de largura 62–125, peso 100–900) para títulos e texto, e
  **JetBrains Mono** para rótulos, códigos e medidas, como numa folha técnica.
- Escala: 13 / 16 / 18 / 24 / 36 / 56 / 88 / gigante. Espaçamento: 8 / 16 / 24 / 40 / 64 / 104 / 168.

## Páginas (oficiais desde 14/10/2026)

| Página | O que tem |
|---|---|
| `/` | a home "Aperta de verdade" + outdoor dos banners (preso na tela: a rolagem troca as artes) |
| `/produtos` | busca por nome, medida (Ø) ou código Halten/original; selo de lançamento |
| `/produtos/[slug]` | portal de inspeção, cota da medida, ficha técnica tirada da descrição, tabela com filtro e orçamento, anterior/próximo |
| `/contato` | formulário (abre o WhatsApp) + canais + placa + mapa (a antiga `/localizacao` redireciona para cá) |
| `/quem-somos` | números do banco, aplicações, placa, missão/visão/valores |
| `/representantes` | mapa clicável, ficha rebitada, lista por estado, link `#uf` |
| `/catalogo` | leva à revista ativa do admin de Links (`/catalogo/<id>?origem=site`: fundo da v2, o X volta ao site) |

- A Halten atende os 26 estados + DF; os representantes cobrem só alguns estados. Representante é contado
  por empresa (mesmo WhatsApp = um só), não por linha do cadastro (`contarRepresentantes`).
- Endereços dos links num lugar só: `ROTAS` em `_partes/contato.ts`.
- Os `/xxx-v2` da prévia redirecionam para as oficiais (`next.config.ts`).
- `/links` ficou como era.

**Para voltar atrás:** as páginas antigas estão em `app/(v1)/` (`/v1`, `/produtos-v1`, `/contato-v1`,
`/localizacao-v1`, `/quem-somos-v1`, `/representantes-v1`), fora do Google. Ou `git revert` do commit da troca.

## Trava anti-repetição (construcoes.md)

Difere de TODOS os builds anteriores nos 5 itens: abertura (cinta T-bolt + compressão da fonte),
pico (esteira indexada com portal de medição), assinatura (o aperto), paleta (asfalto + azul Halten)
e estrutura (7 cenas, com um ato claro no meio).
