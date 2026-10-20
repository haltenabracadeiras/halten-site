"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { lerEscolha, useEscolha } from "./consentimento";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const WHATSAPP_URL = /^(https?:\/\/)?(wa\.me|(api|web|chat)\.whatsapp\.com)(\/|$)|^whatsapp:/i;

const sinal = (sim: boolean) => (sim ? "granted" : "denied");

/** Clique que abre o WhatsApp: evento no GA4 e "Contact" no Meta Pixel — cada um só com a categoria aceita. */
export function rastrearCliqueWhatsapp(url: string) {
  const c = lerEscolha()?.categorias;
  if (c?.medicao) window.gtag?.("event", "clique_whatsapp", { link_url: url });
  if (c?.publicidade) window.fbq?.("track", "Contact");
}

/**
 * Google Analytics (gtag.js) e Meta Pixel com os IDs do admin, mais o rastreio de todo clique em link de WhatsApp.
 * Cada ferramenta só carrega depois que a pessoa aceita a categoria dela no banner de cookies (consentimento.tsx);
 * mesmo assim o consentimento é declarado antes: Consent Mode v2 "denied" antes do config e fbq revoke antes do init.
 * Links que passam por redirecionamento (ex.: /links/go/[id]) informam o destino em data-destino;
 * links com data-sem-rastreio (ex.: crédito do desenvolvedor no rodapé) não contam.
 */
export function Rastreamento({ gaId, metaPixelId }: { gaId: string | null; metaPixelId: string | null }) {
  const pathname = usePathname();
  const noAdmin = pathname?.startsWith("/admin") ?? false;
  const escolha = useEscolha();
  const medicao = escolha?.categorias.medicao ?? false;
  const publicidade = escolha?.categorias.publicidade ?? false;

  useEffect(() => {
    function aoClicar(e: MouseEvent) {
      if (e.type === "auxclick" && e.button !== 1) return; // só o botão do meio (abre em outra aba)
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.hasAttribute("data-sem-rastreio")) return;
      const destino = link.dataset.destino || link.href;
      if (WHATSAPP_URL.test(destino)) rastrearCliqueWhatsapp(destino);
    }
    document.addEventListener("click", aoClicar, true);
    document.addEventListener("auxclick", aoClicar, true);
    return () => {
      document.removeEventListener("click", aoClicar, true);
      document.removeEventListener("auxclick", aoClicar, true);
    };
  }, []);

  // mudou a escolha com as ferramentas já carregadas (pelo "Preferências de cookies"): avisa cada uma
  useEffect(() => {
    // trava oficial do GA: com medição recusada, o gtag.js não envia nada
    if (gaId) (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = !medicao;
    window.gtag?.("consent", "update", {
      analytics_storage: sinal(medicao),
      ad_storage: sinal(publicidade),
      ad_user_data: sinal(publicidade),
      ad_personalization: sinal(publicidade),
    });
    window.fbq?.("consent", publicidade ? "grant" : "revoke");
  }, [gaId, medicao, publicidade]);

  if (noAdmin) return null;

  return (
    <>
      {gaId && medicao && (
        <>
          <Script id="ga-gtag" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
window.gtag = function () { window.dataLayer.push(arguments); };
window.gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
window.gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: '${sinal(publicidade)}', ad_user_data: '${sinal(publicidade)}', ad_personalization: '${sinal(publicidade)}' });
window.gtag('js', new Date());
window.gtag('config', '${gaId}');`}
          </Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
        </>
      )}
      {metaPixelId && publicidade && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('consent', 'revoke');
fbq('init', '${metaPixelId}');
fbq('consent', 'grant');
fbq('track', 'PageView');`}
        </Script>
      )}
    </>
  );
}
