"use client";
import { useCart } from "../context/cart-context";

function parseQty(embalagem: string): number {
  const match = embalagem.match(/\d+/);
  return match ? parseInt(match[0], 10) : 1;
}

export function AddToCartButton({
  code,
  productName,
  embalagem,
}: {
  code: string;
  productName: string;
  embalagem?: string;
}) {
  const { items, addItem, removeItem } = useCart();
  const inCart = items.some((i) => i.code === code);
  const defaultQty = embalagem ? parseQty(embalagem) : 1;

  return (
    <button
      onClick={() => (inCart ? removeItem(code) : addItem(code, productName, defaultQty))}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 12px",
        borderRadius: 6,
        border: inCart ? "1.5px solid #1c9bd7" : "1.5px solid rgba(15,25,35,0.15)",
        background: inCart ? "#1c9bd7" : "transparent",
        color: inCart ? "white" : "rgba(15,25,35,0.5)",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.08em",
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {inCart ? (
        <>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 6h8" />
          </svg>
          ADICIONADO
        </>
      ) : (
        <>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2v8M2 6h8" />
          </svg>
          ADICIONAR
        </>
      )}
    </button>
  );
}
