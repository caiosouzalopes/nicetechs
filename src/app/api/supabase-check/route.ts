import { NextResponse } from "next/server";
import { createSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

/**
 * GET /api/supabase-check - Testa se o servidor consegue falar com o Supabase.
 * Use para conferir se o .env está sendo lido (reinicie o servidor após mudar .env).
 */
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não definidas. Local: confira o .env e reinicie o servidor. Vercel: defina as variáveis em Settings → Environment Variables.",
      },
      { status: 503 }
    );
  }
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from("products").select("id").limit(1);
    if (error) {
      const hint =
        error.message?.toLowerCase().includes("invalid") && error.message?.toLowerCase().includes("key")
          ? "Chave inválida. Local: .env com chaves eyJ... e reinicie (npm run dev). Vercel: defina as variáveis no dashboard e redeploy."
          : error.message;
      return NextResponse.json(
        { ok: false, error: hint },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, productsSample: Array.isArray(data) ? data.length : 0 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { ok: false, error: msg },
      { status: 502 }
    );
  }
}
