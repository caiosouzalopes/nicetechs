-- =============================================================================
-- NICETECH BACKEND - Schema PostgreSQL
-- UUID como PK, created_at/updated_at, soft delete onde aplicável.
-- =============================================================================

-- Extensão UUID (Supabase já possui)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para categoria de produto (alinhado ao frontend)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_category') THEN
    CREATE TYPE product_category AS ENUM ('gamer', 'smartphone', 'games', 'accessories');
  END IF;
END
$$;

-- Trigger: atualizar updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- TABELA: products
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT 'Sob consulta',
  category product_category NOT NULL DEFAULT 'gamer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE public.products IS 'Catálogo de produtos; soft delete via deleted_at.';

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON public.products(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_products_name ON public.products(name);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- -----------------------------------------------------------------------------
-- TABELA: product_analytics
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_analytics (
  product_id UUID NOT NULL PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
  views INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.product_analytics IS 'Métricas de visualizações e cliques por produto.';

CREATE TRIGGER product_analytics_updated_at
  BEFORE UPDATE ON public.product_analytics
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- -----------------------------------------------------------------------------
-- FUNÇÕES RPC para analytics (evitar N+1 e garantir atomicidade)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.increment_product_view(p_product_id UUID)
RETURNS void AS $$
  INSERT INTO public.product_analytics (product_id, views, clicks)
  VALUES (p_product_id, 1, 0)
  ON CONFLICT (product_id) DO UPDATE SET
    views = public.product_analytics.views + 1,
    updated_at = NOW();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_product_click(p_product_id UUID)
RETURNS void AS $$
  INSERT INTO public.product_analytics (product_id, views, clicks)
  VALUES (p_product_id, 0, 1)
  ON CONFLICT (product_id) DO UPDATE SET
    clicks = public.product_analytics.clicks + 1,
    updated_at = NOW();
$$ LANGUAGE sql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- PROCEDURE: sincronizar catálogo de produtos (upsert + soft delete)
-- Entrada: JSONB no formato { products: [ {id, name, description, image, price, category}, ... ] }
-- -----------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE public.sync_products(p_payload JSONB)
LANGUAGE plpgsql
AS $$
DECLARE
  v_products JSONB;
BEGIN
  v_products := COALESCE(p_payload->'products', '[]'::jsonb);

  IF jsonb_typeof(v_products) <> 'array' THEN
    RAISE EXCEPTION 'Campo products deve ser um array JSON';
  END IF;

  CREATE TEMP TABLE IF NOT EXISTS tmp_products (
    id UUID,
    name TEXT,
    description TEXT,
    image TEXT,
    price TEXT,
    category product_category
  ) ON COMMIT DROP;

  TRUNCATE TABLE tmp_products;

  INSERT INTO tmp_products (id, name, description, image, price, category)
  SELECT
    COALESCE(NULLIF(t.id, '')::uuid, uuid_generate_v4()),
    COALESCE(NULLIF(t.name, ''), 'Produto'),
    COALESCE(t.description, ''),
    COALESCE(t.image, ''),
    COALESCE(NULLIF(t.price, ''), 'Sob consulta'),
    COALESCE(t.category, 'gamer')::product_category
  FROM jsonb_to_recordset(v_products) AS t(
    id text,
    name text,
    description text,
    image text,
    price text,
    category text
  );

  UPDATE public.products p
  SET deleted_at = NOW()
  WHERE p.deleted_at IS NULL
    AND NOT EXISTS (
      SELECT 1 FROM tmp_products tp WHERE tp.id = p.id
    );

  INSERT INTO public.products (id, name, description, image, price, category, deleted_at)
  SELECT tp.id, tp.name, tp.description, tp.image, tp.price, tp.category, NULL
  FROM tmp_products tp
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    price = EXCLUDED.price,
    category = EXCLUDED.category,
    deleted_at = NULL;
END;
$$;
