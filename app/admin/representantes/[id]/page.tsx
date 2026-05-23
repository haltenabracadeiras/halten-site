import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "../../../../lib/supabase";
import { updateRepresentative } from "../actions";
import { BRAZIL_STATES } from "../../../representantes/states";
import { PhoneInput } from "../../../components/PhoneInput";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditRepresentativePage({ params }: Props) {
  const { id } = await params;
  const { data: rep } = await getSupabaseAdmin()
    .from("representatives")
    .select("*")
    .eq("id", id)
    .single();

  if (!rep) notFound();

  const action = updateRepresentative.bind(null, id);
  const phoneDefault = rep.whatsapp.replace(/^\+?55/, "");

  return (
    <div style={{ padding: 32, maxWidth: 560 }}>
      <Link
        href="/admin/representantes"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--ink-mid)", textDecoration: "none", marginBottom: 28 }}
      >
        <ArrowLeft size={14} />
        Voltar
      </Link>

      <h1 className="font-sans" style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", marginBottom: 24 }}>
        Editar Representante
      </h1>

      <form action={action} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--ink-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Estado *
          </span>
          <select
            name="state"
            required
            defaultValue={rep.state}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid var(--line)", fontSize: 14, fontFamily: "var(--font-mono)", color: "var(--ink)", background: "white", appearance: "none" }}
          >
            <option value="">Selecione o estado...</option>
            {BRAZIL_STATES.map((s) => (
              <option key={s.id} value={s.id}>{s.id} — {s.name}</option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--ink-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Nome do representante *
          </span>
          <input
            name="name"
            required
            defaultValue={rep.name}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid var(--line)", fontSize: 14, fontFamily: "var(--font-mono)", color: "var(--ink)", background: "white" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--ink-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            WhatsApp *
          </span>
          <PhoneInput name="whatsapp" defaultValue={phoneDefault} required />
        </label>

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            type="submit"
            style={{ flex: 1, padding: "12px 24px", borderRadius: 10, background: "var(--blue)", color: "white", fontSize: 14, fontFamily: "var(--font-mono)", fontWeight: 600, border: "none", cursor: "pointer" }}
          >
            Salvar Alterações
          </button>
          <Link
            href="/admin/representantes"
            style={{ padding: "12px 20px", borderRadius: 10, border: "1px solid var(--line)", fontSize: 14, fontFamily: "var(--font-mono)", color: "var(--ink)", textDecoration: "none", display: "flex", alignItems: "center" }}
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
