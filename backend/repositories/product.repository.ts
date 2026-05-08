import type { ProductRow } from "../types/database.js";
import type { ProductCreateInput, ProductUpdateInput, ListProductsQuery, PaginatedResult } from "../types/api.js";
import { NotFoundError } from "../utils/errors.js";
import { query } from "../config/db.js";

const TABLE = "products";
const PAGE_SIZE_DEFAULT = 20;
const PAGE_SIZE_MAX = 100;

export const productRepository = {
  async findById(id: string): Promise<ProductRow | null> {
    const rows = await query<ProductRow>(
      `select * from ${TABLE} where id = $1 and deleted_at is null limit 1`,
      [id]
    );
    return rows[0] ?? null;
  },

  async findByIdOrThrow(id: string): Promise<ProductRow> {
    const row = await this.findById(id);
    if (!row) throw new NotFoundError("Produto não encontrado");
    return row;
  },

  async list(queryInput: ListProductsQuery): Promise<PaginatedResult<ProductRow>> {
    const page = Math.max(1, queryInput.page ?? 1);
    const pageSize = Math.min(PAGE_SIZE_MAX, Math.max(1, queryInput.page_size ?? PAGE_SIZE_DEFAULT));
    const offset = (page - 1) * pageSize;

    const where: string[] = ["deleted_at is null"]; 
    const params: unknown[] = [];
    let p = 1;

    if (queryInput.category) {
      where.push(`category = $${p++}`);
      params.push(queryInput.category);
    }

    if (queryInput.search?.trim()) {
      where.push(`(name ilike $${p} or description ilike $${p})`);
      params.push(`%${queryInput.search.trim()}%`);
      p += 1;
    }

    const whereSql = where.length ? `where ${where.join(" and ")}` : "";

    const countRows = await query<{ total: string }>(
      `select count(*)::text as total from ${TABLE} ${whereSql}`,
      params
    );
    const total = Number(countRows[0]?.total ?? 0);

    const data = await query<ProductRow>(
      `select * from ${TABLE} ${whereSql} order by created_at desc limit $${p} offset $${p + 1}`,
      [...params, pageSize, offset]
    );

    return {
      data: (data ?? []) as ProductRow[],
      total,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(total / pageSize) || 1,
    };
  },

  async create(input: ProductCreateInput): Promise<ProductRow> {
    const rows = await query<ProductRow>(
      `insert into ${TABLE} (name, description, image, price, category)
       values ($1, $2, $3, $4, $5)
       returning *`,
      [
        input.name,
        input.description ?? "",
        input.image ?? "",
        input.price ?? "Sob consulta",
        input.category,
      ]
    );
    return rows[0] as ProductRow;
  },

  async update(id: string, input: ProductUpdateInput): Promise<ProductRow> {
    await this.findByIdOrThrow(id);
    const sets: string[] = [];
    const params: unknown[] = [];
    let p = 1;

    if (input.name != null) {
      sets.push(`name = $${p++}`);
      params.push(input.name);
    }
    if (input.description != null) {
      sets.push(`description = $${p++}`);
      params.push(input.description);
    }
    if (input.image != null) {
      sets.push(`image = $${p++}`);
      params.push(input.image);
    }
    if (input.price != null) {
      sets.push(`price = $${p++}`);
      params.push(input.price);
    }
    if (input.category != null) {
      sets.push(`category = $${p++}`);
      params.push(input.category);
    }

    if (sets.length === 0) {
      return await this.findByIdOrThrow(id);
    }

    params.push(id);
    const rows = await query<ProductRow>(
      `update ${TABLE}
       set ${sets.join(", ")}
       where id = $${p} and deleted_at is null
       returning *`,
      params
    );
    if (!rows[0]) throw new NotFoundError("Produto não encontrado");
    return rows[0];
  },

  async softDelete(id: string): Promise<void> {
    await this.findByIdOrThrow(id);
    await query(
      `update ${TABLE} set deleted_at = now() where id = $1`,
      [id]
    );
  },
};
