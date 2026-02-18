import type { ProductCategory } from "./database";

export interface ProductDto {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  category: ProductCategory;
  created_at: string;
  updated_at: string;
}

export interface ProductCreateInput {
  name: string;
  description: string;
  image: string;
  price: string;
  category: ProductCategory;
}

export interface ProductUpdateInput extends Partial<ProductCreateInput> {}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AnalyticsDto {
  product_id: string;
  views: number;
  clicks: number;
}

export interface ListProductsQuery {
  page?: number;
  page_size?: number;
  category?: ProductCategory;
  search?: string;
}
