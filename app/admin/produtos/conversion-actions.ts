"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "../../../lib/supabase";

type ConversionRow = { codigo_halten: string; codigos_originais: string };

export async function saveProductConversions(productId: string, rows: ConversionRow[]) {
  const db = getSupabaseAdmin();

  const { error } = await db.from("product_conversions").upsert(
    { product_id: productId, rows },
    { onConflict: "product_id" }
  );

  if (error) throw new Error(`Erro ao salvar conversões: ${error.message}`);

  revalidatePath(`/admin/produtos/${productId}`);
  revalidatePath("/produtos");
}

export async function deleteProductConversions(productId: string) {
  const db = getSupabaseAdmin();
  await db.from("product_conversions").delete().eq("product_id", productId);
  revalidatePath(`/admin/produtos/${productId}`);
}
