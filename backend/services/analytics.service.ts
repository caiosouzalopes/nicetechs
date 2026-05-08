import { analyticsRepository } from "../repositories/index.js";
import type { AnalyticsDto } from "../types/api.js";
import type { ProductAnalyticsRow } from "../types/database.js";

export const analyticsService = {
  async getByProductId(productId: string): Promise<AnalyticsDto | null> {
    const row = await analyticsRepository.getByProductId(productId);
    if (!row) return null;
    return {
      product_id: row.product_id,
      views: row.views,
      clicks: row.clicks,
    };
  },

  async getAll(): Promise<AnalyticsDto[]> {
    const rows = await analyticsRepository.getAll();
    return rows.map((r: ProductAnalyticsRow) => ({
      product_id: r.product_id,
      views: r.views,
      clicks: r.clicks,
    }));
  },

  async trackView(productId: string): Promise<void> {
    await analyticsRepository.incrementView(productId);
  },

  async trackClick(productId: string): Promise<void> {
    await analyticsRepository.incrementClick(productId);
  },
};
