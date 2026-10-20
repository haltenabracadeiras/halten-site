import type { Metadata } from "next";
import { Syne, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "./providers";
import { CartProvider } from "./context/cart-context";
import { CartDrawer } from "./components/cart-drawer";
import { PageTracker } from "./components/page-tracker";
import { ConfigSiteProvider } from "./components/config-site";
import { Rastreamento } from "./components/rastreamento";
import { BannerCookies } from "./components/consentimento";
import { getConfigSite } from "../lib/configuracoes";

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-syne",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://haltenabracadeiras.ind.br"),
  title: "Halten Abraçadeiras",
  description:
    "Soluções industriais em abraçadeiras e acessórios com catalogação moderna.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Halten Abraçadeiras",
  },
  twitter: {
    card: "summary_large_image",
  },
};

// GA, Pixel e WhatsApp vêm do admin: as páginas estáticas se refazem a cada 60s no máximo
// (e na hora, quando o admin salva as configurações — ver app/admin/configuracoes/actions.ts)
export const revalidate = 60;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getConfigSite();

  return (
    <html
      lang="pt-BR"
      className={`${syne.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ConfigSiteProvider whatsapp={config.whatsapp}>
          <CartProvider>
            <PageTracker />
            <LenisProvider>{children}</LenisProvider>
            <CartDrawer />
          </CartProvider>
        </ConfigSiteProvider>
        <BannerCookies />
        <Rastreamento gaId={config.gaId} metaPixelId={config.metaPixelId} />
      </body>
    </html>
  );
}
