"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

export type CartItem = { code: string; productName: string; qty: number };

type CartCtx = {
  items: CartItem[];
  addItem: (code: string, productName: string, defaultQty?: number) => void;
  removeItem: (code: string) => void;
  updateQty: (code: string, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("halten-cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("halten-cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((code: string, productName: string, defaultQty = 1) => {
    setItems((prev) => {
      if (prev.find((i) => i.code === code)) return prev;
      return [...prev, { code, productName, qty: defaultQty }];
    });
  }, []);

  const removeItem = useCallback((code: string) => {
    setItems((prev) => prev.filter((i) => i.code !== code));
  }, []);

  const updateQty = useCallback((code: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((i) => (i.code === code ? { ...i, qty } : i)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
