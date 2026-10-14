import { Archivo } from "next/font/google";

/** Archivo variável (eixo de largura) da v2 — num arquivo só, para as páginas v2 dividirem a mesma fonte. */
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-v2",
  display: "swap",
});
