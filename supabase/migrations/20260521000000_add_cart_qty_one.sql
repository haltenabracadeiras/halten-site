-- Permite marcar produtos que vendem por pacote fechado
-- (carrinho inicia com 1 independente da embalagem)
ALTER TABLE products ADD COLUMN IF NOT EXISTS cart_qty_one boolean NOT NULL DEFAULT false;
