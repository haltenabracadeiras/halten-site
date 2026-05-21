"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const GP_LINK = "https://play.google.com/store/apps/details?id=br.com.ideia2001.HaltenAbracadeiras&hl=pt_BR";
const AS_LINK = "https://apps.apple.com/br/app/halten-abra%C3%A7adeiras/id6761189859";
const INTERVAL = 6500;

export type AdminBanner = {
  id: string;
  title: string | null;
  subtitle: string | null;
  cta_text: string | null;
  cta_link: string | null;
  image_url: string | null;
};

type Props = { adminBanners: AdminBanner[] };

/* ─── Slide 1 — App launch ───────────────────────────────── */
function Slide1() {
  return (
    <div
      style={{
        flex: "0 0 100%",
        height: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        padding: "0 clamp(24px,6vw,96px)",
        background: "radial-gradient(120% 100% at 20% 30%, #1c9bd7 0%, #0f5d8a 55%, #0a3a59 100%)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 580, position: "relative", zIndex: 2 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)", padding: "8px 14px", borderRadius: 999, marginBottom: 24 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "white", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "white" }}>Novidade · App Oficial</span>
        </div>

        <h1 className="font-sans" style={{ fontSize: "clamp(44px,7vw,88px)", fontWeight: 700, lineHeight: 0.95, letterSpacing: "-0.03em", color: "white", margin: "0 0 18px" }}>
          O App da Halten <em style={{ fontStyle: "italic", fontWeight: 600, color: "#cdeafa" }}>chegou.</em>
        </h1>

        <p style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(13px,1.2vw,15px)", lineHeight: 1.6, color: "rgba(255,255,255,0.85)", maxWidth: 480, marginBottom: 32 }}>
          Catálogo completo, especificações técnicas e pedidos diretamente na palma da sua mão. Disponível gratuitamente para iOS e Android.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            {
              href: AS_LINK,
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M17.05 12.04c-.03-2.46 2.01-3.64 2.1-3.7-1.15-1.68-2.94-1.91-3.57-1.93-1.5-.16-2.95.9-3.72.9-.78 0-1.96-.88-3.23-.86-1.65.03-3.2.96-4.05 2.44-1.74 3.01-.44 7.45 1.24 9.89.82 1.19 1.79 2.52 3.07 2.48 1.24-.05 1.7-.79 3.2-.79 1.49 0 1.92.79 3.22.77 1.33-.02 2.17-1.2 2.98-2.4.94-1.37 1.32-2.71 1.34-2.78-.03-.01-2.55-.98-2.58-3.89zM14.65 4.52c.69-.83 1.15-2 1.02-3.14-.99.04-2.18.66-2.89 1.49-.64.73-1.2 1.9-1.05 3.02 1.1.08 2.23-.55 2.92-1.37z"/></svg>,
              label: "Disponível na",
              name: "App Store",
            },
            {
              href: GP_LINK,
              icon: <Image src="/google-play-store-icon.svg" alt="" width={22} height={22} />,
              label: "Disponível no",
              name: "Google Play",
            },
          ].map((store) => (
            <a key={store.name} href={store.href} target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 12, background: "#0a1219", padding: "12px 20px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", textDecoration: "none" }}>
              <div style={{ width: 28, height: 28, display: "grid", placeItems: "center", flexShrink: 0 }}>{store.icon}</div>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>{store.label}</div>
                <div className="font-sans" style={{ fontWeight: 600, fontSize: 15, color: "white", marginTop: 1 }}>{store.name}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Phone mock */}
      <div
        className="hero-phone-mock"
        style={{ position: "absolute", right: "clamp(24px,6vw,96px)", top: "50%", transform: "translateY(-50%)", width: "min(240px,30vw)", height: "min(480px,60vw)", borderRadius: 38, background: "#0f1923", border: "6px solid #0a1219", boxShadow: "0 40px 80px -30px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08) inset", padding: 18, zIndex: 2 }}
      >
        <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 90, height: 24, background: "#0a1219", borderRadius: 14 }} />
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg,#103a55,#0a1219)", borderRadius: 26, padding: "42px 16px 16px" }}>
          <div style={{ background: "var(--blue)", borderRadius: 14, padding: 14, display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "white", display: "grid", placeItems: "center" }}>
              <Image src="/icon-halten.svg" alt="" width={14} height={14} />
            </div>
            <div>
              <div className="font-sans" style={{ fontWeight: 700, fontSize: 13, color: "white" }}>Halten Abraçadeiras</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, opacity: 0.75, letterSpacing: "0.1em", color: "white" }}>NEGÓCIOS · v2.4</div>
            </div>
          </div>
          {[{ l: "Pesquisar produto", s: "cód, modelo, dimensão" }, { l: "Lançamentos", s: "Atualizado recentemente" }, { l: "Carrinho", s: "3 itens · em rascunho" }, { l: "Mensagens", s: "Suporte técnico" }].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: 10, background: "rgba(255,255,255,0.06)", borderRadius: 10, marginTop: i === 0 ? 14 : 8 }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, background: i === 1 ? "white" : i === 3 ? "rgba(255,255,255,0.4)" : "var(--blue)", flexShrink: 0, opacity: i === 1 ? 1 : 0.85 }} />
              <div>
                <b style={{ display: "block", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 11, color: "white", marginBottom: 2 }}>{row.l}</b>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,0.55)" }}>{row.s}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Slide 2 — Industrial ──────────────────────────────── */
