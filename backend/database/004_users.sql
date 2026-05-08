-- =============================================================================
-- NICETECH BACKEND - Tabela de usuários para autenticação
-- =============================================================================

-- Enum para role de usuário
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'user');
  END IF;
END
$$;

-- -----------------------------------------------------------------------------
-- TABELA: users
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE public.users IS 'Usuários do sistema; autenticação via email/senha.';

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON public.users(deleted_at) WHERE deleted_at IS NULL;

DROP TRIGGER IF EXISTS users_updated_at ON public.users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- -----------------------------------------------------------------------------
-- SEED: Usuário admin inicial
-- Hash gerado via bcrypt (10 rounds)
-- -----------------------------------------------------------------------------
INSERT INTO public.users (id, email, password_hash, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@nicetech.com',
  '$2b$10$6r2s4jHNSv6QgXek2gWWye..O2IOUYnXnPKLv1l9sngs8FNFK7ATm',
  'admin'
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role;
