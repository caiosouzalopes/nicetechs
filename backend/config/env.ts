import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().transform(Number).default("4000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória"),
  JWT_SECRET: z.string().min(16, "JWT_SECRET deve ter no mínimo 16 caracteres"),
  ADMIN_PASSWORD: z.string().min(1, "ADMIN_PASSWORD é obrigatória"),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const messages = result.error.flatten().fieldErrors;
    const formatted = Object.entries(messages)
      .map(([k, v]) => `${k}: ${(v ?? []).join(", ")}`)
      .join("\n");
    throw new Error(`Variáveis de ambiente inválidas:\n${formatted}`);
  }
  return result.data;
}

export const env = loadEnv();
