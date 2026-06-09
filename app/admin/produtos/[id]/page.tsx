import { notFound } from "next/navigation";
import Link from "next/link";
import { Eye } from "lucide-react";
import { ProductForm } from "../ProductForm";
import { updateProduct } from "../actions";
import { ProductTableSection } from "../ProductTableSection";
import { ProductConversionSection } from "../ProductConversionSection";
import { getSupabaseAdmin } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

export default async function EditProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getSupabaseAdmin();

  const [{ data: product }, { data: templates }, { data: productTable }, { data: productConversion }] = await Promise.all([
    db.from("products").select("*").eq("id", id).single(),
    db.from("product_table_templates").select("*").order("name"),
    db.from("product_tables").select("*").eq("product_id", id).maybeSingle(),
    db.from("product_conversions").select("*").eq("product_id", id).maybeSingle(),
  ]);

  if (!product) notFound();

  const action = updateProduct.bind(null, id);

  return (
    <div style={{ padding: "var(--admin-pad)", maxWidth: 1400 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <h1 className="font-sans" style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
          Editar Produto
        </h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            type="submit"
            form="product-form"
            className="font-sans"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 18px",
              borderRadius: 999,
              background: "var(--blue)",
              color: "white",
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              border: "none",
              cursor: "pointer",
            }}
          >
            SALVAR
          </button>
          <Link
            href={`/produtos/${product.slug}`}
            target="_blank"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 18px",
              borderRadius: 999,
              background: "var(--ink)",
              color: "white",
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textDecoration: "none",
            }}
          >
            <Eye size={13} />
            VER PUBLICADO
          </Link>
        </div>
      </div>

      {/* Dados do produto */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--line)", padding: 28, boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
        <ProductForm product={product} action={action} />
      </div>

      {/* Tabela técnica */}
      <div style={{ marginTop: 32, background: "white", borderRadius: 16, border: "1px solid var(--line)", padding: 28, boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
        <h2 className="font-sans" style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", margin: "0 0 6px" }}>
          Tabela Técnica
        </h2>
        <p style={{ fontSize: 13, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", margin: "0 0 24px" }}>
          Faça upload de um arquivo Excel (.xlsx) com os dados técnicos do produto. A linha 1 é ignorada (cabeçalho); as colunas seguem a ordem do template selecionado.
        </p>
        <ProductTableSection
          productId={id}
          templates={templates ?? []}
          existingTable={productTable}
        />
      </div>

      {/* Tabela de conversões */}
      <div style={{ marginTop: 32, background: "white", borderRadius: 16, border: "1px solid var(--line)", padding: 28, boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
        <h2 className="font-sans" style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", margin: "0 0 6px" }}>
          Tabela de Conversões
        </h2>
        <p style={{ fontSize: 13, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", margin: "0 0 24px" }}>
          Opcional — apenas para produtos que possuem equivalências com códigos de outras marcas (Mercedes, Scania, Volvo, etc.).
        </p>
        <ProductConversionSection
          productId={id}
          existingConversion={productConversion}
        />
      </div>
    </div>
  );
}
