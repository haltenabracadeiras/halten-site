# DESIGN.md — Halten Abraçadeiras
> Arquivo de identidade visual. Leia antes de criar qualquer componente.
> Todo token, cor, fonte e regra aqui definidos são lei no projeto.

---

## 01. Paleta de Cores

```css
:root {
  /* Marca */
  --blue:           #1c9bd7;   /* azul principal — CTAs, destaques, ênfases */
  --blue-deep:      #1480b8;   /* hover, bordas ativas */
  --blue-light:     #e8f5fc;   /* fundo de badges, pills, tags */
  --blue-glow:      rgba(28, 155, 215, 0.15);

  /* Fundos */
  --bg:             #f7f8fa;   /* fundo geral das páginas */
  --bg-white:       #ffffff;   /* cards, header, modais */
  --bg-section:     #f0f4f8;   /* seções alternadas */

  /* Textos */
  --ink:            #0f1923;   /* títulos, texto forte */
  --ink-mid:        #3d5166;   /* subtítulos, corpo */
  --ink-dim:        #7a92a8;   /* labels, metadados */
  --ink-mute:       #b0c0cc;   /* placeholders, divisores de texto */

  /* Linhas */
  --line:           #e2e8ed;
  --line-soft:      #eef1f4;

  /* Status / Ação */
  --green:          #22c55e;   /* WhatsApp, sucesso */
  --red:            #ef4444;   /* erros, alertas */
}
```

---

## 02. Tipografia

### Famílias (mesmas do guia original)
- **Display / Títulos:** `Syne` — pesos 600, 700, 800
- **Corpo / Mono / Labels:** `JetBrains Mono` — pesos 300, 400, 500
- **Serif / Acento emocional:** `Instrument Serif` — itálico, peso 400

### Importar via next/font ou link Google Fonts:
```
Syne: 500,600,700,800
JetBrains Mono: 300,400,500
Instrument Serif: 400 italic
```

### Escala
| Token        | Tamanho clamp         | Uso                              |
|--------------|-----------------------|----------------------------------|
| `hero`       | clamp(56px,10vw,130px)| Título principal do herói        |
| `h1`         | clamp(36px,5vw,64px)  | Títulos de seção                 |
| `h2`         | 28–36px               | Subtítulos                       |
| `h3`         | 20–24px               | Títulos de card                  |
| `body-lg`    | 17px                  | Parágrafos de introdução         |
| `body`       | 14–15px               | Corpo geral                      |
| `label`      | 11–12px               | Metadados, tags, status          |

### Regras
- Títulos hero: `letter-spacing: -0.04em`, `line-height: 0.9`
- Títulos de seção: `letter-spacing: -0.03em`, `line-height: 1.05`
- Ênfase emocional: palavra-chave em `Instrument Serif italic`, cor `--blue`
- Corpo: `font-family: JetBrains Mono`, `line-height: 1.65`, `font-weight: 300`
- Labels/metadados: `letter-spacing: 0.12em`, `text-transform: uppercase`

---

## 03. Espaçamento

- **Base:** `8px` — todos os valores são múltiplos de 8
- **Escala:** 4 / 8 / 16 / 24 / 32 / 40 / 48 / 64 / 80 / 100 / 120
- **Padding de seção:** `100px 0` (desktop), `64px 0` (tablet), `48px 0` (mobile)
- **Container:** `max-width: 1280px`, `padding: 0 40px` (desktop), `0 20px` (mobile)
- **Gap de grid de cards:** `24px`

---

## 04. Navbar (Flutuante — Elemento Chave)

