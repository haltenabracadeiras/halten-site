import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";

const values = [
  "Transparência e ética",
  "Comprometimento e respeito com a equipe e clientes",
  "Qualidade e inovação",
  "Crescer e evoluir juntos",
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 80, background: "var(--bg)", minHeight: "100vh" }}>
        {/* Header */}
        <section
          style={{
            background: "linear-gradient(135deg, #0f2d4a 0%, #1c9bd7 60%, #38b8f0 100%)",
            padding: "64px 24px",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <p
              className="font-sans"
              style={{
                display: "inline-flex",
                background: "rgba(255,255,255,0.15)",
                color: "white",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "6px 16px",
                borderRadius: 999,
                marginBottom: 20,
              }}
            >
              Quem Somos
            </p>
            <h1
              className="font-sans"
              style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 800,
                color: "white",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              Halten{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#7dd3f8" }}>
                Abraçadeiras
              </span>
            </h1>
            <p
              style={{
                marginTop: 16,
                fontSize: 16,
                color: "rgba(255,255,255,0.8)",
                fontFamily: "var(--font-mono)",
                fontWeight: 300,
                maxWidth: 560,
              }}
            >
              Desenvolvendo, importando e distribuindo produtos com qualidade e segurança desde o início.
            </p>
          </div>
        </section>

        {/* Content */}
        <section style={{ padding: "64px 24px" }}>
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 32,
            }}
          >
            {/* Missão + Visão */}
            <div
              style={{
                display: "grid",
                gap: 24,
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              }}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: 24,
                  border: "1px solid var(--line)",
                  padding: 36,
                  boxShadow: "0 4px 24px rgba(15,25,35,0.05)",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--blue)",
                    fontFamily: "var(--font-mono)",
                    marginBottom: 16,
                  }}
                >
                  Missão
                </p>
                <p
                  className="font-sans"
                  style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 16, lineHeight: 1.3 }}
                >
                  Entregar qualidade com propósito
                </p>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.75,
                    color: "var(--ink-mid)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 300,
                    margin: 0,
                  }}
                >
                  Desenvolver, importar e distribuir produtos inovadores, com qualidade e segurança, visando sempre a satisfação dos nossos clientes.
                </p>
              </div>

              <div
                style={{
                  background: "white",
                  borderRadius: 24,
                  border: "1px solid var(--line)",
                  padding: 36,
                  boxShadow: "0 4px 24px rgba(15,25,35,0.05)",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--blue)",
                    fontFamily: "var(--font-mono)",
                    marginBottom: 16,
                  }}
                >
                  Visão
                </p>
                <p
                  className="font-sans"
                  style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)", marginBottom: 16, lineHeight: 1.3 }}
                >
                  Referência em abraçadeiras
                </p>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.75,
                    color: "var(--ink-mid)",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 300,
                    margin: 0,
                  }}
                >
                  Ser reconhecido como o principal fornecedor de abraçadeiras dos nossos clientes, por excelência em nossos processos e qualidade dos produtos.
                </p>
              </div>
            </div>

            {/* Valores */}
            <div
              style={{
                background: "white",
                borderRadius: 24,
                border: "1px solid var(--line)",
                padding: 36,
                boxShadow: "0 4px 24px rgba(15,25,35,0.05)",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--blue)",
                  fontFamily: "var(--font-mono)",
                  marginBottom: 24,
                }}
              >
                Valores
              </p>
              <div
                style={{
                  display: "grid",
                  gap: 16,
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                }}
              >
                {values.map((value, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                      padding: "18px 20px",
                      background: "var(--bg)",
                      borderRadius: 16,
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "var(--blue-light)",
                        color: "var(--blue)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <p
                      style={{
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "var(--ink-mid)",
                        fontFamily: "var(--font-mono)",
                        margin: 0,
                      }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dados da empresa */}
            <div
              style={{
                background: "var(--blue)",
                borderRadius: 24,
                padding: 36,
                color: "white",
              }}
            >
              <p
                className="font-sans"
                style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}
              >
                Halten Abraçadeiras
              </p>
              <div
                style={{
                  display: "grid",
                  gap: 12,
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  fontFamily: "var(--font-mono)",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                <div>
                  <span style={{ opacity: 0.7 }}>CNPJ</span>
                  <br />
                  43.453.407/0001-87
                </div>
                <div>
                  <span style={{ opacity: 0.7 }}>Endereço</span>
                  <br />
                  R. Alba Vieira, 653 — Cataratas
                  <br />
                  Cascavel/PR · 85818-630
                </div>
                <div>
                  <span style={{ opacity: 0.7 }}>Contato</span>
                  <br />
                  (45) 3197-2130
                  <br />
                  contato@halten.ind.br
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
