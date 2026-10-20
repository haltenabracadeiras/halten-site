"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getSupabaseAdmin } from "../../../lib/supabase";
import { TAG_CONFIGURACOES } from "../../../lib/configuracoes";

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

  // GA, Pixel e WhatsApp são lidos no layout raiz: expira o cache delas e refaz todas as páginas
  updateTag(TAG_CONFIGURACOES);
  revalidatePath("/", "layout");
}
