"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Trash2, GripVertical, Loader2, AlertCircle } from "lucide-react";

type ColumnDef = { key: string; label: string; highlight?: boolean };

const PRESET_COLUMNS: { chip: string; group: string; col: ColumnDef }[] = [
  { chip: "Código",             group: "código",    col: { key: "codigo",           label: "Código",                    highlight: true  } },
  { chip: "Cód. INOX Super",    group: "código",    col: { key: "codigo_inox_super", label: "Código INOX Super 100%",   highlight: true  } },
  { chip: "Cód. INOX/Carbono",  group: "código",    col: { key: "codigo_inox",      label: "Código INOX/Carbono Super", highlight: true  } },
  { chip: "MM Mín.",            group: "diâmetro",  col: { key: "diam_min_mm",      label: "Diâm. Mín. MM",            highlight: false } },
  { chip: "MM Máx.",            group: "diâmetro",  col: { key: "diam_max_mm",      label: "Diâm. Máx. MM",            highlight: false } },
  { chip: "Pol. Mín.",          group: "diâmetro",  col: { key: "diam_min_pol",     label: "Diâm. Mín. Pol.",          highlight: false } },
  { chip: "Pol. Máx.",          group: "diâmetro",  col: { key: "diam_max_pol",     label: "Diâm. Máx. Pol.",          highlight: false } },
  { chip: "Embalagem",          group: "outros",    col: { key: "embalagem",        label: "Embalagem",                highlight: false } },
  { chip: "MM",                 group: "outros",    col: { key: "mm",               label: "MM",                       highlight: false } },
  { chip: "Furo",               group: "outros",    col: { key: "furo",             label: "Furo",                     highlight: false } },
  { chip: "Descrição",          group: "outros",    col: { key: "descricao",        label: "Descrição",                highlight: false } },
  { chip: "Largura MM",         group: "outros",    col: { key: "largura",          label: "Largura MM",               highlight: false } },
  { chip: "Comprimento MM",     group: "outros",    col: { key: "comprimento",      label: "Comprimento MM",           highlight: false } },
];

type Template = {
  id?: string;
  name?: string;
  columns?: ColumnDef[];
};

type Props = {
  template?: Template;
  action: (formData: FormData) => Promise<void>;
  isNew?: boolean;
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--ink-mid)",
  fontFamily: "var(--font-mono)",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid var(--line)",
  borderRadius: 10,
  fontSize: 14,
  fontFamily: "var(--font-mono)",
  color: "var(--ink)",
  background: "white",
  outline: "none",
  boxSizing: "border-box",
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

