import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { getSupabaseAdmin } from "../../../lib/supabase";
import { deleteProduct, toggleProductFeatured, toggleProductActive } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProdutosAdminPage() {
  const { data: products } = await getSupabaseAdmin()
    .from("products")
    .select("*")
    .order("position", { ascending: true });

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 className="font-sans" style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
            Produtos
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
            {products?.length ?? 0} produtos cadastrados
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="font-sans"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 999,
            background: "var(--blue)",
            color: "white",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <Plus size={15} />
          Novo Produto
        </Link>
      </div>

      <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--line)", overflow: "hidden", boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
        {!products || products.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--ink-dim)", fontFamily: "var(--font-mono)", fontSize: 14 }}>
            Nenhum produto cadastrado.{" "}
            <Link href="/admin/produtos/novo" style={{ color: "var(--blue)" }}>Criar o primeiro</Link>
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
              {products.map((p: {
                id: string;
                position: number;
                images: string[] | null;
                name: string;
                slug: string;
                excerpt: string | null;
                category: string | null;
                featured: boolean;
                active: boolean;
              }, i: number) => (
                <tr
                  key={p.id}
                  style={{ borderBottom: i < products.length - 1 ? "1px solid var(--line-soft)" : "none" }}
                >
                  <td style={{ padding: "14px 16px", fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--ink-dim)" }}>
                    {p.position}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {p.images && p.images[0] ? (
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
                    {p.excerpt && (
                      <p style={{ fontSize: 11, color: "var(--ink-dim)", margin: "2px 0 0", fontFamily: "var(--font-mono)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>
                        {p.excerpt}
                      </p>
                    )}
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
                          fontSize: 11,
                          fontFamily: "var(--font-mono)",
                          fontWeight: 600,
                          padding: "4px 12px",
                          borderRadius: 999,
                          border: "none",
                          cursor: "pointer",
                          background: p.featured ? "#fef9c3" : "var(--bg)",
                          color: p.featured ? "#854d0e" : "var(--ink-dim)",
                        }}
                      >
                        {p.featured ? "★ Sim" : "☆ Não"}
                      </button>
                    </form>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <form action={toggleProductActive.bind(null, p.id, p.active)}>
                      <button
                        type="submit"
                        style={{
                          fontSize: 11,
                          fontFamily: "var(--font-mono)",
                          fontWeight: 600,
                          padding: "4px 12px",
                          borderRadius: 999,
                          border: "none",
                          cursor: "pointer",
                          background: p.active ? "#dcfce7" : "#fee2e2",
                          color: p.active ? "#166534" : "#991b1b",
                        }}
                      >
                        {p.active ? "Ativo" : "Inativo"}
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
                          gap: 4,
                          padding: "6px 12px",
                          borderRadius: 8,
                          border: "1px solid var(--line)",
                          fontSize: 12,
                          fontFamily: "var(--font-mono)",
                          color: "var(--ink)",
                          textDecoration: "none",
                        }}
                      >
                        <Pencil size={12} />
                        Editar
                      </Link>
                      <form action={deleteProduct.bind(null, p.id)}>
                        <button
                          type="submit"
                          style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            border: "1px solid #fecaca",
                            background: "#fff5f5",
                            fontSize: 12,
                            fontFamily: "var(--font-mono)",
                            color: "var(--red)",
                            cursor: "pointer",
                          }}
                        >
                          Excluir
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
