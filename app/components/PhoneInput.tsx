"use client";

import { useState } from "react";

function maskPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

interface Props {
  name: string;
  defaultValue?: string;
  required?: boolean;
}

export function PhoneInput({ name, defaultValue = "", required }: Props) {
  const [display, setDisplay] = useState(maskPhone(defaultValue));

  return (
    <div style={{ display: "flex", borderRadius: 10, border: "1px solid var(--line)", overflow: "hidden" }}>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 12px",
          background: "var(--bg)",
          fontSize: 14,
          fontFamily: "var(--font-mono)",
          color: "var(--ink-dim)",
          borderRight: "1px solid var(--line)",
          flexShrink: 0,
        }}
      >
        +55
      </span>
      <input
        type="tel"
        name={name}
        value={display}
        onChange={(e) => setDisplay(maskPhone(e.target.value))}
        placeholder="(45) 9 9999-9999"
        required={required}
        style={{
          flex: 1,
          padding: "10px 14px",
          border: "none",
          fontSize: 14,
          fontFamily: "var(--font-mono)",
          color: "var(--ink)",
          background: "white",
          outline: "none",
        }}
      />
    </div>
  );
}
