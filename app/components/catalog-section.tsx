import Image from "next/image";

export function CatalogSection() {
  return (
    <section
      style={{
        background: "var(--bg)",
        padding: "80px 32px",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: 64,
          flexWrap: "wrap-reverse",
        }}
      >
        {/* Capa do catálogo */}
        <div style={{ flexShrink: 0, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: 220,
              height: 300,
              borderRadius: 20,
              background: "linear-gradient(145deg, #0f2d4a 0%, #1c9bd7 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 28,
              boxShadow: "0 24px 60px rgba(15,45,74,0.3), -6px 6px 0 rgba(28,155,215,0.2)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Linhas decorativas */}
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${15 + i * 24}%`,
                  top: 0,
                  bottom: 0,
                  width: 1,
                  background: "rgba(255,255,255,0.06)",
                  pointerEvents: "none",
                }}
              />
            ))}
            {/* Círculo decorativo */}
            <div
              style={{
                position: "absolute",
                right: -40,
                bottom: -40,
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                pointerEvents: "none",
              }}
            />

            <div>
              <Image src="/logo-white.svg" alt="Halten" width={110} height={26} />
            </div>

            <div>
              <p
                style={{
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  margin: "0 0 6px",
                }}
              >
                Catálogo Digital
              </p>
              <p
                className="font-sans"
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "white",
                  margin: "0 0 4px",
                  lineHeight: 1.1,
                }}
              >
                Abraçadeiras
                <br />& Acessórios
              </p>
              <p
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  color: "rgba(255,255,255,0.45)",
                  margin: 0,
                }}
              >
                halten.ind.br
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div style={{ flex: 1, minWidth: 300, maxWidth: 560 }}>
          <p
            style={{
              display: "inline-flex",
              background: "var(--blue-light)",
              color: "var(--blue)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "6px 16px",
              borderRadius: 999,
              marginBottom: 20,
              fontFamily: "var(--font-mono)",
            }}
          >
            Catálogo Digital
          </p>

          <h2
            className="font-sans"
            style={{
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 800,
              color: "var(--ink)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              margin: "0 0 16px",
            }}
          >
            Todo o catálogo{" "}
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                color: "var(--blue)",
              }}
            >
              na palma da mão
            </span>
          </h2>

          <p
            style={{
              fontSize: 15,
              color: "var(--ink-mid)",
              fontFamily: "var(--font-mono)",
              fontWeight: 300,
              lineHeight: 1.75,
              maxWidth: 480,
              margin: "0 0 36px",
            }}
          >
            Acesse nosso catálogo digital completo com todos os produtos, especificações técnicas e códigos. Fácil de compartilhar com clientes e sempre atualizado.
          </p>

          {/* Features */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 }}>
            {[
              "Todos os produtos com especificações técnicas",
              "Tabelas de dimensões e códigos",
              "Acesso rápido pelo celular ou computador",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "var(--blue-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="#1c9bd7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--ink-mid)",
                    fontFamily: "var(--font-mono)",
                    margin: 0,
                  }}
                >
                  {item}
                </p>
              </div>
            ))}
          </div>

          <a
            href="https://www.baixecatalogo.com.br/catalogo/halten-abracadeiras"
            target="_blank"
            rel="noreferrer"
            className="font-sans"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 28px",
              borderRadius: 999,
              background: "var(--blue)",
              color: "white",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(28,155,215,0.3)",
            }}
          >
            Acessar Catálogo Digital
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
