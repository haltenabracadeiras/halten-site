"use client";

import { useState } from "react";
import { STATE_REGIONS } from "../representantes/states";

interface Props {
  /** Valor atual da região (ex: "Oeste e Sudoeste"). Vazio = não atua em região específica. */
  defaultValue?: string;
}

function parse(value: string): string[] {
  return value
    ? value.split(" e ").map((r) => r.trim()).filter(Boolean)
    : [];
}

/**
 * Campo opcional de região interna do estado.
 * Quando marcado, revela os botões de região (Norte, Sul, Leste...) e grava
 * a seleção no input oculto `regiao` (várias regiões juntadas por " e ").
 * Usado para distinguir representantes que dividem o mesmo estado.
 */
export function RegionField({ defaultValue = "" }: Props) {
  const initial = parse(defaultValue);
  const [enabled, setEnabled] = useState(initial.length > 0);
  const [selected, setSelected] = useState<string[]>(initial);

  const toggle = (region: string) =>
    setSelected((cur) =>
      cur.includes(region) ? cur.filter((r) => r !== region) : [...cur, region]
    );

  const value = enabled ? selected.join(" e ") : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input type="hidden" name="regiao" value={value} />

      <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          style={{ width: 16, height: 16, accentColor: "var(--blue)", cursor: "pointer" }}
        />
        <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--ink-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Atua em região específica do estado
        </span>
      </label>

      {enabled && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {STATE_REGIONS.map((region) => {
            const active = selected.includes(region);
            return (
              <button
                key={region}
                type="button"
                onClick={() => toggle(region)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 999,
                  border: `1px solid ${active ? "var(--blue)" : "var(--line)"}`,
                  background: active ? "rgba(28,155,215,0.1)" : "white",
                  color: active ? "var(--blue)" : "var(--ink-mid)",
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {region}
              </button>
            );
          })}
        </div>
      )}

      {enabled && selected.length > 0 && (
        <p style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--ink-mid)", margin: 0 }}>
          Região: <strong style={{ color: "var(--ink)" }}>{selected.join(" e ")}</strong>
        </p>
      )}
    </div>
  );
}
