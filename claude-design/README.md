# Handoff: Halten Abraçadeiras — Nova Home

## Overview
Redesign completo da home da **Halten Abraçadeiras** (indústria de abraçadeiras industriais, Cascavel/PR, fundada em 1981). Objetivo: substituir a home antiga por uma versão mais moderna, técnica e impactante, que comunique a essência industrial da marca (precisão, engenharia, durabilidade) e organize de forma mais clara: hero/carrossel, produtos, capacidades de engenharia, história da empresa, app oficial, catálogo digital e contato.

## About the Design Files
Os arquivos neste pacote são **referências de design feitas em HTML/CSS/JS estático** — protótipos demonstrando aparência e comportamento pretendidos, **não código de produção pronto para colar**. A tarefa é **recriar este design no ambiente do codebase de destino** (Next.js, React, Vue, etc.) usando os padrões e bibliotecas já estabelecidos no projeto (sistema de componentes, sistema de design tokens, biblioteca de ícones, etc.). Se o projeto ainda não tiver framework definido, **Next.js + Tailwind CSS** é a recomendação para este caso (a home original aparenta ser Next.js — `localhost:3000`).

## Fidelity
**Hi-fi (high-fidelity).** Cores, tipografia, espaçamento, hierarquia e estados de hover estão finalizados. O desenvolvedor deve recriar pixel-perfect, respeitando a paleta e fontes da marca. As silhuetas/ilustrações dos produtos no HTML são **placeholders em SVG** — devem ser substituídas pelas fotos reais do cliente.

---

## Brand System

### Colors
```
--ink        #0f1923   /* dark navy, fundo principal das seções escuras */
--ink-2      #0a1219   /* navy ainda mais escuro, utility bar e footer */
--ink-3      #172430   /* navy de apoio */
--blue       #1c9bd7   /* azul Halten — acento principal */
--blue-2     #56b9e6   /* azul claro derivado, hover/destaques */
--paper      #f4f5f7   /* off-white das seções claras */
--paper-2    #eaecef   /* off-white sutil para gradientes de placeholder */
--white      #ffffff

/* Linhas / divisores */
--line                 rgba(255,255,255,0.08)   /* sobre dark */
--line-strong          rgba(255,255,255,0.18)
--line-dark            rgba(15,25,35,0.10)      /* sobre light */
--line-dark-strong     rgba(15,25,35,0.20)

/* Texto secundário */
--muted        rgba(255,255,255,0.55)
--muted-dark   rgba(15,25,35,0.55)

/* Status */
verde-online   #3fcf8e  (com halo rgba(63,207,142,0.18))
```

### Typography
- **Display / Títulos** — `Syne` (Google Fonts), pesos 500, 600, 700, 800
  - Usar `letter-spacing: -0.02em` em geral; `-0.03em` ou `-0.035em` em títulos muito grandes
  - Itálico (`font-style: italic`) é usado como acento em palavras-chave dentro do título, geralmente colorido em `--blue`
- **Técnico / Body / UI** — `JetBrains Mono` (Google Fonts), pesos 300, 400, 500, 600
  - Usar para: códigos de produto, dimensões, labels com colchetes (ex. `[01 — Catálogo]`), legendas, microtexto
  - `letter-spacing: 0.18em` + `text-transform: uppercase` para eyebrows e labels

```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
```

### Typography Scale (usada no design)
| Token | Family | Size | Weight | Tracking |
|---|---|---|---|---|
| display-xxl | Syne | 88–90px | 700 | -0.035em |
| display-xl  | Syne | 64–84px | 700 | -0.03em |
| display-lg  | Syne | 54px | 700 | -0.03em |
| display-md  | Syne | 30–46px | 700 | -0.02em |
| heading     | Syne | 22–28px | 700 | -0.02em |
| title       | Syne | 18–22px | 600 | -0.02em |
| body        | JetBrains Mono | 13–15px | 400 | 0 |
| micro       | JetBrains Mono | 10–11px | 400 | 0.06–0.18em |
| eyebrow     | JetBrains Mono | 11px | 400 | 0.18em UPPERCASE |

