const caps = [
  {
    num: "01 / Material",
    title: "Inox AISI 304 e 316L",
    body: "Resistência à corrosão em ambientes salinos, químicos e sanitários. Certificado de matéria-prima por bobina.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2 4 7v10l8 5 8-5V7l-8-5z"/><path d="M4 7l8 5 8-5"/><path d="M12 12v10"/>
      </svg>
    ),
  },
  {
    num: "02 / Processo",
    title: "Estampagem + solda TIG",
    body: "Linha CNC com 6 prensas e 4 robôs de solda. Banda sem rebarba — não corta mangueira nem fere o instalador.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>
      </svg>
    ),
  },
  {
    num: "03 / Ensaio",
    title: "Torque · vibração · fadiga",
    body: "Laboratório próprio com banca de torque calibrada (BIPM), câmara salina e teste cíclico até 50.000 voltas.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M12 7v5l3 3"/>
      </svg>
    ),
  },
  {
    num: "04 / Normativa",
    title: "SAE J1508 · DIN 3017",
    body: "Conformidade dimensional e mecânica com as normas internacionais aplicáveis a cada família de produto.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    num: "05 / Logística",
    title: "Pronta-entrega · BR todo",
    body: "Estoque-pulmão de 1,2 milhão de peças em Cascavel/PR. Despacho em até 24h para grandes capitais.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 8h13v9H3z"/><path d="M16 11h4l3 3v3h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
      </svg>
    ),
  },
  {
    num: "06 / Engenharia sob medida",
    title: "Projetos especiais OEM",
    body: "Desenhamos abraçadeiras para o seu projeto: diâmetro, material, banda e gravação personalizada.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2 18 6"/><path d="m4 20 14-14a2.83 2.83 0 0 0-4-4L0 16v4h4z"/>
      </svg>
    ),
  },
];

export function PrecisionSection() {
  return (
    <section
      style={{
        background: "var(--ink)",
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid texture */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0 79px, rgba(255,255,255,0.025) 79px 80px), repeating-linear-gradient(90deg, transparent 0 79px, rgba(255,255,255,0.025) 79px 80px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", position: "relative" }}>
        {/* Head */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.4fr",
            gap: 64,
            marginBottom: 80,
            alignItems: "end",
          }}
          className="precision-head"
        >
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
              [ 02 — Engenharia ]
            </p>
            <h2
              className="font-sans"
              style={{
                fontSize: "clamp(36px,4vw,64px)",
                fontWeight: 700,
                color: "white",
                lineHeight: 0.98,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              Cada peça{" "}
              <em style={{ fontStyle: "italic", color: "var(--blue)" }}>pensada</em>
              <br />antes de ser apertada.
            </h2>
          </div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.65)",
              maxWidth: 480,
              margin: 0,
            }}
          >
            Da matéria-prima ao acabamento, nossa fábrica em Cascavel/PR opera com controle dimensional, ensaio de torque e teste de fadiga em 100% dos lotes. Você recebe rastreabilidade impressa na embalagem.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          className="cap-grid"
        >
          {caps.map((cap, i) => (
            <div
              key={i}
              style={{
                padding: "40px 32px 44px",
                borderRight: (i + 1) % 3 !== 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
                borderTop: i >= 3 ? "1px solid rgba(255,255,255,0.08)" : "none",
                minHeight: 280,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    color: "var(--blue)",
                    marginBottom: 32,
                  }}
                >
                  {cap.num}
                </p>
                <h3
                  className="font-sans"
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                    color: "white",
                    marginBottom: 14,
                  }}
                >
                  {cap.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    lineHeight: 1.65,
                    color: "rgba(255,255,255,0.65)",
                    margin: 0,
                  }}
                >
                  {cap.body}
                </p>
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 32,
                  right: 32,
                  width: 44,
                  height: 44,
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--blue)",
                }}
              >
                {cap.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .precision-head { grid-template-columns: 1fr !important; gap: 24px !important; }
          .cap-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .precision-head h2 { font-size: 36px !important; }
        }
      `}</style>
    </section>
  );
}
