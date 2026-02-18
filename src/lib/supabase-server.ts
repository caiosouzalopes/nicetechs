import { createClient } from "@supabase/supabase-js";

/**
 * Supabase JS client usa URL da API (https://xxx.supabase.co), não a connection string Postgres.
 * Se SUPABASE_URL for postgresql://..., derivamos a API URL do host.
 */
function getSupabaseApiUrl(): string | null {
  const raw = process.env.SUPABASE_URL?.trim() ?? process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return null;
  if (raw.startsWith("https://")) return raw;
  const match = raw.match(/@(?:db\.)?([^.]+)\.supabase\.co/);
  if (match) return `https://${match[1]}.supabase.co`;
  return raw;
}

const url = getSupabaseApiUrl();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

export function isSupabaseConfigured(): boolean {
  return !!(url && key);
}

export function getSupabaseServer() {
  if (!url || !key) throw new Error("SUPABASE_URL (ou NEXT_PUBLIC) e SUPABASE_SERVICE_ROLE_KEY são obrigatórios");
  return createClient(url, key);
}
