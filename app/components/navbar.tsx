"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Phone, Search, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/quem-somos", label: "Quem somos" },
  { href: "/localizacao", label: "Localização" },
  { href: "/contato", label: "Contato" },
];

const WA_LINK = "https://wa.me/5545991447046";

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 80,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            height: "100%",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{ flexShrink: 0, display: "flex", alignItems: "center", lineHeight: 0 }}
          >
            <Image
              src="/logo.svg"
              alt="Halten"
              width={120}
              height={36}
              priority
              style={{ width: 120, height: "auto" }}
            />
          </Link>

          {/* Desktop nav — fades out when search is open */}
          <nav
            className="hidden md:flex items-center justify-center gap-7"
            style={{
              flex: 1,
              opacity: searchOpen ? 0 : 1,
              pointerEvents: searchOpen ? "none" : "auto",
              transition: "opacity 0.25s ease",
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-sans"
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: "var(--ink)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop right group */}
          <div
            className="hidden md:flex items-center"
            style={{ gap: 8, flexShrink: 0 }}
          >
            {/* Search input + toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div
                style={{
                  overflow: "hidden",
                  width: searchOpen ? 220 : 0,
                  opacity: searchOpen ? 1 : 0,
                  transition: "width 0.35s ease, opacity 0.25s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid var(--line)",
                    borderRadius: 999,
                    padding: "6px 14px",
                    background: "white",
                    width: 220,
                  }}
                >
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Escape" && closeSearch()}
                    placeholder="Buscar produto..."
                    style={{
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      fontSize: 14,
                      color: "var(--ink)",
                      width: "100%",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={searchOpen ? closeSearch : () => setSearchOpen(true)}
                aria-label={searchOpen ? "Fechar busca" : "Buscar"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "var(--ink)",
                  flexShrink: 0,
                }}
              >
                {searchOpen ? <X size={18} /> : <Search size={18} />}
              </button>
            </div>

            {/* Atendimento */}
            <Link
              href={WA_LINK}
              target="_blank"
              rel="noreferrer"
              className="font-sans"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 22px",
                borderRadius: 999,
                background: "var(--blue)",
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              <Phone size={15} />
              Atendimento
            </Link>
          </div>

          {/* Mobile right group */}
          <div
            className="flex md:hidden items-center"
            style={{ marginLeft: "auto", gap: 8 }}
          >
            <Link
              href={WA_LINK}
              target="_blank"
              rel="noreferrer"
              aria-label="Atendimento"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "var(--blue)",
                color: "white",
              }}
            >
              <Phone size={16} />
            </Link>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menu"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 38,
                height: 38,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "var(--ink)",
              }}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Drawer overlay */}
      <div
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 60,
          background: "rgba(0,0,0,0.45)",
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Mobile drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 70,
          width: 280,
          background: "white",
          boxShadow: "-4px 0 40px rgba(0,0,0,0.12)",
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          display: "flex",
          flexDirection: "column",
          padding: "20px 24px 32px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <Link href="/" onClick={() => setDrawerOpen(false)} style={{ lineHeight: 0 }}>
            <Image
              src="/logo.svg"
              alt="Halten"
              width={100}
              height={28}
              style={{ width: 100, height: "auto" }}
            />
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Fechar menu"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--ink)",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setDrawerOpen(false)}
              className="font-sans"
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "var(--ink)",
                textDecoration: "none",
                padding: "14px 4px",
                borderBottom: "1px solid var(--line-soft)",
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Link
          href={WA_LINK}
          target="_blank"
          rel="noreferrer"
          onClick={() => setDrawerOpen(false)}
          className="font-sans"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "14px 20px",
            borderRadius: 999,
            background: "var(--blue)",
            color: "white",
            fontSize: 15,
            fontWeight: 600,
            textDecoration: "none",
            marginTop: 24,
          }}
        >
          <Phone size={16} />
          Atendimento
        </Link>
      </div>
    </>
  );
}
