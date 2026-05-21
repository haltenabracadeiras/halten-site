"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, Image as ImageIcon, Package, Settings, LogOut, User, Table2 } from "lucide-react";
import { logoutAction } from "./actions";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/templates", label: "Templates de Tabela", icon: Table2 },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

type Props = { userEmail: string };

export function AdminSidebar({ userEmail }: Props) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 260,
        flexShrink: 0,
        background: "#0a1628",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "28px 24px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Link href="/admin/dashboard" style={{ display: "block" }}>
          <Image
            src="/logo-white.svg"
            alt="Halten Admin"
            width={110}
            height={32}
            style={{ width: 110, height: "auto" }}
          />
        </Link>
        <p
          style={{
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginTop: 8,
          }}
        >
          Painel Admin
        </p>
      </div>

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: "20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/admin/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: 13,
                fontFamily: "var(--font-mono)",
                fontWeight: active ? 600 : 400,
                color: active ? "white" : "rgba(255,255,255,0.45)",
                textDecoration: "none",
                background: active ? "rgba(28,155,215,0.2)" : "transparent",
                borderLeft: active
                  ? "3px solid var(--blue)"
                  : "3px solid transparent",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé: usuário + logout */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* Usuário */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 14px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.04)",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "rgba(28,155,215,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <User size={14} color="var(--blue)" />
          </div>
          <p
            style={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              color: "rgba(255,255,255,0.5)",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {userEmail}
          </p>
        </div>

        {/* Logout */}
        <form action={logoutAction}>
          <button
            type="submit"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              color: "rgba(255,255,255,0.35)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              width: "100%",
              transition: "color 0.15s ease",
            }}
          >
            <LogOut size={14} />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
