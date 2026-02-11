import { NextRequest, NextResponse } from "next/server";
import type { Product } from "@/data/products";
import { products as defaultProducts } from "@/data/products";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Nct0103@";

function isAdminAuthorized(request: NextRequest): boolean {
  const auth =
    request.headers.get("X-Admin-Password") ||
    request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  return !!auth && auth === ADMIN_PASSWORD;
}

async function fetchFromSupabase(): Promise<Product[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, image, price, category")
      .order("created_at", { ascending: false });
    if (error) return null;
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

async function fetchFromJsonBin(): Promise<Product[] | null> {
  const apiKey = process.env.JSONBIN_API_KEY;
  const binId = process.env.JSONBIN_BIN_ID;
  if (!apiKey || !binId) return null;
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
      headers: { "X-Master-Key": apiKey },
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const products = json?.record?.products;
    return Array.isArray(products) ? products : null;
  } catch {
    return null;
  }
}

async function fetchProducts(): Promise<Product[] | null> {
  const fromSupabase = await fetchFromSupabase();
  if (fromSupabase != null) return fromSupabase;
  return fetchFromJsonBin();
}

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  Pragma: "no-cache",
};

export async function GET() {
  const products = await fetchProducts();
  if (products == null) {
    return new NextResponse(null, { status: 204, headers: NO_CACHE_HEADERS });
  }
  return NextResponse.json(products, { headers: NO_CACHE_HEADERS });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json(
      { error: "Não autorizado. Use a senha do painel admin." },
      { status: 401 }
    );
  }

  let body: { products?: Product[] };
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

  // 1. Tentar Supabase
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      const { data: existing } = await supabase.from("products").select("id");
      const existingIds = (existing ?? []).map((r) => r.id);
      const newIds = new Set(products.map((p) => p.id));
      const toDelete = existingIds.filter((id) => !newIds.has(id));
      if (toDelete.length > 0) {
        const { error: delErr } = await supabase
          .from("products")
          .delete()
          .in("id", toDelete);
        if (delErr) {
          return NextResponse.json(
            { error: delErr.message || "Erro ao remover produtos." },
            { status: 502 }
          );
        }
      }
      if (products.length > 0) {
        const rows = products.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description ?? "",
          image: p.image ?? "",
          price: p.price ?? "Sob consulta",
          category: p.category,
        }));
        const { error: insErr } = await supabase.from("products").upsert(rows, {
          onConflict: "id",
          ignoreDuplicates: false,
        });
        if (insErr) {
          return NextResponse.json(
            { error: insErr.message || "Erro ao salvar produtos." },
            { status: 502 }
          );
        }
      }
      return NextResponse.json({ success: true });
    } catch (e) {
      return NextResponse.json(
        { error: "Erro ao conectar com Supabase." },
        { status: 502 }
      );
    }
  }

  // 2. Fallback: JSONBin
  const apiKey = process.env.JSONBIN_API_KEY;
  const binId = process.env.JSONBIN_BIN_ID;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Configure SUPABASE ou JSONBIN no .env. Veja .env.example.",
      },
      { status: 503 }
    );
  }

  const payload = { products };
  const url = binId
    ? `https://api.jsonbin.io/v3/b/${binId}`
    : "https://api.jsonbin.io/v3/b";
  try {
    const res = await fetch(url, {
      method: binId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": apiKey,
        ...(binId ? {} : { "X-Bin-Name": "nicetech-stock" }),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err?.message || "Falha ao atualizar JSONBin." },
        { status: 502 }
      );
    }
    const data = await res.json();
    const newBinId = data?.metadata?.id;
    if (newBinId && !binId) {
      return NextResponse.json({
        success: true,
        binId: newBinId,
        message:
          "Bin criado. Adicione JSONBIN_BIN_ID=" + newBinId + " no .env e faça redeploy.",
      });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erro ao conectar com JSONBin." },
      { status: 502 }
    );
  }
}
