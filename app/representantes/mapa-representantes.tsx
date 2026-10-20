"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { BRASIL_VIEWBOX, CASCAVEL, ESTADOS } from "../v2/_dados/brasil";
import { NOMES_UF, ROTULO_DESLOCADO, rotaAte } from "../v2/_dados/mapa";
import { linkWhatsapp } from "../v2/_partes/contato";
import { useWhatsapp } from "../components/config-site";

export type Representante = {
  id: string;
  nome: string;
  uf: string;
  regiao: string | null;
  email: string | null;
  telefone: string; // já formatado para mostrar
  whatsapp: string; // link wa.me com a mensagem pronta
};

const SVG_NS = "http://www.w3.org/2000/svg";

function reduzido() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Leva um ponto (o "caminhão") de Cascavel até o fim da rota. */
function viajar(rota: SVGPathElement, ponta: SVGCircleElement, duracao: number) {
  const L = rota.getTotalLength();
  const p = { t: 0 };
  const pos = () => {
    const pt = rota.getPointAtLength(L * p.t);
    ponta.setAttribute("cx", pt.x.toFixed(1));
    ponta.setAttribute("cy", pt.y.toFixed(1));
  };
  pos();
  return gsap.to(p, { t: 1, duration: duracao, ease: "power2.inOut", onUpdate: pos });
}

function circulo(classe: string, r: number) {
  const c = document.createElementNS(SVG_NS, "circle");
  c.setAttribute("class", classe);
  c.setAttribute("r", String(r));
  return c;
}

