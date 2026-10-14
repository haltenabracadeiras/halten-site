import { getSupabaseAdmin } from "../../../lib/supabase";
import {
  ORDEM,
  calcularFaixa,
  contarCodigos,
  imagemDa,
  linhasReais,
  linkDoBanner,
  nomeCurto,
  slugDoLink,
  type Coluna,
  type Linha,
} from "./linha";

export type Conversao = { codigo_halten: string; codigos_originais: string };

export type ProdutoV2 = {
  id: string;
  slug: string;
  nome: string;
  curto: string;
  imagens: string[];
  zoom: number;
  faixa: string | null;
  codigos: number;
  lancamento: boolean;
  qtdUm: boolean; // cart_qty_one: o carrinho entra com 1, não com a embalagem
  texto: string[]; // parágrafos da descrição, sem a ficha técnica
  fichaTitulo: string | null; // "Especificações Wastegate (WG)"
  ficha: [string, string][]; // ["Material", "Aço Inox 304"]
  tabela: { nome: string; colunas: Coluna[]; linhas: Record<string, string>[] } | null;
  conversoes: Conversao[];
  vizinhos: { anterior: Vizinho | null; proximo: Vizinho | null };
};

type Vizinho = { slug: string; curto: string };

/**
 * A descrição do admin traz a ficha técnica no fim ("Especificações (TCH):\nMaterial: Aço Inox 304").
 * Separa o texto corrido das linhas "chave: valor" para a ficha virar uma tabela de verdade.
 */
export function separarDescricao(bruto: string | null) {
  const linhas = (bruto ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000b-\u001f]/g, "\n") // há caractere de controle colado no texto do admin
    .split("\n")
    .map((l) => l.trim());
  const i = linhas.findIndex((l) => /^especifica[çc][õo]es/i.test(l));
  const corpo = i === -1 ? linhas : linhas.slice(0, i);
  const resto = i === -1 ? [] : linhas.slice(i + 1);

  const texto: string[] = [];
  let paragrafo: string[] = [];
  for (const l of corpo) {
    if (l) paragrafo.push(l);
    else if (paragrafo.length) {
      texto.push(paragrafo.join(" "));
      paragrafo = [];
    }
  }
  if (paragrafo.length) texto.push(paragrafo.join(" "));

  const ficha: [string, string][] = [];
  for (const l of resto) {
    const m = l.match(/^([^:]{2,48}):\s*(.+)$/);
    if (m) ficha.push([m[1].trim(), m[2].trim()]);
    else if (l) texto.push(l);
  }

  return { texto, ficha, fichaTitulo: i === -1 ? null : linhas[i].replace(/:\s*$/, "") };
}

export async function carregarProdutoV2(slug: string): Promise<ProdutoV2 | null> {
  const db = getSupabaseAdmin();
  const { data: p } = await db
    .from("products")
    .select("id,name,slug,description,images,image_zoom,cart_qty_one")
    .eq("slug", slug.trim())
    .eq("active", true)
    .limit(1)
    .maybeSingle();
  if (!p) return null;

  const [{ data: tabela }, { data: conv }, { data: ativos }, { data: banners }] = await Promise.all([
    db.from("product_tables").select("rows, product_table_templates(name, columns)").eq("product_id", p.id).maybeSingle(),
    db.from("product_conversions").select("rows").eq("product_id", p.id).maybeSingle(),
    db.from("products").select("slug,name").eq("active", true),
    db.from("banners").select("cta_link").eq("active", true),
  ]);

  // tabela técnica, com os rótulos trocados e as colunas extras que o admin guarda numa linha __config__
  const todas = (tabela?.rows ?? []) as Linha[];
  const config = todas.find((r) => "__config__" in r);
  const tmpl = tabela?.product_table_templates as unknown as { name: string; columns: Coluna[] } | null;
  let colunas = tmpl?.columns ?? [];
  if (config) {
    try {
      const c = JSON.parse(String(config.__config__));
      const trocas = (c.labelOverrides ?? {}) as Record<string, string>;
      colunas = [...colunas.map((col) => ({ ...col, label: trocas[col.key] ?? col.label })), ...((c.extraCols ?? []) as Coluna[])];
    } catch {}
  }
  const rows = linhasReais(todas);
  const linhas = rows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, String(v ?? "").trim()])));

  // vizinhos na mesma ordem da esteira da home
  const ordenados = (ativos ?? [])
    .map((a) => ({ slug: a.slug as string, curto: nomeCurto(a.name as string) }))
    .sort((a, b) => {
      const ia = ORDEM.indexOf(a.slug);
      const ib = ORDEM.indexOf(b.slug);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });
  const pos = ordenados.findIndex((o) => o.slug === p.slug);

  const imagens = (Array.isArray(p.images) ? (p.images as string[]) : []).map((u) => imagemDa(u)).filter((u): u is string => !!u);
  const { texto, ficha, fichaTitulo } = separarDescricao(p.description);

  return {
    id: p.id,
    slug: p.slug,
    nome: String(p.name).replace(/\s+/g, " ").trim(),
    curto: nomeCurto(p.name),
    imagens,
    zoom: p.image_zoom ?? 100,
    faixa: calcularFaixa(colunas, rows),
    codigos: contarCodigos(colunas, rows),
    lancamento: (banners ?? []).some((b) => slugDoLink(linkDoBanner(b.cta_link).link) === p.slug),
    qtdUm: !!p.cart_qty_one,
    texto,
    fichaTitulo,
    ficha,
    tabela: tmpl && linhas.length ? { nome: tmpl.name, colunas, linhas } : null,
    conversoes: ((conv?.rows ?? []) as Conversao[]).map((c) => ({
      codigo_halten: String(c.codigo_halten ?? "").trim(),
      codigos_originais: String(c.codigos_originais ?? "").trim(),
    })),
    vizinhos: {
      anterior: pos > 0 ? ordenados[pos - 1] : null,
      proximo: pos >= 0 && pos < ordenados.length - 1 ? ordenados[pos + 1] : null,
    },
  };
}
