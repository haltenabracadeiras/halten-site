import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { getSupabaseAdmin } from "../../../lib/supabase";
import { deleteBanner, toggleBannerActive } from "./actions";

export const dynamic = "force-dynamic";

export default async function BannersPage() {
  const { data: banners } = await getSupabaseAdmin()
    .from("banners")
    .select("*")
    .order("position", { ascending: true });

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 className="font-sans" style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
            Banners
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
            {banners?.length ?? 0} banners cadastrados
          </p>
        </div>
        <Link
          href="/admin/banners/novo"
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
          Novo Banner
        </Link>
      </div>

      <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--line)", overflow: "hidden", boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
        {!banners || banners.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--ink-dim)", fontFamily: "var(--font-mono)", fontSize: 14 }}>
            Nenhum banner cadastrado.{" "}
            <Link href="/admin/banners/novo" style={{ color: "var(--blue)" }}>Criar o primeiro</Link>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)", background: "var(--bg)" }}>
                {["Pos", "Imagem", "Título", "Status", "Ações"].map((h) => (
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
              {banners.map((b: { id: string; position: number; image_url: string; title: string | null; subtitle: string | null; active: boolean }, i: number) => (
                <tr
                  key={b.id}
                  style={{ borderBottom: i < banners.length - 1 ? "1px solid var(--line-soft)" : "none" }}
                >
                  <td style={{ padding: "14px 16px", fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--ink-dim)" }}>
                    {b.position}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {b.image_url ? (
                      <img
                        src={b.image_url}
                        alt={b.title ?? "Banner"}
                        style={{ width: 80, height: 48, objectFit: "cover", borderRadius: 8, background: "var(--bg)" }}
                      />
                    ) : (
                      <div style={{ width: 80, height: 48, background: "var(--bg)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--ink-mute)", fontFamily: "var(--font-mono)" }}>
                        Sem imagem
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", margin: 0, fontFamily: "var(--font-mono)" }}>
                      {b.title ?? "—"}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--ink-dim)", margin: 0, fontFamily: "var(--font-mono)" }}>
                      {b.subtitle ?? "—"}
                    </p>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <form action={toggleBannerActive.bind(null, b.id, b.active)}>
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
                          background: b.active ? "#dcfce7" : "#fee2e2",
                          color: b.active ? "#166534" : "#991b1b",
                        }}
                      >
                        {b.active ? "Ativo" : "Inativo"}
                      </button>
                    </form>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Link
                        href={`/admin/banners/${b.id}`}
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
                      <form action={deleteBanner.bind(null, b.id)}>
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
