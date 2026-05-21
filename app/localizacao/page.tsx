import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";

export default function LocationPage() {
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
              Localização
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
              Estamos em{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#7dd3f8" }}>
                Cascavel
              </span>
            </h1>
            <p
              style={{
                marginTop: 16,
                fontSize: 16,
                color: "rgba(255,255,255,0.8)",
                fontFamily: "var(--font-mono)",
                fontWeight: 300,
              }}
            >
              Venha nos visitar ou entre em contato para agendar.
            </p>
          </div>
        </section>

        {/* Content */}
        <section style={{ padding: "64px 24px" }}>
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              display: "grid",
              gap: 32,
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            }}
          >
            {/* Info column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Address */}
              <div
                style={{
                  background: "white",
                  borderRadius: 24,
                  border: "1px solid var(--line)",
                  padding: 28,
                  boxShadow: "0 4px 24px rgba(15,25,35,0.05)",
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "var(--blue-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MapPin size={20} color="var(--blue)" />
                </div>
                <div>
                  <p
                    className="font-sans"
                    style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}
                  >
                    Endereço
                  </p>
                  <p style={{ fontSize: 14, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", lineHeight: 1.7, margin: 0 }}>
                    R. Alba Vieira, 653 — Cataratas
                    <br />
                    Cascavel, PR · CEP 85818-630
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div
                style={{
                  background: "white",
                  borderRadius: 24,
                  border: "1px solid var(--line)",
                  padding: 28,
                  boxShadow: "0 4px 24px rgba(15,25,35,0.05)",
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "var(--blue-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Phone size={20} color="var(--blue)" />
                </div>
                <div>
                  <p
                    className="font-sans"
                    style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}
                  >
                    Telefone
                  </p>
                  <p style={{ fontSize: 14, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", lineHeight: 1.7, margin: 0 }}>
                    (45) 3197-2130
                    <br />
                    (45) 99144-7046 · WhatsApp
                  </p>
                </div>
              </div>

              {/* Email */}
              <div
                style={{
                  background: "white",
                  borderRadius: 24,
                  border: "1px solid var(--line)",
                  padding: 28,
                  boxShadow: "0 4px 24px rgba(15,25,35,0.05)",
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "var(--blue-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Mail size={20} color="var(--blue)" />
                </div>
                <div>
                  <p
                    className="font-sans"
                    style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}
                  >
                    E-mail
                  </p>
                  <p style={{ fontSize: 14, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", lineHeight: 1.7, margin: 0 }}>
                    contato@halten.ind.br
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div
                style={{
                  background: "white",
                  borderRadius: 24,
                  border: "1px solid var(--line)",
                  padding: 28,
                  boxShadow: "0 4px 24px rgba(15,25,35,0.05)",
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "var(--blue-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Clock size={20} color="var(--blue)" />
                </div>
                <div>
                  <p
                    className="font-sans"
                    style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}
                  >
                    Horário de atendimento
                  </p>
                  <p style={{ fontSize: 14, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", lineHeight: 1.7, margin: 0 }}>
                    Segunda a sexta · 08:00 às 17:30
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div
              style={{
                borderRadius: 24,
                border: "1px solid var(--line)",
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(15,25,35,0.05)",
                minHeight: 400,
              }}
            >
              <iframe
                title="Localização Halten Abraçadeiras"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3600.0!2d-53.4595!3d-24.9566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zLTI0Ljk1NjYsLTUzLjQ1OTU!5e0!3m2!1spt-BR!2sbr!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0, display: "block", minHeight: 400 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
