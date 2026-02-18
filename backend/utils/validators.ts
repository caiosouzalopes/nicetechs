import { z } from "zod";

const productCategory = z.enum(["gamer", "smartphone", "games", "accessories"]);

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  full_name: z.string().max(255).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

export const refreshSchema = z.object({
  refresh_token: z.string().min(1, "refresh_token obrigatório"),
});

export const productCreateSchema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(255),
  description: z.string().max(2000).default(""),
  image: z.string().url("URL da imagem inválida").or(z.literal("")).default(""),
  price: z.string().max(100).default("Sob consulta"),
  category: productCategory.default("gamer"),
});

export const productUpdateSchema = productCreateSchema.partial();

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  page_size: z.coerce.number().int().min(1).max(100).optional(),
  category: productCategory.optional(),
  search: z.string().max(100).optional(),
});

export const trackAnalyticsSchema = z.object({
  productId: z.string().uuid("productId deve ser UUID"),
  type: z.enum(["view", "click"]),
});
