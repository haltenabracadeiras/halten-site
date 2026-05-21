const pillars = [
  {
    k: "Missão",
    title: "Fornecer soluções técnicas que apertam de verdade.",
    body: "Abraçadeiras que garantem operações mais seguras e eficientes para o setor industrial brasileiro.",
    n: "01",
  },
  {
    k: "Visão",
    title: "Ser a referência nacional em fixação.",
    body: "Reconhecida pela qualidade, pela inovação no processo produtivo e pelo cuidado com o cliente — peça a peça.",
    n: "02",
  },
  {
    k: "Valores",
    title: "Integridade, robustez e atendimento dedicado.",
    body: "Resultado do cliente como métrica principal. Comprometimento com prazo, qualidade e a verdade técnica em cada catálogo.",
    n: "03",
  },
  {
    k: "Origem",
    title: "Cascavel/PR · 2022 · capital industrial do Oeste.",
    body: "Uma empresa jovem com propósito claro: trazer qualidade, transparência e inovação para o mercado de fixação industrial.",
    n: "04",
  },
];

export function AboutSection() {
  return (
    <section
      id="quem-somos"
      style={{
        background: "var(--ink)",
        color: "white",
        padding: "120px 0",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap: 80,
          alignItems: "start",
        }}
        className="about-wrap"
      >
        {/* Left — story */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              marginBottom: 18,
            }}
          >
            [ 02 — Quem somos ]
          </p>
          <h2
            className="font-sans"
            style={{
              fontSize: "clamp(44px,5.5vw,72px)",
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: "white",
              margin: "0 0 28px",
            }}
          >
            A história da
            <br />
            <span style={{ color: "var(--blue)" }}>Halten.</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.55)",
              maxWidth: 440,
              marginBottom: 18,
            }}
          >
            {/* texto será atualizado em breve */}
            Nascemos com o propósito de oferecer abraçadeiras de alta qualidade para o mercado industrial brasileiro, com transparência, ética e inovação em cada etapa do processo.
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.55)",
              maxWidth: 440,
            }}
          >
            Uma equipe comprometida com a excelência técnica, atendendo montadoras, indústrias, setor agrícola e pesados, com soluções de fixação que realmente seguram.
          </p>

          <div
            style={{
              marginTop: 32,
              paddingTop: 24,
              borderTop: "1px solid rgba(255,255,255,0.10)",
              maxWidth: 440,
            }}
          >
            <p className="font-sans" style={{ fontWeight: 600, fontSize: 18, color: "white", marginBottom: 4 }}>
              Compromisso assinado.
            </p>
            <small style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 400, letterSpacing: "0.08em" }}>
              Halten Indústria e Comércio Ltda.
            </small>
          </div>
        </div>

        {/* Right — pillars */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            borderTop: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {pillars.map((pillar) => (
            <div
              key={pillar.k}
              style={{
                padding: "32px 0",
                borderBottom: "1px solid rgba(255,255,255,0.10)",
                display: "grid",
                gridTemplateColumns: "120px 1fr auto",
                gap: 32,
                alignItems: "start",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  color: "var(--blue)",
                  textTransform: "uppercase",
                  paddingTop: 6,
                  margin: 0,
                }}
              >
                {pillar.k}
              </p>
              <div>
                <h4
                  className="font-sans"
                  style={{
                    fontSize: "clamp(18px,2vw,28px)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    marginBottom: 10,
                    color: "white",
                  }}
                >
                  {pillar.title}
                </h4>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: "rgba(255,255,255,0.5)",
                    maxWidth: 540,
                    margin: 0,
                  }}
                >
                  {pillar.body}
                </p>
              </div>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.1em",
                  paddingTop: 8,
                  margin: 0,
                }}
              >
                {pillar.n}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-wrap { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
        @media (max-width: 640px) {
          .about-wrap div[style*="gridTemplateColumns: 120px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
