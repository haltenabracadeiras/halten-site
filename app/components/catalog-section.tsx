import Image from "next/image";

const CATALOG_LINK = "https://www.baixecatalogo.com.br/catalogo/halten-abracadeiras";

export function CatalogSection() {
  return (
    <section
      style={{
        background: "var(--paper)",
        color: "var(--ink)",
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
          gridTemplateColumns: "1fr 1.1fr",
          gap: 80,
          alignItems: "center",
        }}
        className="catalog-wrap"
      >
        {/* Left — book visual */}
        <div style={{ position: "relative", height: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent 0 47px, rgba(15,25,35,0.05) 47px 48px), repeating-linear-gradient(90deg, transparent 0 47px, rgba(15,25,35,0.05) 47px 48px)",
            }}
          />
          <div
            style={{
              position: "relative",
              width: 320,
              height: 440,
              background: "linear-gradient(135deg, #1c9bd7 0%, #0f5d8a 100%)",
              borderRadius: "6px 22px 22px 6px",
              boxShadow: "0 50px 80px -30px rgba(15,25,35,0.4)",
              padding: "40px 32px",
              color: "white",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 8, background: "rgba(0,0,0,0.25)" }} />
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: 60,
                backgroundImage: "repeating-linear-gradient(0deg, transparent 0 19px, rgba(255,255,255,0.08) 19px 20px)",
              }}
            />
            <div className="font-sans" style={{ fontWeight: 700, fontSize: 24, letterSpacing: "-0.02em", position: "relative", zIndex: 1 }}>
              Halten
              <small style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 400, letterSpacing: "0.18em", opacity: 0.7, marginTop: 4 }}>
                ABRAÇADEIRAS · INDUSTRIAL
              </small>
            </div>
            {/* Ícone centralizado */}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
              <Image src="/icon-halten-white.svg" alt="Halten" width={120} height={120} style={{ opacity: 0.9 }} />
            </div>
            <div style={{ position: "absolute", left: 32, bottom: 32, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", opacity: 0.7 }}>
              halten.ind.br
            </div>
          </div>
        </div>

        {/* Right — content */}
        <div>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(15,25,35,0.45)",
              marginBottom: 18,
            }}
          >
            [ 04 — Catálogo digital ]
          </p>
          <h2
            className="font-sans"
            style={{
              fontSize: "clamp(36px,4.5vw,64px)",
              fontWeight: 700,
              lineHeight: 0.98,
              letterSpacing: "-0.03em",
              color: "var(--ink)",
              margin: "0 0 26px",
            }}
          >
            Catálogo digital{" "}
            <em style={{ fontStyle: "italic", color: "var(--blue)" }}>fácil, rápido e intuitivo.</em>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              lineHeight: 1.7,
              color: "rgba(15,25,35,0.55)",
              maxWidth: 520,
              marginBottom: 32,
            }}
          >
            Acesse o catálogo digital completo com todos os produtos, especificações técnicas e códigos. Fácil de compartilhar com clientes — e sempre atualizado.
          </p>

          <ul style={{ listStyle: "none", padding: 0, marginBottom: 36, display: "flex", flexDirection: "column", gap: 14, maxWidth: 520 }}>
            {[
              { title: "240+ produtos com especificações técnicas", sub: "Faixa de aperto, banda, material, torque máximo" },
              { title: "Tabelas de dimensões e códigos", sub: "SKUs prontos para integração no seu ERP" },
              { title: "Acesso rápido pelo celular ou computador", sub: "PDF, web e mobile — sincronizados" },
            ].map((item) => (
              <li
                key={item.title}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: "var(--ink)",
                  paddingBottom: 14,
                  borderBottom: "1px solid rgba(15,25,35,0.08)",
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "var(--blue)",
                    color: "white",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </span>
                <div>
                  <b className="font-sans" style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.01em", color: "var(--ink)", display: "block", marginBottom: 2 }}>
                    {item.title}
                  </b>
                  <span style={{ color: "rgba(15,25,35,0.55)", fontSize: 12 }}>{item.sub}</span>
                </div>
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href={CATALOG_LINK}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: 46,
                padding: "0 22px",
                borderRadius: 10,
                background: "var(--blue)",
                color: "white",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                fontWeight: 500,
                boxShadow: "0 12px 28px -12px rgba(28,155,215,0.55)",
              }}
            >
              Acessar catálogo digital
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>
            <a
              href={CATALOG_LINK}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 46,
                padding: "0 22px",
                borderRadius: 10,
                background: "transparent",
                color: "var(--ink)",
                border: "1px solid rgba(15,25,35,0.2)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Baixar PDF
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .catalog-wrap { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
