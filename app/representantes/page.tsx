import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { getSupabaseAdmin } from "../../lib/supabase";
import { BrazilMap } from "./BrazilMap";

export const dynamic = "force-dynamic";
export const metadata = { title: "Representantes — Halten Abraçadeiras" };

export default async function RepresentativesPublicPage() {
  const { data: reps } = await getSupabaseAdmin()
    .from("representatives")
    .select("id, name, whatsapp, state")
    .eq("active", true)
    .order("state", { ascending: true });

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section
          style={{
            background: "linear-gradient(160deg, #0a1628 0%, #0d1f38 60%, #0a1220 100%)",
            padding: "80px 32px 72px",
            textAlign: "center",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p style={{ fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--blue)", marginBottom: 16 }}>
            Rede Nacional
          </p>
          <h1
            className="font-sans"
            style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 700, color: "white", margin: "0 0 16px", lineHeight: 1.15 }}
          >
            Nossos Representantes
          </h1>
          <p style={{ fontSize: 16, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.5)", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
            Encontre o representante Halten no seu estado e entre em contato diretamente pelo WhatsApp.
          </p>
        </section>

        {/* Mapa */}
        <section style={{ background: "#0f1923", padding: "64px 32px 80px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <BrazilMap representatives={reps ?? []} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
