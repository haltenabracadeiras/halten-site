"use client";

import { useState } from "react";
import { ProductCard } from "../components/product-card";

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  excerpt: string | null;
  images: string[] | null;
};

type Props = {
  products: Product[];
  categories: string[];
};

export function ProductsGrid({ products, categories }: Props) {
  const [active, setActive] = useState<string>("all");

  const filtered =
    active === "all"
      ? products
      : products.filter((p) => p.category === active);

  return (
    <div className="space-y-10">
      {/* Category filter */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActive("all")}
          style={{
            padding: "8px 20px",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.08em",
            border: "1.5px solid",
            cursor: "pointer",
            transition: "all 0.2s ease",
            background: active === "all" ? "var(--blue)" : "transparent",
            borderColor: active === "all" ? "var(--blue)" : "var(--line)",
            color: active === "all" ? "white" : "var(--ink-mid)",
          }}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            style={{
              padding: "8px 20px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.08em",
              border: "1.5px solid",
              cursor: "pointer",
              transition: "all 0.2s ease",
              background: active === cat ? "var(--blue)" : "transparent",
              borderColor: active === cat ? "var(--blue)" : "var(--line)",
              color: active === cat ? "white" : "var(--ink-mid)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                title: product.name,
                category: product.category ?? "Produto",
                excerpt: product.excerpt ?? "",
                badge: product.category ?? "Produto",
                imageUrl: Array.isArray(product.images)
                  ? (product.images[0] ?? "")
                  : "",
                slug: product.slug,
              }}
            />
          ))}
        </div>
      ) : (
        <div
          className="rounded-[24px] border border-[var(--line)] bg-white p-12 text-center"
          style={{ color: "var(--ink-mid)", fontFamily: "var(--font-mono)" }}
        >
          Nenhum produto nesta categoria.
        </div>
      )}
    </div>
  );
}
