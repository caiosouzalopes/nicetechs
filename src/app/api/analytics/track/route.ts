import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true });
  }
  let body: { productId?: string; type?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }
  const productId = body?.productId;
  const type = body?.type;
  if (!productId || typeof productId !== "string" || !type) {
    return NextResponse.json({ ok: true });
  }
  if (type !== "view" && type !== "click") {
    return NextResponse.json({ ok: true });
  }
  try {
    const supabase = createSupabaseAdmin();
    const fn = type === "view" ? "increment_product_view" : "increment_product_click";
    const { error } = await supabase.rpc(fn, { p_product_id: productId });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
