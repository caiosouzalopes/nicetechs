-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Policies seguras: leitura pública onde faz sentido; escrita por role.
-- =============================================================================

-- Este projeto não usa Supabase Auth no Neon/Postgres. Portanto, as políticas
-- baseadas em auth.uid()/roles anon/authenticated não se aplicam aqui.
-- A autorização é feita no backend Express via JWT (admin) e no backend Next via senha.
-- Mantenha este arquivo vazio (ou apenas comentários) para evitar erros ao rodar migrations.
