import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { ProductsGrid } from "./products-grid";
import { getSupabaseAdmin } from "../../lib/supabase";

export const dynamic = "force-dynamic";

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  price: number | null;
  excerpt: string | null;
  images: string[] | null;
};

async function getAllProducts() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("id,name,slug,category,price,excerpt,images,image_zoom")
    .eq("active", true)
    .order("position", { ascending: true });

  if (error) {
    console.error("[produtos] Supabase error:", error.message);
    return [];
  }

  return (data ?? []) as ProductRow[];
}

export default async function ProductsPage() {
  const products = await getAllProducts();
  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean) as string[]),
  ];

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--paper)" }}>
        {/* Hero header */}
        <section
          style={{
            background: "var(--ink)",
            padding: "96px 32px 80px",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginBottom: 20,
              }}
            >
              [ Catálogo · Produtos ]
            </p>
            <h1
              className="font-sans"
              style={{
                fontSize: "clamp(48px,6vw,80px)",
                fontWeight: 700,
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                color: "white",
                margin: 0,
              }}
            >
              Linha completa{" "}
              <em style={{ fontStyle: "italic", color: "var(--blue)" }}>de abraçadeiras.</em>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 14,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.55)",
                maxWidth: 520,
                marginTop: 20,
                marginBottom: 0,
              }}
            >
              Abraçadeiras para os projetos mais exigentes — montagem de motores, intercooler, sistemas hidráulicos, agrícola e cargas pesadas.
            </p>
          </div>
        </section>

        {/* Grid */}
        <section style={{ padding: "80px 32px 120px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <ProductsGrid products={products} categories={categories} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
