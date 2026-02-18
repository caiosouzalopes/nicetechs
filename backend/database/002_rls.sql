-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Policies seguras: leitura pública onde faz sentido; escrita por role.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- PROFILES
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Usuário autenticado vê apenas o próprio perfil
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Usuário pode atualizar apenas o próprio perfil (campos permitidos via app)
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role (backend) pode fazer tudo; anon não insere/update/delete
-- (inserção é feita pelo trigger handle_new_user com SECURITY DEFINER)

-- -----------------------------------------------------------------------------
-- PRODUCTS
-- -----------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Leitura pública: qualquer um pode listar/ver produtos não deletados
CREATE POLICY "products_select_public"
  ON public.products FOR SELECT
  TO anon, authenticated
  USING (deleted_at IS NULL);

-- Apenas admin pode inserir/atualizar/deletar (soft delete)
-- Uso de role em profiles; policy usa função que checa role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE POLICY "products_insert_admin"
  ON public.products FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "products_update_admin"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "products_delete_admin"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- PRODUCT_ANALYTICS
-- -----------------------------------------------------------------------------
ALTER TABLE public.product_analytics ENABLE ROW LEVEL SECURITY;

-- Leitura: apenas admin vê métricas
CREATE POLICY "product_analytics_select_admin"
  ON public.product_analytics FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Incremento é feito via RPC (increment_product_view/click) com SECURITY DEFINER
-- Permite que anon e authenticated chamem a função (contabiliza views/clicks)
GRANT EXECUTE ON FUNCTION public.increment_product_view(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_product_view(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_product_click(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_product_click(UUID) TO authenticated;

-- Dentro da função, inserção/update em product_analytics é feita com definer (bypass RLS)
-- Assim anon pode registrar view/click sem ver a tabela.
