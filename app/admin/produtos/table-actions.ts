"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "../../../lib/supabase";

export async function saveProductTable(
  productId: string,
  templateId: string | null,
  rows: Record<string, string>[]
) {
  const db = getSupabaseAdmin();

  // Upsert — produto tem no máximo 1 tabela (UNIQUE constraint)
  const { error } = await db.from("product_tables").upsert(
    { product_id: productId, template_id: templateId || null, rows },
    { onConflict: "product_id" }
  );

  if (error) throw new Error(`Erro ao salvar tabela: ${error.message}`);

  revalidatePath(`/admin/produtos/${productId}`);
  revalidatePath("/produtos");
}

export async function deleteProductTable(productId: string) {
  const db = getSupabaseAdmin();
  await db.from("product_tables").delete().eq("product_id", productId);
  revalidatePath(`/admin/produtos/${productId}`);
}
