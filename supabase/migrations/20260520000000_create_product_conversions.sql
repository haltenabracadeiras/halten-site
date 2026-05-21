-- Tabela de Conversões por produto
-- Execute este script no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS product_conversions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rows       jsonb NOT NULL DEFAULT '[]', -- array de { codigo_halten: string, codigos_originais: string }
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id)
);

-- RLS
ALTER TABLE product_conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "conversions_select_public"
  ON product_conversions FOR SELECT USING (true);

CREATE POLICY "conversions_insert_auth"
  ON product_conversions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "conversions_update_auth"
  ON product_conversions FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "conversions_delete_auth"
  ON product_conversions FOR DELETE USING (auth.role() = 'authenticated');
