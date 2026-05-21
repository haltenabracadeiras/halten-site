import { ProductForm } from "../ProductForm";
import { createProduct } from "../actions";

export default function NovoProdutoPage() {
  return (
    <div style={{ padding: 32, maxWidth: 1400 }}>
      <h1 className="font-sans" style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", marginBottom: 28 }}>
        Novo Produto
      </h1>
      <div style={{ background: "white", borderRadius: 16, border: "1px solid var(--line)", padding: 28, boxShadow: "0 2px 12px rgba(15,25,35,0.04)" }}>
        <ProductForm action={createProduct} isNew />
      </div>
    </div>
  );
}
