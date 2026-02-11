-- Execute este SQL no Supabase: SQL Editor → New query → Cole e clique Run

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  price TEXT DEFAULT 'Sob consulta',
  category TEXT NOT NULL CHECK (category IN ('gamer', 'smartphone', 'games', 'accessories')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Qualquer um pode ler produtos
DROP POLICY IF EXISTS "Produtos públicos para leitura" ON products;
CREATE POLICY "Produtos públicos para leitura"
  ON products FOR SELECT USING (true);

-- Permitir inserir/atualizar/deletar (service_role usada nas API routes)
DROP POLICY IF EXISTS "Permitir todas operações" ON products;
CREATE POLICY "Permitir todas operações"
  ON products FOR ALL USING (true) WITH CHECK (true);
