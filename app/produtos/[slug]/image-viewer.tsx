"use client";

import { useState } from "react";

type Props = {
  images: string[];
  slug: string;
  productName: string;
};

export function ImageViewer({ images, slug, productName }: Props) {
  const [active, setActive] = useState(0);
  const mainSrc = images.length > 0 ? images[active] : null;

  const prev = () => setActive((active - 1 + images.length) % images.length);
  const next = () => setActive((active + 1) % images.length);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Frame */}
      <div
        style={{
          borderRadius: 18,
          overflow: "hidden",
          background: "#fff",
          border: "1px solid rgba(15,25,35,0.08)",
        }}
      >
        {/* Stage */}
        <div
          style={{
            position: "relative",
            aspectRatio: "4/3",
            display: "grid",
            placeItems: "center",
            overflow: "hidden",
            background:
              "radial-gradient(90% 80% at 50% 40%, #ffffff 0%, #eef2f5 52%, oklch(0.92 0.018 233) 100%)",
          }}
        >
          {/* Corner ticks */}
          <span style={{ position: "absolute", top: 14, left: 14, width: 16, height: 16, borderLeft: "1px solid rgba(15,25,35,0.28)", borderTop: "1px solid rgba(15,25,35,0.28)", zIndex: 4 }} />
          <span style={{ position: "absolute", top: 14, right: 14, width: 16, height: 16, borderRight: "1px solid rgba(15,25,35,0.28)", borderTop: "1px solid rgba(15,25,35,0.28)", zIndex: 4 }} />
          <span style={{ position: "absolute", bottom: 14, left: 14, width: 16, height: 16, borderLeft: "1px solid rgba(15,25,35,0.28)", borderBottom: "1px solid rgba(15,25,35,0.28)", zIndex: 4 }} />
          <span style={{ position: "absolute", bottom: 14, right: 14, width: 16, height: 16, borderRight: "1px solid rgba(15,25,35,0.28)", borderBottom: "1px solid rgba(15,25,35,0.28)", zIndex: 4 }} />

          {/* Nav pill */}
          {images.length > 1 && (
            <div
              style={{
                position: "absolute",
                top: 16,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 5,
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: 4,
                borderRadius: 999,
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(15,25,35,0.08)",
                backdropFilter: "blur(6px)",
              }}
            >
              <button
                type="button"
                onClick={prev}
                aria-label="Anterior"
                style={{
                  width: 26, height: 26, border: 0, borderRadius: "50%",
                  background: "transparent", cursor: "pointer",
                  display: "grid", placeItems: "center",
                  fontSize: 15, lineHeight: 1, color: "#0f1923",
                }}
              >
                ‹
              </button>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", fontWeight: 500, padding: "0 8px", color: "#0f1923" }}>
                {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={next}
                aria-label="Próximo"
                style={{
                  width: 26, height: 26, border: 0, borderRadius: "50%",
                  background: "transparent", cursor: "pointer",
                  display: "grid", placeItems: "center",
                  fontSize: 15, lineHeight: 1, color: "#0f1923",
                }}
              >
                ›
              </button>
            </div>
          )}

          {/* Product image — multiply removes white background automatically */}
          {mainSrc ? (
            <img
              src={mainSrc}
              alt={productName}
              style={{
                width: "84%",
                height: "84%",
                objectFit: "contain",
                mixBlendMode: "multiply",
                position: "relative",
                zIndex: 2,
              }}
            />
          ) : (
            <div
              style={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                color: "rgba(15,25,35,0.2)",
              }}
            >
              <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" style={{ width: 56, height: 56 }}>
                <circle cx="50" cy="50" r="30" />
                <circle cx="50" cy="50" r="38" strokeDasharray="2 2" opacity="0.55" />
                <rect x="38" y="14" width="24" height="14" rx="2" fill="currentColor" opacity="0.85" />
                <path d="M44 16h12M44 22h12" />
              </svg>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Imagem não disponível
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: "0 2px" }}>
          {images.map((src, i) => {
            const isActive = i === active;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                style={{
                  position: "relative",
                  aspectRatio: "1/1",
                  borderRadius: 12,
                  overflow: "hidden",
                  cursor: "pointer",
                  border: `1.5px solid ${isActive ? "#1c9bd7" : "rgba(15,25,35,0.08)"}`,
                  background: "#fff",
                  padding: 0,
                  transition: "border-color 0.15s",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "grid",
                    placeItems: "center",
                    background: "radial-gradient(120% 120% at 50% 30%, #fff, #e9eef2)",
                  }}
                >
                  <img
                    src={src}
                    alt={`Vista ${i + 1}`}
                    style={{ width: "78%", height: "78%", objectFit: "contain", mixBlendMode: "multiply" }}
                  />
                </div>
                <span
                  style={{
                    position: "absolute",
                    bottom: 8,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.16em",
                    color: isActive ? "#1c9bd7" : "rgba(15,25,35,0.55)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
