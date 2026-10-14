import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Páginas de antes da v2 (/v1, /produtos-v1, /contato-v1...), guardadas para voltar se precisar.
 * Ficam fora do Google para não competir com as páginas oficiais.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function V1Layout({ children }: { children: ReactNode }) {
  return children;
}
