# Nicetech Backend

Backend REST em Node.js + TypeScript com **Supabase** (Auth, Database, RLS), seguindo Clean Architecture e boas práticas de segurança e escalabilidade.

## Stack

- **Runtime:** Node.js 18+
- **Framework:** Express
- **Banco / Auth:** Supabase (PostgreSQL + Auth)
- **Validação:** Zod
- **Linguagem:** TypeScript (strict)

## Estrutura

```
backend/
├── config/          # Supabase clients, env (Zod)
├── database/        # SQL: schema, RLS, seeds
├── modules/         # auth, users, products, analytics (rotas por domínio)
├── repositories/    # Acesso a dados (Supabase)
├── services/        # Regras de negócio
├── controllers/     # HTTP request/response
├── middlewares/     # auth, erro global, validação
├── types/           # Tipos e DTOs
├── utils/           # logger, errors, validators
└── server.ts        # Entrada da aplicação
```

## Variáveis de ambiente

Crie `.env` na pasta `backend/` (use `.env.example` como base):

| Variável | Obrigatório | Descrição |
|----------|-------------|-----------|
| `SUPABASE_URL` | Sim | URL do projeto (Dashboard → Settings → API) |
| `SUPABASE_ANON_KEY` | Sim | Chave anon/public |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Chave service_role (nunca no frontend) |
| `PORT` | Não | Porta do servidor (padrão: 4000) |
| `DATABASE_URL` | Não* | Connection string Postgres (só para `npm run db:migrate`) |
| `NODE_ENV` | Não | development \| production \| test |

\* `DATABASE_URL`: Supabase → Settings → Database → Connection string (URI).

**Nunca commite chaves no código.**

## Banco de dados (Supabase)

**Opção A – Script (recomendado)**  
Coloque `DATABASE_URL` no `backend/.env` e rode:

```bash
cd backend
npm run db:migrate
```

Isso executa, na ordem: `001_schema.sql`, `001b_trigger_auth_user.sql`, `002_rls.sql`, `003_seed.sql`.

**Opção B – SQL Editor**  
No Supabase, abra **SQL Editor** e execute na mesma ordem os arquivos em `database/`.

## Como rodar

```bash
cd backend
npm install
cp .env.example .env   # edite .env com as chaves do Supabase
npm run dev            # http://localhost:4000
```

Build para produção:

```bash
npm run build
npm start
```

## API – Endpoints

Base URL: `http://localhost:4000`

### Health

- `GET /health` – status do servidor

### Auth

- `POST /api/auth/register` – registro (body: email, password, full_name?)
- `POST /api/auth/login` – login (body: email, password)
- `POST /api/auth/refresh` – refresh token (body: refresh_token)
- `GET /api/auth/me` – usuário atual (Header: `Authorization: Bearer <access_token>`)

### Products (público: GET; escrita: admin)

- `GET /api/products` – listar (query: page, page_size, category, search)
- `GET /api/products/:id` – por ID
- `POST /api/products` – criar (admin)
- `PATCH /api/products/:id` – atualizar (admin)
- `DELETE /api/products/:id` – soft delete (admin)

### Analytics

- `GET /api/analytics` – todas as métricas (admin)
- `GET /api/analytics/:productId` – métricas de um produto (admin)
- `POST /api/analytics/track` – registrar view/click (body: productId, type: "view" | "click")

## Exemplos de requisição (curl)

### Registrar

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"senha123","full_name":"Admin"}'
```

### Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"senha123"}'
```

### Listar produtos (público)

```bash
curl "http://localhost:4000/api/products?page=1&page_size=10"
```

### Criar produto (admin)

```bash
export TOKEN="<access_token do login>"
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"PC Gamer","description":"...","image":"https://...","price":"Sob consulta","category":"gamer"}'
```

### Registrar view (público)

```bash
curl -X POST http://localhost:4000/api/analytics/track \
  -H "Content-Type: application/json" \
  -d '{"productId":"a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11","type":"view"}'
```

## Arquitetura e decisões

- **Repository:** abstrai Supabase; serviços não conhecem detalhes de cliente/query.
- **Service:** orquestra repositórios e regras; retorna DTOs.
- **Controller:** só HTTP (body, params, headers) e chama service.
- **RLS:** produtos visíveis a todos; escrita em produtos e analytics apenas para admin (via `profiles.role`).
- **Auth:** Supabase Auth (JWT); middleware valida token com `getUser(accessToken)` e anexa `user` (id, email, role) ao request.
- **Erros:** `AppError` e subclasses com status HTTP; middleware central formata resposta e log.
- **Validação:** Zod em body/query via middlewares; falha vira 422 com detalhes.

## Primeiro admin

1. Registrar um usuário via `POST /api/auth/register`.
2. No Supabase: **Table Editor** → `profiles` → editar o registro e definir `role = 'admin'`.
3. Ou execute no SQL Editor:  
   `UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';`

A partir daí esse usuário pode criar/editar produtos e ver analytics.

## Deploy (Vercel + backend)

- **Frontend (Next.js):** pode ficar na Vercel; configure as variáveis de ambiente do Supabase no projeto Vercel se o frontend chamar a API do backend ou o Supabase diretamente.
- **Backend (Express):** este servidor roda em outro provedor (Railway, Render, Fly.io, etc.) ou em um projeto Vercel separado com serverless/Node; não é deployado junto do Next.js estático por padrão.
- **Migrations:** rode **uma vez** após criar o projeto Supabase: `npm run db:migrate` (com `DATABASE_URL` no `backend/.env`) ou execute os SQLs no Supabase SQL Editor.
