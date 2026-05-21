import Link from "next/link";
import { Package, Image as ImageIcon, Star, Eye } from "lucide-react";
import { getSupabaseAdmin } from "../../../lib/supabase";

export const dynamic = "force-dynamic";

async function getStats() {
  const db = getSupabaseAdmin();

  const [
    { count: totalProducts },
    { count: featuredProducts },
    { count: activeProducts },
    { count: totalBanners },
    { count: activeBanners },
  ] = await Promise.all([
    db.from("products").select("*", { count: "exact", head: true }),
    db.from("products").select("*", { count: "exact", head: true }).eq("featured", true),
    db.from("products").select("*", { count: "exact", head: true }).eq("active", true),
    db.from("banners").select("*", { count: "exact", head: true }),
    db.from("banners").select("*", { count: "exact", head: true }).eq("active", true),
  ]);

  return {
    totalProducts: totalProducts ?? 0,
    featuredProducts: featuredProducts ?? 0,
    activeProducts: activeProducts ?? 0,
    totalBanners: totalBanners ?? 0,
    activeBanners: activeBanners ?? 0,
  };
}

async function getRecentProducts() {
  const { data } = await getSupabaseAdmin()
    .from("products")
    .select("id,name,category,active,featured")
    .order("created_at", { ascending: false })
    .limit(5);
  return data ?? [];
}

const statCards = [
  { label: "Total de Produtos", key: "totalProducts", icon: Package, color: "var(--blue)" },
  { label: "Em Destaque", key: "featuredProducts", icon: Star, color: "#f59e0b" },
  { label: "Produtos Ativos", key: "activeProducts", icon: Eye, color: "var(--green)" },
  { label: "Banners Ativos", key: "activeBanners", icon: ImageIcon, color: "#8b5cf6" },
] as const;

export default async function DashboardPage() {
  const [stats, recent] = await Promise.all([getStats(), getRecentProducts()]);

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 32 }}>
        <h1
          className="font-sans"
          style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", margin: 0 }}
        >
          Dashboard
        </h1>
        <p style={{ fontSize: 13, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
          Visão geral do painel administrativo
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
          marginBottom: 32,
        }}
      >
        {statCards.map(({ label, key, icon: Icon, color }) => (
          <div
            key={key}
            style={{
              background: "white",
              borderRadius: 16,
              border: "1px solid var(--line)",
              padding: 24,
              boxShadow: "0 2px 12px rgba(15,25,35,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "var(--ink-dim)", letterSpacing: "0.08em", margin: 0 }}>
                {label}
              </p>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: `${color}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={16} color={color} />
              </div>
            </div>
            <p
              className="font-sans"
              style={{ fontSize: 32, fontWeight: 800, color: "var(--ink)", margin: 0, lineHeight: 1 }}
            >
              {stats[key]}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions + Recent products */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
        }}
      >
        {/* Quick actions */}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            border: "1px solid var(--line)",
            padding: 24,
            boxShadow: "0 2px 12px rgba(15,25,35,0.04)",
          }}
        >
          <p className="font-sans" style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 16 }}>
            Ações rápidas
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { href: "/admin/produtos/novo", label: "Novo Produto", bg: "var(--blue)" },
              { href: "/admin/banners/novo", label: "Novo Banner", bg: "#8b5cf6" },
              { href: "/admin/configuracoes", label: "Configurações", bg: "var(--ink-mid)" },
            ].map(({ href, label, bg }) => (
              <Link
                key={href}
                href={href}
                className="font-sans"
                style={{
                  display: "block",
                  padding: "11px 16px",
                  borderRadius: 10,
                  background: bg,
                  color: "white",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "opacity 0.15s ease",
                }}
              >
                + {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent products */}
        <div
          style={{
            background: "white",
            borderRadius: 16,
            border: "1px solid var(--line)",
            padding: 24,
            boxShadow: "0 2px 12px rgba(15,25,35,0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p className="font-sans" style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
              Produtos recentes
            </p>
            <Link href="/admin/produtos" style={{ fontSize: 12, color: "var(--blue)", fontFamily: "var(--font-mono)", textDecoration: "none" }}>
              Ver todos
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {recent.length === 0 && (
              <p style={{ fontSize: 13, color: "var(--ink-dim)", fontFamily: "var(--font-mono)" }}>Nenhum produto ainda.</p>
            )}
            {recent.map((p: { id: string; name: string; category: string | null; active: boolean; featured: boolean }) => (
              <Link
                key={p.id}
                href={`/admin/produtos/${p.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: "var(--bg)",
                  textDecoration: "none",
                }}
              >
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", margin: 0, fontFamily: "var(--font-mono)" }}>
                    {p.name}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--ink-dim)", margin: 0, fontFamily: "var(--font-mono)" }}>
                    {p.category ?? "Sem categoria"}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {p.featured && (
                    <span style={{ fontSize: 10, background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: 999, fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                      Destaque
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 10,
                      background: p.active ? "#dcfce7" : "#fee2e2",
                      color: p.active ? "#166534" : "#991b1b",
                      padding: "2px 8px",
                      borderRadius: 999,
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                    }}
                  >
                    {p.active ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
