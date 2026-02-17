import { NextResponse } from "next/server";
import { createSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

function getEnvDebug() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  return {
    hasUrl: url.length > 0,
    hasServiceKey: key.length > 0,
    urlPrefix: url ? url.slice(0, 30) + "..." : "",
    keyStartsWithEyJ: key.startsWith("eyJ"),
  };
}

/**
 * GET /api/supabase-check - Testa conexão com Supabase.
 * Use ?debug=1 para ver se as variáveis estão definidas.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const debug = url.searchParams.get("debug") === "1";

  if (!isSupabaseConfigured()) {
    const debugInfo = debug ? getEnvDebug() : undefined;
    return NextResponse.json(
      {
        ok: false,
        error:
          "Variáveis não definidas. No Vercel: defina NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (chave = texto eyJ... sem aspas). Depois: Redeploy.",
        ...(debugInfo && { debug: debugInfo }),
      },
      { status: 503 }
    );
  }
  try {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from("products").select("id").limit(1);
    if (error) {
      const debugInfo = debug ? getEnvDebug() : undefined;
      return NextResponse.json(
        {
          ok: false,
          error: "Erro Supabase. Veja 'detail'. Use ?debug=1 para diagnóstico.",
          detail: error.message,
          code: error.code,
          ...(debugInfo && { debug: debugInfo }),
        },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, productsSample: Array.isArray(data) ? data.length : 0 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const debugInfo = debug ? getEnvDebug() : undefined;
    return NextResponse.json(
      { ok: false, error: msg, ...(debugInfo && { debug: debugInfo }) },
      { status: 502 }
    );
  }
}
