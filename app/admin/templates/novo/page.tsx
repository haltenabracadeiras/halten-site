import { TemplateForm } from "../TemplateForm";
import { createTemplate } from "../actions";

export default function NovoTemplatePage() {
  return (
    <div style={{ padding: "40px 48px", maxWidth: 760 }}>
      <h1 className="font-sans" style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)", margin: "0 0 8px" }}>
        Novo Template de Tabela
      </h1>
      <p style={{ fontSize: 13, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", marginBottom: 32 }}>
        Defina o nome e as colunas do template.
      </p>
      <div style={{ background: "white", borderRadius: 16, border: "1.5px solid var(--line)", padding: "32px" }}>
        <TemplateForm action={createTemplate} isNew />
      </div>
    </div>
  );
}
