"use client";

import { useState } from "react";

const MAX_THUMBS = 4;

type Props = {
  images: string[];
  slug: string;
  productName: string;
};

export function ImageViewer({ images, slug, productName }: Props) {
  const [active, setActive] = useState(0);
  const mainSrc = images.length > 0 ? images[active] : null;

  const visibleThumbs = images.slice(0, MAX_THUMBS);
  const overflow = images.length - MAX_THUMBS;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Main viewer */}
      <div
        style={{
          position: "relative",
          background: "#0a1219",
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.06)",
          aspectRatio: "4/3",
          display: "grid",
          placeItems: "center",
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(28,155,215,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(28,155,215,0.07) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Corner labels */}
        <span
          style={{
            position: "absolute",
            top: 14,
            left: 16,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "rgba(255,255,255,0.22)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            zIndex: 2,
          }}
        >
          REF · {slug.toUpperCase()}
        </span>
        <span
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "rgba(255,255,255,0.22)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            zIndex: 2,
          }}
        >
          VIEW · ORTHO
        </span>
        <span
          style={{
            position: "absolute",
            bottom: 14,
            left: 16,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "rgba(255,255,255,0.22)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            zIndex: 2,
          }}
        >
          SCALE · 1:2
        </span>
        <span
          style={{
            position: "absolute",
            bottom: 14,
            right: 16,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "rgba(255,255,255,0.22)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            zIndex: 2,
          }}
        >
          UNITS · MM
        </span>

        {/* Image counter */}
        {images.length > 1 && (
          <div
            style={{
              position: "absolute",
              top: 14,
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.1em",
              background: "rgba(0,0,0,0.35)",
              padding: "3px 10px",
              borderRadius: 4,
              zIndex: 2,
            }}
          >
            {active + 1} / {images.length}
          </div>
        )}

        {/* Image */}
        {mainSrc ? (
          <img
            src={mainSrc}
            alt={productName}
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "78%",
              maxHeight: "78%",
              objectFit: "contain",
            }}
          />
        ) : (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              color: "rgba(255,255,255,0.12)",
            }}
          >
            <svg
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              style={{ width: 56, height: 56 }}
            >
              <circle cx="50" cy="50" r="30" />
              <circle cx="50" cy="50" r="38" strokeDasharray="2 2" opacity="0.55" />
              <rect x="38" y="14" width="24" height="14" rx="2" fill="currentColor" opacity="0.85" />
              <path d="M44 16h12M44 22h12" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Imagem não disponível
            </span>
          </div>
        )}
      </div>

      {/* Thumbnail strip — only when there are multiple images */}
      {images.length > 1 && (
        <div style={{ display: "flex", gap: 8 }}>
          {visibleThumbs.map((src, i) => {
            const isActive = i === active;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: 0,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {/* Thumbnail card */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "1/1",
                    borderRadius: 12,
                    border: isActive
                      ? "2px solid var(--ink)"
                      : "2px solid rgba(15,25,35,0.1)",
                    background: "white",
                    padding: 6,
                    overflow: "hidden",
                    display: "grid",
                    placeItems: "center",
                    transition: "border-color 0.15s",
                  }}
                >
                  <img
                    src={src}
                    alt={`Vista ${i + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
                {/* Label */}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: isActive ? "var(--ink)" : "rgba(15,25,35,0.35)",
                    fontWeight: isActive ? 500 : 400,
                    transition: "color 0.15s",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            );
          })}

          {/* Overflow "+N fotos" */}
          {overflow > 0 && (
            <button
              type="button"
              onClick={() => setActive(MAX_THUMBS)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: 0,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  borderRadius: 12,
                  border: "2px dashed rgba(15,25,35,0.18)",
                  background: "rgba(15,25,35,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 16,
                    fontWeight: 600,
                    color: "rgba(15,25,35,0.45)",
                    lineHeight: 1,
                  }}
                >
                  +{overflow}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.08em",
                    color: "rgba(15,25,35,0.35)",
                  }}
                >
                  fotos
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(15,25,35,0.3)",
                }}
              >
                mais
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
