import { NextResponse } from "next/server";
import { getAnalyticsFromDb, isDatabaseConfigured } from "@/lib/db";
import { createSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

const NO_CACHE = { "Cache-Control": "no-store, no-cache", Pragma: "no-cache" };

export async function GET() {
  if (isDatabaseConfigured()) {
    const data = await getAnalyticsFromDb();
    if (data != null) return NextResponse.json(data, { headers: NO_CACHE });
  }
  if (isSupabaseConfigured()) {
    try {
      const supabase = createSupabaseAdmin();
      const { data, error } = await supabase
        .from("product_analytics")
        .select("product_id, views, clicks");
      if (error) return NextResponse.json({}, { status: 200, headers: NO_CACHE });
      const analytics: Record<string, { views: number; clicks: number }> = {};
      (data ?? []).forEach((row) => {
        analytics[row.product_id] = { views: row.views ?? 0, clicks: row.clicks ?? 0 };
      });
      return NextResponse.json(analytics, { headers: NO_CACHE });
    } catch {
      /* fallback */
    }
  }
  return new NextResponse(null, { status: 204, headers: NO_CACHE });
}
