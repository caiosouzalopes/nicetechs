import { NextResponse } from "next/server";
import { getNeonSql, isNeonConfigured } from "@/lib/neon";

const NO_CACHE = { "Cache-Control": "no-store, no-cache", Pragma: "no-cache" };

export async function GET() {
  try {
    if (!isNeonConfigured()) {
      return NextResponse.json({}, { headers: NO_CACHE });
    }
    const sql = getNeonSql();
    const rows = await sql`
      select product_id, views, clicks
      from product_analytics
    `;
    const data: Record<string, { views: number; clicks: number }> = {};
    for (const r of (rows ?? []) as Array<{ product_id: string; views: number; clicks: number }>) {
      data[r.product_id] = { views: Number(r.views ?? 0), clicks: Number(r.clicks ?? 0) };
    }
    return NextResponse.json(data, { headers: NO_CACHE });
  } catch {
    return NextResponse.json({}, { headers: NO_CACHE });
  }
}
