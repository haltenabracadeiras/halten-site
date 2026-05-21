const stats = [
  { key: "Produtos vendidos", value: "12", unit: "k+", desc: "unidades comercializadas em 2025" },
  { key: "Satisfação",        value: "98", unit: "%",  desc: "NPS médio em pesquisa B2B" },
  { key: "Suporte rápido",    value: "24", unit: "h",  desc: "tempo médio de resposta técnica" },
  { key: "Experiência",       value: "45", unit: "anos", desc: "fabricação contínua desde 1981" },
];

export function StatsBar() {
  return (
    <section
      style={{
        background: "var(--ink)",
        padding: "100px 0 80px",
        position: "relative",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "1.1fr 2fr",
          gap: 80,
          alignItems: "end",
        }}
        className="stats-wrap"
      >
        {/* Intro */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--blue)",
              marginBottom: 18,
            }}
          >
            [ 00.1 — Sobre a operação ]
          </p>
          <h2
            className="font-sans"
            style={{
              fontSize: "clamp(32px,3.8vw,54px)",
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              color: "white",
              margin: "0 0 22px",
            }}
          >
            Engenharia que{" "}
            <em style={{ fontStyle: "italic", color: "var(--blue)" }}>aperta forte</em>
            {" "}há quatro décadas.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.65)",
              maxWidth: 380,
              margin: 0,
            }}
          >
            Fabricamos no Brasil abraçadeiras e acessórios para o setor automotivo, sanitário, agroindustrial e de infraestrutura. Cada lote sai com rastreabilidade e ensaio.
          </p>
        </div>

        {/* Numbers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
          className="stats-nums"
        >
          {stats.map((s, i) => (
            <div
              key={s.key}
              style={{
                padding: "32px 24px 0",
                borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  color: "var(--blue)",
                  textTransform: "uppercase",
                  marginBottom: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--blue)", display: "inline-block" }} />
                {s.key}
              </p>
              <div
                className="font-sans"
                style={{
                  fontSize: "clamp(44px,5vw,72px)",
                  fontWeight: 700,
                  lineHeight: 0.9,
                  letterSpacing: "-0.04em",
                  color: "white",
                }}
              >
                {s.value}
                <sub
                  style={{
                    fontSize: "clamp(18px,2vw,28px)",
                    color: "rgba(255,255,255,0.45)",
                    fontWeight: 500,
                    verticalAlign: "baseline",
                    marginLeft: 4,
                  }}
                >
                  {s.unit}
                </sub>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.45)",
                  marginTop: 18,
                  lineHeight: 1.6,
                }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .stats-wrap { grid-template-columns: 1fr !important; gap: 48px !important; }
          .stats-nums { grid-template-columns: repeat(2,1fr) !important; gap: 0; }
          .stats-nums > div:nth-child(2) { border-right: none !important; }
          .stats-nums > div:nth-child(3), .stats-nums > div:nth-child(4) { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 32px; margin-top: 0; }
        }
        @media (max-width: 540px) {
          .stats-nums { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}
