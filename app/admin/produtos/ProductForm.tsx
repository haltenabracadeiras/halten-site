"use client";

import { useState, useRef, useTransition } from "react";
import Link from "next/link";
import { X, ImagePlus, Loader2, AlertCircle } from "lucide-react";

type Product = {
  id?: string;
  name?: string | null;
  slug?: string | null;
  category?: string | null;
  excerpt?: string | null;
  description?: string | null;
  images?: string[] | null;
  featured?: boolean | null;
  active?: boolean | null;
  position?: number | null;
  cnpj_required?: boolean | null;
  whatsapp_text?: string | null;
  cart_qty_one?: boolean | null;
  image_zoom?: number | null;
};

type Props = {
  product?: Product;
  action: (formData: FormData) => Promise<void>;
  isNew?: boolean;
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--ink-mid)",
  fontFamily: "var(--font-mono)",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  border: "1.5px solid var(--line)",
  borderRadius: 10,
  fontSize: 14,
  fontFamily: "var(--font-mono)",
  color: "var(--ink)",
  background: "white",
  outline: "none",
  boxSizing: "border-box",
};

const CATEGORIES = [
  "Abraçadeiras",
  "Parafusos",
  "Porcas",
  "Arruelas",
  "Fixadores",
  "Outros",
];

type ImageEntry = { type: "existing"; url: string } | { type: "new"; file: File; preview: string };

