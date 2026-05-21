"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { getSupabaseAdmin } from "../../../lib/supabase";

async function toWebP(file: File): Promise<Buffer> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return sharp(buffer)
    .webp({ quality: 85 })
    .toBuffer();
}

async function uploadToStorage(file: File, bucket: string): Promise<string> {
  const db = getSupabaseAdmin();

  await db.storage.createBucket(bucket, { public: true }).catch(() => {});

  const webpBuffer = await toWebP(file);
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

  const { error } = await db.storage.from(bucket).upload(path, webpBuffer, {
    contentType: "image/webp",
    upsert: false,
  });

  if (error) throw new Error(`Falha no upload: ${error.message}`);

  const { data } = db.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function buildImages(formData: FormData): Promise<string[]> {
  const existingRaw = (formData.get("existing_images") as string) || "[]";
  const existing: string[] = JSON.parse(existingRaw);

  const newFiles = formData.getAll("new_images") as File[];
  const uploaded = await Promise.all(
    newFiles.filter((f) => f instanceof File && f.size > 0).map((f) => uploadToStorage(f, "products"))
  );

  return [...existing, ...uploaded];
}

export async function createProduct(formData: FormData) {
  const db = getSupabaseAdmin();
  const name = formData.get("name") as string;
  const images = await buildImages(formData);

  const { data } = await db.from("products").insert({
    name,
    slug: ((formData.get("slug") as string) || toSlug(name)).trim(),
    category: (formData.get("category") as string) || null,
    excerpt: (formData.get("excerpt") as string) || null,
    description: (formData.get("description") as string) || null,
    images,
    featured: formData.get("featured") === "true",
    active: formData.get("active") === "true",
    position: Number(formData.get("position")) || 0,
    cnpj_required: formData.get("cnpj_required") === "true",
    whatsapp_text: (formData.get("whatsapp_text") as string) || null,
  }).select("id").single();

  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  revalidatePath("/");
  redirect(data?.id ? `/admin/produtos/${data.id}` : "/admin/produtos");
}

export async function updateProduct(id: string, formData: FormData) {
  const db = getSupabaseAdmin();
  const name = formData.get("name") as string;
  const images = await buildImages(formData);

  await db
    .from("products")
    .update({
      name,
      slug: ((formData.get("slug") as string) || toSlug(name)).trim(),
      category: (formData.get("category") as string) || null,
      excerpt: (formData.get("excerpt") as string) || null,
      description: (formData.get("description") as string) || null,
      images,
      featured: formData.get("featured") === "true",
      active: formData.get("active") === "true",
      position: Number(formData.get("position")) || 0,
      cnpj_required: formData.get("cnpj_required") === "true",
      whatsapp_text: (formData.get("whatsapp_text") as string) || null,
    })
    .eq("id", id);

  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  revalidatePath("/");
  redirect("/admin/produtos");
}

export async function deleteProduct(id: string) {
  const db = getSupabaseAdmin();
  await db.from("products").delete().eq("id", id);
  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  revalidatePath("/");
}

export async function toggleProductFeatured(id: string, current: boolean) {
  const db = getSupabaseAdmin();
  await db.from("products").update({ featured: !current }).eq("id", id);
  revalidatePath("/admin/produtos");
  revalidatePath("/");
}

export async function toggleProductActive(id: string, current: boolean) {
  const db = getSupabaseAdmin();
  await db.from("products").update({ active: !current }).eq("id", id);
  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  revalidatePath("/");
}
