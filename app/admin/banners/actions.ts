"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "../../../lib/supabase";

async function uploadToStorage(file: File, bucket: string): Promise<string> {
  const db = getSupabaseAdmin();

  // Garante que o bucket existe (pública para leitura anônima)
  const { error: bucketErr } = await db.storage.createBucket(bucket, { public: true });
  if (bucketErr && !bucketErr.message.includes("already exists")) {
    console.error("[banners/actions] Erro ao criar bucket:", bucketErr.message);
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  console.log("[banners/actions] Fazendo upload para storage:", { bucket, path, size: file.size, type: file.type });

  const { error: uploadErr } = await db.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (uploadErr) {
    console.error("[banners/actions] Erro no upload:", uploadErr);
    throw new Error(`Falha no upload da imagem: ${uploadErr.message}`);
  }

  const { data } = db.storage.from(bucket).getPublicUrl(path);
  console.log("[banners/actions] Upload ok, URL pública:", data.publicUrl);
  return data.publicUrl;
}

async function resolveImageUrl(formData: FormData): Promise<string> {
  const imageFile = formData.get("image_file");
  const existingUrl = (formData.get("image_url_existing") as string) ?? "";

  console.log("[banners/actions] resolveImageUrl:", {
    imageFileType: imageFile instanceof File ? "File" : typeof imageFile,
    imageFileSize: imageFile instanceof File ? imageFile.size : "n/a",
    existingUrl,
  });

  if (imageFile instanceof File && imageFile.size > 0) {
    return uploadToStorage(imageFile, "banners");
  }

  return existingUrl;
}

export async function createBanner(formData: FormData) {
  console.log("[banners/actions] createBanner iniciado");

  const db = getSupabaseAdmin();
  let imageUrl: string;

  try {
    imageUrl = await resolveImageUrl(formData);
  } catch (err) {
    console.error("[banners/actions] Falha em resolveImageUrl:", err);
    throw err;
  }

  const payload = {
    title: (formData.get("title") as string) || "",   // "" passa NOT NULL; null quebraria
    subtitle: (formData.get("subtitle") as string) || null,
    cta_text: (formData.get("cta_text") as string) || null,
    cta_link: (formData.get("cta_link") as string) || null,
    image_url: imageUrl || null,
    position: Number(formData.get("position")) || 0,
    active: formData.get("active") === "true",
  };

  console.log("[banners/actions] Inserindo no banco:", payload);

  const { error: dbErr } = await db.from("banners").insert(payload);

  if (dbErr) {
    console.error("[banners/actions] Erro no insert:", dbErr);
    throw new Error(`Erro ao salvar no banco: ${dbErr.message}`);
  }

  console.log("[banners/actions] Banner salvo com sucesso, redirecionando...");

  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function updateBanner(id: string, formData: FormData) {
  console.log("[banners/actions] updateBanner iniciado:", id);

  const db = getSupabaseAdmin();
  let imageUrl: string;

  try {
    imageUrl = await resolveImageUrl(formData);
  } catch (err) {
    console.error("[banners/actions] Falha em resolveImageUrl:", err);
    throw err;
  }

  const payload = {
    title: (formData.get("title") as string) || "",
    subtitle: (formData.get("subtitle") as string) || null,
    cta_text: (formData.get("cta_text") as string) || null,
    cta_link: (formData.get("cta_link") as string) || null,
    image_url: imageUrl || null,
    position: Number(formData.get("position")) || 0,
    active: formData.get("active") === "true",
  };

  console.log("[banners/actions] Atualizando no banco:", payload);

  const { error: dbErr } = await db.from("banners").update(payload).eq("id", id);

  if (dbErr) {
    console.error("[banners/actions] Erro no update:", dbErr);
    throw new Error(`Erro ao atualizar no banco: ${dbErr.message}`);
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function deleteBanner(id: string) {
  const db = getSupabaseAdmin();
  await db.from("banners").delete().eq("id", id);
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function toggleBannerActive(id: string, current: boolean) {
  const db = getSupabaseAdmin();
  await db.from("banners").update({ active: !current }).eq("id", id);
  revalidatePath("/admin/banners");
  revalidatePath("/");
}
