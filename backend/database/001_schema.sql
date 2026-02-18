-- =============================================================================
-- NICETECH BACKEND - Schema PostgreSQL
-- UUID como PK, created_at/updated_at, soft delete onde aplicável.
-- =============================================================================

-- Extensão UUID (Supabase já possui)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para role do usuário
CREATE TYPE app_role AS ENUM ('admin', 'user');

-- Enum para categoria de produto (alinhado ao frontend)
CREATE TYPE product_category AS ENUM ('gamer', 'smartphone', 'games', 'accessories');

-- -----------------------------------------------------------------------------
-- TABELA: profiles (estende auth.users, criada via trigger)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Perfil do usuário; espelha auth.users e adiciona role e dados extras.';

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Trigger: atualizar updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Trigger: criar profile ao inserir em auth.users (Supabase Auth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Nota: no Supabase, o trigger em auth.users é criado pelo Dashboard ou por migration
-- em auth schema. Aqui assumimos que auth.users existe.
-- Para conectar: Supabase Dashboard > Database > Triggers > New > on auth.users AFTER INSERT
-- chama handle_new_user(). Ou use: (em projeto Supabase linked)
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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
