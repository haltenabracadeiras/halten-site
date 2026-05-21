-- FASE 1: Sistema de Tabelas Técnicas para Produtos
-- Execute este script no Supabase SQL Editor

-- 1. Templates de tabela (estrutura de colunas reutilizável)
CREATE TABLE IF NOT EXISTS product_table_templates (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  columns    jsonb NOT NULL DEFAULT '[]', -- array de { key: string, label: string }
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Tabelas de dados por produto
CREATE TABLE IF NOT EXISTS product_tables (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  template_id uuid REFERENCES product_table_templates(id) ON DELETE SET NULL,
  rows        jsonb NOT NULL DEFAULT '[]', -- array de objetos { [key]: value }
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id)
);

-- 3. RLS
ALTER TABLE product_table_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tables ENABLE ROW LEVEL SECURITY;

-- Templates: leitura pública, escrita autenticada
CREATE POLICY "templates_select_public"
  ON product_table_templates FOR SELECT USING (true);

CREATE POLICY "templates_insert_auth"
  ON product_table_templates FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "templates_update_auth"
  ON product_table_templates FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "templates_delete_auth"
  ON product_table_templates FOR DELETE USING (auth.role() = 'authenticated');

-- Tabelas de produto: leitura pública, escrita autenticada
CREATE POLICY "product_tables_select_public"
  ON product_tables FOR SELECT USING (true);

CREATE POLICY "product_tables_insert_auth"
  ON product_tables FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "product_tables_update_auth"
  ON product_tables FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "product_tables_delete_auth"
  ON product_tables FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Templates de exemplo
INSERT INTO product_table_templates (name, columns) VALUES
(
  'Tucho Intercooler',
  '[
    {"key": "cod_inox_carbono",   "label": "CÓDIGO INOX/CARBONO"},
    {"key": "cod_inox_100",       "label": "CÓDIGO INOX 100%"},
    {"key": "diametro_min",       "label": "DIÂMETRO MM (MÍN)"},
    {"key": "diametro_max",       "label": "DIÂMETRO MM (MÁX)"},
    {"key": "aco_inox_embalagem", "label": "AÇO INOX EMBALAGEM"}
  ]'
),
(
  'Metal Borracha',
  '[
    {"key": "codigo",          "label": "CÓDIGO"},
    {"key": "diametro_mm",     "label": "DIÂMETRO MM"},
    {"key": "embalagem",       "label": "METAL GALVANIZADO EMBALAGEM"}
  ]'
);
