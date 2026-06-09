import type { Metadata } from "next";
import { Syne, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "./providers";
import { CartProvider } from "./context/cart-context";
import { CartDrawer } from "./components/cart-drawer";
import { PageTracker } from "./components/page-tracker";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${syne.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <PageTracker />
          <LenisProvider>{children}</LenisProvider>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
