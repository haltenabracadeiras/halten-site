"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "../../../lib/supabase";

type ColumnDef = { key: string; label: string; highlight?: boolean };

function parseColumns(formData: FormData): ColumnDef[] {
  const labels = formData.getAll("col_label") as string[];
  const keys = formData.getAll("col_key") as string[];
  const highlights = formData.getAll("col_highlight") as string[];
  return labels
    .map((label, i) => ({
      label: label.trim(),
      key: keys[i]?.trim() ?? "",
      highlight: highlights[i] === "true",
    }))
    .filter((c) => c.label && c.key);
}

export async function createTemplate(formData: FormData) {
  const db = getSupabaseAdmin();
  const name = (formData.get("name") as string).trim();
  const columns = parseColumns(formData);

  const { error } = await db.from("product_table_templates").insert({ name, columns });
  if (error) throw new Error(`Erro ao criar template: ${error.message}`);

  revalidatePath("/admin/templates");
  redirect("/admin/templates");
}

export async function updateTemplate(id: string, formData: FormData) {
  const db = getSupabaseAdmin();
  const name = (formData.get("name") as string).trim();
  const columns = parseColumns(formData);

  const { error } = await db.from("product_table_templates").update({ name, columns }).eq("id", id);
  if (error) throw new Error(`Erro ao atualizar template: ${error.message}`);

  revalidatePath("/admin/templates");
  redirect("/admin/templates");
}

export async function deleteTemplate(id: string) {
  const db = getSupabaseAdmin();
  await db.from("product_table_templates").delete().eq("id", id);
  revalidatePath("/admin/templates");
}

export async function duplicateTemplate(id: string) {
  const db = getSupabaseAdmin();
  const { data } = await db.from("product_table_templates").select("name, columns").eq("id", id).single();
  if (!data) throw new Error("Template não encontrado.");
  const { error } = await db.from("product_table_templates").insert({
    name: `${data.name} (cópia)`,
    columns: data.columns,
  });
  if (error) throw new Error(`Erro ao duplicar: ${error.message}`);
  revalidatePath("/admin/templates");
}
