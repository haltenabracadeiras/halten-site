import Image from "next/image";
import { PhoneCarousel } from "./phone-carousel";

const GP_LINK = "https://play.google.com/store/apps/details?id=br.com.ideia2001.HaltenAbracadeiras&hl=pt_BR";
const AS_LINK = "https://apps.apple.com/br/app/halten-abra%C3%A7adeiras/id6761189859";

const features = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
      </svg>
    ),
    title: "Busca por código",
    sub: "SKU, modelo, dimensão",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16v16H4z"/><path d="M4 9h16M9 4v16"/>
      </svg>
    ),
    title: "Tabela técnica",
    sub: "Diâmetros, torque, banda",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: "Pedido em rascunho",
    sub: "Salva offline",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 6-6"/>
      </svg>
    ),
    title: "Atualizações ao vivo",
    sub: "Novidades em tempo real",
  },
];

export function AppSection() {
  return (
    <section
      style={{
        background: "var(--ink)",
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -300,
          right: -200,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(28,155,215,0.18), transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: 80,
          alignItems: "center",
          position: "relative",
        }}
        className="app-wrap"
      >
        {/* Left */}
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(28,155,215,0.12)",
              border: "1px solid rgba(28,155,215,0.35)",
              padding: "8px 16px",
              borderRadius: 999,
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--blue-2)",
                boxShadow: "0 0 0 4px rgba(28,155,215,0.25)",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--blue-2)",
              }}
            >
              Aplicativo oficial
            </span>
          </div>

          <h2
            className="font-sans"
            style={{
              fontSize: "clamp(44px,6vw,84px)",
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: "-0.035em",
              color: "white",
              margin: "0 0 24px",
            }}
          >
            Halten no{" "}
            <em style={{ fontStyle: "italic", color: "var(--blue)" }}>seu celular.</em>
          </h2>

          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 480,
              marginBottom: 36,
            }}
          >
            Consulte códigos, tabelas técnicas e o catálogo completo de abraçadeiras direto do smartphone — sem internet depois do primeiro acesso. Disponível gratuitamente para Android e iOS.
          </p>

          {/* Feature grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginBottom: 36,
              maxWidth: 520,
            }}
          >
            {features.map((f) => (
              <div
                key={f.title}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: 14,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 7,
                    background: "rgba(28,155,215,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--blue)",
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <p className="font-sans" style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3, color: "white", margin: 0 }}>
                    {f.title}
                  </p>
                  <small style={{ display: "block", fontFamily: "var(--font-mono)", fontWeight: 400, fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 4, letterSpacing: "0.05em" }}>
                    {f.sub}
                  </small>
                </div>
              </div>
            ))}
          </div>

          {/* Store badges */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href={AS_LINK}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "12px 20px",
                borderRadius: 12,
                textDecoration: "none",
              }}
            >
              <div style={{ width: 28, height: 28, display: "grid", placeItems: "center", flexShrink: 0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                  <path d="M17.05 12.04c-.03-2.46 2.01-3.64 2.1-3.7-1.15-1.68-2.94-1.91-3.57-1.93-1.5-.16-2.95.9-3.72.9-.78 0-1.96-.88-3.23-.86-1.65.03-3.2.96-4.05 2.44-1.74 3.01-.44 7.45 1.24 9.89.82 1.19 1.79 2.52 3.07 2.48 1.24-.05 1.7-.79 3.2-.79 1.49 0 1.92.79 3.22.77 1.33-.02 2.17-1.2 2.98-2.4.94-1.37 1.32-2.71 1.34-2.78-.03-.01-2.55-.98-2.58-3.89zM14.65 4.52c.69-.83 1.15-2 1.02-3.14-.99.04-2.18.66-2.89 1.49-.64.73-1.2 1.9-1.05 3.02 1.1.08 2.23-.55 2.92-1.37z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
                  Disponível na
                </div>
                <div className="font-sans" style={{ fontWeight: 600, fontSize: 15, color: "white", marginTop: 1 }}>
                  App Store
                </div>
              </div>
            </a>

            <a
              href={GP_LINK}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "12px 20px",
                borderRadius: 12,
                textDecoration: "none",
              }}
            >
              <div style={{ width: 28, height: 28, display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Image src="/google-play-store-icon.svg" alt="Google Play" width={22} height={22} />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
                  Disponível no
                </div>
                <div className="font-sans" style={{ fontWeight: 600, fontSize: 15, color: "white", marginTop: 1 }}>
                  Google Play
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Right — phone carousel */}
        <div
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          className="app-visual"
        >
          <PhoneCarousel />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .app-wrap { grid-template-columns: 1fr !important; }
          .app-visual { display: none !important; }
        }
      `}</style>
    </section>
  );
}
