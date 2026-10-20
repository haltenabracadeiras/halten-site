"use client";

import { createContext, useContext } from "react";

/** Número do WhatsApp comercial do admin, lido no layout raiz (getConfigSite) e repassado aos componentes de cliente. */
const WhatsappContext = createContext<string>("");

export function ConfigSiteProvider({ whatsapp, children }: { whatsapp: string; children: React.ReactNode }) {
  return <WhatsappContext.Provider value={whatsapp}>{children}</WhatsappContext.Provider>;
}

/** Número do WhatsApp comercial (só dígitos), como está em Admin → Configurações. */
export function useWhatsapp() {
  return useContext(WhatsappContext);
}
