"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "../../../lib/supabase";

function normalizeWhatsapp(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.startsWith("55") ? digits : `55${digits}`;
}

/** Campo de texto opcional: string vazia vira null para não poluir o banco. */
function optionalText(raw: FormDataEntryValue | null): string | null {
  const value = (raw as string | null)?.trim();
  return value ? value : null;
}

export async function createRepresentative(formData: FormData) {
  const db = getSupabaseAdmin();
  const name = formData.get("name") as string;
  const whatsapp = normalizeWhatsapp(formData.get("whatsapp") as string);
  const state = formData.get("state") as string;
  const email = optionalText(formData.get("email"));
  const regiao = optionalText(formData.get("regiao"));

  const { error } = await db.from("representatives").insert({ name, whatsapp, state, email, regiao });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/representantes");
  revalidatePath("/representantes");
  redirect("/admin/representantes");
}

export async function updateRepresentative(id: string, formData: FormData) {
  const db = getSupabaseAdmin();
  const name = formData.get("name") as string;
  const whatsapp = normalizeWhatsapp(formData.get("whatsapp") as string);
  const state = formData.get("state") as string;
  const email = optionalText(formData.get("email"));
  const regiao = optionalText(formData.get("regiao"));

  const { error } = await db.from("representatives").update({ name, whatsapp, state, email, regiao }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/representantes");
  revalidatePath("/representantes");
  redirect("/admin/representantes");
}

export async function deleteRepresentative(id: string) {
  const db = getSupabaseAdmin();
  const { error } = await db.from("representatives").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/representantes");
  revalidatePath("/representantes");
}

export async function toggleRepresentativeActive(id: string, current: boolean) {
  const db = getSupabaseAdmin();
  const { error } = await db.from("representatives").update({ active: !current }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/representantes");
  revalidatePath("/representantes");
}
