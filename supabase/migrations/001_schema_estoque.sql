-- =============================================================================
-- NICETECH SOLUTIONS - Schema do sistema de ESTOQUE (só o necessário)
-- Execute no Supabase: SQL Editor → New query → Cole tudo → Run
-- =============================================================================
-- Tabelas: products (catálogo) + product_analytics (views/clicks por produto)
-- Uso: estoque unificado + métricas do dashboard em todos os dispositivos
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TABELA: products (estoque)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT 'Sob consulta',
  category TEXT NOT NULL CHECK (category IN ('gamer', 'smartphone', 'games', 'accessories')),
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE products IS 'Catálogo de produtos (estoque do site)';

-- Compatibilidade: se a tabela já existia, adicionar colunas novas
ALTER TABLE products ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sort_order INT NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- -----------------------------------------------------------------------------
-- 2. TABELA: product_analytics (views e cliques por produto)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_analytics (
  product_id TEXT NOT NULL PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  views INT NOT NULL DEFAULT 0 CHECK (views >= 0),
  clicks INT NOT NULL DEFAULT 0 CHECK (clicks >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE product_analytics IS 'Métricas por produto (dashboard admin)';

-- -----------------------------------------------------------------------------
-- 3. FUNÇÃO: atualizar updated_at
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 4. TRIGGERS: updated_at
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS product_analytics_updated_at ON product_analytics;
CREATE TRIGGER product_analytics_updated_at
  BEFORE UPDATE ON product_analytics
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- -----------------------------------------------------------------------------
-- 5. TRIGGER: criar linha em product_analytics ao inserir produto
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION ensure_product_analytics_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO product_analytics (product_id, views, clicks)
  VALUES (NEW.id, 0, 0)
  ON CONFLICT (product_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS product_analytics_on_product_insert ON products;
CREATE TRIGGER product_analytics_on_product_insert
  AFTER INSERT ON products
  FOR EACH ROW EXECUTE FUNCTION ensure_product_analytics_on_insert();

-- -----------------------------------------------------------------------------
-- 6. FUNÇÕES: incrementar view e click (atómicas, usadas pela API)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_product_view(p_product_id TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO product_analytics (product_id, views, clicks)
  VALUES (p_product_id, 1, 0)
  ON CONFLICT (product_id)
  DO UPDATE SET views = product_analytics.views + 1, updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_product_click(p_product_id TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO product_analytics (product_id, views, clicks)
  VALUES (p_product_id, 0, 1)
  ON CONFLICT (product_id)
  DO UPDATE SET clicks = product_analytics.clicks + 1, updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_select_public" ON products;
CREATE POLICY "products_select_public" ON products FOR SELECT USING (true);
DROP POLICY IF EXISTS "products_all_service" ON products;
CREATE POLICY "products_all_service" ON products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "product_analytics_select_public" ON product_analytics;
CREATE POLICY "product_analytics_select_public" ON product_analytics FOR SELECT USING (true);
DROP POLICY IF EXISTS "product_analytics_all_service" ON product_analytics;
CREATE POLICY "product_analytics_all_service" ON product_analytics FOR ALL USING (true) WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- 8. ÍNDICES
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active_sort ON products(active, sort_order);

-- -----------------------------------------------------------------------------
-- 9. Garantir analytics para todos os produtos existentes
-- -----------------------------------------------------------------------------
INSERT INTO product_analytics (product_id, views, clicks)
SELECT id, 0, 0 FROM products
ON CONFLICT (product_id) DO NOTHING;
