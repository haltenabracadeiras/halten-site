"use client";

import { useRef, useState, useTransition } from "react";
import { FileSpreadsheet, Loader2, Trash2, Check, AlertCircle } from "lucide-react";
import * as XLSX from "xlsx";
import { saveProductTable, deleteProductTable } from "./table-actions";

type ColumnDef = { key: string; label: string; highlight?: boolean };
type Template = { id: string; name: string; columns: ColumnDef[] };
type ExistingTable = { id: string; template_id: string | null; rows: Record<string, string>[] };

const MM_REGEX = /(\d+(?:[.,]\d+)?)\s*[xX]\s*(\d+(?:[.,]\d+)?)\s*[Mm][Mm]/;
// Matches inch notation inside parens: (5/16"X1/2") (1.1/4"X1.1/2") (1 1/4"X1 1/2")
const POL_REGEX = /\(\s*((?:\d+\/\d+|\d+(?:\.\d+\/\d+|\s+\d+\/\d+)?))\s*[""']\s*[xX]\s*((?:\d+\/\d+|\d+(?:\.\d+\/\d+|\s+\d+\/\d+)?))\s*[""']/;

function isMinMmCol(col: ColumnDef) {
  const t = (col.key + " " + col.label).toLowerCase();
  return (t.includes("min") || t.includes("mín")) && !t.includes("pol");
}
function isMaxMmCol(col: ColumnDef) {
  const t = (col.key + " " + col.label).toLowerCase();
  return (t.includes("max") || t.includes("máx")) && !t.includes("pol");
}
function isMinPolCol(col: ColumnDef) {
  const t = (col.key + " " + col.label).toLowerCase();
  return (t.includes("min") || t.includes("mín")) && t.includes("pol");
}
function isMaxPolCol(col: ColumnDef) {
  const t = (col.key + " " + col.label).toLowerCase();
  return (t.includes("max") || t.includes("máx")) && t.includes("pol");
}

type Props = {
  productId: string;
  templates: Template[];
  existingTable?: ExistingTable | null;
};

function parseTableConfig(existingTable: ExistingTable | null | undefined) {
  const allRows = existingTable?.rows ?? [];
  const configRow = allRows.find(r => "__config__" in r);
  if (!configRow) return { rows: allRows, extraCols: [] as ColumnDef[], labelOverrides: {} as Record<string, string> };
  try {
    const config = JSON.parse(String(configRow.__config__));
    return {
      rows: allRows.filter(r => !("__config__" in r)),
      extraCols: (config.extraCols ?? []) as ColumnDef[],
      labelOverrides: (config.labelOverrides ?? {}) as Record<string, string>,
    };
  } catch {
    return { rows: allRows.filter(r => !("__config__" in r)), extraCols: [] as ColumnDef[], labelOverrides: {} as Record<string, string> };
  }
}

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

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid var(--line)",
  borderRadius: 10,
  fontSize: 14,
  fontFamily: "var(--font-mono)",
  color: "var(--ink)",
  background: "white",
  outline: "none",
};

