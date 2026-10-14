import { getSupabaseAdmin } from "../../../lib/supabase";
import { ROTAS } from "../_partes/contato";

const CATALOGO_EXTERNO = "https://www.baixecatalogo.com.br/catalogo/halten-abracadeiras";

/**
 * O catálogo digital é o link "catálogo" ativo do admin de Links (a revista em PDF).
 * Trocar o PDF lá muda o catálogo aqui também. Sem ele, cai no catálogo externo.
 */
export async function linkDoCatalogo(): Promise<{ href: string; externo: boolean }> {
  try {
    const { data } = await getSupabaseAdmin()
      .from("links")
      .select("id")
      .eq("icon", "catalogo")
      .eq("active", true)
      .order("position", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (data?.id) return { href: ROTAS.catalogo(data.id), externo: false };
  } catch {}
  return { href: CATALOGO_EXTERNO, externo: true };
}
