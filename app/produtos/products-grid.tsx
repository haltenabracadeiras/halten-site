"use client";

import { useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  excerpt: string | null;
  images: string[] | null;
  image_zoom: number | null;
};

type Props = {
  products: Product[];
  categories: string[];
  initialQuery?: string;
};

const ClampSVG = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: "55%", height: "55%", color: "#1c9bd7", opacity: 0.7 }}>
    <circle cx="50" cy="50" r="30"/>
    <circle cx="50" cy="50" r="38" strokeDasharray="2 2" opacity="0.55"/>
    <rect x="38" y="14" width="24" height="14" rx="2" fill="currentColor" opacity="0.85"/>
    <path d="M44 16h12M44 22h12"/>
  </svg>
);

export function ProductsGrid({ products, categories, initialQuery = "" }: Props) {
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState(initialQuery);

  const filtered = products.filter((p) => {
    const matchCat = active === "all" || p.category === active;
    const q = query.trim().toLowerCase();
    const matchQuery = !q || p.name.toLowerCase().includes(q) || (p.category ?? "").toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    return matchCat && matchQuery;
  });

  return (
    <div>
      {/* Filtros */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 48 }}>
        {["all", ...categories].map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "8px 16px",
                border: "1px solid",
                borderColor: isActive ? "var(--ink)" : "rgba(15,25,35,0.2)",
                borderRadius: 999,
                cursor: "pointer",
                color: isActive ? "white" : "var(--ink)",
                background: isActive ? "var(--ink)" : "transparent",
                transition: "all 0.15s ease",
              }}
            >
              {cat === "all" ? "Todos" : cat}
            </button>
          );
        })}
      </div>

      {/* Grid de produtos */}
      {filtered.length > 0 ? (
        <div className="prod-page-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {filtered.map((product) => {
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
                  {/* Imagem */}
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

                  {/* Conteúdo */}
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
        <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(15,25,35,0.35)", fontFamily: "var(--font-mono)" }}>
          Nenhum produto nesta categoria.
        </div>
      )}

      <style>{`
        .pcard-item:hover { transform: translateY(-4px); box-shadow: 0 30px 50px -30px rgba(15,25,35,0.25); }
        @media (max-width: 960px) { .prod-page-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 540px) { .prod-page-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