### Spacing scale
Use múltiplos de 4 e 8: `4, 8, 12, 14, 18, 22, 24, 32, 40, 48, 56, 64, 80, 100, 120, 140` (px). O grid principal é `max-width: 1440px` com `padding-inline: 56px`.

### Border radius
`6, 8, 9, 10, 12, 14, 16, 18` (px) — cartões grandes usam 14–18, botões e chips usam 8–10, pills usam 999.

### Shadows
- Sombra de elevação suave em cards no hover: `0 30px 50px -30px rgba(15,25,35,0.25)`
- Glow azul nos CTAs: `0 12px 28px -12px rgba(28,155,215,0.55)`
- Sombra de phone mockup: `0 60px 100px -40px rgba(0,0,0,0.7)`
- Sombra do "livro" do catálogo: `0 50px 80px -30px rgba(15,25,35,0.4)`

---

## Layout (1440 max-width, container padding 56px)

A página é estruturada em **bandas verticais** de fundos alternados (escuro ↔ claro) para criar ritmo:

```
util bar         (dark #0a1219, 34px)
header (sticky)  (dark #0f1923 com blur, 78px)
hero carousel    (1920×650 fixo — REQUISITO DO CLIENTE)
marquee          (blue #1c9bd7, 62px)
stats            (dark, ~120px vertical)
products         (paper, ~120px vertical)
precision        (dark, ~140px vertical)
about            (paper, ~140px vertical)
app section      (dark, ~140px vertical)
catalog          (paper, ~140px vertical)
cta band         (dark, ~120px vertical)
big "HALTEN"     (dark, marca d'água)
footer           (dark #0a1219)
```

---

## Screens / Views

> Há apenas **uma view** (home single-page com scroll). Detalhamento por seção abaixo.

### 1. Utility bar (topo)
- Altura: 34px. Fundo `--ink-2`. Border-bottom `--line`.
- Esquerda: indicador verde com halo + texto "Operação online · Seg–Sex 08:00–17:30" e endereço.
- Direita: trio de links (idioma, e-mail, telefone) separados por `gap: 18px`.
- Tipografia: JetBrains Mono 11px, `letter-spacing: 0.04em`, cor `--muted`.

### 2. Header (sticky)
- Altura: 78px. `position: sticky; top: 0`. Fundo `rgba(15,25,35,0.85)` com `backdrop-filter: blur(14px)`.
- **Logo** (esquerda): mark 38×38 azul com radius 9px contendo SVG monocromático + wordmark "Halten" em Syne 22px/700 e sublinha "Abraçadeiras · Est. 1981" em JetBrains Mono 9px.
- **Nav primary** (centro): 5 links (`Início`, `Produtos`, `Quem somos`, `Localização`, `Contato`) em Syne 13px. Link ativo ganha barra azul de 2px abaixo.
- **Right group**: botão de busca (ícone 42×42 com border), botão de catálogo, CTA "Atendimento" em pill azul com ícone de telefone.

### 3. Hero Carousel — **1920 × 650 (REQUISITO MANTIDO)**
Carrossel auto-rotativo (6500ms), 2 slides, com setas, dots e contador "01/02" no canto.

- **Corner labels** em mono pequena: `[01] Banner promocional — 1920 × 650` (TL), `Atualizado · Mai 2026` (TR).
- **Slide 1 — App Launch**
  - Fundo: `radial-gradient(120% 100% at 20% 30%, #1c9bd7, #0f5d8a 55%, #0a3a59)`
  - Esquerda: badge pill "Novidade · App Oficial" + título Syne 88px "O App da Halten **chegou.**" (palavra "chegou." em itálico azul-claro) + lede + dois botões "store" (App Store, Google Play).
  - Direita: phone mockup 240×480 dentro de um disco com grade radial (sugerindo radar/precisão), com tela mostrando logo card e lista de itens (Pesquisar, Lançamentos, Carrinho, Mensagens).
