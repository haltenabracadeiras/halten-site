-- Halten products seed data
-- Use this SQL to populate the "products" table in Supabase.

INSERT INTO products (name, slug, category, price, excerpt, description, details, images, active, position, cnpj_required, featured, whatsapp_text)
VALUES
  ('Abraçadeira de Aço Inox 304', 'abracadeira-aco-inox-304', 'Aço Inox', 12.5, 'Abraçadeira resistente para aplicações industriais.', 'Abraçadeira de alta resistência em aço inox 304, indicada para fixação de tubulações e cabos em instalações industriais e externas.', '[{"valor": "Diâmetro 20-30mm"}, {"valor": "Espessura 1,2mm"}, {"valor": "Resistência à corrosão"}]'::jsonb, '[{"url": "https://images.example.com/abracadeira-inox-304-1.jpg"}, {"url": "https://images.example.com/abracadeira-inox-304-2.jpg"}]'::jsonb, true, 1, false, true, 'Tenho interesse na abraçadeira de aço inox 304. Gostaria de orçamento.');

INSERT INTO products (name, slug, category, price, excerpt, description, details, images, active, position, cnpj_required, featured, whatsapp_text)
VALUES
  ('Abraçadeira com Encaixe Rápido', 'abracadeira-encaixe-rapido', 'Soluções de Encaixe', 18.75, 'Abraçadeira com sistema de engate rápido para instalações ágeis.', 'Abraçadeira com mola interna e sistema de encaixe rápido para montagem instantânea de dutos, cabos e tubulações em ambientes industriais.', '[{"valor": "Instalação sem ferramenta"}, {"valor": "Material reforçado"}, {"valor": "Uso interno e externo"}]'::jsonb, '[{"url": "https://images.example.com/abracadeira-encaixe-rapido-1.jpg"}]'::jsonb, true, 2, false, true, 'Gostaria de receber um orçamento para a abraçadeira com encaixe rápido.');

INSERT INTO products (name, slug, category, price, excerpt, description, details, images, active, position, cnpj_required, featured, whatsapp_text)
VALUES
  ('Abraçadeira Térmica para Cabos', 'abracadeira-termica-cabos', 'Acessórios', 22.9, 'Abraçadeira térmica com propriedades isolantes e fixação segura.', 'Abraçadeira térmica projetada para proteção e fixação de cabos elétricos e tubulações sensíveis a temperaturas elevadas.', '[{"valor": "Resistente a altas temperaturas"}, {"valor": "Isolamento adicional"}, {"valor": "Fácil instalação"}]'::jsonb, '[{"url": "https://images.example.com/abracadeira-termica-cabos-1.jpg"}]'::jsonb, true, 3, true, true, 'Tenho interesse na abraçadeira térmica para cabos. Favor enviar orçamento.');
