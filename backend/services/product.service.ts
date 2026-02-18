import { productRepository } from "../repositories";
import type { ProductDto, ProductCreateInput, ProductUpdateInput, ListProductsQuery, PaginatedResult } from "../types/api";
import type { ProductRow } from "../types/database";

function toDto(row: ProductRow): ProductDto {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    image: row.image,
    price: row.price,
    category: row.category,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export const productService = {
  async getById(id: string): Promise<ProductDto> {
    const row = await productRepository.findByIdOrThrow(id);
    return toDto(row);
  },

  async list(query: ListProductsQuery): Promise<PaginatedResult<ProductDto>> {
    const result = await productRepository.list(query);
    return {
      ...result,
      data: result.data.map(toDto),
    };
  },

  async create(input: ProductCreateInput): Promise<ProductDto> {
    const row = await productRepository.create(input);
    return toDto(row);
  },

  async update(id: string, input: ProductUpdateInput): Promise<ProductDto> {
    const row = await productRepository.update(id, input);
    return toDto(row);
  },

  async remove(id: string): Promise<void> {
    await productRepository.softDelete(id);
  },
};
