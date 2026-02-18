import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().transform(Number).default("4000"),
  SUPABASE_URL: z.string().url("SUPABASE_URL deve ser uma URL válida"),
  SUPABASE_ANON_KEY: z.string().min(1, "SUPABASE_ANON_KEY é obrigatória"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY é obrigatória"),
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
