const ITEMS = ["HALTEN ABRAÇADEIRAS", "DESDE 2022", "TRANSPARÊNCIA E ÉTICA", "QUALIDADE E INOVAÇÃO"];

const Dot = () => (
  <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "var(--ink-2)", margin: "0 24px", flexShrink: 0 }} />
);

function Strip() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
      {ITEMS.map((item, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
          {item}
          <Dot />
        </span>
      ))}
    </span>
  );
}

export function MarqueeSection() {
  return (
    <div
      aria-hidden="true"
      style={{
        background: "var(--blue)",
        color: "var(--ink-2)",
        overflow: "hidden",
        height: 62,
        display: "flex",
        alignItems: "center",
        borderTop: "1px solid rgba(255,255,255,0.15)",
        borderBottom: "1px solid rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          animation: "marquee-scroll 28s linear infinite",
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          fontSize: 20,
          letterSpacing: "-0.01em",
          willChange: "transform",
        }}
      >
        <Strip />
        <Strip />
      </div>
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
