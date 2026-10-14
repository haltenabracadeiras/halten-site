import { getSupabaseAdmin } from "../../../lib/supabase";

type Coluna = { key: string; label: string; highlight?: boolean };
type Linha = Record<string, unknown>;

export type Peca = {
  slug: string;
  nome: string; // nome completo, como no cadastro
  curto: string; // sem o prefixo "Abraçadeira"
  imagem: string | null;
  zoom: number; // image_zoom do admin (100 = normal)
  faixa: string | null; // ex.: "Ø 32–220 mm" ou "até 300 mm"
  codigos: number; // códigos reais na tabela técnica
};

export type DadosV2 = {
  pecas: Peca[];
  totalCodigos: number;
  medidor: { codigo: string; produto: string; min: number; max: number };
  representantes: number;
  estados: string[];
};

// Ordem da esteira: linha pesada primeiro, nylon no fim. Produto novo entra no final.
const ORDEM = [
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

function imagemDa(url: string | null) {
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

function nomeCurto(nome: string) {
  return nome
    .replace(/^\s*abra[çc]adei(ra|ar)\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function linhasReais(rows: Linha[] | null | undefined) {
  return (rows ?? []).filter((r) => !("__config__" in r));
}

function contarCodigos(colunas: Coluna[], rows: Linha[]) {
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

function calcularFaixa(colunas: Coluna[], rows: Linha[]): string | null {
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

  const [{ data: produtos }, { data: tabelas }, { data: reps }] = await Promise.all([
    supabase.from("products").select("id,name,slug,images,image_zoom").eq("active", true),
    supabase.from("product_tables").select("product_id, rows, product_table_templates(columns)"),
    supabase.from("representatives").select("state").eq("active", true),
  ]);

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
    });
  }

  pecas.sort((a, b) => {
    const ia = ORDEM.indexOf(a.slug);
    const ib = ORDEM.indexOf(b.slug);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  const estados = Array.from(new Set((reps ?? []).map((r) => String(r.state).toUpperCase())));

  return {
    pecas,
    totalCodigos,
    medidor: medidor ?? { codigo: "TCH120132", produto: "Tucho Canaleta", min: 120, max: 132 },
    representantes: reps?.length ?? 0,
    estados,
  };
}
