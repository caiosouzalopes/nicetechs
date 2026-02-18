import { getSupabaseAdmin } from "../config/supabase";
import type { ProductRow } from "../types/database";
import type { ProductCreateInput, ProductUpdateInput, ListProductsQuery } from "../types/api";
import type { PaginatedResult } from "../types/api";
import { NotFoundError } from "../utils/errors";

const TABLE = "products";
const PAGE_SIZE_DEFAULT = 20;
const PAGE_SIZE_MAX = 100;

export const productRepository = {
  async findById(id: string): Promise<ProductRow | null> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .is("deleted_at", null)
      .single();
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data as ProductRow;
  },

  async findByIdOrThrow(id: string): Promise<ProductRow> {
    const row = await this.findById(id);
    if (!row) throw new NotFoundError("Produto não encontrado");
    return row;
  },

  async list(query: ListProductsQuery): Promise<PaginatedResult<ProductRow>> {
    const page = Math.max(1, query.page ?? 1);
    const pageSize = Math.min(PAGE_SIZE_MAX, Math.max(1, query.page_size ?? PAGE_SIZE_DEFAULT));
    const supabase = getSupabaseAdmin();

    let q = supabase
      .from(TABLE)
      .select("*", { count: "exact", head: true })
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (query.category) {
      q = q.eq("category", query.category);
    }
    if (query.search?.trim()) {
      const term = query.search.trim().replace(/%/g, "\\%");
      q = q.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
    }

    const { data, error, count } = await q;
    if (error) throw error;

    const total = count ?? 0;
    return {
      data: (data ?? []) as ProductRow[],
      total,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(total / pageSize) || 1,
    };
  },

  async create(input: ProductCreateInput): Promise<ProductRow> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        name: input.name,
        description: input.description ?? "",
        image: input.image ?? "",
        price: input.price ?? "Sob consulta",
        category: input.category,
      })
      .select()
      .single();
    if (error) throw error;
    return data as ProductRow;
  },

  async update(id: string, input: ProductUpdateInput): Promise<ProductRow> {
    await this.findByIdOrThrow(id);
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from(TABLE)
      .update({
        ...(input.name != null && { name: input.name }),
        ...(input.description != null && { description: input.description }),
        ...(input.image != null && { image: input.image }),
        ...(input.price != null && { price: input.price }),
        ...(input.category != null && { category: input.category }),
      })
      .eq("id", id)
      .is("deleted_at", null)
      .select()
      .single();
    if (error) throw error;
    return data as ProductRow;
  },

  async softDelete(id: string): Promise<void> {
    await this.findByIdOrThrow(id);
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from(TABLE)
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  },
};