function Slide2() {
  return (
    <div
      style={{ flex: "0 0 100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(24px,6vw,96px)", background: "linear-gradient(120deg,#0f1923 0%,#14283a 60%,#1c9bd7 130%)", overflow: "hidden" }}
    >
      <div style={{ maxWidth: 580, position: "relative", zIndex: 2, flex: 1 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(28,155,215,0.18)", border: "1px solid rgba(28,155,215,0.4)", padding: "8px 14px", borderRadius: 999, marginBottom: 24 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--blue-2)", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--blue-2)" }}>Linha 2026 · Inox AISI 304/316</span>
        </div>

        <h1 className="font-sans" style={{ fontSize: "clamp(40px,6vw,78px)", fontWeight: 700, lineHeight: 0.96, letterSpacing: "-0.03em", color: "white", margin: "0 0 22px" }}>
          Fixação <em style={{ fontStyle: "italic", color: "var(--blue)" }}>industrial</em><br />em alta resistência.
        </h1>

        <p style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(13px,1.2vw,14px)", lineHeight: 1.7, color: "rgba(255,255,255,0.7)", maxWidth: 480, marginBottom: 32 }}>
          Abraçadeiras desenvolvidas para suportar vibração, pressão e ciclos térmicos extremos. Cada peça é testada em laboratório próprio.
        </p>

        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/produtos" style={{ display: "inline-flex", alignItems: "center", gap: 10, height: 46, padding: "0 22px", borderRadius: 10, background: "var(--blue)", color: "white", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", fontWeight: 500, boxShadow: "0 12px 28px -12px rgba(28,155,215,0.55)" }}>
            Ver linha completa
          </Link>
          <a href="https://www.baixecatalogo.com.br/catalogo/halten-abracadeiras" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", height: 46, padding: "0 22px", borderRadius: 10, background: "transparent", border: "1px solid rgba(255,255,255,0.18)", color: "white", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", fontWeight: 500 }}>
            Catálogo digital
          </a>
        </div>
      </div>

      {/* Rings */}
      <div className="hero-rings" style={{ flexShrink: 0, position: "relative", width: "min(480px,38vw)", height: "min(480px,38vw)" }}>
        {[
          { inset: 0, border: "2px dashed rgba(255,255,255,0.18)" },
          { inset: 50, border: "1px solid rgba(255,255,255,0.08)" },
          { inset: 120, border: "2px solid rgba(28,155,215,0.45)" },
          { inset: 170, border: "6px solid rgba(28,155,215,0.7)", background: "radial-gradient(circle at 30% 30%,rgba(255,255,255,0.15),transparent 70%)" },
          { inset: 200, border: "1px solid white", background: "rgba(255,255,255,0.06)" },
        ].map((r, i) => (
          <div key={i} style={{ position: "absolute", inset: r.inset, borderRadius: "50%", border: r.border, background: r.background }} />
        ))}
        <span style={{ position: "absolute", fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", top: -22, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap" }}>⌀ 76 mm</span>
        <span style={{ position: "absolute", fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", right: -90, top: "50%", transform: "translateY(-50%)", whiteSpace: "nowrap" }}>torque · 12 N·m</span>
        <span style={{ position: "absolute", fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.1em", bottom: -22, left: "50%", transform: "translateX(-50%)", whiteSpace: "nowrap" }}>aço inox W4</span>
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
          <div className="font-sans" style={{ fontWeight: 700, fontSize: "clamp(20px,2.5vw,34px)", letterSpacing: "-0.02em", color: "white" }}>SAE J1508</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", color: "var(--blue-2)", textTransform: "uppercase", marginTop: 4 }}>Norma aplicada</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Slide de banner do admin — altura natural pela imagem ─ */
function AdminSlide({ banner, total }: { banner: AdminBanner; total: number }) {
  return (
    <div style={{ width: `${100 / total}%`, flexShrink: 0, position: "relative" }}>
      {/* Imagem define a altura — sem objectFit, sem corte */}
      {banner.image_url ? (
        <img
          src={banner.image_url}
          alt={banner.title ?? "Banner"}
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      ) : (
        <div style={{ width: "100%", paddingTop: "50%", background: "#0a1219" }} />
      )}

      {/* Overlay + conteúdo textual opcional */}
      {(banner.title || banner.subtitle || banner.cta_text) && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,18,25,0.85) 0%, rgba(10,18,25,0.3) 55%, transparent 100%)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 clamp(24px,6vw,96px) clamp(40px,6vw,72px)", zIndex: 2 }}>
            {banner.title && (
              <h1 className="font-sans" style={{ fontSize: "clamp(28px,4vw,64px)", fontWeight: 700, lineHeight: 1.0, letterSpacing: "-0.03em", color: "white", margin: "0 0 12px", textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>
                {banner.title}
              </h1>
            )}
            {banner.subtitle && (
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(12px,1.1vw,15px)", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: 20, maxWidth: 640 }}>
                {banner.subtitle}
              </p>
            )}
            {banner.cta_text && banner.cta_link && (
              <Link href={banner.cta_link} style={{ display: "inline-flex", alignItems: "center", gap: 10, height: 46, padding: "0 22px", borderRadius: 10, background: "var(--blue)", color: "white", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", textDecoration: "none", fontWeight: 500, boxShadow: "0 12px 28px -12px rgba(28,155,215,0.55)" }}>
                {banner.cta_text}
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* Botões de navegação reutilizáveis */
function NavButtons({ total, current, go }: { total: number; current: number; go: (n: number) => void }) {
  if (total <= 1) return null;
  return (
    <>
      {[{ side: "left", dir: -1, path: "m15 18-6-6 6-6", label: "Anterior" }, { side: "right", dir: 1, path: "m9 18 6-6-6-6", label: "Próximo" }].map((ctrl) => (
        <button
          key={ctrl.label}
          type="button"
          aria-label={ctrl.label}
          onClick={() => go(current + ctrl.dir)}
          style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", [ctrl.side]: 32, zIndex: 5, width: 54, height: 54, borderRadius: "50%", background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.25)", display: "grid", placeItems: "center", color: "white", cursor: "pointer", backdropFilter: "blur(10px)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={ctrl.path} /></svg>
        </button>
      ))}
      <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 5 }}>
        {Array.from({ length: total }).map((_, i) => (
          <button key={i} type="button" aria-label={`Slide ${i + 1}`} onClick={() => go(i)}
            style={{ width: current === i ? 48 : 32, height: 4, borderRadius: 2, background: current === i ? "white" : "rgba(255,255,255,0.25)", border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s ease" }} />
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 24, right: 48, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.14em", color: "rgba(255,255,255,0.7)", zIndex: 5 }}>
        SLIDE <b style={{ color: "white", fontWeight: 500 }}>{String(current + 1).padStart(2, "0")}</b> / {String(total).padStart(2, "0")}
      </div>
    </>
  );
}

/* ─── Carousel principal ────────────────────────────────── */
export function HeroCarousel({ adminBanners }: Props) {
  const useAdmin = adminBanners.length > 0;
  const total = useAdmin ? adminBanners.length : 2;

  const [current, setCurrent] = useState(0);

  const go = useCallback((n: number) => {
    setCurrent(((n % total) + total) % total);
  }, [total]);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % total), INTERVAL);
    return () => clearInterval(t);
  }, [total]);

  /* ── Admin: altura natural (imagem define height) ── */
  if (useAdmin) {
    return (
      <section style={{ position: "relative", width: "100%", overflow: "hidden", background: "#0a1219" }}>
        {/* Track: largura total × nº de slides, desloca por porcentagem */}
        <div
          style={{
            display: "flex",
            width: `${total * 100}%`,
            transform: `translateX(-${(current / total) * 100}%)`,
            transition: "transform 0.7s cubic-bezier(0.7,0,0.2,1)",
          }}
        >
          {adminBanners.map((b) => (
            <AdminSlide key={b.id} banner={b} total={total} />
          ))}
        </div>
        <NavButtons total={total} current={current} go={go} />
      </section>
    );
  }

  /* ── Default: slides fixos com altura clamp ── */
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(520px,65vw,780px)",
        background: "#0a1219",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          transform: `translateX(${-current * 100}%)`,
          transition: "transform 0.7s cubic-bezier(0.7,0,0.2,1)",
        }}
      >
        <Slide1 key="s1" />
        <Slide2 key="s2" />
      </div>
      <NavButtons total={total} current={current} go={go} />
      <style>{`
        @media (max-width: 768px) {
          .hero-phone-mock { display: none !important; }
          .hero-rings { display: none !important; }
        }
      `}</style>
    </section>
  );
}