export function ProductForm({ product, action, isNew }: Props) {
  const [images, setImages] = useState<ImageEntry[]>(() =>
    (product?.images ?? []).map((url) => ({ type: "existing", url }))
  );
  const [activeImg, setActiveImg] = useState(0);
  const [imageZoom, setImageZoom] = useState(product?.image_zoom ?? 100);
  const fileRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const entries: ImageEntry[] = files.map((file) => ({
      type: "new",
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...entries]);
    // Limpa o input para permitir selecionar os mesmos arquivos novamente
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeImage(idx: number) {
    setImages((prev) => {
      const entry = prev[idx];
      if (entry.type === "new") URL.revokeObjectURL(entry.preview);
      return prev.filter((_, i) => i !== idx);
    });
  }

  // Prepara os dados para o FormData
  const existingUrls = images
    .filter((e): e is Extract<ImageEntry, { type: "existing" }> => e.type === "existing")
    .map((e) => e.url);

  const newFiles = images
    .filter((e): e is Extract<ImageEntry, { type: "new" }> => e.type === "new")
    .map((e) => e.file);

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    fd.set("existing_images", JSON.stringify(existingUrls));
    fd.delete("new_images");
    for (const file of newFiles) {
      fd.append("new_images", file);
    }

    startTransition(async () => {
      try {
        await action(fd);
      } catch (err: unknown) {
        if (
          err &&
          typeof err === "object" &&
          "digest" in err &&
          typeof (err as { digest: string }).digest === "string" &&
          (err as { digest: string }).digest.startsWith("NEXT_")
        ) {
          throw err;
        }
        setError((err as Error).message ?? "Erro desconhecido ao salvar.");
      }
    });
  }

  return (
    <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {error && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "14px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10 }}>
          <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 13, color: "#dc2626", fontFamily: "var(--font-mono)", margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Nome + Slug */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        <div>
          <label style={labelStyle}>Nome do produto *</label>
          <input
            name="name"
            required
            defaultValue={product?.name ?? ""}
            style={inputStyle}
            placeholder="Abraçadeira tipo U M8"
          />
        </div>
        <div>
          <label style={labelStyle}>Slug (URL)</label>
          <input
            name="slug"
            defaultValue={product?.slug ?? ""}
            style={inputStyle}
            placeholder="abracadeira-tipo-u-m8 (auto se vazio)"
          />
        </div>
      </div>

      {/* Categoria + Posição */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
        <div>
          <label style={labelStyle}>Categoria</label>
          <select name="category" defaultValue={product?.category ?? ""} style={inputStyle}>
            <option value="">— Sem categoria —</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Posição (ordem)</label>
          <input name="position" type="number" defaultValue={product?.position ?? 0} style={inputStyle} />
        </div>
      </div>

      {/* Resumo */}
      <div>
        <label style={labelStyle}>Resumo (excerpt)</label>
        <input
          name="excerpt"
          defaultValue={product?.excerpt ?? ""}
          style={inputStyle}
          placeholder="Descrição curta exibida nos cards de produto"
        />
      </div>

      {/* Descrição */}
      <div>
        <label style={labelStyle}>Descrição completa</label>
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          rows={6}
          style={{ ...inputStyle, resize: "vertical" }}
          placeholder="Descrição detalhada, especificações técnicas, normas, etc."
        />
      </div>

      {/* Galeria de imagens */}
      <div>
        <label style={labelStyle}>Imagens do produto</label>

        {images.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 10, marginBottom: 12 }}>
            {/* Preview principal */}
            <div
              style={{
                background: "#0f1923",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 260,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.2)", position: "absolute", top: 10, left: 14, letterSpacing: "0.12em" }}>
                REF · {String(activeImg + 1).padStart(2, "0")}
              </div>
              <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.2)", position: "absolute", top: 10, right: 14, letterSpacing: "0.12em" }}>
                ZOOM · {imageZoom}%
              </div>
              <img
                src={images[activeImg].type === "existing" ? images[activeImg].url : (images[activeImg] as Extract<ImageEntry, {type:"new"}>).preview}
                alt="Preview"
                style={{
                  maxWidth: "80%",
                  maxHeight: 220,
                  objectFit: "contain",
                  transform: `scale(${imageZoom / 100})`,
                  transformOrigin: "center",
                  transition: "transform 0.2s",
                }}
              />
            </div>

            {/* Thumbnails */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto", maxHeight: 280 }}>
              {images.map((entry, i) => {
                const src = entry.type === "existing" ? entry.url : (entry as Extract<ImageEntry, {type:"new"}>).preview;
                return (
                  <div key={i} style={{ position: "relative", flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => setActiveImg(i)}
                      style={{
                        width: "100%",
                        aspectRatio: "4/3",
                        padding: 0,
                        border: activeImg === i ? "2px solid #1c9bd7" : "1.5px solid var(--line)",
                        borderRadius: 8,
                        overflow: "hidden",
                        cursor: "pointer",
                        background: "var(--bg)",
                        display: "block",
                      }}
                    >
                      <img src={src} alt={`Imagem ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </button>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 3 }}>
                      <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--ink-dim)" }}>
                        {i === 0 ? "CAPA" : String(i + 1).padStart(2, "0")}
                      </span>
                      <button
                        type="button"
                        onClick={() => { removeImage(i); if (activeImg >= i && activeImg > 0) setActiveImg(activeImg - 1); }}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#fca5a5", padding: 0, fontSize: 13, lineHeight: 1 }}
                      >×</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Zoom slider */}
        {images.length > 0 && (
          <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ ...labelStyle, marginBottom: 0, whiteSpace: "nowrap" }}>Zoom no card</label>
            <input
              type="range"
              name="image_zoom"
              min={50}
              max={150}
              value={imageZoom}
              onChange={(e) => setImageZoom(Number(e.target.value))}
              style={{ flex: 1, accentColor: "#1c9bd7" }}
            />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-mid)", minWidth: 36 }}>{imageZoom}%</span>
          </div>
        )}
        {images.length === 0 && <input type="hidden" name="image_zoom" value={imageZoom} />}

        {/* Botão adicionar */}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFilesChange}
          style={{ display: "none" }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            border: "1.5px dashed var(--line)",
            borderRadius: 10,
            cursor: "pointer",
            background: "var(--bg)",
            color: "var(--ink-mid)",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
          }}
        >
          <ImagePlus size={15} />
          {images.length === 0 ? "Adicionar imagens" : "Adicionar mais imagens"}
        </button>
        <p style={{ fontSize: 11, color: "var(--ink-dim)", fontFamily: "var(--font-mono)", marginTop: 6 }}>
          A primeira imagem será a capa do produto. JPG, PNG, WebP — máx. 5 MB por arquivo.
        </p>
      </div>

      {/* Destaque + Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <label style={labelStyle}>Destaque (home)</label>
          <select name="featured" defaultValue={String(product?.featured ?? false)} style={inputStyle}>
            <option value="true">★ Sim — exibir na home</option>
            <option value="false">Não</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Status</label>
          <select name="active" defaultValue={String(product?.active ?? true)} style={inputStyle}>
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>
      </div>

      {/* CNPJ obrigatório + WhatsApp */}
      <div
        style={{
          background: "var(--bg)",
          border: "1px solid var(--line-soft)",
          borderRadius: 12,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
            color: "var(--ink)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Configurações de contato B2B
        </p>

        <div>
          <label style={labelStyle}>CNPJ obrigatório para pedir preço?</label>
          <select
            name="cnpj_required"
            defaultValue={String(product?.cnpj_required ?? false)}
            style={inputStyle}
          >
            <option value="true">Sim — exigir CNPJ</option>
            <option value="false">Não</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Quantidade padrão no carrinho</label>
          <select
            name="cart_qty_one"
            defaultValue={String(product?.cart_qty_one ?? false)}
            style={inputStyle}
          >
            <option value="false">Usar quantidade da embalagem (padrão)</option>
            <option value="true">Sempre iniciar com 1 (venda por pacote)</option>
          </select>
          <p style={{ fontSize: 11, color: "var(--ink-dim)", fontFamily: "var(--font-mono)", marginTop: 6 }}>
            Use "1" para produtos vendidos por pacote fechado (ex: abraçadeira nylon 100 un).
          </p>
        </div>

        <div>
          <label style={labelStyle}>Texto da mensagem WhatsApp</label>
          <textarea
            name="whatsapp_text"
            defaultValue={
              product?.whatsapp_text ??
              "Olá! Tenho interesse no produto {produto} e gostaria de saber o preço."
            }
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder="Use {produto} para inserir o nome do produto automaticamente"
          />
          <p style={{ fontSize: 11, color: "var(--ink-dim)", fontFamily: "var(--font-mono)", marginTop: 6 }}>
            Use <code style={{ background: "var(--line-soft)", padding: "1px 4px", borderRadius: 4 }}>{"{produto}"}</code> para inserir o nome do produto.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
        <button
          type="submit"
          disabled={isPending}
          className="font-sans"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            borderRadius: 999,
            background: isPending ? "#94a3b8" : "var(--blue)",
            color: "white",
            fontSize: 14,
            fontWeight: 700,
            border: "none",
            cursor: isPending ? "not-allowed" : "pointer",
          }}
        >
          {isPending && <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />}
          {isPending ? "Salvando…" : isNew ? "Criar Produto" : "Salvar Alterações"}
        </button>
        <Link
          href="/admin/produtos"
          className="font-sans"
          style={{
            padding: "12px 24px",
            borderRadius: 999,
            border: "1.5px solid var(--line)",
            color: "var(--ink-mid)",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Cancelar
        </Link>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
