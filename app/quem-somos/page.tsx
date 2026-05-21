import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { AboutSection } from "../components/about-section";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero header */}
        <section style={{ background: "var(--ink)", padding: "96px 32px 80px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginBottom: 20,
              }}
            >
              [ Quem somos ]
            </p>
            <h1
              className="font-sans"
              style={{
                fontSize: "clamp(48px,6vw,80px)",
                fontWeight: 700,
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                color: "white",
                margin: 0,
              }}
            >
              A história{" "}
              <em style={{ fontStyle: "italic", color: "var(--blue)" }}>da Halten.</em>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.55)",
                maxWidth: 520,
                marginTop: 20,
              }}
            >
              Nascemos com o propósito de oferecer abraçadeiras de alta qualidade para o mercado industrial brasileiro, com transparência, ética e inovação.
            </p>
          </div>
        </section>

        {/* Conteúdo — reutiliza o mesmo bloco da home */}
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
