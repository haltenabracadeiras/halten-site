"use client";

import { useEffect } from "react";

/**
 * Revelação leve das páginas internas v2: o que tem [data-revela] sobe e aparece ao entrar na tela.
 * Só esconde depois que o JS roda (classe rv-js no <html>), então sem JS nada some.
 */
export function Revelar() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const html = document.documentElement;
    const alvos = Array.from(document.querySelectorAll<HTMLElement>("[data-revela]"));
    // o que já está na tela ao abrir aparece sem esperar
    const dentro = (el: HTMLElement) => el.getBoundingClientRect().top < window.innerHeight * 0.92;
    alvos.filter(dentro).forEach((el) => el.classList.add("revelado"));
    html.classList.add("rv-js");

    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("revelado");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    alvos.filter((el) => !el.classList.contains("revelado")).forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      html.classList.remove("rv-js");
    };
  }, []);

  return null;
}
