import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createRepresentative } from "../actions";
import { BRAZIL_STATES } from "../../../representantes/states";
import { PhoneInput } from "../../../components/PhoneInput";
import { RegionField } from "../../../components/RegionField";

export default function NovoRepresentantePage() {
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
        Novo Representante
      </h1>

      <form action={createRepresentative} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--ink-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Estado *
          </span>
          <select
            name="state"
            required
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
            placeholder="Ex: João Silva"
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid var(--line)", fontSize: 14, fontFamily: "var(--font-mono)", color: "var(--ink)", background: "white" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--ink-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            WhatsApp *
          </span>
          <PhoneInput name="whatsapp" required />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--ink-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            E-mail
          </span>
          <input
            name="email"
            type="email"
            placeholder="Ex: contato@empresa.com.br"
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid var(--line)", fontSize: 14, fontFamily: "var(--font-mono)", color: "var(--ink)", background: "white" }}
          />
        </label>

        <RegionField />

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button
            type="submit"
            style={{ flex: 1, padding: "12px 24px", borderRadius: 10, background: "var(--blue)", color: "white", fontSize: 14, fontFamily: "var(--font-mono)", fontWeight: 600, border: "none", cursor: "pointer" }}
          >
            Salvar Representante
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