export function TemplateForm({ template, action, isNew }: Props) {
  const [columns, setColumns] = useState<ColumnDef[]>(template?.columns ?? []);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function addColumn() {
    setColumns((prev) => [...prev, { key: "", label: "", highlight: false }]);
  }

  function addPreset(col: ColumnDef) {
    if (columns.some((c) => c.key === col.key)) return;
    setColumns((prev) => [...prev, { ...col }]);
  }

  function toggleHighlight(index: number) {
    setColumns((prev) =>
      prev.map((col, i) => (i === index ? { ...col, highlight: !col.highlight } : col))
    );
  }

  function removeColumn(index: number) {
    setColumns((prev) => prev.filter((_, i) => i !== index));
  }

  function updateLabel(index: number, label: string) {
    setColumns((prev) =>
      prev.map((col, i) =>
        i === index ? { label, key: col.key || slugify(label) } : col
      )
    );
  }

  function updateKey(index: number, key: string) {
    setColumns((prev) =>
      prev.map((col, i) => (i === index ? { ...col, key } : col))
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const fd = new FormData(e.currentTarget);
    columns.forEach((col) => {
      fd.append("col_label", col.label);
      fd.append("col_key", col.key);
      fd.append("col_highlight", col.highlight ? "true" : "false");
    });

    startTransition(async () => {
      try {
        await action(fd);
      } catch (err: unknown) {
        if (
          err &&
          typeof err === "object" &&
          "digest" in err &&
          typeof (err as { digest: string }).digest === "string" &&
          (err as { digest: string }).digest.startsWith("NEXT_")
        ) {
          throw err;
        }
        setError((err as Error).message ?? "Erro desconhecido.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {error && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10 }}>
          <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#dc2626", fontFamily: "var(--font-mono)", margin: 0 }}>Erro ao salvar template</p>
            <p style={{ fontSize: 12, color: "#dc2626", fontFamily: "var(--font-mono)", margin: "4px 0 0", opacity: 0.8 }}>{error}</p>
          </div>
        </div>
      )}

      {/* Nome */}
      <div>
        <label style={labelStyle}>Nome do Template</label>
        <input
          name="name"
          required
          defaultValue={template?.name ?? ""}
          style={inputStyle}
          placeholder="Ex: Tucho Intercooler"
        />
      </div>

      {/* Colunas */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Colunas da Tabela</label>
          <button
            type="button"
            onClick={addColumn}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: 8,
              background: "var(--blue)",
              color: "white",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "var(--font-mono)",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Plus size={13} />
            Adicionar Coluna
          </button>
        </div>

        {/* Colunas rápidas */}
        <div style={{ marginBottom: 14, padding: "12px 14px", background: "var(--bg)", borderRadius: 10, border: "1.5px solid var(--line)" }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-mute)", fontFamily: "var(--font-mono)", margin: "0 0 10px" }}>
            Adição rápida — clique para inserir
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {PRESET_COLUMNS.map((p) => {
              const added = columns.some((c) => c.key === p.col.key);
              return (
                <button
                  key={p.col.key}
                  type="button"
                  onClick={() => addPreset(p.col)}
                  disabled={added}
                  title={added ? "Já adicionada" : `Adicionar: ${p.col.label}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 12px",
                    borderRadius: 999,
                    border: added ? "1.5px solid var(--line)" : p.col.highlight ? "1.5px solid var(--blue)" : "1.5px solid var(--line)",
                    background: added ? "var(--line)" : p.col.highlight ? "rgba(28,155,215,0.1)" : "white",
                    color: added ? "var(--ink-mute)" : p.col.highlight ? "var(--blue)" : "var(--ink-mid)",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    cursor: added ? "default" : "pointer",
                    opacity: added ? 0.5 : 1,
                    transition: "opacity 0.15s",
                  }}
                >
                  {p.col.highlight && !added && <span style={{ fontSize: 10 }}>★</span>}
                  {added && <span style={{ fontSize: 10 }}>✓</span>}
                  {p.chip}
                </button>
              );
            })}
          </div>
        </div>

        {columns.length === 0 && (
          <p style={{ fontSize: 13, color: "var(--ink-mute)", fontFamily: "var(--font-mono)", textAlign: "center", padding: "24px 0", border: "1.5px dashed var(--line)", borderRadius: 10 }}>
            Nenhuma coluna adicionada. Clique em "Adicionar Coluna".
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {columns.map((col, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "28px 1fr 1fr auto 36px",
                gap: 8,
                alignItems: "center",
                padding: "10px 12px",
                background: "var(--bg)",
                borderRadius: 10,
                border: col.highlight ? "1.5px solid var(--blue)" : "1.5px solid var(--line)",
              }}
            >
              <GripVertical size={14} color="var(--ink-mute)" style={{ cursor: "grab" }} />

              <div>
                <input
                  placeholder="Título da coluna"
                  value={col.label}
                  onChange={(e) => updateLabel(index, e.target.value)}
                  style={{ ...inputStyle, fontSize: 13, padding: "8px 10px" }}
                />
              </div>

              <div>
                <input
                  placeholder="Chave (auto)"
                  value={col.key}
                  onChange={(e) => updateKey(index, e.target.value)}
                  style={{ ...inputStyle, fontSize: 12, padding: "8px 10px", color: "var(--ink-mid)" }}
                />
              </div>

              <button
                type="button"
                onClick={() => toggleHighlight(index)}
                title="Destacar em azul no site"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: col.highlight ? "1.5px solid var(--blue)" : "1.5px solid var(--line)",
                  background: col.highlight ? "var(--blue)" : "white",
                  color: col.highlight ? "white" : "var(--ink-mute)",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                ★
              </button>

              <button
                type="button"
                onClick={() => removeColumn(index)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}
                title="Remover coluna"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "var(--ink-mute)", fontFamily: "var(--font-mono)", marginTop: 8 }}>
          A "Chave" é preenchida automaticamente a partir do título. Você pode editar manualmente.
        </p>
      </div>

      {/* Botões */}
      <div style={{ display: "flex", gap: 12, paddingTop: 4 }}>
        <button
          type="submit"
          disabled={isPending}
          className="font-sans"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            borderRadius: 999,
            background: isPending ? "#94a3b8" : "var(--blue)",
            color: "white",
            fontSize: 14,
            fontWeight: 700,
            border: "none",
            cursor: isPending ? "not-allowed" : "pointer",
          }}
        >
          {isPending && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
          {isPending ? "Salvando…" : isNew ? "Criar Template" : "Salvar Alterações"}
        </button>
        <Link
          href="/admin/templates"
          className="font-sans"
          style={{ padding: "12px 24px", borderRadius: 999, border: "1.5px solid var(--line)", color: "var(--ink-mid)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}
        >
          Cancelar
        </Link>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
