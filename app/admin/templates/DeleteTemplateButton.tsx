"use client";

import { Trash2 } from "lucide-react";
import { deleteTemplate } from "./actions";

export function DeleteTemplateButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={async () => {
        if (!confirm(`Excluir template "${name}"?`)) return;
        await deleteTemplate(id);
      }}
    >
      <button
        type="submit"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 14px",
          borderRadius: 8,
          border: "1.5px solid #fecaca",
          fontSize: 12,
          fontFamily: "var(--font-mono)",
          color: "#dc2626",
          background: "white",
          cursor: "pointer",
        }}
      >
        <Trash2 size={12} />
        Excluir
      </button>
    </form>
  );
}
