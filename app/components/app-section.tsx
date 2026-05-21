import Image from "next/image";

export function AppSection() {
  return (
    <section
      style={{
        background: "linear-gradient(135deg, #0a1e33 0%, #0f2d4a 50%, #0d2640 100%)",
        padding: "80px 32px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Glow decorativo */}
      <div
        style={{
          position: "absolute",
          right: "10%",
          top: "50%",
          transform: "translateY(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(28,155,215,0.1) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 48,
          flexWrap: "wrap",
          position: "relative",
        }}
      >
        {/* Conteúdo */}
        <div style={{ flex: 1, minWidth: 300, maxWidth: 580 }}>
          <p
            style={{
              display: "inline-flex",
              background: "rgba(28,155,215,0.15)",
              border: "1px solid rgba(28,155,215,0.3)",
              color: "#1c9bd7",
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
            Aplicativo Oficial
          </p>

          <h2
            className="font-sans"
            style={{
              fontSize: "clamp(30px, 4vw, 48px)",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              margin: "0 0 16px",
            }}
          >
            Halten no seu{" "}
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                color: "#7dd3f8",
              }}
            >
              celular
            </span>
          </h2>

          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.55)",
              fontFamily: "var(--font-mono)",
              fontWeight: 300,
              lineHeight: 1.75,
              maxWidth: 480,
              margin: "0 0 40px",
            }}
          >
            Consulte códigos, tabelas técnicas e o catálogo completo de abraçadeiras diretamente do seu smartphone. Disponível gratuitamente para Android e iOS.
          </p>

          {/* Badges */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {/* Google Play */}
            <a
              href="https://play.google.com/store/apps/details?id=br.com.ideia2001.HaltenAbracadeiras&hl=pt_BR"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 20px",
                borderRadius: 14,
                background: "white",
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
            >
              <Image
                src="/google-play-store-icon.svg"
                alt="Google Play"
                width={32}
                height={32}
                style={{ display: "block", flexShrink: 0 }}
              />
              <div>
                <p style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "#888", margin: 0, lineHeight: 1, letterSpacing: "0.05em" }}>
                  DISPONÍVEL NO
                </p>
                <p
                  className="font-sans"
                  style={{ fontSize: 18, fontWeight: 700, color: "#111", margin: "3px 0 0", lineHeight: 1 }}
                >
                  Google Play
                </p>
              </div>
            </a>

            {/* App Store */}
            <a
              href="https://apps.apple.com/br/app/halten-abra%C3%A7adeiras/id6761189859"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 20px",
                borderRadius: 14,
                background: "white",
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              }}
            >
              <Image
                src="/apple-black-logo.svg"
                alt="App Store"
                width={26}
                height={32}
                style={{ display: "block", flexShrink: 0 }}
              />
              <div>
                <p style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "#888", margin: 0, lineHeight: 1, letterSpacing: "0.05em" }}>
                  DISPONÍVEL NA
                </p>
                <p
                  className="font-sans"
                  style={{ fontSize: 18, fontWeight: 700, color: "#111", margin: "3px 0 0", lineHeight: 1 }}
                >
                  App Store
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Mockup do celular */}
        <div style={{ flexShrink: 0, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: 200,
              height: 360,
              borderRadius: 38,
              background: "rgba(255,255,255,0.04)",
              border: "1.5px solid rgba(255,255,255,0.12)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "28px 20px 24px",
              gap: 14,
              boxShadow: "0 32px 80px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06)",
              position: "relative",
            }}
          >
            {/* Notch */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: "50%",
                transform: "translateX(-50%)",
                width: 56,
                height: 6,
                borderRadius: 999,
                background: "rgba(255,255,255,0.15)",
              }}
            />
            {/* App icon */}
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "var(--blue)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
                boxShadow: "0 8px 24px rgba(28,155,215,0.4)",
              }}
            >
              <Image src="/icon-halten-white.svg" alt="" width={30} height={30} />
            </div>
            <p
              className="font-sans"
              style={{ fontSize: 13, fontWeight: 700, color: "white", margin: 0, textAlign: "center" }}
            >
              Halten
            </p>
            <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.07)" }} />
            {/* Fake rows */}
            {[
              { w: "90%", h: 9 },
              { w: "70%", h: 9 },
              { w: "85%", h: 9 },
              { w: "60%", h: 9 },
              { w: "80%", h: 9 },
              { w: "75%", h: 9 },
            ].map((r, i) => (
              <div
                key={i}
                style={{
                  width: r.w,
                  height: r.h,
                  borderRadius: 999,
                  background: i % 3 === 0
                    ? "rgba(28,155,215,0.3)"
                    : "rgba(255,255,255,0.07)",
                  alignSelf: "flex-start",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
