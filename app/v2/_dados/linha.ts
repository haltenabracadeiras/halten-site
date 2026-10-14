import { getSupabaseAdmin } from "../../../lib/supabase";

export type Coluna = { key: string; label: string; highlight?: boolean };
export type Linha = Record<string, unknown>;

export type Peca = {
  slug: string;
  nome: string; // nome completo, como no cadastro
  curto: string; // sem o prefixo "Abraçadeira"
  imagem: string | null;
  zoom: number; // image_zoom do admin (100 = normal)
  faixa: string | null; // ex.: "Ø 32–220 mm" ou "até 300 mm"
  codigos: number; // códigos reais na tabela técnica
  lancamento: boolean; // algum banner ativo aponta para este produto
  termos: Termo[]; // códigos para a busca da lista de produtos
};

/** Um código pesquisável: o código Halten ou um código original (de montadora ou concorrente). */
export type Termo = { codigo: string; tipo: "halten" | "original" };

/** Banner do admin, mostrado no outdoor (a arte já traz o texto). */
export type BannerV2 = {
  id: string;
  imagem: string;
  link: string | null; // caminho interno ("/produtos/x") ou URL externa
  externo: boolean;
  alt: string;
};

export type DadosV2 = {
  pecas: Peca[];
  totalCodigos: number;
  medidor: { codigo: string; produto: string; min: number; max: number };
  representantes: number;
  estados: string[];
  banners: BannerV2[];
};

// Ordem da esteira: linha pesada primeiro, nylon no fim. Produto novo entra no final.
export const ORDEM = [
  "tucho-intercooler",
  "tuch0-mola",
  "tucho-canaleta",
  "modelo-mercedes",
  "wastegate",
  "InoxSuper-InoxCarbonoSuper",
  "carbonosuper-cs",
  "homocinetica-hah",
  "combustivel-ac",
  "lefix-lf",
  "metalborracha-b",
  "zipinox",
  "mini-hmb",
  "mini-m",
  "mini-inox",
  "nylon-n",
  "nylon-botao",
  "nylon-t",
];

// Fotos enviadas sem transparência: recorte feito para a prévia (o ideal é reenviar no admin com fundo transparente).
const RECORTES: Record<string, string> = {
  "1785782521447-zw0iksgwnw.webp": "/v2/pecas/homocinetica-hah.webp",
};

export function imagemDa(url: string | null) {
  if (!url) return null;
  const arquivo = url.split("/").pop() ?? "";
  return RECORTES[arquivo] ?? url;
}