export function ProductTableSection({ productId, templates, existingTable }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  // Seleciona template inicial (o da tabela existente ou o primeiro disponível)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    existingTable?.template_id ?? templates[0]?.id ?? ""
  );

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  // Rows: começa com as existentes, se houver
  const _parsed = parseTableConfig(existingTable);
  const [rows, setRows] = useState<Record<string, string>[]>(_parsed.rows);
  const [extraColumns, setExtraColumns] = useState<ColumnDef[]>(_parsed.extraCols);
  const [labelOverrides, setLabelOverrides] = useState<Record<string, string>>(_parsed.labelOverrides);
  const [editingColKey, setEditingColKey] = useState<string | null>(null);
  const [rawData, setRawData] = useState<string[][]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [autoExtract, setAutoExtract] = useState(false);
  const [fillTarget, setFillTarget] = useState<{ key: string; label: string; value: string } | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const allColumns: ColumnDef[] = selectedTemplate
    ? [
        ...selectedTemplate.columns.map(c => ({ ...c, label: labelOverrides[c.key] ?? c.label })),
        ...extraColumns,
      ]
    : [];

  function handleCellKey(e: React.KeyboardEvent<HTMLInputElement>, rowIdx: number, colIdx: number) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const target = e.key === "ArrowDown" ? rowIdx + 1 : rowIdx - 1;
    if (target < 0 || target >= rows.length) return;
    const table = (e.target as HTMLInputElement).closest("table");
    const cell = table?.querySelectorAll("tbody tr")[target]?.querySelectorAll("input")[colIdx];
    (cell as HTMLInputElement | undefined)?.focus();
  }

  function applyFill() {
    if (!fillTarget) return;
    setRows(prev => prev.map(row => ({ ...row, [fillTarget.key]: fillTarget.value })));
    setFillTarget(null);
  }

  function updateCell(rowIdx: number, key: string, value: string) {
    setRows(prev => {
      const next = [...prev];
      next[rowIdx] = { ...next[rowIdx], [key]: value };
      return next;
    });
  }

  function handleDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) return;
    setRows(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(targetIdx, 0, moved);
      return next;
    });
    setDragIdx(null);
    setDragOverIdx(null);
  }

  function addRow() {
    if (!selectedTemplate) return;
    const empty: Record<string, string> = {};
    allColumns.forEach((col) => { empty[col.key] = ""; });
    setRows(prev => [...prev, empty]);
  }

  function removeRow(idx: number) {
    setRows(prev => prev.filter((_, i) => i !== idx));
  }

  function parseRaw(raw: string[][], template: Template, extract: boolean) {
    const parsed: Record<string, string>[] = [];
    const cols = template.columns;

    for (let rowIdx = 1; rowIdx < raw.length; rowIdx++) {
      const excelRow = raw[rowIdx];
      if (!excelRow || excelRow.every((cell) => !cell)) continue;

      const obj: Record<string, string> = {};

      if (extract) {
        const nameCell = String(excelRow[0] ?? "");
        const mmMatch = nameCell.match(MM_REGEX);
        const mmMin = mmMatch ? mmMatch[1] : "";
        const mmMax = mmMatch ? mmMatch[2] : "";
        const polMatch = nameCell.match(POL_REGEX);
        const polMin = polMatch ? polMatch[1].trim() : "";
        const polMax = polMatch ? polMatch[2].trim() : "";
        const dataCols = excelRow.slice(1);
        let dataIdx = 0;

        cols.forEach((col) => {
          if (isMinMmCol(col)) {
            obj[col.key] = mmMin;
          } else if (isMaxMmCol(col)) {
            obj[col.key] = mmMax;
          } else if (isMinPolCol(col)) {
            obj[col.key] = polMin;
          } else if (isMaxPolCol(col)) {
            obj[col.key] = polMax;
          } else {
            obj[col.key] = String(dataCols[dataIdx++] ?? "").trim();
          }
        });
      } else {
        cols.forEach((col, colIdx) => {
          obj[col.key] = String(excelRow[colIdx] ?? "").trim();
        });
      }

      parsed.push(obj);
    }
    return parsed;
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !selectedTemplate) return;
    setError(null);
    setSuccess(false);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = ev.target?.result;
        const wb = XLSX.read(data, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1 }) as string[][];

        setRawData(raw);
        setRows(parseRaw(raw, selectedTemplate, autoExtract));
        setFileName(file.name);
      } catch {
        setError("Erro ao ler o arquivo Excel. Verifique o formato.");
      }
    };
    reader.readAsBinaryString(file);
  }

  function handleSave() {
    if (!rows.length) {
      setError("Nenhuma linha para salvar.");
      return;
    }
    setError(null);
    setSuccess(false);

    const hasConfig = extraColumns.length > 0 || Object.keys(labelOverrides).length > 0;
    const rowsToSave: Record<string, string>[] = hasConfig
      ? [{ __config__: JSON.stringify({ extraCols: extraColumns, labelOverrides }) }, ...rows]
      : rows;

    startTransition(async () => {
      try {
        await saveProductTable(productId, selectedTemplateId || null, rowsToSave);
        setSuccess(true);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  function exportExcel() {
    if (!selectedTemplate || !rows.length) return;
    const header = allColumns.map((c) => c.label);
    const data = rows.map((row) => allColumns.map((c) => row[c.key] ?? ""));
    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tabela");
    XLSX.writeFile(wb, `tabela-${selectedTemplate.name.toLowerCase().replace(/\s+/g, "-")}.xlsx`);
  }

  function exportPDF() {
    if (!selectedTemplate || !rows.length) return;
    const cols = allColumns;
    const headerCells = cols.map((c) => `<th>${c.label}</th>`).join("");
    const bodyRows = rows.map((row) =>
      `<tr>${cols.map((c) => `<td style="${c.highlight ? "color:#1c9bd7;font-weight:700" : ""}">${row[c.key] ?? "—"}</td>`).join("")}</tr>`
    ).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Tabela — ${selectedTemplate.name}</title>
    <style>
      body { font-family: monospace; padding: 32px; color: #0f1923; }
      h2 { font-family: sans-serif; font-size: 18px; margin: 0 0 6px; }
      p { font-size: 11px; color: #888; margin: 0 0 20px; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      thead tr { background: #0f1923; }
      th { padding: 10px 14px; text-align: left; color: white; font-size: 10px; letter-spacing: .08em; text-transform: uppercase; white-space: nowrap; }
      td { padding: 9px 14px; border-bottom: 1px solid #e5e7eb; }
      tr:nth-child(even) td { background: #f8fafc; }
      @media print { body { padding: 0; } }
    </style></head><body>
    <h2>${selectedTemplate.name}</h2>
    <p>Halten Abraçadeiras · Tabela Técnica</p>
    <table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>
    <script>window.onload=()=>{window.print();}<\/script>
    </body></html>`;

    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); }
  }

  function handleDelete() {
    if (!confirm("Remover a tabela técnica deste produto?")) return;
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      try {
        await deleteProductTable(productId);
        setRows([]);
        setFileName(null);
        setSuccess(false);
      } catch (err) {
        setError((err as Error).message);
      }
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Feedback */}
      {error && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10 }}>
          <AlertCircle size={15} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 13, color: "#dc2626", fontFamily: "var(--font-mono)", margin: 0 }}>{error}</p>
        </div>
      )}
      {success && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10 }}>
          <Check size={15} color="#16a34a" />
          <p style={{ fontSize: 13, color: "#16a34a", fontFamily: "var(--font-mono)", margin: 0 }}>Tabela salva com sucesso!</p>
        </div>
      )}

      {/* Seleção de template */}
      {templates.length === 0 ? (
        <p style={{ fontSize: 13, color: "var(--ink-mute)", fontFamily: "var(--font-mono)" }}>
          Nenhum template cadastrado. Crie um em{" "}
          <a href="/admin/templates" style={{ color: "var(--blue)" }}>Templates de Tabela</a>.
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Template de Colunas</label>
            <select
              value={selectedTemplateId}
              onChange={(e) => {
                const newId = e.target.value;
                setSelectedTemplateId(newId);
                const newTemplate = templates.find((t) => t.id === newId);
                if (rawData.length && newTemplate) {
                  setRows(parseRaw(rawData, newTemplate, autoExtract));
                } else {
                  setRows([]);
                }
              }}
              style={selectStyle}
            >
              <option value="">— Sem template —</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={labelStyle}>Arquivo Excel (.xlsx / .xls)</label>

            {/* Toggle auto-extract */}
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={autoExtract}
                onChange={(e) => {
                  const val = e.target.checked;
                  setAutoExtract(val);
                  if (rawData.length && selectedTemplate) {
                    setRows(parseRaw(rawData, selectedTemplate, val));
                  }
                }}
                style={{ width: 15, height: 15, accentColor: "var(--blue)", cursor: "pointer" }}
              />
              <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--ink-mid)" }}>
                Extrair dimensões automaticamente do nome (col A)
              </span>
            </label>

            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFile}
              style={{ display: "none" }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                borderRadius: 10,
                border: "1.5px solid var(--line)",
                background: "var(--bg)",
                fontSize: 13,
                fontFamily: "var(--font-mono)",
                color: "var(--ink-mid)",
                cursor: "pointer",
                width: "100%",
              }}
            >
              <FileSpreadsheet size={15} color="var(--blue)" />
              {fileName ?? "Selecionar arquivo…"}
            </button>
          </div>
        </div>
      )}

      {/* Preview da tabela */}
      {selectedTemplate && rows.length > 0 && (
        <div>
          <label style={{ ...labelStyle, marginBottom: 10 }}>
            Preview — {rows.length} linha{rows.length !== 1 ? "s" : ""}
          </label>
          {/* Barra de preencher coluna */}
          {fillTarget && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--ink-mid)", whiteSpace: "nowrap" }}>
                Preencher <strong>{fillTarget.label}</strong> em todas as linhas:
              </span>
              <input
                autoFocus
                value={fillTarget.value}
                onChange={(e) => setFillTarget(prev => prev ? { ...prev, value: e.target.value } : null)}
                onKeyDown={(e) => { if (e.key === "Enter") applyFill(); if (e.key === "Escape") setFillTarget(null); }}
                placeholder="Digite o valor e pressione Enter…"
                style={{ flex: 1, padding: "6px 10px", border: "1.5px solid var(--blue)", borderRadius: 8, fontSize: 13, fontFamily: "var(--font-mono)", outline: "none" }}
              />
              <button type="button" onClick={applyFill} style={{ padding: "6px 14px", background: "var(--blue)", color: "white", border: "none", borderRadius: 8, fontSize: 12, fontFamily: "var(--font-mono)", cursor: "pointer", fontWeight: 700 }}>
                Aplicar
              </button>
              <button type="button" onClick={() => setFillTarget(null)} style={{ padding: "6px 10px", background: "white", border: "1px solid var(--line)", borderRadius: 8, fontSize: 12, fontFamily: "var(--font-mono)", cursor: "pointer" }}>
                ✕
              </button>
            </div>
          )}

          <div style={{ overflowX: "auto", overflowY: "hidden", border: "1.5px solid var(--line)", borderRadius: 10 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "var(--font-mono)" }}>
              <thead>
                <tr style={{ background: "#1c9bd7" }}>
                  <th style={{ width: 28 }} />
                  {allColumns.map((col) => {
                    const isExtra = extraColumns.some(c => c.key === col.key);
                    return (
                      <th
                        key={col.key}
                        style={{
                          padding: "10px 12px",
                          textAlign: "left",
                          color: "white",
                          fontWeight: 700,
                          letterSpacing: "0.04em",
                          whiteSpace: "nowrap",
                          userSelect: "none",
                        }}
                      >
                        {editingColKey === col.key ? (
                          <input
                            autoFocus
                            defaultValue={col.label}
                            onBlur={(e) => {
                              const newLabel = e.target.value.trim() || col.label;
                              if (isExtra) {
                                setExtraColumns(prev => prev.map(c => c.key === col.key ? { ...c, label: newLabel } : c));
                              } else {
                                setLabelOverrides(prev => ({ ...prev, [col.key]: newLabel }));
                              }
                              setEditingColKey(null);
                            }}
                            onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); if (e.key === "Escape") setEditingColKey(null); }}
                            style={{
                              background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.5)",
                              borderRadius: 4, color: "white", padding: "2px 6px", fontSize: 12,
                              fontFamily: "var(--font-mono)", fontWeight: 700, outline: "none",
                              minWidth: 80,
                            }}
                          />
                        ) : (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                            <span
                              title="Clique para preencher toda a coluna"
                              onClick={() => setFillTarget({ key: col.key, label: col.label, value: "" })}
                              style={{ cursor: "pointer" }}
                            >
                              {col.label}
                            </span>
                            <button
                              type="button"
                              title="Editar nome da coluna"
                              onClick={(e) => { e.stopPropagation(); setEditingColKey(col.key); }}
                              style={{
                                background: "none", border: "none", color: "rgba(255,255,255,0.65)",
                                cursor: "pointer", padding: "0 2px", fontSize: 11, lineHeight: 1,
                                display: "inline-flex", alignItems: "center",
                              }}
                            >
                              ✏
                            </button>
                            {isExtra && (
                              <button
                                type="button"
                                title="Remover coluna"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExtraColumns(prev => prev.filter(c => c.key !== col.key));
                                  setRows(prev => prev.map(r => { const { [col.key]: _, ...rest } = r; return rest; }));
                                }}
                                style={{
                                  background: "none", border: "none", color: "rgba(255,200,200,0.85)",
                                  cursor: "pointer", padding: "0 2px", fontSize: 14, lineHeight: 1,
                                }}
                              >
                                ×
                              </button>
                            )}
                          </span>
                        )}
                      </th>
                    );
                  })}
                  {/* Adicionar coluna */}
                  <th style={{ width: 44, paddingLeft: 4 }}>
                    <button
                      type="button"
                      title="Adicionar coluna"
                      onClick={() => {
                        const key = `c_${Date.now()}`;
                        setExtraColumns(prev => [...prev, { key, label: "Nova Coluna" }]);
                        setEditingColKey(key);
                        setRows(prev => prev.map(r => ({ ...r, [key]: "" })));
                      }}
                      style={{
                        width: 24, height: 24, borderRadius: "50%",
                        background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.45)",
                        color: "white", cursor: "pointer", display: "grid", placeItems: "center",
                        fontSize: 18, lineHeight: 1, fontWeight: 400,
                      }}
                    >
                      +
                    </button>
                  </th>
                  <th style={{ width: 32 }} />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    draggable
                    onDragStart={() => setDragIdx(i)}
                    onDragOver={(e) => { e.preventDefault(); setDragOverIdx(i); }}
                    onDrop={() => handleDrop(i)}
                    onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
                    style={{
                      background: dragOverIdx === i ? "#eff6ff" : i % 2 === 0 ? "white" : "#f8fafc",
                      opacity: dragIdx === i ? 0.4 : 1,
                      outline: dragOverIdx === i ? "2px solid #1c9bd7" : "none",
                      outlineOffset: -2,
                    }}
                  >
                    <td style={{ padding: "3px 4px", borderBottom: "1px solid var(--line)", textAlign: "center", cursor: "grab" }}>
                      <svg width="12" height="18" viewBox="0 0 12 18" fill="none" style={{ display: "block", margin: "0 auto" }}>
                        {[0,6,12].map(y => [2,8].map(x => (
                          <circle key={`${x}-${y}`} cx={x} cy={y + 3} r={1.5} fill="#94a3b8" />
                        )))}
                      </svg>
                    </td>
                    {allColumns.map((col, ci) => (
                      <td key={col.key} style={{ padding: "3px 6px", borderBottom: "1px solid var(--line)" }}>
                        <input
                          type="text"
                          value={row[col.key] ?? ""}
                          onChange={(e) => updateCell(i, col.key, e.target.value)}
                          style={{
                            width: "100%",
                            border: "none",
                            background: "transparent",
                            fontSize: 12,
                            fontFamily: "var(--font-mono)",
                            color: col.highlight ? "#1c9bd7" : "var(--ink)",
                            fontWeight: col.highlight ? 700 : 400,
                            outline: "none",
                            padding: "5px 6px",
                            borderRadius: 4,
                            minWidth: 60,
                          }}
                          onKeyDown={(e) => handleCellKey(e, i, ci)}
                          onFocus={(e) => (e.target.style.background = "#eff6ff")}
                          onBlur={(e) => (e.target.style.background = "transparent")}
                        />
                      </td>
                    ))}
                    <td style={{ padding: "3px 6px", borderBottom: "1px solid var(--line)", textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => removeRow(i)}
                        title="Remover linha"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#fca5a5",
                          lineHeight: 1,
                          padding: "4px 6px",
                          borderRadius: 4,
                          fontSize: 14,
                        }}
                        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#dc2626")}
                        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#fca5a5")}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={addRow}
            style={{
              marginTop: 8,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 16px",
              border: "1.5px dashed var(--blue)",
              borderRadius: 8,
              background: "transparent",
              color: "var(--blue)",
              fontSize: 12,
              fontFamily: "var(--font-mono)",
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            + Adicionar linha
          </button>
        </div>
      )}

      {/* Ações */}
      {templates.length > 0 && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending || rows.length === 0}
            className="font-sans"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "11px 24px",
              borderRadius: 999,
              background: rows.length === 0 || isPending ? "#94a3b8" : "var(--blue)",
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              border: "none",
              cursor: rows.length === 0 || isPending ? "not-allowed" : "pointer",
            }}
          >
            {isPending && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
            {isPending ? "Salvando…" : "Salvar Tabela"}
          </button>

          {rows.length > 0 && (
            <button
              type="button"
              onClick={exportExcel}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "11px 20px",
                borderRadius: 999,
                border: "1.5px solid #bbf7d0",
                color: "#16a34a",
                background: "white",
                fontSize: 13,
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
              }}
            >
              <FileSpreadsheet size={13} />
              Exportar Excel
            </button>
          )}

          {rows.length > 0 && (
            <button
              type="button"
              onClick={exportPDF}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "11px 20px",
                borderRadius: 999,
                border: "1.5px solid #bfdbfe",
                color: "#2563eb",
                background: "white",
                fontSize: 13,
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 18 15 15"/>
              </svg>
              Exportar PDF
            </button>
          )}

          {(existingTable || rows.length > 0) && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "11px 20px",
                borderRadius: 999,
                border: "1.5px solid #fecaca",
                color: "#dc2626",
                background: "white",
                fontSize: 13,
                fontFamily: "var(--font-mono)",
                cursor: isPending ? "not-allowed" : "pointer",
              }}
            >
              <Trash2 size={13} />
              Remover Tabela
            </button>
          )}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
