import type { ProductAnalyticsRow } from "../types/database.js";
import { query } from "../config/db.js";

const TABLE = "product_analytics";

export const analyticsRepository = {
  async getByProductId(productId: string): Promise<ProductAnalyticsRow | null> {
    const rows = await query<ProductAnalyticsRow>(
      `select * from ${TABLE} where product_id = $1 limit 1`,
      [productId]
    );
    return rows[0] ?? null;
  },

  async getAll(): Promise<ProductAnalyticsRow[]> {
    return await query<ProductAnalyticsRow>(
      `select * from ${TABLE} order by updated_at desc`
    );
  },

  async incrementView(productId: string): Promise<void> {
    await query(
      `insert into ${TABLE} (product_id, views, clicks)
       values ($1, 1, 0)
       on conflict (product_id)
       do update set views = ${TABLE}.views + 1, updated_at = now()`,
      [productId]
    );
  },

  async incrementClick(productId: string): Promise<void> {
    await query(
      `insert into ${TABLE} (product_id, views, clicks)
       values ($1, 0, 1)
       on conflict (product_id)
       do update set clicks = ${TABLE}.clicks + 1, updated_at = now()`,
      [productId]
    );
  },
};
