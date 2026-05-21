import { ProductCard } from "./product-card";
import { SectionHeader } from "./section-header";
import { ScrollReveal } from "./scroll-reveal";
import { getSupabaseAdmin } from "../../lib/supabase";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  price: number | null;
  excerpt: string | null;
  images: string[] | null;
};

async function getFeaturedProducts() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .eq("active", true)
    .order("position", { ascending: true });

  console.log("[products-section] data:", JSON.stringify(data));
  console.log("[products-section] error:", JSON.stringify(error));

  if (error) {
    console.error("Supabase error fetching featured products:", error.message);
    return { rows: [] as ProductRow[], error: error.message };
  }

  return { rows: (data ?? []) as ProductRow[], error: null };
}

export default async function ProductsSection() {
  const { rows: products } = await getFeaturedProducts();

  return (
    <section id="produtos" className="bg-[var(--bg)] px-6 py-20 text-[var(--ink)] sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1280px] space-y-16">
        <div className="rounded-[32px] bg-[var(--bg-white)] p-10 shadow-[0_18px_48px_rgba(15,25,35,0.06)]">
          <SectionHeader badge="Produtos" title="Nossas soluções" subtitle="para sua linha" />
          <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--ink-mid)]" style={{ fontFamily: "var(--font-mono)" }}>
            Conheça a seleção de abraçadeiras e acessórios desenvolvidos para dar suporte às demandas mais exigentes do seu projeto.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            {products.map((product: ProductRow, index: number) => (
              <ScrollReveal key={product.id} delay={index * 100}>
                <ProductCard
                  product={{
                    title: product.name,
                    category: product.category ?? "Produto",
                    excerpt: product.excerpt ?? "",
                    badge: product.category ?? "Destaque",
                    imageUrl: Array.isArray(product.images) ? (product.images[0] ?? "") : "",
                    slug: product.slug,
                  }}
                />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] border border-[var(--line)] bg-[var(--bg-white)] p-10 text-center text-[var(--ink-mid)]">
            Nenhum produto em destaque encontrado. Verifique seu banco de dados Supabase.
          </div>
        )}
      </div>
    </section>
  );
}