- **Slide 2 — Linha industrial**
  - Fundo: `linear-gradient(120deg, #0f1923, #14283a 60%, #1c9bd7 130%)`
  - Esquerda: badge "Linha 2026 · Inox AISI 304/316" + título "Fixação **industrial** em alta resistência" + 2 CTAs.
  - Direita: composição de 5 anéis concêntricos (representação técnica de uma abraçadeira) com 4 marcadores mono ao redor (`⌀ 76 mm`, `torque · 12 N·m`, `aço inox W4`, `⌀ 38 mm`) e label central "SAE J1508 / Norma aplicada".
- **Controles**: setas circulares 54px nas laterais, dots inferiores (dot ativo é mais largo), contador no canto inferior direito.

### 4. Marquee
- Fundo `--blue` (#1c9bd7), texto `--ink-2`.
- Loop de animação CSS 38s scroll horizontal.
- Texto Syne 700 20px: `FIXAÇÃO INDUSTRIAL · INOX AISI 304/316 · RESISTÊNCIA & PRECISÃO · DESDE 1981 · 45 ANOS DE ENGENHARIA · NORMA SAE J1508`.

### 5. Stats
- Layout: grid 2 colunas (`1.1fr 2fr`, alinhados em `align-items: end`).
- Esquerda: eyebrow `[ 00.1 — Sobre a operação ]` + título Syne 54px "Engenharia que **aperta forte** há quatro décadas" + parágrafo.
- Direita: 4 células divididas por bordas verticais. Cada célula tem:
  - eyebrow azul com bolinha + label
  - número gigante Syne 72px (ex. `12k+`, `98%`, `24h`, `45anos`) com sufixo em tamanho menor
  - descrição mono pequena (`unidades comercializadas em 2025`, etc.)

### 6. Products
- Section-head em grid 2 col: título "Nossas soluções **para a sua linha**" + parágrafo + chips de filtro (`Todos`, `Sem-fim`, `Mola`, `Mercedes`, `Intercooler`, `Acessórios`).
- Grid de 4 cartões. Cada cartão:
  - Visual quadrado com grade técnica de fundo (`repeating-linear-gradient` 32px), código do produto no canto superior esquerdo (`HLT-09 · MRC`), tag de material no superior direito (preta ou azul), silhueta SVG da abraçadeira no centro.
  - Body: título Syne 20px, specs em duas colunas mono (`⌀ 25–82 mm` / `Faixa de aperto`, `12 mm` / `Largura banda`), footer com categoria azul e botão circular com seta diagonal.
  - Hover: `translateY(-4px)` + sombra, círculo da seta vira azul.
- Footer: link "Ver todos os 240+ modelos" com seta + meta `CAT. 2026 · 240 SKUs · ATUALIZADO 12/05/2026`.

### 7. Precision / Engenharia
- Fundo `--ink` com grid técnico sutil (`repeating-linear-gradient` 80px, opacidade 0.025).
- Head 2-col com título "Cada peça **pensada** antes de ser apertada" + parágrafo.
- Grid 3×2 de 6 capacidades, dividido por bordas. Cada célula tem:
  - número `01 / Material` (mono, azul)
  - título Syne 28px
  - parágrafo descritivo
  - ícone (SVG 20px) num quadrado 44px com border, no canto superior direito
- Conteúdo: Material (Inox 304/316L), Processo (estampagem + TIG), Ensaio (torque/vibração/fadiga), Normativa (SAE/DIN), Logística (BR todo), Engenharia sob medida (OEM).

### 8. About
- Grid 2 col (`1fr 1.2fr`).
- Esquerda: eyebrow + título Syne 72px "A história **da Halten**" + 2 parágrafos + assinatura com borda superior.
- Direita: lista vertical de 4 "pillars" separados por linhas horizontais. Cada pillar é grid `120px 1fr auto`: label (`Missão`/`Visão`/`Valores`/`Origem`) + bloco com `<h4>` Syne 30px e descrição + numeração `01/02/03/04`. Hover: `padding-left: 8px`.

### 9. App Section
- Fundo dark com glow radial azul no canto superior direito.
- Esquerda: badge pulsante "Aplicativo oficial" + título Syne 84px "Halten no **seu celular.**" + lede + grid 2×2 de features (Busca, Tabela técnica, Pedido rascunho, Atualizações ao vivo) + 2 store buttons.
- Direita: phone mockup grande 280×560 com tela em gradiente azul mostrando UI do app (header, cell hero, search, lista de produtos). Sobreposto na parte inferior direita: QR code branco 200px com label "Aponte sua câmera / baixar agora".

### 10. Catalog
- Grid 2 col (`1fr 1.1fr`).
- Esquerda: livro 3D em CSS — `340×460`, gradiente azul, lombada escura à esquerda, listras verticais sutis à direita, com logo, ano, título "Abraçadeiras & Acessórios" em Syne 46px itálico, URL e SKU count.
- Direita: eyebrow + título Syne 64px "Todo o catálogo **na palma da mão**" + parágrafo + lista de 3 features com checkmark azul + dois CTAs (azul "Acessar catálogo digital" e ghost "Baixar PDF").

### 11. CTA Band / Contato
- Fundo dark com glow azul radial no topo.
- Grid 2 col (`1.4fr 1fr`).
- Esquerda: eyebrow + título Syne 90px "Vamos **apertar** seu próximo projeto?" + parágrafo + 2 CTAs (azul "Solicitar orçamento técnico" e ghost "Falar no WhatsApp").
- Direita: cartão com border + label "Canais diretos" + título + 4 itens (e-mail, WhatsApp, telefone, fábrica) cada um com ícone em quadrado azul claro, label mono pequena e valor Syne 16px.

### 12. Big Word ("HALTEN")
Texto Syne 240px/800 em `rgba(255,255,255,0.03)` centralizado, fundo `--ink-2`, padding-top 80px. Marca d'água tipográfica antes do footer.

### 13. Footer
- Grid 4-col (`1.4fr 1fr 1fr 1fr`).
- Col 1 (brand): logo + descrição da empresa + pill com CNPJ.
- Col 2 (Navegação): h5 azul + lista de 5 links em Syne 15px.
- Col 3 (Contato): h5 + labels mono pequenas (`E-mail`, `WhatsApp`, `Telefone`) com valor.
- Col 4 (Localização): endereço completo + horário de atendimento.
- Legal bar: copyright à esquerda + pill verde "Fabricado em Cascavel/PR" à direita.

### 14. Side rail (fixed)
Texto vertical (writing-mode vertical-rl) à esquerda em 24px, mono 10px maiúscula tracked: "SCROLL · HALTEN · 2026". Decorativo.

---

## Interactions & Behavior

### Carousel
- Auto-rotate a cada **6500ms** entre 2 slides.
- Transition: `transform .7s cubic-bezier(.7,0,.2,1)` no track (translateX).
- Clique em seta ou dot reseta o timer.
- Setas circulares posicionadas a `left:32px`/`right:32px`, top 50% translate Y.
- Dots: ativo é 48px largo, inativos 32px, altura 4px.
- O contador `01/02` no canto inferior direito atualiza junto.

### Hovers
- **CTA pill azul**: muda para `#1689bf`.
- **Nav links**: ganham fundo `rgba(255,255,255,0.05)` e cor branca.
- **Icon buttons**: idem.
- **Product cards**: `translateY(-4px)` + box-shadow azulada, seta do footer fica azul preenchida.
- **Pillars (Missão/Visão/Valores)**: `padding-left: 8px`.
- **Store buttons**: sem hover específico (são links já tratados).

### Animations
- **Marquee**: keyframes `scroll-x` from `translateX(0)` to `translateX(-50%)`, 38s linear infinite. O conteúdo é duplicado para loop sem corte.
- **Carousel transition**: como acima.
- Verde online: `box-shadow: 0 0 0 3px rgba(63,207,142,0.18)` (halo estático).

### Responsive
> O design foi feito **para desktop 1440px**. Para implementação real, fazer o tratamento responsivo:
> - **≥ 1024px**: layout como está
> - **768–1023px**: stacking de colunas (about, app, catalog, ctaband viram single-col), nav vira menu hamburger, hero diminui altura para ~520px
> - **< 768px (mobile)**: títulos diminuem (Syne 88px → 44px), stats vira 2×2, produtos 1-col, padding lateral reduz a 24px
> - O **banner 1920×650** continua proporcional (object-fit cover ou letterboxing dentro de container que mantém aspect ratio em telas menores). Confirme com o cliente como lidar com o requisito em mobile.

---

## State Management

A home é largely **estática**. Estados necessários:
- **Carousel index** (`0..n-1`) com timer auto-rotate cancelável.
- **Filter chip active** (string) — atualmente decorativo, mas deve filtrar a grid de produtos quando integrada ao backend.
- **Header sticky background** — já tratado via CSS sticky + backdrop-filter; opcional adicionar uma classe `.scrolled` que muda opacidade do fundo após `scrollY > 20`.

Para integração:
- Produtos virão de uma API (CMS ou catálogo interno). Cada produto: `{ id, code, name, category, material, sizeRange, bandWidth, image, isPremium, isHeavy }`.
- Slides do carrossel também devem ser CMS-editáveis (cliente exige atualizar banners).

---

## Assets

### Atualmente no protótipo (placeholders)
- Logo Halten: mark SVG (círculo + barras) + wordmark texto. **Substituir pelo logo oficial em SVG.**
- Silhuetas de produtos: SVGs simples desenhados inline. **Substituir pelas fotos reais dos produtos** (4 cards na grid de produtos + qualquer outro produto adicionado pelo CMS).
- QR Code: SVG decorativo. **Substituir pelo QR Code real do app.**
- Phone mockup das duas seções (hero slide 1, app section): desenhados em HTML/CSS. **Pode-se manter** como mockup ou substituir por screenshot real do app.
- Livro do catálogo: desenhado em HTML/CSS. **Pode-se manter** ou substituir pela render real da capa do PDF.
- Ícones: SVGs inline derivados do Lucide/Feather. **Sugerido**: usar a biblioteca [lucide-react](https://lucide.dev/) (ou equivalente do framework) para padronizar.

### Fontes
- Google Fonts: `Syne` e `JetBrains Mono`. Carregar via `next/font/google` no Next.js para performance.

---

## Recommended tech stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **CSS**: Tailwind CSS, ou CSS Modules — qualquer um suporta o sistema de tokens proposto
- **Ícones**: lucide-react
- **Imagens**: next/image
- **Animações**: o que existe pode ser CSS puro (não precisa de Framer Motion); o carousel pode usar Embla Carousel ou um custom hook
- **CMS** (sugestão): Sanity ou Strapi para gerenciar banners do hero, produtos e textos

---

## Files in this handoff
- `Halten Home.html` — protótipo completo single-file (HTML + CSS + JS inline). Abra no navegador para ver a referência rodando.

---

## Notes para o desenvolvedor
1. **O banner 1920×650 é um requisito do cliente final** — não reduza a proporção; pode tornar o cliente capaz de fazer upload do JPG/PNG e renderizar inteiro como background com CSS `background-size: cover` ou `<img>` full-bleed. O CMS deve aceitar pelo menos N slides com fields: `image`, `title`, `subtitle`, `cta_label`, `cta_url`.
2. **A grade técnica de fundo** (`repeating-linear-gradient`) em várias seções é parte importante da identidade — não a remova ao reimplementar.
3. **A tipografia mista Syne + JetBrains Mono é a alma do design** — mantenha o uso disciplinado: Syne só para títulos/displays, Mono para tudo que é "técnico" (códigos, dimensões, eyebrows, microcopy).
4. **Cores acessíveis**: o azul `#1c9bd7` sobre `#0f1923` passa AA para texto grande; para texto pequeno em corpo, prefira `--muted` (`rgba(255,255,255,0.55)`) ou branco.
5. **Performance**: o protótipo usa muitas linhas decorativas em CSS. Em produção, considere usar `will-change` apenas no track do carousel.