```
Comportamento:
- Inicial (topo da página): posição absoluta, fundo transparente, logo e links brancos
  → só funciona se o hero tiver fundo escuro/colorido atrás
- Após scroll de 80px: transiciona para fundo branco com sombra suave,
  logo colorida, links escuros — fixed no topo
- Transição: all 0.4s cubic-bezier(0.16, 1, 0.3, 1)

Estrutura:
[Logo] ←— espaço —→ [Produtos | Quem somos | Localização | Contato] [Busca] [Atendimento CTA]

Estilo flutuante (após scroll):
- background: rgba(255,255,255,0.92)
- backdrop-filter: blur(16px)
- border-bottom: 1px solid var(--line)
- box-shadow: 0 4px 32px rgba(15,25,35,0.08)
- border-radius: 0 (no topo) OU pill flutuante se preferir versão destacada

Variante pill (mais moderna):
- margin: 16px auto
- max-width: 960px
- border-radius: 999px
- padding: 12px 28px
- border: 1px solid var(--line)
```

---

## 05. Hero

```
Layout: fundo com gradiente azul escuro → azul médio (diagonal)
Sobreposto: ruído SVG opacity 0.04, grid de linhas 80×80 opacity 0.08
Texto: branco no topo do hero (contrasta com fundo azul)

Elementos:
- Pill de anúncio: fundo rgba(255,255,255,0.15), texto branco, blur
- Título: Syne 800, branco, letra-espaçamento -0.04em
- Ênfase: Instrument Serif italic, cor #7dd3f8 (azul claro)
- Subtexto: JetBrains Mono 300, branco 80%
- CTAs: botão branco sólido (texto azul) + botão outline branco
- Scroll indicator: seta animada bounce

Gradiente de fundo:
background: linear-gradient(135deg, #0f2d4a 0%, #1c9bd7 60%, #38b8f0 100%)
```

---

## 06. Componentes

### Cards de Produto
```
background: var(--bg-white)
border: 1px solid var(--line)
border-radius: 12px
padding: 24px
overflow: hidden
transition: all 0.3s ease

Hover:
- transform: translateY(-4px)
- box-shadow: 0 16px 48px rgba(28,155,215,0.12)
- border-color: var(--blue)

Imagem: object-fit contain, fundo var(--bg-section), padding 16px
Nome: Syne 600, var(--ink), font-size 15px
Botão: outline azul → fill azul no hover
```

### Seção Headers
```
Pill label: background var(--blue-light), color var(--blue),
            font JetBrains Mono, font-size 11px, letter-spacing 0.15em,
            border-radius 999px, padding 6px 16px
Título: Syne 700, var(--ink), ênfase em Instrument Serif italic azul
Subtexto: JetBrains Mono 300, var(--ink-mid)
```

### Número de Seção (estilo guia original)
```
font-family: JetBrains Mono
font-size: 11px
color: var(--blue)
letter-spacing: 0.15em
margin-bottom: 16px
position: relative

::before {
  content: ''
  width: 32px, height: 1px
  background: var(--blue)
  position: absolute, left: 0, top: -8px
}
```

### Botões
```
Primário:
  background: var(--blue)
  color: white
  font: Syne 600, 14px
  padding: 14px 32px
  border-radius: 8px
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s
  hover: background var(--blue-deep), transform translateY(-1px),
         box-shadow 0 8px 24px rgba(28,155,215,0.3)

Secundário / Outline:
  background: transparent
  border: 1.5px solid var(--blue)
  color: var(--blue)
  hover: background var(--blue-light)

WhatsApp:
  background: #22c55e
  hover: #16a34a

Hero (sobre fundo azul):
  background: white, color: var(--blue)
  hover: box-shadow 0 8px 32px rgba(0,0,0,0.15)
```

### Caixas de Destaque / Warning
```
background: var(--blue-light)
border-left: 3px solid var(--blue)
border-radius: 0 8px 8px 0
padding: 20px 24px
color: var(--ink-mid)
```

### Badge / Tag de produto
```
background: var(--blue-light)
color: var(--blue)
font: JetBrains Mono 500, 10px
letter-spacing: 0.1em
padding: 4px 10px
border-radius: 999px
```

---

## 07. Animações

