import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase JS client usa URL da API (https://xxx.supabase.co), não a connection string Postgres.
 * Se SUPABASE_URL for postgresql://..., derivamos a API URL do host.
 */
function getSupabaseApiUrl(): string | null {
  try {
    const raw = process.env.SUPABASE_URL?.trim() ?? process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    if (!raw) return null;
    if (raw.startsWith("https://")) return raw;
    const match = raw.match(/@(?:db\.)?([^.]+)\.supabase\.co/);
    if (match) return `https://${match[1]}.supabase.co`;
    return raw;
  } catch {
    return null;
  }
}

const url = getSupabaseApiUrl();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

export function isSupabaseConfigured(): boolean {
  return !!(url && key);
}

let _client: SupabaseClient | null = null;

export function getSupabaseServer(): SupabaseClient {
  if (!url || !key) throw new Error("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios");
  if (!_client) _client = createClient(url, key);
  return _client;
}
