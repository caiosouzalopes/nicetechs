import { NextRequest, NextResponse } from "next/server";

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

export async function GET() {
  return NextResponse.json([], { headers: NO_CACHE_HEADERS });
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json(
      { error: "Não autorizado. Use a senha do painel admin." },
      { status: 401 }
    );
  }
  try {
    await request.json();
  } catch {
    return NextResponse.json(
      { error: "Body inválido. Envie { products: [...] }" },
      { status: 400 }
    );
  }
  return NextResponse.json({ success: true });
}
