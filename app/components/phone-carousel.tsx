"use client";

import { useState, useEffect, useCallback } from "react";

const SCREENS = [
  "/app-screen/screen- (1).PNG",
  "/app-screen/screen- (2).PNG",
  "/app-screen/screen- (3).PNG",
  "/app-screen/screen- (4).PNG",
  "/app-screen/screen- (5).PNG",
];

const INTERVAL = 3000;

export function PhoneCarousel() {
  const [current, setCurrent] = useState(0);
  const total = SCREENS.length;

  const go = useCallback((n: number) => {
    setCurrent(((n % total) + total) % total);
  }, [total]);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % total), INTERVAL);
    return () => clearInterval(t);
  }, [total]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* ── iPhone frame ── */}
      <div
        style={{
          position: "relative",
          width: 280,
          height: 572,
          borderRadius: 50,
          background: "linear-gradient(160deg, #2a2a2e 0%, #1a1a1e 60%, #111114 100%)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.08) inset, " +
            "0 0 0 1.5px rgba(0,0,0,0.9), " +
            "0 40px 80px -20px rgba(0,0,0,0.8), " +
            "0 0 60px -10px rgba(28,155,215,0.15)",
          padding: "12px 10px",
        }}
      >
        {/* Side button — volume up */}
        <div style={{ position: "absolute", left: -3, top: 110, width: 3, height: 32, borderRadius: "2px 0 0 2px", background: "#2a2a2e" }} />
        <div style={{ position: "absolute", left: -3, top: 152, width: 3, height: 32, borderRadius: "2px 0 0 2px", background: "#2a2a2e" }} />
        {/* Side button — power */}
        <div style={{ position: "absolute", right: -3, top: 130, width: 3, height: 56, borderRadius: "0 2px 2px 0", background: "#2a2a2e" }} />

        {/* Screen */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 40,
            background: "#000",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Dynamic Island */}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: "50%",
              transform: "translateX(-50%)",
              width: 88,
              height: 28,
              background: "#000",
              borderRadius: 20,
              zIndex: 10,
            }}
          />

          {/* Slides track */}
          <div
            style={{
              display: "flex",
              width: `${total * 100}%`,
              height: "100%",
              transform: `translateX(-${(current / total) * 100}%)`,
              transition: "transform 0.5s cubic-bezier(0.7,0,0.2,1)",
            }}
          >
            {SCREENS.map((src, i) => (
              <div
                key={i}
                style={{
                  width: `${100 / total}%`,
                  flexShrink: 0,
                  height: "100%",
                  background: "#0f1923",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`App screen ${i + 1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dots */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          marginTop: 16,
        }}
      >
        {SCREENS.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Screen ${i + 1}`}
            onClick={() => go(i)}
            style={{
              width: current === i ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: current === i ? "var(--blue)" : "rgba(255,255,255,0.2)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
