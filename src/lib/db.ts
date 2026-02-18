/**
 * Conexão com o banco usando apenas DATABASE_URL (PostgreSQL).
 * Use no .env: DATABASE_URL="postgresql://user:senha@host:5432/database"
 * No Vercel: defina só DATABASE_URL em Environment Variables.
 */

import type { Product } from "@/data/products";

const DATABASE_URL = process.env.DATABASE_URL?.trim();

const VALID_CATEGORIES: Product["category"][] = ["gamer", "smartphone", "games", "accessories"];

function normalizeCategory(cat: string): Product["category"] {
  return VALID_CATEGORIES.includes(cat as Product["category"])
    ? (cat as Product["category"])
    : "gamer";
}

export function isDatabaseConfigured(): boolean {
  return !!DATABASE_URL;
}

async function withClient<T>(
  fn: (client: import("pg").Client) => Promise<T>
): Promise<T> {
  if (!DATABASE_URL) throw new Error("DATABASE_URL não definida");
  const { Client } = await import("pg");
  const client = new Client({ connectionString: DATABASE_URL });
  try {
    await client.connect();
    return await fn(client);
  } finally {
    await client.end();
  }
}

export type ProductRow = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  category: string;
};

export async function getProductsFromDb(): Promise<Product[] | null> {
  if (!isDatabaseConfigured()) return null;
  try {
    return await withClient(async (client) => {
      const res = await client.query<ProductRow>(
        `SELECT id, name, description, image, price, category
         FROM products
         ORDER BY created_at DESC`
      );
      return (res.rows ?? []).map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description ?? "",
        image: r.image ?? "",
        price: r.price ?? "Sob consulta",
        category: r.category as Product["category"],
      }));
    });
  } catch {
    return null;
  }
}

export async function syncProductsToDb(products: Product[]): Promise<{ error?: string }> {
  if (!isDatabaseConfigured()) return { error: "DATABASE_URL não definida" };
  try {
    await withClient(async (client) => {
      await client.query("BEGIN");
      try {
        const existingRes = await client.query<{ id: string }>("SELECT id FROM products");
        const existingIds = (existingRes.rows ?? []).map((r) => r.id);
        const newIds = new Set(products.map((p) => p.id));
        const toDelete = existingIds.filter((id) => !newIds.has(id));
        if (toDelete.length > 0) {
          await client.query(
            "DELETE FROM products WHERE id = ANY($1::text[])",
            [toDelete]
          );
        }
        if (products.length > 0) {
          for (const p of products) {
            await client.query(
              `INSERT INTO products (id, name, description, image, price, category)
               VALUES ($1, $2, $3, $4, $5, $6)
               ON CONFLICT (id) DO UPDATE SET
                 name = EXCLUDED.name,
                 description = EXCLUDED.description,
                 image = EXCLUDED.image,
                 price = EXCLUDED.price,
                 category = EXCLUDED.category,
                 updated_at = NOW()`,
              [
                p.id,
                String(p.name ?? "").trim() || "Produto",
                String(p.description ?? "").trim(),
                String(p.image ?? "").trim(),
                String(p.price ?? "Sob consulta").trim() || "Sob consulta",
                normalizeCategory(p.category ?? "gamer"),
              ]
            );
          }
        }
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      }
    });
    return {};
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { error: msg };
  }
}

export type AnalyticsRow = { product_id: string; views: number; clicks: number };

export async function getAnalyticsFromDb(): Promise<Record<string, { views: number; clicks: number }> | null> {
  if (!isDatabaseConfigured()) return null;
  try {
    return await withClient(async (client) => {
      const res = await client.query<AnalyticsRow>(
        "SELECT product_id, views, clicks FROM product_analytics"
      );
      const out: Record<string, { views: number; clicks: number }> = {};
      (res.rows ?? []).forEach((r) => {
        out[r.product_id] = { views: r.views ?? 0, clicks: r.clicks ?? 0 };
      });
      return out;
    });
  } catch {
    return null;
  }
}

export async function incrementViewFromDb(productId: string): Promise<{ error?: string }> {
  if (!isDatabaseConfigured()) return { error: "DATABASE_URL não definida" };
  try {
    await withClient(async (client) => {
      await client.query("SELECT increment_product_view($1)", [productId]);
    });
    return {};
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { error: msg };
  }
}

export async function incrementClickFromDb(productId: string): Promise<{ error?: string }> {
  if (!isDatabaseConfigured()) return { error: "DATABASE_URL não definida" };
  try {
    await withClient(async (client) => {
      await client.query("SELECT increment_product_click($1)", [productId]);
    });
    return {};
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { error: msg };
  }
}
