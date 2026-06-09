import { getSupabaseAdmin } from "../../../lib/supabase";
import { saveConfiguracoes } from "./actions";

export const dynamic = "force-dynamic";

async function getConfig(): Promise<Record<string, string>> {
  const { data } = await getSupabaseAdmin()
    .from("configuracoes")
    .select("key, value");

  if (!data) return {};
  return Object.fromEntries(
    data.map((row: { key: string; value: string }) => [row.key, row.value])
  );
}

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

const sectionStyle: React.CSSProperties = {
  background: "white",
  borderRadius: 16,
  border: "1px solid var(--line)",
  padding: 28,
  boxShadow: "0 2px 12px rgba(15,25,35,0.04)",
  marginBottom: 24,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  fontFamily: "var(--font-mono)",
  color: "var(--ink)",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  marginBottom: 20,
  paddingBottom: 12,
  borderBottom: "1px solid var(--line-soft)",
};

export default async function ConfiguracoesPage() {
  const config = await getConfig();

  return (
    <div style={{ padding: "var(--admin-pad)", maxWidth: 860 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 className="font-sans" style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", margin: 0 }}>
          Configurações
        </h1>
        <p style={{ fontSize: 13, color: "var(--ink-mid)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
          Dados da empresa, integrações e configurações do site
        </p>
      </div>

      <form action={saveConfiguracoes} style={{ display: "flex", flexDirection: "column", gap: 0 }}>

        {/* ── Integrações e Analytics ── */}
        <div style={sectionStyle}>
          <p style={sectionTitleStyle}>Integrações e Analytics</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              <div>
                <label style={labelStyle}>Google Analytics ID</label>
                <input
                  name="ga_id"
                  defaultValue={config.ga_id ?? ""}
                  style={inputStyle}
                  placeholder="G-XXXXXXXXXX"
                />
                <p style={{ fontSize: 11, color: "var(--ink-dim)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
                  Measurement ID do GA4 (começa com G-)
                </p>
              </div>
              <div>
                <label style={labelStyle}>Meta Pixel ID</label>
                <input
                  name="meta_pixel_id"
                  defaultValue={config.meta_pixel_id ?? ""}
                  style={inputStyle}
                  placeholder="123456789012345"
                />
                <p style={{ fontSize: 11, color: "var(--ink-dim)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
                  ID numérico do Meta (Facebook) Pixel
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── WhatsApp e CNPJ ── */}
        <div style={sectionStyle}>
          <p style={sectionTitleStyle}>WhatsApp e Aviso CNPJ</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>Número WhatsApp</label>
              <input
                name="empresa_whatsapp"
                defaultValue={config.empresa_whatsapp ?? "554531972130"}
                style={inputStyle}
                placeholder="554599999999 (sem + ou espaços)"
              />
              <p style={{ fontSize: 11, color: "var(--ink-dim)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
                Formato DDI+DDD+número. Ex.: 554599999999
              </p>
            </div>
            <div>
              <label style={labelStyle}>Aviso CNPJ obrigatório (padrão global)</label>
              <select
                name="cnpj_aviso_ativo"
                defaultValue={config.cnpj_aviso_ativo ?? "false"}
                style={inputStyle}
              >
                <option value="true">Ativo — exibir aviso de CNPJ em todos os produtos</option>
                <option value="false">Inativo — configurar por produto individualmente</option>
              </select>
              <p style={{ fontSize: 11, color: "var(--ink-dim)", fontFamily: "var(--font-mono)", marginTop: 4 }}>
                Quando ativo, todos os produtos exigirão CNPJ para solicitar preço.
              </p>
            </div>
          </div>
        </div>

        {/* ── Dados da empresa ── */}
        <div style={sectionStyle}>
          <p style={sectionTitleStyle}>Dados da empresa</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              <div>
                <label style={labelStyle}>Nome da empresa</label>
                <input name="empresa_nome" defaultValue={config.empresa_nome ?? "Halten Abraçadeiras"} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>CNPJ</label>
                <input name="empresa_cnpj" defaultValue={config.empresa_cnpj ?? ""} style={inputStyle} placeholder="00.000.000/0000-00" />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <div>
                <label style={labelStyle}>Telefone</label>
                <input name="empresa_telefone" defaultValue={config.empresa_telefone ?? "(45) 3197-2130"} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>E-mail</label>
                <input name="empresa_email" defaultValue={config.empresa_email ?? "contato@halten.ind.br"} style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Endereço</label>
              <input name="empresa_endereco" defaultValue={config.empresa_endereco ?? "R. Alba Vieira, 653 — Cataratas"} style={inputStyle} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Cidade / UF</label>
                <input name="empresa_cidade" defaultValue={config.empresa_cidade ?? "Cascavel / PR"} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>CEP</label>
                <input name="empresa_cep" defaultValue={config.empresa_cep ?? "85818-630"} style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Redes sociais ── */}
        <div style={sectionStyle}>
          <p style={sectionTitleStyle}>Redes sociais</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            <div>
              <label style={labelStyle}>Instagram (URL)</label>
              <input name="empresa_instagram" defaultValue={config.empresa_instagram ?? ""} style={inputStyle} placeholder="https://instagram.com/halten" />
            </div>
            <div>
              <label style={labelStyle}>LinkedIn (URL)</label>
              <input name="empresa_linkedin" defaultValue={config.empresa_linkedin ?? ""} style={inputStyle} placeholder="https://linkedin.com/company/halten" />
            </div>
          </div>
        </div>

        {/* ── SEO ── */}
        <div style={sectionStyle}>
          <p style={sectionTitleStyle}>SEO — Metatags</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>Título do site</label>
              <input name="seo_titulo" defaultValue={config.seo_titulo ?? "Halten Abraçadeiras — Soluções Industriais"} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Descrição (meta description)</label>
              <textarea
                name="seo_descricao"
                defaultValue={config.seo_descricao ?? "Halten Abraçadeiras: fornecedor especializado em fixadores e abraçadeiras industriais para o mercado B2B."}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
            <div>
              <label style={labelStyle}>Keywords (separadas por vírgula)</label>
              <input
                name="seo_keywords"
                defaultValue={config.seo_keywords ?? "abraçadeiras industriais, fixadores, B2B, Cascavel, Paraná"}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, paddingBottom: 8 }}>
          <button
            type="submit"
            className="font-sans"
            style={{
              padding: "12px 32px",
              borderRadius: 999,
              background: "var(--blue)",
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            Salvar configurações
          </button>
        </div>
      </form>
    </div>
  );
}