```
Lenis Smooth Scroll: sempre ativo (lerp: 0.08, duration: 1.2)

Scroll reveal (usando Intersection Observer):
  - Entrada: opacity 0 + translateY(24px) → opacity 1 + translateY(0)
  - Duration: 0.6s
  - Easing: cubic-bezier(0.16, 1, 0.3, 1)
  - Delay escalonado em listas: 0.1s por item

Navbar:
  - Transição de transparente para sólido: 0.4s cubic-bezier(0.16,1,0.3,1)

Cards hover:
  - translateY(-4px) + box-shadow: 0.3s ease

Botões hover:
  - transform + box-shadow: 0.2s ease

Hero:
  - Título: fade + slideUp ao carregar (0.8s, delay 0.1s)
  - Subtítulo: fade + slideUp (delay 0.3s)
  - CTAs: fade + slideUp (delay 0.5s)
  - Pill de anúncio: fade (delay 0s)

Floating elements (opcional no hero):
  - Elementos decorativos com keyframe float (translateY ±12px, 4s ease-in-out infinite)
```

---

## 08. Estrutura de Páginas

### Site público
```
/ (Home)
  ├── Navbar flutuante
  ├── Hero (fundo azul, texto branco)
  ├── Barra de stats (4 números)
  ├── Produtos em destaque (3 cards + "Ver todos")
  ├── Quem Somos (missão, visão, valores)
  ├── Localização (mapa compacto + dados ao lado)
  ├── Fale Conosco (formulário)
  └── Rodapé

/produtos
  └── Grid com filtro por categoria

/produtos/[slug]
  └── Galeria + descrição + aviso CNPJ + Orçar WhatsApp

/quem-somos
/localizacao
/contato
```

### Admin (`/admin`)
```
/admin/login
/admin/dashboard
/admin/banners        → listar / criar / editar / reordenar / excluir
/admin/produtos       → listar / criar / editar / excluir
/admin/configuracoes  → Google Analytics ID, Meta Pixel ID, WhatsApp número, textos gerais
```

---

## 09. Dados Reais da Empresa

```
Razão Social:  Halten Abraçadeiras
CNPJ:          43.453.407/0001-87
Endereço:      R. Alba Vieira, 653 — Cataratas, Cascavel/PR — 85818-630
Telefone 1:    (45) 3197-2130
Telefone 2:    (45) 99144-7046
Email:         contato@halten.ind.br
WhatsApp:      (45) 99144-7046
Instagram:     @haltenabracadeiras (confirmar)
Coords mapa:   -24.9566, -53.4595 (aproximado — conferir)
```

---

## 10. Conteúdo — Quem Somos

```
MISSÃO:
Desenvolver, importar e distribuir produtos inovadores, com qualidade e
segurança, visando sempre a satisfação dos nossos clientes.

VISÃO:
Ser reconhecido como o principal fornecedor de abraçadeiras dos nossos
clientes, por excelência em nossos processos e qualidade dos produtos.

VALORES:
1. Transparência e ética
2. Comprometimento e respeito com a equipe e clientes
3. Qualidade e inovação
4. Crescer e evoluir juntos
```

---

## 11. Schema do Banco de Dados (Supabase)

```sql
-- Banners
create table banners (
  id uuid primary key default gen_random_uuid(),
  titulo text,
  subtitulo text,
  imagem_url text not null,
  link text,
  ordem int default 0,
  ativo boolean default true,
  created_at timestamptz default now()
);

-- Categorias de produto
create table categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique
);

-- Produtos
create table produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  descricao text,
  categoria_id uuid references categorias(id),
  destaque boolean default false,
  ativo boolean default true,
  ordem int default 0,
  created_at timestamptz default now()
);

-- Imagens de produto (múltiplas)
create table produto_imagens (
  id uuid primary key default gen_random_uuid(),
  produto_id uuid references produtos(id) on delete cascade,
  url text not null,
  ordem int default 0
);

-- Configurações gerais
create table configuracoes (
  chave text primary key,
  valor text
);
-- Chaves: 'google_analytics_id', 'meta_pixel_id',
--         'whatsapp_numero', 'aviso_cnpj_ativo'
```
