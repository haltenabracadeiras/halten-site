import Link from "next/link";
import { getSupabaseAdmin } from "../../lib/supabase";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  excerpt: string | null;
  images: string[] | null;
  image_zoom: number | null;
};

async function getFeaturedProducts() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("id,name,slug,category,excerpt,images,image_zoom")
    .eq("featured", true)
    .eq("active", true)
    .order("position", { ascending: true })
    .limit(4);

  if (error) {
    console.error("[products-section] error:", error.message);
    return [] as ProductRow[];
  }

  return (data ?? []) as ProductRow[];
}

const ClampSVG = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: "55%", height: "55%", color: "#1c9bd7", opacity: 0.7 }}>
    <circle cx="50" cy="50" r="30"/>
    <circle cx="50" cy="50" r="38" strokeDasharray="2 2" opacity="0.55"/>
    <rect x="38" y="14" width="24" height="14" rx="2" fill="currentColor" opacity="0.85"/>
    <path d="M44 16h12M44 22h12"/>
  </svg>
);

export default async function ProductsSection() {
  const products = await getFeaturedProducts();

  return (
    <section
      id="produtos"
      style={{
        background: "var(--paper)",
        color: "var(--ink)",
        padding: "120px 0 120px",
        position: "relative",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
        {/* Section head */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1.4fr",
            gap: 64,
            marginBottom: 64,
            alignItems: "start",
          }}
          className="prod-head"
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(15,25,35,0.45)",
                marginBottom: 12,
              }}
            >
              [ 01 — Catálogo · Produtos ]
            </p>
            <h2
              className="font-sans"
              style={{
                fontSize: "clamp(40px,5vw,64px)",
                fontWeight: 700,
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                color: "var(--ink)",
                margin: 0,
              }}
            >
              Nossas soluções
              <br />
              <em style={{ fontStyle: "italic", color: "var(--blue)" }}>para a sua linha.</em>
            </h2>
          </div>
          <div style={{ paddingTop: 28 }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                lineHeight: 1.7,
                color: "rgba(15,25,35,0.55)",
                maxWidth: 460,
                margin: 0,
              }}
            >
              Abraçadeiras desenvolvidas para projetos exigentes — montagem de motores, intercooler, sistemas hidráulicos, agrícola e cargas pesadas. Encontre a abraçadeira certa por modelo, dimensão ou aplicação.
            </p>
          </div>
        </div>

        {/* Product grid */}
        {products.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 14,
            }}
            className="prod-grid"
          >
            {products.map((product) => {
              const imageUrl = Array.isArray(product.images) ? (product.images[0] ?? null) : null;
              return (
                <Link
                  key={product.id}
                  href={`/produtos/${product.slug}`}
                  style={{ textDecoration: "none", display: "flex", flexDirection: "column" }}
                >
                  <article
                    className="pcard-item"
                    style={{
                      background: "white",
                      borderRadius: 16,
                      overflow: "hidden",
                      border: "1px solid rgba(15,25,35,0.06)",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    {/* Visual */}
                    <div
                      style={{
                        aspectRatio: "1/1",
                        background: "white",
                        position: "relative",
                        display: "grid",
                        placeItems: "center",
                        overflow: "hidden",
                      }}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          style={{ width: "100%", height: "100%", objectFit: "contain", position: "absolute", inset: 0, padding: 12, transform: `scale(${(product.image_zoom ?? 100) / 100})`, transformOrigin: "center" }}
                        />
                      ) : (
                        <ClampSVG />
                      )}
                      {product.category && (
                        <span
                          style={{
                            position: "absolute",
                            top: 14,
                            right: 14,
                            fontFamily: "var(--font-mono)",
                            fontSize: 9,
                            letterSpacing: "0.16em",
                            color: "white",
                            background: "var(--blue)",
                            padding: "4px 8px",
                            borderRadius: 4,
                            textTransform: "uppercase",
                          }}
                        >
                          {product.category}
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div
                      style={{
                        padding: "22px 22px 24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        borderTop: "1px solid rgba(15,25,35,0.06)",
                        flex: 1,
                      }}
                    >
                      <h3
                        className="font-sans"
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          letterSpacing: "-0.02em",
                          lineHeight: 1.1,
                          color: "var(--ink)",
                          margin: 0,
                        }}
                      >
                        {product.name}
                      </h3>
                      {product.excerpt && (
                        <p
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            color: "rgba(15,25,35,0.55)",
                            lineHeight: 1.5,
                            margin: 0,
                          }}
                        >
                          {product.excerpt}
                        </p>
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingTop: 12,
                          borderTop: "1px dashed rgba(15,25,35,0.12)",
                          marginTop: "auto",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "var(--blue)",
                          }}
                        >
                          {product.category ?? "Produto"}
                        </span>
                        <span
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            border: "1px solid rgba(15,25,35,0.2)",
                            display: "grid",
                            placeItems: "center",
                            color: "var(--ink)",
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M7 17 17 7M9 7h8v8" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(15,25,35,0.35)", fontFamily: "var(--font-mono)" }}>
            Nenhum produto em destaque encontrado.
          </div>
        )}

        {/* Footer row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 48,
            paddingTop: 32,
            borderTop: "1px solid rgba(15,25,35,0.1)",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <Link href="/produtos" className="ver-todos" style={{ display: "inline-flex", alignItems: "center", gap: 14, textDecoration: "none" }}>
            <span className="font-sans ver-todos-text" style={{ fontWeight: 600, fontSize: 22, color: "var(--ink)", transition: "color 0.2s" }}>
              Ver todos os modelos
            </span>
            <span className="ver-todos-btn" style={{ width: 42, height: 42, borderRadius: "50%", background: "var(--ink)", color: "white", display: "grid", placeItems: "center", transition: "background 0.2s" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "rgba(15,25,35,0.35)", letterSpacing: "0.14em", margin: 0 }}>
            CAT. 2026 · ATUALIZADO {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      <style>{`
        .pcard-item:hover { transform: translateY(-4px); box-shadow: 0 30px 50px -30px rgba(15,25,35,0.25); }
        .ver-todos:hover .ver-todos-text { color: var(--blue) !important; }
        .ver-todos:hover .ver-todos-btn { background: var(--blue) !important; }
        @media (max-width: 960px) {
          .prod-head { grid-template-columns: 1fr !important; gap: 32px !important; }
          .prod-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 540px) {
          .prod-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
