import { NextRequest, NextResponse } from "next/server";
import { getNeonSql, isNeonConfigured } from "@/lib/neon";

export async function POST(request: NextRequest) {
  try {
    let body: { productId?: unknown; type?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Body inválido" }, { status: 400 });
    }

    const productId = typeof body.productId === "string" ? body.productId : "";
    const type = body.type === "view" || body.type === "click" ? body.type : null;
    if (!productId || !type) {
      return NextResponse.json(
        { error: "Envie { productId: string, type: 'view' | 'click' }" },
        { status: 400 }
      );
    }

    if (!isNeonConfigured()) {
      return NextResponse.json({ ok: true });
    }

    const sql = getNeonSql();
    if (type === "view") {
      await sql`select public.increment_product_view(${productId}::uuid)`;
    } else {
      await sql`select public.increment_product_click(${productId}::uuid)`;
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
