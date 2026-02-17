-- =============================================================================
-- NICETECH SOLUTIONS - Tabelas OPCIONAIS (use quando integrar no site)
-- Execute só quando for usar: formulário de contato no banco, depoimentos no banco
-- =============================================================================

-- contact_messages: usar quando o formulário de contato passar a salvar no banco
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  source TEXT DEFAULT 'site',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "contact_insert_public" ON contact_messages;
CREATE POLICY "contact_insert_public" ON contact_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "contact_select_all" ON contact_messages;
CREATE POLICY "contact_select_all" ON contact_messages FOR SELECT USING (true);

-- testimonials: usar quando depoimentos vierem do banco em vez de data/testimonials.ts
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  company TEXT,
  text TEXT NOT NULL,
  avatar TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "testimonials_select_active" ON testimonials;
CREATE POLICY "testimonials_select_active" ON testimonials FOR SELECT USING (active = true);
DROP POLICY IF EXISTS "testimonials_all_service" ON testimonials;
CREATE POLICY "testimonials_all_service" ON testimonials FOR ALL USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION set_updated_at_testimonials()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS testimonials_updated_at ON testimonials;
CREATE TRIGGER testimonials_updated_at BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION set_updated_at_testimonials();
