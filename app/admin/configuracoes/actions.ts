"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "../../../lib/supabase";

export async function saveConfiguracoes(formData: FormData) {
  const db = getSupabaseAdmin();

  const fields = [
    // Integrações
    "ga_id",
    "meta_pixel_id",
    // WhatsApp e CNPJ
    "empresa_whatsapp",
    "cnpj_aviso_ativo",
    // Empresa
    "empresa_nome",
    "empresa_cnpj",
    "empresa_telefone",
    "empresa_email",
    "empresa_endereco",
    "empresa_cidade",
    "empresa_cep",
    // Redes sociais
    "empresa_instagram",
    "empresa_linkedin",
    // SEO
    "seo_titulo",
    "seo_descricao",
    "seo_keywords",
  ];

  for (const key of fields) {
    const value = formData.get(key) as string;
    await db
      .from("configuracoes")
      .upsert({ key, value }, { onConflict: "key" });
  }

  revalidatePath("/admin/configuracoes");
  revalidatePath("/");
}
