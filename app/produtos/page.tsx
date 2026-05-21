import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { SectionHeader } from "../components/section-header";
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
    .select("id,name,slug,category,price,excerpt,images")
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
      <main style={{ paddingTop: 80 }}>
        {/* Page header */}
        <section
          style={{
            background: "linear-gradient(135deg, #0f2d4a 0%, #1c9bd7 60%, #38b8f0 100%)",
            padding: "64px 24px",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <p
              className="font-sans"
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.15)",
                color: "white",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "6px 16px",
                borderRadius: 999,
                marginBottom: 20,
              }}
            >
              Catálogo
            </p>
            <h1
              className="font-sans"
              style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 800,
                color: "white",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              Produtos{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#7dd3f8" }}>
                Halten
              </span>
            </h1>
            <p
              style={{
                marginTop: 16,
                fontSize: 16,
                color: "rgba(255,255,255,0.8)",
                fontFamily: "var(--font-mono)",
                fontWeight: 300,
                maxWidth: 500,
              }}
            >
              Abraçadeiras e acessórios para as demandas mais exigentes da indústria.
            </p>
          </div>
        </section>

        {/* Products grid with filter */}
        <section
          style={{
            background: "var(--bg)",
            padding: "64px 24px",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <ProductsGrid products={products} categories={categories} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
