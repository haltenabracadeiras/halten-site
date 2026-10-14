"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { Peca } from "../v2/_dados/linha";
import { ROTAS, WHATSAPP_NUMERO, linkWhatsapp } from "../v2/_partes/contato";

type Achado = { rotulo: string; valor: string } | null;

const semAcento = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const compacto = (s: string) => semAcento(s).replace(/[^a-z0-9]/g, "");

/** "120", "Ø 120", "120mm", "12,5" → 120 / 12.5; o resto não é medida. */
function medidaDa(q: string) {
  const m = q.trim().match(/^(?:ø|o|diam\w*)?\s*(\d+(?:[.,]\d+)?)\s*(?:mm)?$/i);
  return m ? parseFloat(m[1].replace(",", ".")) : null;
}

/** "Ø 32–220 mm" → [32, 220]; comprimento e outros formatos não entram na busca por medida. */
function faixaDe(faixa: string | null): [number, number] | null {
  const m = faixa?.match(/^Ø\s*([\d.,]+)\s*–\s*([\d.,]+)\s*mm$/);
  if (!m) return null;
  const n = (s: string) => parseFloat(s.replace(/\./g, "").replace(",", "."));
  return [n(m[1]), n(m[2])];
}

function buscar(p: Peca, q: string): { ok: boolean; achado: Achado } {
  if (semAcento(p.nome).includes(semAcento(q))) return { ok: true, achado: null };
  const mm = medidaDa(q);
  const faixa = faixaDe(p.faixa);
  if (mm !== null && faixa && mm >= faixa[0] && mm <= faixa[1]) {
    return { ok: true, achado: { rotulo: "Serve em", valor: `Ø ${q.replace(/[^\d.,]/g, "")} mm` } };
  }
  const c = compacto(q);
  if (c.length >= 3) {
    const t = p.termos.find((t) => compacto(t.codigo).includes(c));
    if (t) return { ok: true, achado: { rotulo: t.tipo === "halten" ? "Código" : "Original", valor: t.codigo } };
  }
  return { ok: false, achado: null };
}

export function ListaProdutos({ pecas, inicial }: { pecas: Peca[]; inicial: string }) {
  const [q, setQ] = useState(inicial);
  const busca = q.trim();

  // a busca fica no endereço (?q=), para dar para mandar o link
  useEffect(() => {
    const url = new URL(window.location.href);
    if (busca) url.searchParams.set("q", busca);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  }, [busca]);

  const resultados = pecas
    .map((p, i) => ({ p, indice: i + 1, ...(busca ? buscar(p, busca) : { ok: true, achado: null }) }))
    .filter((r) => r.ok);

  return (
    <section className="pl" aria-label="Modelos">
      <div className="pl-busca">
        <label htmlFor="pl-q" className="pl-busca-rotulo">
          Buscar na linha
        </label>
        <div className="pl-campo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            id="pl-q"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nome, medida ou código"
            autoComplete="off"
            spellCheck={false}
          />
          {q ? (
            <button type="button" className="pl-limpar" onClick={() => setQ("")} aria-label="Limpar busca">
              ×
            </button>
          ) : null}
        </div>
        <p className="pl-contagem" aria-live="polite">
          {busca ? `${resultados.length} de ${pecas.length} modelos` : `${pecas.length} modelos`}
        </p>
      </div>

      {resultados.length ? (
        <ol className="pl-grade">
          {resultados.map(({ p, indice, achado }) => (
            <li key={p.slug}>
              <a href={ROTAS.produto(p.slug)} className="pl-card">
                <span className="pl-foto" style={{ "--zoom": String(p.zoom / 100) } as CSSProperties}>
                  <i className="canto c1" />
                  <i className="canto c2" />
                  <i className="canto c3" />
                  <i className="canto c4" />
                  {p.imagem ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imagem} alt="" loading={indice <= 8 ? "eager" : "lazy"} decoding="async" />
                  ) : null}
                  {p.lancamento ? <em className="pl-selo">Lançamento</em> : null}
                </span>
                <span className="pl-info">
                  <span className="pl-indice">{String(indice).padStart(2, "0")}</span>
                  <b className="pl-nome">{p.curto}</b>
                  <span className="pl-dados">
                    {p.faixa ? <span>{p.faixa}</span> : null}
                    <span>
                      {p.codigos} {p.codigos === 1 ? "código" : "códigos"}
                    </span>
                  </span>
                  {achado ? (
                    <span className="pl-achado">
                      {achado.rotulo}: <mark>{achado.valor}</mark>
                    </span>
                  ) : null}
                </span>
                <span className="pl-seta" aria-hidden="true">
                  →
                </span>
              </a>
            </li>
          ))}
        </ol>
      ) : (
        <div className="pl-vazio">
          <p>
            Nenhum modelo com “<b>{busca}</b>”.
          </p>
          <a
            className="botao"
            href={linkWhatsapp(WHATSAPP_NUMERO, `Olá, Halten! Vocês têm o código ${busca}?`)}
            target="_blank"
            rel="noreferrer"
          >
            Perguntar no WhatsApp
          </a>
        </div>
      )}
    </section>
  );
}
