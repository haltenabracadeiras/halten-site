import Link from "next/link";
import { Plus, Pencil, Columns3 } from "lucide-react";
import { getSupabaseAdmin } from "../../../lib/supabase";
import { DeleteTemplateButton } from "./DeleteTemplateButton";
import { DuplicateTemplateButton } from "./DuplicateTemplateButton";

export const dynamic = "force-dynamic";

type ColumnDef = { key: string; label: string };
type Template = { id: string; name: string; columns: ColumnDef[]; created_at: string };

export default async function TemplatesPage() {
  const db = getSupabaseAdmin();
  const { data: templates } = await db
    .from("product_table_templates")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div style={{ padding: "40px 48px", maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 className="font-sans" style={{ fontSize: 24, fontWeight: 800, color: "var(--ink)", margin: 0 }}>
            Templates de Tabela
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
            Estruturas de colunas reutilizáveis para tabelas técnicas de produtos.
          </p>
        </div>
        <Link
          href="/admin/templates/novo"
          className="font-sans"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 22px",
            borderRadius: 999,
            background: "var(--blue)",
            color: "white",
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          <Plus size={15} />
          Novo Template
        </Link>
      </div>

      {/* Tabela */}
      {!templates || templates.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 24px", border: "1.5px dashed var(--line)", borderRadius: 16, color: "var(--ink-mute)", fontFamily: "var(--font-mono)", fontSize: 14 }}>
          Nenhum template cadastrado. Clique em "Novo Template" para começar.
        </div>
      ) : (
        <div className="admin-table-card" style={{ background: "white", borderRadius: 16, border: "1.5px solid var(--line)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg)", borderBottom: "1.5px solid var(--line)" }}>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-mid)", fontFamily: "var(--font-mono)" }}>Nome</th>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-mid)", fontFamily: "var(--font-mono)" }}>Colunas</th>
                <th style={{ padding: "12px 20px", textAlign: "right", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-mid)", fontFamily: "var(--font-mono)" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {(templates as Template[]).map((t, i) => (
                <tr key={t.id} style={{ borderBottom: i < templates.length - 1 ? "1px solid var(--line)" : "none" }}>
                  <td style={{ padding: "16px 20px" }}>
                    <p className="font-sans" style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{t.name}</p>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Columns3 size={13} color="var(--ink-mute)" />
                      <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--ink-mid)" }}>
                        {t.columns?.length ?? 0} coluna{(t.columns?.length ?? 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div style={{ marginTop: 4, display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {t.columns?.slice(0, 4).map((col) => (
                        <span
                          key={col.key}
                          style={{ fontSize: 10, fontFamily: "var(--font-mono)", padding: "2px 8px", borderRadius: 6, background: "rgba(28,155,215,0.1)", color: "var(--blue)", letterSpacing: "0.04em" }}
                        >
                          {col.label}
                        </span>
                      ))}
                      {(t.columns?.length ?? 0) > 4 && (
                        <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--ink-mute)" }}>
                          +{t.columns.length - 4} mais
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 8 }}>
                      <Link
                        href={`/admin/templates/${t.id}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "7px 14px",
                          borderRadius: 8,
                          border: "1.5px solid var(--line)",
                          fontSize: 12,
                          fontFamily: "var(--font-mono)",
                          color: "var(--ink-mid)",
                          textDecoration: "none",
                        }}
                      >
                        <Pencil size={12} />
                        Editar
                      </Link>
                      <DuplicateTemplateButton id={t.id} />
                      <DeleteTemplateButton id={t.id} name={t.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
