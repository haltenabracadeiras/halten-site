"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

type Props = {
  /** Destino do botão Editar */
  editHref: string;
  /** Server action de exclusão (já com o id "bindado") */
  deleteAction: (formData: FormData) => void | Promise<void>;
  /** Botões inline mostrados no desktop (aparência atual de cada tabela) */
  children: React.ReactNode;
};

/**
 * Ações de linha das tabelas do admin.
 * - Desktop: mostra os botões inline (children).
 * - Mobile: mostra um kebab (⋮) que abre Editar/Excluir num menu flutuante.
 *   O menu usa position: fixed para não ser cortado pelo scroll horizontal da tabela.
 */
export function RowActions({ editHref, deleteAction, children }: Props) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    // Fecha ao rolar (a tabela ou a página), redimensionar ou clicar fora
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    document.addEventListener("click", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      document.removeEventListener("click", close);
    };
  }, [open]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const r = btnRef.current?.getBoundingClientRect();
    if (r) setCoords({ top: r.bottom + 6, right: window.innerWidth - r.right });
    setOpen((o) => !o);
  };

  return (
    <>
      {/* Desktop */}
      <div className="row-actions-inline" style={{ display: "flex", gap: 8 }}>
        {children}
      </div>

      {/* Mobile: kebab */}
      <div className="row-actions-kebab">
        <button
          ref={btnRef}
          type="button"
          onClick={toggle}
          aria-label="Ações"
          aria-haspopup="menu"
          aria-expanded={open}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 38,
            height: 38,
            borderRadius: 10,
            border: "1px solid var(--line)",
            background: "white",
            color: "var(--ink-mid)",
            cursor: "pointer",
          }}
        >
          <MoreVertical size={18} />
        </button>

        {open && (
          <div
            role="menu"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed",
              top: coords.top,
              right: coords.right,
              zIndex: 90,
              minWidth: 168,
              background: "white",
              borderRadius: 12,
              border: "1px solid var(--line)",
              boxShadow: "0 12px 32px rgba(15,25,35,0.18)",
              overflow: "hidden",
            }}
          >
            <Link
              href={editHref}
              role="menuitem"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "13px 16px",
                fontSize: 13,
                fontFamily: "var(--font-mono)",
                fontWeight: 600,
                color: "var(--ink)",
                textDecoration: "none",
              }}
            >
              <Pencil size={15} />
              Editar
            </Link>
            <form action={deleteAction} style={{ borderTop: "1px solid var(--line-soft)", margin: 0 }}>
              <button
                type="submit"
                role="menuitem"
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  gap: 10,
                  padding: "13px 16px",
                  fontSize: 13,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  color: "#dc2626",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={15} />
                Excluir
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
