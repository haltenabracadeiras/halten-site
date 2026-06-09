import Link from "next/link";
import { Plus } from "lucide-react";
import { getSupabaseAdmin } from "../../../lib/supabase";
import { ProductsTable } from "./ProductsTable";

export const dynamic = "force-dynamic";

export default async function ProdutosAdminPage() {
  const { data: products } = await getSupabaseAdmin()
    .from("products")
    .select("*")
    .order("position", { ascending: true });

  return (
    <div style={{ padding: "var(--admin-pad)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 className="font-sans" style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
            Produtos
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
            {products?.length ?? 0} produtos cadastrados
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="font-sans"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            borderRadius: 999,
            background: "var(--blue)",
            color: "white",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <Plus size={15} />
          Novo Produto
        </Link>
      </div>

      <div className="admin-table-card" style={{ background: "white", borderRadius: 16, border: "1px solid var(--line)", boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
        <ProductsTable products={products ?? []} />
      </div>
    </div>
  );
}
