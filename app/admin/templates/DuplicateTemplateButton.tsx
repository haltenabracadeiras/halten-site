"use client";

import { Copy } from "lucide-react";
import { duplicateTemplate } from "./actions";

export function DuplicateTemplateButton({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        await duplicateTemplate(id);
      }}
    >
      <button
        type="submit"
        title="Duplicar template"
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
          background: "white",
          cursor: "pointer",
        }}
      >
        <Copy size={12} />
        Duplicar
      </button>
    </form>
  );
}
