import { NextResponse } from "next/server";

const NO_CACHE = { "Cache-Control": "no-store, no-cache", Pragma: "no-cache" };

export async function GET() {
  return NextResponse.json({}, { headers: NO_CACHE });
}
