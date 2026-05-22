"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setError("");

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos."
          : authError.message
      );
      setIsPending(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px 12px 40px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 12,
    fontSize: 14,
    fontFamily: "var(--font-mono)",
    color: "var(--ink)",
    outline: "none",
    boxSizing: "border-box",
    background: "#f8fafc",
    transition: "border-color 0.15s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#64748b",
    fontFamily: "var(--font-mono)",
    marginBottom: 8,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #0a1628 0%, #0f2a4a 50%, #1c3a5e 100%)",
        padding: 24,
      }}
    >
      {/* Subtle grid overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(28,155,215,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(28,155,215,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "white",
          borderRadius: 24,
          padding: "40px 36px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
          <Image
            src="/icon-halten.svg"
            alt="Halten"
            width={48}
            height={48}
            style={{ width: 48, height: 48 }}
          />
        </div>

        <p
          style={{
            fontSize: 12,
            color: "#94a3b8",
            fontFamily: "var(--font-mono)",
            textAlign: "center",
            marginBottom: 32,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Painel administrativo
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* E-mail */}
          <div>
            <label style={labelStyle}>E-mail</label>
            <div style={{ position: "relative" }}>
              <Mail
                size={15}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  pointerEvents: "none",
                }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                autoComplete="email"
                placeholder="admin@halten.com.br"
                style={inputBase}
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label style={labelStyle}>Senha</label>
            <div style={{ position: "relative" }}>
              <Lock
                size={15}
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  pointerEvents: "none",
                }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                style={inputBase}
              />
            </div>
          </div>

          {/* Erro */}
          {error && (
            <p
              style={{
                fontSize: 13,
                color: "#dc2626",
                fontFamily: "var(--font-mono)",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 8,
                padding: "10px 14px",
                margin: 0,
              }}
            >
              {error}
            </p>
          )}

          {/* Botão */}
          <button
            type="submit"
            disabled={isPending}
            className="font-sans"
            style={{
              padding: "13px 24px",
              borderRadius: 999,
              background: isPending ? "#94a3b8" : "var(--blue)",
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              border: "none",
              cursor: isPending ? "not-allowed" : "pointer",
              transition: "background 0.2s ease",
              marginTop: 4,
              letterSpacing: "0.02em",
            }}
          >
            {isPending ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
