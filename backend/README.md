# Nicetech Backend

Backend Express para servir API de produtos/estoque e autenticação simples (admin) usando Postgres (Neon/Vercel).

## Stack

- **Runtime:** Node.js 18+
- **Framework:** Express
- **Banco / Auth:** Postgres (Neon/Vercel)
- **Validação:** Zod
- **Linguagem:** TypeScript (strict)

## Estrutura

```
backend/
├── config/          # Configurações do banco e auth
├── database/        # SQL: schema, seeds
├── modules/         # auth, users, products, analytics (rotas por domínio)
├── repositories/    # Acesso a dados (Postgres)
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
| `DATABASE_URL` | Sim | Connection string do Postgres (Neon/Vercel) |
| `JWT_SECRET` | Sim | Chave secreta para tokens JWT (>= 16 caracteres) |
| `ADMIN_PASSWORD` | Sim | Senha do admin |
| `PORT` | Não | Porta do servidor (padrão: 4000) |
| `NODE_ENV` | Não | development \| production \| test |

**Nunca commite chaves no código.**

## Banco / Migrations

Usa `DATABASE_URL` do `.env`.

```bash
cd backend
npm run db:migrate
```

## Autenticação

- `/api/auth/login` valida a senha do admin e retorna um `access_token` (JWT)
- `/api/auth/me` retorna o usuário do token

## Como rodar

```bash
cd backend
npm install
cp .env.example .env   # edite .env com as configurações do banco e auth
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

- `POST /api/auth/login` – login (body: email, password)
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

- **Repository:** abstrai Postgres; serviços não conhecem detalhes de cliente/query.
- **Service:** orquestra repositórios e regras; retorna DTOs.
- **Controller:** só HTTP (body, params, headers) e chama service.
- **Auth:** JWT; middleware valida token e anexa `user` (id, email, role) ao request.
- **Erros:** `AppError` e subclasses com status HTTP; middleware central formata resposta e log.
- **Validação:** Zod em body/query via middlewares; falha vira 422 com detalhes.

## Deploy (Vercel + backend)

- **Frontend (Next.js):** pode ficar na Vercel; configure as variáveis de ambiente do Postgres no projeto Vercel se o frontend chamar a API do backend ou o Postgres diretamente.
- **Backend (Express):** este servidor roda em outro provedor (Railway, Render, Fly.io, etc.) ou em um projeto Vercel separado com serverless/Node; não é deployado junto do Next.js estático por padrão.
- **Migrations:** rode com `npm run db:migrate` (com `DATABASE_URL` no `backend/.env`).
