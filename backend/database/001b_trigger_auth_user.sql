-- Execute no Supabase SQL Editor após 001_schema.sql
-- Cria o trigger que popula public.profiles quando um usuário se registra em auth.users

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