export function MapaRepresentantes({ reps, children }: { reps: Representante[]; children: ReactNode }) {
  const whatsapp = useWhatsapp();
  const [sel, setSel] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const fxRef = useRef<SVGGElement>(null);
  const fichaRef = useRef<HTMLDivElement>(null);

  const porUf = new Map<string, Representante[]>();
  for (const r of reps) porUf.set(r.uf, [...(porUf.get(r.uf) ?? []), r]);
  const servidos = Array.from(porUf.keys()).sort();
  const rotas = servidos
    .filter((uf) => uf !== "PR" && ESTADOS[uf])
    .map((uf) => ({ uf, ...rotaAte(uf) }))
    .sort((a, b) => a.dist - b.dist);
  // estado sem representante: rota tracejada direto da fábrica
  const rotaDireta = sel && sel !== "PR" && !porUf.has(sel) && ESTADOS[sel] ? rotaAte(sel) : null;

  function escolher(uf: string) {
    setSel(uf);
    history.replaceState(null, "", `#${uf.toLowerCase()}`);
    // se a ficha estiver fora da tela (celular: fica abaixo do mapa), leva até ela
    requestAnimationFrame(() => {
      const el = fichaRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top < 80 || r.bottom > window.innerHeight) {
        el.scrollIntoView({ behavior: reduzido() ? "auto" : "smooth", block: "start" });
      }
    });
  }

  // link com #uf (ex.: /representantes-v2#sp) já abre o estado
  useEffect(() => {
    const ler = () => {
      const uf = window.location.hash.slice(1).toUpperCase();
      if (ESTADOS[uf]) setSel(uf);
    };
    const id = window.setTimeout(ler, 0);
    window.addEventListener("hashchange", ler);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("hashchange", ler);
    };
  }, []);

  // abertura: os caminhões saem de Cascavel para cada estado atendido
  useEffect(() => {
    const svg = svgRef.current;
    const fx = fxRef.current;
    if (!svg || !fx || reduzido()) return;
    const tl = gsap.timeline({ delay: 0.35 });
    const criados: SVGCircleElement[] = [];
    svg.querySelectorAll<SVGPathElement>(".mapa-rotas [data-rota]").forEach((rota, i) => {
      const ponta = circulo("rv2-caminhao", 5);
      const uf = rota.dataset.rota!;
      const [ex, ey] = ESTADOS[uf].c;
      const anel = circulo("rv2-chegada", 6);
      anel.setAttribute("cx", String(ex));
      anel.setAttribute("cy", String(ey));
      gsap.set([ponta, anel], { opacity: 0 });
      fx.append(ponta, anel);
      criados.push(ponta, anel);
      const t = i * 0.11;
      tl.set(ponta, { opacity: 1 }, t)
        .add(viajar(rota, ponta, 0.85), t)
        .set(ponta, { opacity: 0 }, t + 0.85)
        .fromTo(anel, { opacity: 0.9, attr: { r: 6 } }, { opacity: 0, attr: { r: 30 }, duration: 0.8, ease: "power2.out" }, t + 0.8);
    });
    return () => {
      tl.kill();
      criados.forEach((c) => c.remove());
    };
  }, []);

  // estado escolhido: o caminhão vai até lá e fica marcando o lugar
  useEffect(() => {
    const svg = svgRef.current;
    const fx = fxRef.current;
    if (!sel || !svg || !fx) return;
    const criados: SVGCircleElement[] = [];
    const tl = gsap.timeline();
    const rota = sel === "PR" ? null : svg.querySelector<SVGPathElement>(`[data-rota="${sel}"]`);
    if (rota) {
      const ponta = circulo("rota-ponta rv2-ponta", 7);
      fx.append(ponta);
      criados.push(ponta);
      if (reduzido()) {
        const fim = rota.getPointAtLength(rota.getTotalLength());
        ponta.setAttribute("cx", String(fim.x));
        ponta.setAttribute("cy", String(fim.y));
      } else {
        tl.add(viajar(rota, ponta, Math.min(1.1, 0.45 + rota.getTotalLength() / 900)));
      }
    }
    if (!reduzido()) {
      const [ex, ey] = sel === "PR" ? CASCAVEL : ESTADOS[sel].c;
      const anel = circulo("rv2-chegada", 6);
      anel.setAttribute("cx", String(ex));
      anel.setAttribute("cy", String(ey));
      fx.append(anel);
      criados.push(anel);
      tl.fromTo(anel, { opacity: 0.9, attr: { r: 8 } }, { opacity: 0, attr: { r: 40 }, duration: 0.9, ease: "power2.out" });
      if (fichaRef.current) {
        gsap.fromTo(fichaRef.current, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" });
      }
    }
    return () => {
      tl.kill();
      criados.forEach((c) => c.remove());
    };
  }, [sel]);

  const repsSel = sel ? (porUf.get(sel) ?? []) : [];
  const nomeSel = sel ? (NOMES_UF[sel] ?? sel) : "";

  return (
    <section className="rv2-palco">
      <div className="rv2-intro">{children}</div>

      <div className="rv2-mapa-col">
        <svg
          ref={svgRef}
          className="brasil-mapa rv2-mapa"
          viewBox={BRASIL_VIEWBOX}
          role="img"
          aria-label={`Mapa do Brasil. Estados com representante Halten: ${servidos.map((uf) => NOMES_UF[uf] ?? uf).join(", ")}.`}
        >
          <g className="mapa-estados">
            {Object.entries(ESTADOS).map(([uf, e]) => (
              <path
                key={uf}
                d={e.d}
                data-uf={uf}
                className={["uf", porUf.has(uf) ? "uf-atendido" : "", sel === uf ? "escolhido" : ""].join(" ")}
                onClick={() => escolher(uf)}
              >
                <title>{NOMES_UF[uf] ?? uf}</title>
              </path>
            ))}
          </g>
          <g className="mapa-rotas">
            {rotas.map((r) => (
              <path key={r.uf} d={r.d} data-rota={r.uf} className={sel === r.uf ? "rota escolhida" : "rota"} />
            ))}
            {rotaDireta ? <path d={rotaDireta.d} data-rota={sel ?? ""} className="rota rota-direta escolhida" /> : null}
          </g>
          <g className="mapa-rotulos">
            {servidos
              .filter((uf) => ESTADOS[uf])
              .map((uf) => {
                const [x, y] = ESTADOS[uf].c;
                const off = ROTULO_DESLOCADO[uf];
                const lx = off ? x + off[0] : x;
                const ly = off ? y + off[1] : y;
                return (
                  <g key={uf} className={sel === uf ? "rotulo-uf escolhido" : "rotulo-uf"}>
                    {off ? <line x1={x} y1={y} x2={lx - 22} y2={ly - 6} /> : null}
                    <text x={lx} y={ly}>
                      {uf}
                    </text>
                  </g>
                );
              })}
          </g>
          <g ref={fxRef} className="rv2-fx" />
          <g className="mapa-cascavel" transform={`translate(${CASCAVEL[0]} ${CASCAVEL[1]})`}>
            <circle className="pulso" r="16" />
            <circle className="nucleo" r="7" />
            <text x="-14" y="34">
              Cascavel
            </text>
          </g>
        </svg>
        <p className="rv2-legenda" aria-hidden="true">
          <span>
            <i className="rv2-legenda-com" /> Com representante
          </span>
          <span>
            <i className="rv2-legenda-sem" /> Sem representante — a fábrica atende
          </span>
        </p>
      </div>

      <div className="rv2-escolha">
        <div className="rv2-chips">
          <p className="rv2-chips-rotulo" id="rv2-chips-rotulo">
            Estados atendidos
          </p>
          <div className="rv2-chips-lista" role="group" aria-labelledby="rv2-chips-rotulo">
            {servidos.map((uf) => (
              <button key={uf} type="button" aria-pressed={sel === uf} onClick={() => escolher(uf)} title={NOMES_UF[uf]}>
                {uf}
              </button>
            ))}
          </div>
        </div>

        <div className="rv2-ficha" ref={fichaRef} aria-live="polite">
          <figure className="placa rv2-placa">
            <i className="rebite r1" />
            <i className="rebite r2" />
            <i className="rebite r3" />
            <i className="rebite r4" />

            {!sel ? (
              <>
                <p className="rv2-placa-estado">Nenhum estado escolhido</p>
                <p className="placa-razao rv2-placa-vazia">Escolha o seu estado.</p>
                <p className="rv2-placa-texto">
                  No mapa ou nos botões dos estados. Aqui aparecem o representante, o WhatsApp e o e-mail dele.
                </p>
              </>
            ) : repsSel.length === 0 ? (
              <>
                <p className="rv2-placa-estado">
                  <b>{sel}</b> {nomeSel}
                </p>
                <p className="placa-razao">Ainda sem representante neste estado.</p>
                <p className="rv2-placa-texto">A fábrica atende você direto, de Cascavel/PR.</p>
                <a
                  className="botao rv2-zap"
                  href={linkWhatsapp(whatsapp, `Olá, Halten! Sou de ${nomeSel} e gostaria de fazer um orçamento.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Falar com a fábrica
                </a>
              </>
            ) : (
              <>
                <p className="rv2-placa-estado">
                  <b>{sel}</b> {nomeSel}
                  <span>
                    {repsSel.length} {repsSel.length === 1 ? "representante" : "representantes"}
                  </span>
                </p>
                {repsSel.map((r) => (
                  <div key={r.id} className="rv2-rep">
                    {r.regiao ? <span className="rv2-regiao">Região {r.regiao}</span> : null}
                    <p className="placa-razao">{r.nome}</p>
                    <dl className="placa-dados">
                      <div>
                        <dt>WhatsApp</dt>
                        <dd>{r.telefone}</dd>
                      </div>
                      {r.email ? (
                        <div>
                          <dt>E-mail</dt>
                          <dd className="rv2-email">
                            <a href={`mailto:${r.email}`}>{r.email}</a>
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                    <a className="botao rv2-zap" href={r.whatsapp} target="_blank" rel="noreferrer">
                      Falar no WhatsApp
                    </a>
                  </div>
                ))}
              </>
            )}
            <figcaption>Ficha do representante</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
