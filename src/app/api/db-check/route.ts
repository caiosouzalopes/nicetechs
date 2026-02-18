import { NextResponse } from "next/server";
import { getProductsFromDb, isDatabaseConfigured } from "@/lib/db";

/**
 * GET /api/db-check - Testa conexão usando apenas DATABASE_URL.
 * Basta definir DATABASE_URL no .env ou no Vercel (Environment Variables).
 */
export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "DATABASE_URL não definida. Defina no .env ou no Vercel (Settings → Environment Variables). Ex: postgresql://user:senha@host:5432/postgres",
      },
      { status: 503 }
    );
  }
  try {
    const products = await getProductsFromDb();
    return NextResponse.json({
      ok: true,
      productsCount: Array.isArray(products) ? products.length : 0,
      source: "DATABASE_URL",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { ok: false, error: msg },
      { status: 502 }
    );
  }
}
