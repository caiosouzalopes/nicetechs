/**
 * Tipos que espelham as tabelas do PostgreSQL.
 * Mantenha em sync com as migrations.
 */

export type ProductCategory = "gamer" | "smartphone" | "games" | "accessories";

export interface ProductRow {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  category: ProductCategory;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProductAnalyticsRow {
  product_id: string;
  views: number;
  clicks: number;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      products: { Row: ProductRow; Insert: Omit<ProductRow, "id" | "created_at" | "updated_at">; Update: Partial<ProductRow> };
      product_analytics: { Row: ProductAnalyticsRow; Insert: ProductAnalyticsRow; Update: Partial<ProductAnalyticsRow> };
    };
  };
}
