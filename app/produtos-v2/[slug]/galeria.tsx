"use client";

import { useState, type CSSProperties } from "react";

/** Foto do produto no portal de inspeção (o mesmo da esteira da home), com miniaturas quando há mais de uma. */
export function Galeria({ imagens, nome, zoom }: { imagens: string[]; nome: string; zoom: number }) {
  const [atual, setAtual] = useState(0);

  return (
    <div className="pp-galeria">
      <div className="pp-palco" style={{ "--zoom": String(zoom / 100) } as CSSProperties}>
        <i className="canto c1" />
        <i className="canto c2" />
        <i className="canto c3" />
        <i className="canto c4" />
        {imagens.length ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={atual} src={imagens[atual]} alt={imagens.length > 1 ? `${nome} — foto ${atual + 1}` : nome} />
        ) : (
          <span className="pp-sem-foto">Foto em breve</span>
        )}
        {imagens.length > 1 ? (
          <span className="pp-contador" aria-hidden="true">
            {String(atual + 1).padStart(2, "0")} / {String(imagens.length).padStart(2, "0")}
          </span>
        ) : null}
      </div>

      {imagens.length > 1 ? (
        <div className="pp-miniaturas" role="group" aria-label="Fotos do produto">
          {imagens.map((src, i) => (
            <button key={src} type="button" aria-pressed={i === atual} aria-label={`Foto ${i + 1}`} onClick={() => setAtual(i)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
