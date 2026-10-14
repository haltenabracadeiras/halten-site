"use client";

import { useEffect } from "react";
import { iniciarV2 } from "./cenas";

/** Liga o movimento da v2 depois da hidratação (GSAP + motor da skill Sites Incríveis). */
export function Movimento({ medidor }: { medidor: { min: number; max: number } }) {
  useEffect(() => {
    const raiz = document.getElementById("v2");
    if (!raiz) return;
    return iniciarV2(raiz, medidor);
  }, [medidor]);

  return null;
}
