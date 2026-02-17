import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Product } from "@/data/products";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export type DbProduct = Product & { created_at?: string };

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios");
  }
  if (!adminClient) {
    adminClient = createClient(supabaseUrl, supabaseServiceKey);
  }
  return adminClient;
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
}

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseServiceKey);
}
