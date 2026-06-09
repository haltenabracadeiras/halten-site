"use client";

import { useEffect, useRef, useState } from "react";

type Rep = {
  id: string;
  name: string;
  whatsapp: string;
  state: string;
  email?: string | null;
  regiao?: string | null;
};
type StateInfo = { d: string; cx: number; cy: number };
type Props = { representatives: Rep[] };

const SVG_TO_STATE: Record<string, string> = {
  ac: "RO", al: "AC", ap: "AM", am: "RR", ba: "AP",
  ce: "TO", df: "MT", es: "GO", go: "MS", ma: "MG",
  mt: "PR", ms: "RS", mg: "BA", pa: "PI", pb: "CE",
  pr: "RN", pe: "AL", pi: "SE", rj: "DF", rn: "PE",
  rs: "MA", ro: "PA", rr: "SP", sc: "RJ", sp: "ES",
  se: "SC", to: "PB",
};

const STATE_NAMES: Record<string, string> = {
  AC:"Acre", AL:"Alagoas", AM:"Amazonas", AP:"Amapá", BA:"Bahia",
  CE:"Ceará", DF:"Distrito Federal", ES:"Espírito Santo", GO:"Goiás",
  MA:"Maranhão", MG:"Minas Gerais", MS:"Mato Grosso do Sul", MT:"Mato Grosso",
  PA:"Pará", PB:"Paraíba", PE:"Pernambuco", PI:"Piauí", PR:"Paraná",
  RJ:"Rio de Janeiro", RN:"Rio Grande do Norte", RO:"Rondônia", RR:"Roraima",
  RS:"Rio Grande do Sul", SC:"Santa Catarina", SE:"Sergipe", SP:"São Paulo",
  TO:"Tocantins",
};

const ANIM_STYLES = `
  @keyframes repCardIn {
    from { opacity: 0; transform: translateY(12px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }
  @keyframes dotRing {
    0%   { transform: scale(1);   opacity: 0.7; }
    100% { transform: scale(3.5); opacity: 0;   }
  }
  @keyframes dotGlow {
    0%,100% { opacity: 1; }
    50%     { opacity: 0.55; }
  }
  .dot-ring {
    transform-box: fill-box;
    transform-origin: center;
    animation: dotRing 2.2s ease-out infinite;
  }
  .dot-core {
    transform-box: fill-box;
    transform-origin: center;
    animation: dotGlow 2.2s ease-in-out infinite;
  }
`;

const WA_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" fill="currentColor" />
  </svg>
);

