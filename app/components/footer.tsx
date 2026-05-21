import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Início", href: "/" },
  { label: "Produtos", href: "/produtos" },
  { label: "Quem Somos", href: "/quem-somos" },
  { label: "Contato", href: "/contato" },
];

export function Footer() {
  return (
    <footer style={{ background: "#0f1923" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "64px 32px 0",
        }}
      >
        {/* Grid principal */}
        <div
          style={{
            display: "grid",
            gap: 48,
            gridTemplateColumns: "2fr 1fr 1.4fr 1.4fr",
            paddingBottom: 48,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
          className="footer-grid"
        >
          {/* Marca */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "white",
                borderRadius: 16,
                padding: "10px 20px",
                marginBottom: 20,
              }}
            >
              <Image src="/logo.svg" alt="Halten Abraçadeiras" width={148} height={34} />
            </div>
            <p
              style={{
                fontSize: 13,
                fontFamily: "var(--font-mono)",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.75,
                margin: "0 0 20px",
                maxWidth: 280,
              }}
            >
              Soluções industriais em abraçadeiras e acessórios com qualidade e desempenho para sua empresa.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                CNPJ
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  color: "rgba(255,255,255,0.55)",
                  letterSpacing: "0.04em",
                }}
              >
                43.453.407/0001-87
              </span>
            </div>
          </div>

          {/* Navegação */}
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                fontFamily: "var(--font-mono)",
                margin: "0 0 18px",
              }}
            >
              Navegação
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.6)",
                    textDecoration: "none",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contato */}
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                fontFamily: "var(--font-mono)",
                margin: "0 0 18px",
              }}
            >
              Contato
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)", margin: "0 0 3px", letterSpacing: "0.06em" }}>
                  E-mail
                </p>
                <a
                  href="mailto:contato@halten.ind.br"
                  style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-mono)", textDecoration: "none" }}
                >
                  contato@halten.ind.br
                </a>
              </div>
              <div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)", margin: "0 0 3px", letterSpacing: "0.06em" }}>
                  WhatsApp
                </p>
                <a
                  href="https://wa.me/5545991447046"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-mono)", textDecoration: "none" }}
                >
                  (45) 99144-7046
                </a>
              </div>
              <div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "var(--font-mono)", margin: "0 0 3px", letterSpacing: "0.06em" }}>
                  Telefone
                </p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-mono)", margin: 0 }}>
                  (45) 3197-2130
                </p>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
                fontFamily: "var(--font-mono)",
                margin: "0 0 18px",
              }}
            >
              Localização
            </p>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.75)",
                fontFamily: "var(--font-mono)",
                lineHeight: 1.8,
                margin: "0 0 16px",
              }}
            >
              R. Alba Vieira, 653
              <br />
              Cataratas — Cascavel/PR
              <br />
              CEP 85818-630
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 999,
                background: "rgba(28,155,215,0.15)",
                border: "1px solid rgba(28,155,215,0.25)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#1c9bd7",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "rgba(28,155,215,0.9)" }}>
                Seg – Sex · 08:00 às 17:30
              </span>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div
          style={{
            padding: "20px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.22)",
              fontFamily: "var(--font-mono)",
              margin: 0,
            }}
          >
            © {new Date().getFullYear()} Halten Abraçadeiras · Todos os direitos reservados
          </p>
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.22)",
              fontFamily: "var(--font-mono)",
              margin: 0,
            }}
          >
            CNPJ 43.453.407/0001-87
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 540px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
