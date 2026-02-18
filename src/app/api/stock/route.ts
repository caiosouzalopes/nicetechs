import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer, isSupabaseConfigured } from "@/lib/supabase-server";

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
  if (!isSupabaseConfigured()) {
    return NextResponse.json([], { headers: NO_CACHE_HEADERS });
  }
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, image, price, category")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });
    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[GET /api/stock] Supabase error:", error.message, error.details);
      }
      return NextResponse.json([], { headers: NO_CACHE_HEADERS });
    }
    const list = Array.isArray(data) ? data : [];
    return NextResponse.json(list, { headers: NO_CACHE_HEADERS });
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("[GET /api/stock]", e);
    }
    return NextResponse.json([], { headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json(
      { error: "Não autorizado. Use a senha do painel admin." },
      { status: 401 }
    );
  }
  let body: { products?: Array<{ id?: string; name?: string; description?: string; image?: string; price?: string; category?: string }> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Body inválido. Envie { products: [...] }" },
      { status: 400 }
    );
  }
  const products = body?.products;
  if (!Array.isArray(products)) {
    return NextResponse.json(
      { error: "Envie um array de produtos em 'products'." },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true });
  }

  try {
    const supabase = getSupabaseServer();
    const { data: existing } = await supabase.from("products").select("id").is("deleted_at", null);
    const existingIds = (existing ?? []).map((r) => r.id);
    const newIds = new Set(products.map((p) => p.id).filter(Boolean) as string[]);
    const toDelete = existingIds.filter((id) => !newIds.has(id));
    if (toDelete.length > 0) {
      await supabase.from("products").update({ deleted_at: new Date().toISOString() }).in("id", toDelete);
    }
    if (products.length > 0) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const rows = products.map((p) => {
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
      const { error: upsertErr } = await supabase.from("products").upsert(rows, {
        onConflict: "id",
        ignoreDuplicates: false,
      });
      if (upsertErr) {
        return NextResponse.json({ error: upsertErr.message }, { status: 502 });
      }
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao salvar";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
