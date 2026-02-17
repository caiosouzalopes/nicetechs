import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Product } from "@/data/products";

function trimEnv(s: string | undefined): string {
  return (s ?? "").trim();
}

const supabaseUrl = trimEnv(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
);
const supabaseAnonKey = trimEnv(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.SUPABASE_ANON_KEY
);
const supabaseServiceKey = trimEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);

export type DbProduct = Product & { created_at?: string };

let adminClient: SupabaseClient | null = null;

/** Usa variáveis lidas no carregamento do módulo (cache). */
export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios");
  }
  if (!adminClient) {
    adminClient = createClient(supabaseUrl, supabaseServiceKey);
  }
  return adminClient;
}

/** Cria cliente admin lendo process.env na hora (para API routes). Sem cache. */
export function createSupabaseAdmin(): SupabaseClient {
  const url = trimEnv(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  );
  const key = trimEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url || !key) {
    throw new Error("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios no .env");
  }
  return createClient(url, key);
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
}

export function isSupabaseConfigured(): boolean {
  const url = trimEnv(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  );
  const key = trimEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  return !!(url && key);
}
