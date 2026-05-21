import { notFound } from "next/navigation";
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
    <div style={{ padding: 32, maxWidth: 1400 }}>
      <h1 className="font-sans" style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", marginBottom: 28 }}>
        Editar Produto
      </h1>

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
