import { getSupabaseAdmin } from "../config/supabase";
import type { ProductAnalyticsRow } from "../types/database";

const TABLE = "product_analytics";

export const analyticsRepository = {
  async getByProductId(productId: string): Promise<ProductAnalyticsRow | null> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("product_id", productId)
      .single();
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data as ProductAnalyticsRow;
  },

  async getAll(): Promise<ProductAnalyticsRow[]> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from(TABLE).select("*");
    if (error) throw error;
    return (data ?? []) as ProductAnalyticsRow[];
  },

  async incrementView(productId: string): Promise<void> {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.rpc("increment_product_view", { p_product_id: productId });
    if (error) throw error;
  },

  async incrementClick(productId: string): Promise<void> {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.rpc("increment_product_click", { p_product_id: productId });
    if (error) throw error;
  },
};
