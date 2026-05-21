import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";
import { getSupabaseAdmin } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

type ColumnDef = { key: string; label: string };

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  price: number | null;
  excerpt: string | null;
  description: string | null;
  details: string[] | null;
  images: string[] | null;
};

type ProductTable = {
  rows: Record<string, string>[];
  product_table_templates: { name: string; columns: ColumnDef[] } | null;
};

type ConversionRow = { codigo_halten: string; codigos_originais: string };
type ProductConversion = { rows: ConversionRow[] };

async function getProductBySlug(slug: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("id,name,slug,category,price,excerpt,description,details,images")
    .eq("slug", slug.trim())
    .eq("active", true)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[produto/slug] Supabase error:", error.message);
    return null;
  }

  return data as ProductRow | null;
}

async function getProductTable(productId: string): Promise<ProductTable | null> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("product_tables")
    .select("rows, product_table_templates(name, columns)")
    .eq("product_id", productId)
    .maybeSingle();

  return data as ProductTable | null;
}

async function getProductConversion(productId: string): Promise<ProductConversion | null> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("product_conversions")
    .select("rows")
    .eq("product_id", productId)
    .maybeSingle();

  return data as ProductConversion | null;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [productTable, productConversion] = await Promise.all([
    getProductTable(product.id),
    getProductConversion(product.id),
  ]);

  const images = Array.isArray(product.images) ? product.images : [];
  const whatsappMsg = encodeURIComponent(
    `Olá! Tenho interesse no produto *${product.name}*. Poderia me enviar um orçamento?`
  );

  const tableTemplate = productTable?.product_table_templates;
  const tableRows = productTable?.rows ?? [];
  const hasTable = !!(tableTemplate && tableRows.length > 0);

  const conversionRows = productConversion?.rows ?? [];
  const hasConversions = conversionRows.length > 0;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 80, background: "var(--bg)", minHeight: "100vh" }}>
        {/* Breadcrumb */}
        <div
          style={{
            background: "white",
            borderBottom: "1px solid var(--line)",
            padding: "16px 24px",
          }}
        >
          <div
            style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 8 }}
          >
            <Link
              href="/produtos"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                color: "var(--blue)",
                textDecoration: "none",
                fontFamily: "var(--font-mono)",
              }}
            >
              <ArrowLeft size={14} />
              Catálogo
            </Link>
            <span style={{ color: "var(--ink-mute)", fontSize: 14 }}>/</span>
            <span
              style={{ fontSize: 14, color: "var(--ink-mid)", fontFamily: "var(--font-mono)" }}
            >
              {product.name}
            </span>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "48px 24px",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 32,
            minWidth: 0,
            overflow: "hidden",
          }}
          className="lg:grid-cols-[1fr_360px]"
        >
          {/* Left: images + description + technical table */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32, minWidth: 0 }}>
            {/* Gallery */}
            <div
              style={{
                background: "white",
                borderRadius: 24,
                border: "1px solid var(--line)",
                padding: 32,
                boxShadow: "0 4px 24px rgba(15,25,35,0.05)",
              }}
            >
              {images.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gap: 16,
                    gridTemplateColumns: images.length === 1 ? "1fr" : "repeat(2, 1fr)",
                  }}
                >
                  {images.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`${product.name} — imagem ${i + 1}`}
                      style={{
                        width: "100%",
                        height: 260,
                        objectFit: "contain",
                        borderRadius: 16,
                        background: "var(--bg-section)",
                        padding: 16,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    height: 280,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 16,
                    background: "var(--bg-section)",
                    color: "var(--ink-mute)",
                    fontSize: 14,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  Imagens em breve
                </div>
              )}
            </div>

            {/* Description */}
            <div
              style={{
                background: "white",
                borderRadius: 24,
                border: "1px solid var(--line)",
                padding: 32,
                boxShadow: "0 4px 24px rgba(15,25,35,0.05)",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--blue)",
                  fontFamily: "var(--font-mono)",
                  marginBottom: 16,
                }}
              >
                Descrição
              </p>
              <p
                style={{
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: "var(--ink-mid)",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 300,
                  whiteSpace: "pre-wrap",
                }}
              >
                {product.description ??
                  product.excerpt ??
                  "Descrição detalhada não disponível para este produto."}
              </p>

              {product.details && product.details.length > 0 && (
                <div style={{ marginTop: 28 }}>
                  <p
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "var(--blue)",
                      fontFamily: "var(--font-mono)",
                      marginBottom: 14,
                    }}
                  >
                    Especificações
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 20,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {product.details.map((d, i) => (
                      <li
                        key={i}
                        style={{
                          fontSize: 14,
                          color: "var(--ink-mid)",
                          fontFamily: "var(--font-mono)",
                          lineHeight: 1.6,
                        }}
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Tabela técnica */}
            {hasTable && (
              <div
                style={{
                  background: "white",
                  borderRadius: 24,
                  border: "1px solid var(--line)",
                  padding: 32,
                  boxShadow: "0 4px 24px rgba(15,25,35,0.05)",
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--blue)",
                    fontFamily: "var(--font-mono)",
                    marginBottom: 20,
                  }}
                >
                  Tabela Técnica
                </p>

                <div data-lenis-prevent style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--line)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "var(--font-mono)" }}>
                    <thead>
                      <tr style={{ background: "#1c9bd7" }}>
                        {tableTemplate!.columns.map((col) => (
                          <th
                            key={col.key}
                            style={{
                              padding: "12px 16px",
                              textAlign: "left",
                              color: "white",
                              fontWeight: 700,
                              fontSize: 11,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row, i) => (
                        <tr
                          key={i}
                          style={{ background: i % 2 === 0 ? "white" : "#f8fafc" }}
                        >
                          {tableTemplate!.columns.map((col, ci) => (
                            <td
                              key={col.key}
                              style={{
                                padding: "10px 16px",
                                color: col.highlight ? "#1c9bd7" : "var(--ink)",
                                fontWeight: col.highlight ? 700 : 400,
                                borderBottom: i < tableRows.length - 1 ? "1px solid var(--line)" : "none",
                                whiteSpace: col.highlight ? "nowrap" : "normal",
                                wordBreak: "break-word",
                                minWidth: col.highlight ? undefined : 120,
                              }}
                            >
                              {row[col.key] ?? "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* Tabela de conversões */}
            {hasConversions && (
              <div
                style={{
                  background: "white",
                  borderRadius: 24,
                  border: "1px solid var(--line)",
                  padding: 32,
                  boxShadow: "0 4px 24px rgba(15,25,35,0.05)",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--blue)",
                    fontFamily: "var(--font-mono)",
                    marginBottom: 20,
                  }}
                >
                  Tabela de Conversões
                </p>

                <div data-lenis-prevent style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--line)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, fontFamily: "var(--font-mono)" }}>
                    <thead>
                      <tr style={{ background: "#111827" }}>
                        <th
                          style={{
                            padding: "12px 16px",
                            textAlign: "left",
                            color: "white",
                            fontWeight: 700,
                            fontSize: 11,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                            width: "30%",
                          }}
                        >
                          Código Halten
                        </th>
                        <th
                          style={{
                            padding: "12px 16px",
                            textAlign: "left",
                            color: "white",
                            fontWeight: 700,
                            fontSize: 11,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                          }}
                        >
                          Códigos Originais
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {conversionRows.map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#f8fafc" }}>
                          <td
                            style={{
                              padding: "10px 16px",
                              fontWeight: 700,
                              color: "var(--ink)",
                              borderBottom: i < conversionRows.length - 1 ? "1px solid var(--line)" : "none",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.codigo_halten}
                          </td>
                          <td
                            style={{
                              padding: "10px 16px",
                              color: "var(--ink-mid)",
                              borderBottom: i < conversionRows.length - 1 ? "1px solid var(--line)" : "none",
                            }}
                          >
                            {row.codigos_originais}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right: sidebar */}
          <aside
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              alignSelf: "start",
              position: "sticky",
              top: 100,
            }}
          >
            {/* Product info card */}
            <div
              style={{
                background: "white",
                borderRadius: 24,
                border: "1px solid var(--line)",
                padding: 28,
                boxShadow: "0 4px 24px rgba(15,25,35,0.05)",
              }}
            >
              {product.category && (
                <span
                  style={{
                    display: "inline-flex",
                    background: "var(--blue-light)",
                    color: "var(--blue)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "4px 12px",
                    borderRadius: 999,
                    fontFamily: "var(--font-mono)",
                    marginBottom: 14,
                  }}
                >
                  {product.category}
                </span>
              )}
              <h1
                className="font-sans"
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--ink)",
                  lineHeight: 1.25,
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                {product.name}
              </h1>

              <div
                style={{
                  marginTop: 20,
                  paddingTop: 20,
                  borderTop: "1px solid var(--line-soft)",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--ink-dim)",
                    fontFamily: "var(--font-mono)",
                    marginBottom: 6,
                  }}
                >
                  Preço
                </p>
                <p
                  className="font-sans"
                  style={{ fontSize: 28, fontWeight: 700, color: "var(--ink)", margin: 0 }}
                >
                  {product.price !== null
                    ? `R$ ${product.price.toFixed(2).replace(".", ",")}`
                    : "Sob consulta"}
                </p>
              </div>
            </div>

            {/* CNPJ warning */}
            <div
              style={{
                background: "var(--blue-light)",
                borderLeft: "3px solid var(--blue)",
                borderRadius: "0 12px 12px 0",
                padding: "16px 20px",
              }}
            >
              <p
                className="font-sans"
                style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}
              >
                Venda exclusiva para CNPJ
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--ink-mid)",
                  fontFamily: "var(--font-mono)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Este produto é comercializado apenas para pessoas jurídicas. Tenha seu CNPJ em mãos ao solicitar o orçamento.
              </p>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/5545991447046?text=${whatsappMsg}`}
              target="_blank"
              rel="noreferrer"
              className="font-sans"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "16px 24px",
                borderRadius: 999,
                background: "#22c55e",
                color: "white",
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                transition: "background 0.2s ease",
              }}
            >
              <MessageCircle size={18} />
              Solicitar orçamento
            </a>

            <Link
              href="/produtos"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                fontSize: 14,
                color: "var(--ink-mid)",
                textDecoration: "none",
                fontFamily: "var(--font-mono)",
                padding: "12px 0",
              }}
            >
              <ArrowLeft size={14} />
              Voltar ao catálogo
            </Link>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
