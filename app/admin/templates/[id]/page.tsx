import { notFound } from "next/navigation";
import { getSupabaseAdmin } from "../../../../lib/supabase";
import { TemplateForm } from "../TemplateForm";
import { updateTemplate } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getSupabaseAdmin();
  const { data: template } = await db.from("product_table_templates").select("*").eq("id", id).single();

  if (!template) notFound();

  const boundAction = updateTemplate.bind(null, id);

  return (
    <div style={{ padding: "40px 48px", maxWidth: 760 }}>
      <h1 className="font-sans" style={{ fontSize: 22, fontWeight: 800, color: "var(--ink)", margin: "0 0 8px" }}>
        Editar Template
      </h1>
      <p style={{ fontSize: 13, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", marginBottom: 32 }}>
        {template.name}
      </p>
      <div style={{ background: "white", borderRadius: 16, border: "1.5px solid var(--line)", padding: "32px" }}>
        <TemplateForm template={template} action={boundAction} />
      </div>
    </div>
  );
}
