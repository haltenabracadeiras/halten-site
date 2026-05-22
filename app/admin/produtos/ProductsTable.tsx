"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Search } from "lucide-react";
import { deleteProduct, toggleProductFeatured, toggleProductActive } from "./actions";

type Product = {
  id: string;
  position: number;
  images: string[] | null;
  name: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  featured: boolean;
  active: boolean;
};

export function ProductsTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.slug.toLowerCase().includes(query.toLowerCase()) ||
    (p.category ?? "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* Barra de busca */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
          borderBottom: "1px solid var(--line)",
          background: "var(--bg)",
        }}
      >
        <Search size={14} color="var(--ink-dim)" style={{ flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome, slug ou categoria…"
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            fontSize: 13,
            fontFamily: "var(--font-mono)",
            color: "var(--ink)",
            outline: "none",
          }}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ink-dim)",
              fontSize: 16,
              lineHeight: 1,
              padding: 0,
            }}
          >
            ×
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: 48, textAlign: "center", color: "var(--ink-dim)", fontFamily: "var(--font-mono)", fontSize: 14 }}>
          {query ? `Nenhum resultado para "${query}"` : "Nenhum produto cadastrado."}
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--line)", background: "var(--bg)" }}>
              {["Pos", "Imagem", "Produto", "Categoria", "Destaque", "Status", "Ações"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--ink-dim)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr
                key={p.id}
                style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--line-soft)" : "none" }}
              >
                <td style={{ padding: "14px 16px", fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--ink-dim)" }}>
                  {p.position}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      style={{ width: 64, height: 48, objectFit: "cover", borderRadius: 8, background: "var(--bg)" }}
                    />
                  ) : (
                    <div style={{ width: 64, height: 48, background: "var(--bg)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--ink-mute)", fontFamily: "var(--font-mono)" }}>
                      Sem img
                    </div>
                  )}
                </td>
                <td style={{ padding: "14px 16px", maxWidth: 260 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", margin: 0, fontFamily: "var(--font-mono)" }}>
                    {p.name}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--ink-dim)", margin: 0, fontFamily: "var(--font-mono)" }}>
                    /{p.slug}
                  </p>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--ink-mid)" }}>
                    {p.category ?? "—"}
                  </span>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <form action={toggleProductFeatured.bind(null, p.id, p.featured)}>
                    <button
                      type="submit"
                      style={{
                        fontSize: 10,
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        padding: "5px 12px",
                        borderRadius: 999,
                        border: "none",
                        cursor: "pointer",
                        background: p.featured ? "#1c9bd7" : "var(--bg)",
                        color: p.featured ? "white" : "var(--ink-dim)",
                      }}
                    >
                      {p.featured ? "★ SIM" : "☆ NÃO"}
                    </button>
                  </form>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <form action={toggleProductActive.bind(null, p.id, p.active)}>
                    <button
                      type="submit"
                      style={{
                        fontSize: 10,
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        padding: "5px 12px",
                        borderRadius: 999,
                        border: "none",
                        cursor: "pointer",
                        background: p.active ? "#22c55e" : "#f87171",
                        color: "white",
                      }}
                    >
                      {p.active ? "ATIVO" : "INATIVO"}
                    </button>
                  </form>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link
                      href={`/admin/produtos/${p.id}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 14px",
                        borderRadius: 999,
                        background: "var(--ink)",
                        fontSize: 11,
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: "white",
                        textDecoration: "none",
                      }}
                    >
                      <Pencil size={11} />
                      EDITAR
                    </Link>
                    <form action={deleteProduct.bind(null, p.id)}>
                      <button
                        type="submit"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "6px 14px",
                          borderRadius: 999,
                          border: "1.5px solid #fecaca",
                          background: "transparent",
                          fontSize: 11,
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          color: "#dc2626",
                          cursor: "pointer",
                        }}
                      >
                        EXCLUIR
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
