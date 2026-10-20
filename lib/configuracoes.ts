import { unstable_cache } from "next/cache";
import { getSupabaseAdmin } from "./supabase";

/** Tag do cache das configurações: o salvar do admin (/admin/configuracoes) expira ela na hora. */
export const TAG_CONFIGURACOES = "configuracoes";

/** Só para o site não ficar sem botão de WhatsApp se o campo do admin estiver vazio ou o banco não responder. */
const WHATSAPP_RESERVA = "5545991517308";

export type ConfigSite = {
  /** Measurement ID do GA4 (G-XXXX), ou null se o campo estiver vazio/inválido */
  gaId: string | null;
  /** ID numérico do Meta Pixel, ou null se o campo estiver vazio/inválido */
  metaPixelId: string | null;
  /** número do WhatsApp comercial, só dígitos (DDI+DDD+número) */
  whatsapp: string;
};

/** Os IDs vão para dentro de um <script>: só passa o que tem o formato certo. */
function limparGaId(valor?: string) {
  const v = valor?.trim().toUpperCase() ?? "";
  return /^(G|GT|AW)-[A-Z0-9]+$/.test(v) ? v : null;
}

function limparPixelId(valor?: string) {
  const v = valor?.trim() ?? "";
  return /^\d{5,20}$/.test(v) ? v : null;
}

async function lerConfigSite(): Promise<ConfigSite> {
  let config: Record<string, string> = {};
  try {
    const { data } = await getSupabaseAdmin().from("configuracoes").select("key, value");
    config = Object.fromEntries((data ?? []).map((r: { key: string; value: string | null }) => [r.key, r.value ?? ""]));
  } catch {
    // banco fora do ar: o site segue sem GA/Pixel e com o WhatsApp de reserva
  }

  const whatsapp = (config.empresa_whatsapp ?? "").replace(/\D/g, "");
  return {
    gaId: limparGaId(config.ga_id ?? config.google_analytics_id),
    metaPixelId: limparPixelId(config.meta_pixel_id),
    whatsapp: whatsapp.length >= 10 ? whatsapp : WHATSAPP_RESERVA,
  };
}

/** Configurações do admin usadas no site todo. Cache de 60s; o admin expira na hora ao salvar. */
export const getConfigSite = unstable_cache(lerConfigSite, ["config-site"], {
  revalidate: 60,
  tags: [TAG_CONFIGURACOES],
});
