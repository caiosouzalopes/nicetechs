# Nicetech Solutions – Landing Page Realizada por HB Studio Dev www.hbstudiodev.com.br

## Deploy na Vercel (estoque e admin)

Para a página de estoque e o painel admin funcionarem com o banco:

1. **Variáveis de ambiente** (Vercel → Projeto → Settings → Environment Variables):
   - `SUPABASE_URL` = URL da API do Supabase (ex: `https://SEU_REF.supabase.co`). Se você tiver só a connection Postgres (`postgresql://...@db.XXX.supabase.co...`), use a URL da API: `https://XXX.supabase.co`.
   - `SUPABASE_SERVICE_ROLE_KEY` = chave **service_role** (Dashboard Supabase → Settings → API). Não use a chave anon no lugar desta.
   - `ADMIN_PASSWORD` ou `NEXT_PUBLIC_ADMIN_PASSWORD` = senha do painel admin (opcional; padrão no código).

2. **Redeploy** após salvar as variáveis (Deployments → ⋮ → Redeploy).
