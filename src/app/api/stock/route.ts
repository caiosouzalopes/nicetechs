import { NextRequest, NextResponse } from "next/server";
import { getNeonSql, isNeonConfigured } from "@/lib/neon";

export const dynamic = "force-dynamic";
export const maxDuration = 10;

const ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD ||
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
  "Nct0103@";

function isAdminAuthorized(request: NextRequest): boolean {
  const auth =
    request.headers.get("X-Admin-Password") ||
    request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  return !!auth && auth === ADMIN_PASSWORD;
}

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  Pragma: "no-cache",
};

const CATEGORIES = ["gamer", "smartphone", "games", "accessories"] as const;

function normalizeCategory(c: string): (typeof CATEGORIES)[number] {
  return CATEGORIES.includes(c as (typeof CATEGORIES)[number]) ? (c as (typeof CATEGORIES)[number]) : "gamer";
}

export async function GET() {
  try {
    if (!isNeonConfigured()) {
      return NextResponse.json([], { status: 200, headers: NO_CACHE_HEADERS });
    }
    const sql = getNeonSql();
    const rows = await sql`
      select id, name, description, image, price, category
      from products
      where deleted_at is null
      order by created_at desc
    `;
    const list = Array.isArray(rows) ? rows : [];
    return NextResponse.json(list, { status: 200, headers: NO_CACHE_HEADERS });
  } catch {
    return NextResponse.json([], { status: 200, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminAuthorized(request)) {
      return NextResponse.json(
        { error: "Não autorizado. Use a senha do painel admin." },
        { status: 401 }
      );
    }
    let body: { products?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Body inválido. Envie { products: [...] }" },
        { status: 400 }
      );
    }
    const products = Array.isArray(body?.products) ? body.products : null;
    if (!products) {
      return NextResponse.json(
        { error: "Envie um array de produtos em 'products'." },
        { status: 400 }
      );
    }

    if (!isNeonConfigured()) {
      return NextResponse.json(
        { error: "Banco de dados não configurado. Defina DATABASE_URL no .env." },
        { status: 503 }
      );
    }

    const sql = getNeonSql();
    const existing = await sql`select id from products where deleted_at is null`;
    const existingIds = ((existing ?? []) as Array<{ id: string }>).map((r) => r.id);
    const newIds = new Set(products.map((p: { id?: string }) => p.id).filter(Boolean) as string[]);
    const toDelete = existingIds.filter((id) => !newIds.has(id));
    if (toDelete.length > 0) {
      await sql`update products set deleted_at = ${new Date().toISOString()} where id = any(${toDelete}::uuid[])`;
    }
    if (products.length > 0) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const rows = products.map((p: { id?: string; name?: string; description?: string; image?: string; price?: string; category?: string }) => {
        const id = (p.id && uuidRegex.test(p.id)) ? p.id : crypto.randomUUID();
        return {
          id,
          name: String(p.name ?? "").trim() || "Produto",
          description: String(p.description ?? "").trim(),
          image: String(p.image ?? "").trim(),
          price: String(p.price ?? "Sob consulta").trim() || "Sob consulta",
          category: normalizeCategory(p.category ?? "gamer"),
        };
      });

      try {
        await sql`begin`;
        for (const r of rows) {
          await sql`
            insert into products (id, name, description, image, price, category)
            values (${r.id}::uuid, ${r.name}, ${r.description}, ${r.image}, ${r.price}, ${r.category})
            on conflict (id)
            do update set
              name = excluded.name,
              description = excluded.description,
              image = excluded.image,
              price = excluded.price,
              category = excluded.category,
              deleted_at = null
          `;
        }
        await sql`commit`;
      } catch {
        try {
          await sql`rollback`;
        } catch {
          /* noop */
        }
        return NextResponse.json(
          { error: "Erro ao salvar no banco. Tente novamente." },
          { status: 502 }
        );
      }
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Erro ao processar. Tente novamente." }, { status: 502 });
  }
}
