import { NextRequest, NextResponse } from "next/server";
import type { Product } from "@/data/products";
import { products as defaultProducts } from "@/data/products";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Nct0103@";

function isAdminAuthorized(request: NextRequest): boolean {
  const auth =
    request.headers.get("X-Admin-Password") ||
    request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  return !!auth && auth === ADMIN_PASSWORD;
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
    const data = await res.json();
    const products = data?.record?.products;
    return Array.isArray(products) ? products : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const products = await fetchFromJsonBin();
  // Sem JSONBin configurado: 204 = use localStorage no cliente (mantém edições por dispositivo)
  if (products == null) {
    return new NextResponse(null, { status: 204 });
  }
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return NextResponse.json(
      { error: "Não autorizado. Use a senha do painel admin." },
      { status: 401 }
    );
  }

  const apiKey = process.env.JSONBIN_API_KEY;
  const binId = process.env.JSONBIN_BIN_ID;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Configure JSONBIN_API_KEY no .env para sincronizar o estoque em todos os dispositivos. Veja README ou .env.example.",
      },
      { status: 503 }
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

  const payload = { products };

  if (binId) {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": apiKey,
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
      return NextResponse.json({ success: true });
    } catch (e) {
      return NextResponse.json(
        { error: "Erro ao conectar com JSONBin." },
        { status: 502 }
      );
    }
  }

  // Sem BIN_ID: criar um novo bin na primeira vez
  try {
    const res = await fetch("https://api.jsonbin.io/v3/b", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": apiKey,
        "X-Bin-Name": "nicetech-stock",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err?.message || "Falha ao criar bin no JSONBin." },
        { status: 502 }
      );
    }
    const data = await res.json();
    const newBinId = data?.metadata?.id;
    return NextResponse.json({
      success: true,
      binId: newBinId,
      message:
        "Bin criado. Adicione no .env: JSONBIN_BIN_ID=" +
        newBinId +
        " e faça redeploy para as próximas alterações sincronizarem.",
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao conectar com JSONBin." },
      { status: 502 }
    );
  }
}
