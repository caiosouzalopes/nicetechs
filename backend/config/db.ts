import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

let _pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!_pool) {
    _pool = new Pool({ connectionString: env.DATABASE_URL });
  }
  return _pool;
}

export async function query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
  const pool = getPool();
  const result = await pool.query(text, params as never);
  return result.rows as T[];
}