export function BrazilMap({ representatives }: Props) {
  const [states, setStates] = useState<Record<string, StateInfo>>({});
  const [viewBox, setViewBox] = useState("0 0 220000 194010");
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const loadedRef = useRef(false);

  // Agrupa por estado: um estado pode ter mais de um representante.
  const repsByState = new Map<string, Rep[]>();
  for (const r of representatives) {
    const list = repsByState.get(r.state);
    if (list) list.push(r);
    else repsByState.set(r.state, [r]);
  }
  const selectedReps = selected ? repsByState.get(selected) ?? [] : [];

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    fetch("/brazil-map.svg")
      .then((r) => r.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const svgEl = doc.querySelector("svg");
        const vb = svgEl?.getAttribute("viewBox") ?? "0 0 220000 194010";
        setViewBox(vb);

        const tempSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        tempSvg.setAttribute("viewBox", vb);
        Object.assign(tempSvg.style, {
          position: "absolute", visibility: "hidden",
          width: "1px", height: "1px", overflow: "hidden",
        });
        document.body.appendChild(tempSvg);

        const result: Record<string, StateInfo> = {};

        doc.querySelectorAll("path[id]").forEach((path) => {
          const svgId = path.getAttribute("id")?.toLowerCase() ?? "";
          const stateCode = SVG_TO_STATE[svgId];
          if (!stateCode) return;
          const d = path.getAttribute("d") ?? "";
          if (!d) return;
          const el = document.createElementNS("http://www.w3.org/2000/svg", "path") as SVGPathElement;
          el.setAttribute("d", d);
          tempSvg.appendChild(el);
          const b = el.getBBox();
          result[stateCode] = { d, cx: b.x + b.width / 2, cy: b.y + b.height / 2 };
        });

        document.body.removeChild(tempSvg);
        setStates(result);
      });
  }, []);

  const stateEntries = Object.entries(states);

  return (
    <div style={{ display: "flex", gap: 48, alignItems: "flex-start", flexWrap: "wrap" }}>
      <style>{ANIM_STYLES}</style>

      {/* Mapa */}
      <div style={{ flex: "1 1 440px", maxWidth: 580 }}>
        {stateEntries.length === 0 ? (
          <div style={{ aspectRatio: "220/194", background: "rgba(255,255,255,0.04)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)", fontSize: 13 }}>Carregando mapa...</p>
          </div>
        ) : (
          <svg
              viewBox={viewBox}
              style={{
                width: "100%", height: "auto", display: "block",
                filter: [
                  "drop-shadow(0 32px 48px rgba(0,0,0,0.7))",
                  "drop-shadow(0 8px 20px rgba(0,0,0,0.45))",
                  "drop-shadow(0 0 60px rgba(28,155,215,0.08))",
                ].join(" "),
              }}
              aria-label="Mapa do Brasil — clique no seu estado"
            >
              <defs>
                {/* Gradiente para estados com representante */}
                <radialGradient id="repFill" cx="45%" cy="30%" r="75%" gradientUnits="objectBoundingBox">
                  <stop offset="0%"   stopColor="rgba(56,185,240,0.65)" />
                  <stop offset="100%" stopColor="rgba(18,110,190,0.28)" />
                </radialGradient>
                {/* Gradiente para estado selecionado */}
                <radialGradient id="selFill" cx="45%" cy="30%" r="75%" gradientUnits="objectBoundingBox">
                  <stop offset="0%"   stopColor="rgba(80,210,255,0.95)" />
                  <stop offset="100%" stopColor="rgba(20,130,220,0.80)" />
                </radialGradient>
                {/* Gradiente para hover sem representante */}
                <radialGradient id="hovFill" cx="45%" cy="30%" r="75%" gradientUnits="objectBoundingBox">
                  <stop offset="0%"   stopColor="rgba(255,255,255,0.22)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
                </radialGradient>
                {/* Gradiente para hover com representante */}
                <radialGradient id="hovRepFill" cx="45%" cy="30%" r="75%" gradientUnits="objectBoundingBox">
                  <stop offset="0%"   stopColor="rgba(80,200,255,0.80)" />
                  <stop offset="100%" stopColor="rgba(28,130,210,0.50)" />
                </radialGradient>
                {/* Filtro de brilho para hover/selecionado */}
                <filter id="glowSel" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="1500" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glowHov" x="-15%" y="-15%" width="130%" height="130%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="800" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {stateEntries.map(([id, { d, cx, cy }]) => {
                const repCount = repsByState.get(id)?.length ?? 0;
                const hasRep = repCount > 0;
                const isHov = hovered === id;
                const isSel = selected === id;

                let fill = "rgba(255,255,255,0.07)";
                if (isSel) fill = "url(#selFill)";
                else if (isHov && hasRep) fill = "url(#hovRepFill)";
                else if (isHov) fill = "url(#hovFill)";
                else if (hasRep) fill = "url(#repFill)";

                const strokeColor = isSel
                  ? "rgba(80,210,255,0.9)"
                  : isHov
                  ? "rgba(255,255,255,0.4)"
                  : "rgba(255,255,255,0.13)";

                const filterAttr = isSel ? "url(#glowSel)" : isHov ? "url(#glowHov)" : undefined;

                return (
                  <g
                    key={id}
                    onClick={() => hasRep && setSelected(isSel ? null : id)}
                    onMouseEnter={() => setHovered(id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: hasRep ? "pointer" : "default" }}
                  >
                    <path
                      d={d}
                      fill={fill}
                      stroke={strokeColor}
                      strokeWidth={isSel ? 350 : isHov ? 250 : 140}
                      filter={filterAttr}
                      style={{ transition: "fill 0.18s ease, stroke 0.18s ease, stroke-width 0.18s ease" }}
                    />
                    <text
                      x={cx} y={cy}
                      textAnchor="middle" dominantBaseline="middle"
                      style={{
                        fontSize: 3200,
                        fontFamily: "monospace",
                        fill: isSel
                          ? "white"
                          : hasRep
                          ? "rgba(200,240,255,0.95)"
                          : "rgba(255,255,255,0.35)",
                        fontWeight: hasRep ? 700 : 400,
                        pointerEvents: "none",
                        userSelect: "none",
                        transition: "fill 0.18s ease",
                      }}
                    >
                      {id === "DF" ? "" : id}
                    </text>

                    {/* Ponto pulsante em estados com representante */}
                    {hasRep && !isSel && (
                      <g>
                        <circle
                          className="dot-ring"
                          cx={cx} cy={cy + 5000}
                          r={1200}
                          fill="none"
                          stroke="rgba(28,200,255,0.6)"
                          strokeWidth={280}
                        />
                        <circle
                          className="dot-core"
                          cx={cx} cy={cy + 5000}
                          r={1000}
                          fill="rgba(28,200,255,0.95)"
                        />
                      </g>
                    )}

                    {/* Contador quando há mais de um representante no estado */}
                    {repCount > 1 && (
                      <g style={{ pointerEvents: "none" }}>
                        <circle cx={cx + 3200} cy={cy + 3200} r={1700} fill="#1c9bd7" stroke="white" strokeWidth={220} />
                        <text
                          x={cx + 3200} y={cy + 3200}
                          textAnchor="middle" dominantBaseline="central"
                          style={{ fontSize: 2300, fontFamily: "monospace", fontWeight: 700, fill: "white", userSelect: "none" }}
                        >
                          {repCount}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
          </svg>
        )}

        <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: "rgba(28,155,215,0.45)", border: "1px solid rgba(80,200,255,0.3)", boxShadow: "0 0 8px rgba(28,155,215,0.4)" }} />
            <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.5)" }}>Com representante — clique para ver</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }} />
            <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.5)" }}>Sem representante</span>
          </div>
        </div>
      </div>

      {/* Painel lateral */}
      <div style={{ flex: "1 1 280px", maxWidth: 380 }}>
        {selectedReps.length > 0 ? (
          <div
            key={selected}
            style={{
              background: "linear-gradient(135deg, rgba(28,155,215,0.12) 0%, rgba(10,30,60,0.6) 100%)",
              border: "1px solid rgba(28,155,215,0.4)",
              borderRadius: 20, padding: 32,
              boxShadow: "0 0 40px -10px rgba(28,155,215,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
              animation: "repCardIn 0.28s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(28,155,215,0.2)", border: "1px solid rgba(28,155,215,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", fontWeight: 700, color: "#4cc8f8" }}>{selected}</span>
              </div>
              <div>
                <p style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.4)", margin: 0, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                  {selectedReps.length > 1 ? `${selectedReps.length} Representantes` : "Representante"}
                </p>
                <p style={{ fontSize: 14, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.7)", margin: 0 }}>{selected ? STATE_NAMES[selected] ?? selected : ""}</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {selectedReps.map((rep) => (
                <div
                  key={rep.id}
                  style={{
                    background: selectedReps.length > 1 ? "rgba(255,255,255,0.03)" : "transparent",
                    border: selectedReps.length > 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                    borderRadius: 14,
                    padding: selectedReps.length > 1 ? 20 : 0,
                  }}
                >
                  {rep.regiao && (
                    <span style={{ display: "inline-block", marginBottom: 8, padding: "3px 10px", borderRadius: 999, background: "rgba(28,155,215,0.18)", border: "1px solid rgba(28,155,215,0.35)", fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 600, color: "#7dd6ff", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Região {rep.regiao}
                    </span>
                  )}
                  <h3 style={{ fontSize: selectedReps.length > 1 ? 18 : 22, fontWeight: 700, color: "white", margin: "0 0 14px", lineHeight: 1.25 }}>
                    {rep.name}
                  </h3>
                  <a
                    href={`https://wa.me/${rep.whatsapp.replace(/^\+/, "")}`}
                    target="_blank" rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 22px", borderRadius: 12, background: "#25D366", color: "white", fontSize: 14, fontFamily: "var(--font-mono)", fontWeight: 600, textDecoration: "none", boxShadow: "0 8px 24px -8px rgba(37,211,102,0.6)" }}
                  >
                    {WA_ICON}
                    Falar no WhatsApp
                  </a>
                  {rep.email && (
                    <a
                      href={`mailto:${rep.email}`}
                      style={{ display: "block", marginTop: 12, fontSize: 13, fontFamily: "var(--font-mono)", color: "rgba(125,214,255,0.85)", textDecoration: "none", wordBreak: "break-all" }}
                    >
                      {rep.email}
                    </a>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelected(null)}
              style={{ display: "block", marginTop: 20, background: "none", border: "none", cursor: "pointer", fontSize: 12, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.3)", padding: 0 }}
            >
              Fechar ×
            </button>
          </div>
        ) : (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 240, textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(28,155,215,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(28,155,215,0.7)" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <p style={{ fontSize: 14, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.5)", margin: "0 0 6px", fontWeight: 500 }}>Selecione um estado</p>
            <p style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.25)", margin: 0 }}>
              {repsByState.size > 0 ? "Clique em um estado azul para ver o representante" : "Nenhum representante cadastrado ainda"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