function numero(v: unknown): number | null {
  const n = parseFloat(String(v ?? "").trim().replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function br(n: number) {
  return n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

export function nomeCurto(nome: string) {
  return nome
    .replace(/^\s*abra[çc]adei(ra|ar)\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** O admin grava o link completo do site; vira caminho interno para funcionar também no localhost. */
export function linkDoBanner(bruto: string | null): { link: string | null; externo: boolean } {
  const s = (bruto ?? "").trim();
  if (!s) return { link: null, externo: false };
  if (s.startsWith("/")) return { link: s, externo: false };
  try {
    const u = new URL(s);
    if (u.hostname.endsWith("haltenabracadeiras.ind.br")) return { link: u.pathname + u.search + u.hash, externo: false };
    return { link: u.href, externo: true };
  } catch {
    return { link: null, externo: false };
  }
}

export function slugDoLink(link: string | null) {
  return link?.match(/^\/produtos\/([^/?#]+)/)?.[1] ?? null;
}

/**
 * Representantes contados por empresa, não por linha do cadastro: quem atende vários estados
 * (ex.: a mesma empresa em AL, PE e RN) tem uma linha por estado, mas é um representante só.
 */
export function contarRepresentantes(reps: { name?: unknown; whatsapp?: unknown }[]) {
  return new Set(
    reps.map((r) => String(r.whatsapp ?? "").replace(/\D/g, "") || String(r.name ?? "").trim().toUpperCase()),
  ).size;
}

export function linhasReais(rows: Linha[] | null | undefined) {
  return (rows ?? []).filter((r) => !("__config__" in r));
}

export function contarCodigos(colunas: Coluna[], rows: Linha[]) {
  const chaves = colunas.filter((c) => c.highlight).map((c) => c.key);
  const codigos = new Set<string>();
  for (const r of rows) {
    for (const k of chaves) {
      const v = String(r[k] ?? "").trim();
      if (v) codigos.add(v);
    }
  }
  return codigos.size;
}

/** Células de "códigos originais" vêm em lista ("1371085, 1392944 (Scania) / CT300 (Norma)"). */
function separarOriginais(texto: string) {
  return texto
    .split(/[,;/]|(?<=\))\s+/) // "1439822 (Scania) 20592787(Volvo)" são dois códigos
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

export function termosDaPeca(
  colunas: Coluna[],
  rows: Linha[],
  conversoes: { codigo_halten?: unknown; codigos_originais?: unknown }[],
): Termo[] {
  const termos: Termo[] = [];
  const visto = new Set<string>();
  const add = (codigo: string, tipo: Termo["tipo"]) => {
    const c = codigo.trim();
    if (c && !visto.has(c)) {
      visto.add(c);
      termos.push({ codigo: c, tipo });
    }
  };
  const halten = colunas.filter((c) => c.highlight).map((c) => c.key);
  const originais = colunas.filter((c) => /origina(l|is)/i.test(c.key + c.label)).map((c) => c.key);
  for (const r of rows) {
    for (const k of halten) add(String(r[k] ?? ""), "halten");
    for (const k of originais) separarOriginais(String(r[k] ?? "")).forEach((o) => add(o, "original"));
  }
  for (const c of conversoes) {
    add(String(c.codigo_halten ?? ""), "halten");
    separarOriginais(String(c.codigos_originais ?? "")).forEach((o) => add(o, "original"));
  }
  return termos;
}

export function calcularFaixa(colunas: Coluna[], rows: Linha[]): string | null {
  const achar = (teste: (l: string) => boolean) => colunas.find((c) => teste(c.label.toLowerCase()))?.key;
  const semPol = (l: string) => !l.includes("pol");
  const kMin = achar((l) => /di[aâ]m/.test(l) && /m[ií]n/.test(l) && semPol(l));
  const kMax = achar((l) => /di[aâ]m/.test(l) && /m[aá]x/.test(l) && semPol(l));
  const valores = (k?: string) =>
    k ? rows.map((r) => numero(r[k])).filter((n): n is number => n !== null && n > 0) : [];

  if (kMin && kMax) {
    const mins = valores(kMin);
    const maxs = valores(kMax);
    if (mins.length && maxs.length) return `Ø ${br(Math.min(...mins))}–${br(Math.max(...maxs))} mm`;
  }

  const kComp = achar((l) => l.includes("comprimento"));
  if (kComp) {
    const comps = valores(kComp);
    if (comps.length) {
      const a = Math.min(...comps);
      const b = Math.max(...comps);
      return a === b ? `${br(b)} mm de comprimento` : `${br(a)}–${br(b)} mm de comprimento`;
    }
  }

  const kMm = achar((l) => l.trim() === "mm");
  if (kMm) {
    const mms = valores(kMm);
    if (mms.length) return `Ø ${br(Math.min(...mms))}–${br(Math.max(...mms))} mm`;
  }
  return null;
}

export async function carregarDadosV2(): Promise<DadosV2> {
  const supabase = getSupabaseAdmin();

  const [{ data: produtos }, { data: tabelas }, { data: conversoesDb }, { data: reps }, { data: bannersDb }] = await Promise.all([
    supabase.from("products").select("id,name,slug,images,image_zoom").eq("active", true),
    supabase.from("product_tables").select("product_id, rows, product_table_templates(columns)"),
    supabase.from("product_conversions").select("product_id, rows"),
    supabase.from("representatives").select("state, name, whatsapp").eq("active", true),
    // mesma regra da home atual (ativos, pela posição); no empate, o mais novo primeiro
    supabase
      .from("banners")
      .select("id,title,cta_link,image_url")
      .eq("active", true)
      .order("position", { ascending: true })
      .order("created_at", { ascending: false }),
  ]);

  const banners = (bannersDb ?? [])
    .filter((b) => b.image_url)
    .map((b) => ({ id: b.id as string, imagem: b.image_url as string, titulo: (b.title ?? "").trim(), ...linkDoBanner(b.cta_link) }));
  const lancamentos = new Set(banners.map((b) => slugDoLink(b.link)).filter(Boolean));

  const pecas: Peca[] = [];
  let totalCodigos = 0;
  let medidor: DadosV2["medidor"] | null = null;

  for (const p of produtos ?? []) {
    const tabela = (tabelas ?? []).find((t) => t.product_id === p.id);
    const tmpl = tabela?.product_table_templates as unknown as { columns: Coluna[] } | null;
    const colunas = tmpl?.columns ?? [];
    const rows = linhasReais(tabela?.rows as Linha[] | null);
    const codigos = contarCodigos(colunas, rows);
    totalCodigos += codigos;

    // Medidor da abertura: um código real do Tucho Canaleta (TCH120132 → Ø 120–132 mm).
    if (p.slug === "tucho-canaleta") {
      const alvo = rows.find((r) => String(r.codigo_tch ?? "").trim() === "TCH120132") ?? rows[rows.length - 1];
      const min = numero(alvo?.diam_min_mm);
      const max = numero(alvo?.diam_max_mm);
      if (alvo && min && max) {
        medidor = { codigo: String(alvo.codigo_tch).trim(), produto: nomeCurto(p.name), min, max };
      }
    }

    pecas.push({
      slug: p.slug,
      nome: p.name.replace(/\s+/g, " ").trim(),
      curto: nomeCurto(p.name),
      imagem: imagemDa(Array.isArray(p.images) ? (p.images[0] ?? null) : null),
      zoom: p.image_zoom ?? 100,
      faixa: calcularFaixa(colunas, rows),
      codigos,
      lancamento: lancamentos.has(p.slug),
      termos: termosDaPeca(
        colunas,
        rows,
        ((conversoesDb ?? []).find((c) => c.product_id === p.id)?.rows ?? []) as Linha[],
      ),
    });
  }

  pecas.sort((a, b) => {
    const ia = ORDEM.indexOf(a.slug);
    const ib = ORDEM.indexOf(b.slug);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  const estados = Array.from(new Set((reps ?? []).map((r) => String(r.state).toUpperCase())));

  // a arte não tem texto no banco: o alt sai do título, ou do produto para onde o banner leva
  const nomePorSlug = new Map(pecas.map((p) => [p.slug, p.nome]));
  const bannersV2: BannerV2[] = banners.map(({ id, imagem, titulo, link, externo }) => {
    const produto = nomePorSlug.get(slugDoLink(link) ?? "");
    return {
      id,
      imagem,
      link,
      externo,
      alt: titulo || (produto ? `Lançamento Halten: ${produto}` : "Novidade Halten Abraçadeiras"),
    };
  });

  return {
    pecas,
    totalCodigos,
    medidor: medidor ?? { codigo: "TCH120132", produto: "Tucho Canaleta", min: 120, max: 132 },
    representantes: contarRepresentantes(reps ?? []),
    estados,
    banners: bannersV2,
  };
}
