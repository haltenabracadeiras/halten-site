import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { getSupabaseAdmin } from "../../../lib/supabase";
import { deleteRepresentative, toggleRepresentativeActive } from "./actions";
import { BRAZIL_STATES } from "../../representantes/states";

export const dynamic = "force-dynamic";

type Rep = { id: string; name: string; whatsapp: string; state: string; active: boolean };

function formatPhone(stored: string): string {
  const n = stored.replace(/\D/g, "").replace(/^55/, "");
  if (n.length === 11) return `(${n.slice(0, 2)}) ${n[2]} ${n.slice(3, 7)}-${n.slice(7)}`;
  if (n.length === 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
  return stored;
}

export default async function RepresentativesPage() {
  const { data: reps } = await getSupabaseAdmin()
    .from("representatives")
    .select("*")
    .order("state", { ascending: true });

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 className="font-sans" style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
            Representantes
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
            {reps?.length ?? 0} representante(s) cadastrado(s)
          </p>
        </div>
        <Link
          href="/admin/representantes/novo"
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
          Novo Representante
        </Link>
      </div>

      <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--line)", overflow: "hidden", boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
        {!reps || reps.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--ink-dim)", fontFamily: "var(--font-mono)", fontSize: 14 }}>
            Nenhum representante cadastrado.{" "}
            <Link href="/admin/representantes/novo" style={{ color: "var(--blue)" }}>Cadastrar o primeiro</Link>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--line)", background: "var(--bg)" }}>
                {["Estado", "Nome", "WhatsApp", "Status", "Ações"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-dim)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(reps as Rep[]).map((r, i) => {
                const stateName = BRAZIL_STATES.find((s) => s.id === r.state)?.name ?? r.state;
                return (
                  <tr key={r.id} style={{ borderBottom: i < reps.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, background: "rgba(28,155,215,0.1)", color: "var(--blue)", fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                        {r.state} — {stateName}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--ink)", fontWeight: 500 }}>
                      {r.name}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--ink-mid)" }}>
                      {formatPhone(r.whatsapp)}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <form action={toggleRepresentativeActive.bind(null, r.id, r.active)}>
                        <button
                          type="submit"
                          style={{ fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 600, padding: "4px 12px", borderRadius: 999, border: "none", cursor: "pointer", background: r.active ? "#dcfce7" : "#fee2e2", color: r.active ? "#166534" : "#991b1b" }}
                        >
                          {r.active ? "Ativo" : "Inativo"}
                        </button>
                      </form>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Link
                          href={`/admin/representantes/${r.id}`}
                          style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--line)", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--ink)", textDecoration: "none" }}
                        >
                          <Pencil size={12} />
                          Editar
                        </Link>
                        <form action={deleteRepresentative.bind(null, r.id)}>
                          <button
                            type="submit"
                            style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #fecaca", background: "#fff5f5", fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--red)", cursor: "pointer" }}
                          >
                            Excluir
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
