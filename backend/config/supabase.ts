import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

/**
 * Cliente público (anon key). Use no frontend ou em contextos onde RLS deve ser aplicado.
 */
let publicClient: SupabaseClient | null = null;

export function getSupabasePublic(): SupabaseClient {
  if (!publicClient) {
    publicClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    });
  }
  return publicClient;
}

/**
 * Cliente admin (service role). Apenas no backend, bypassa RLS. Nunca exponha no frontend.
 */
let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!adminClient) {
    adminClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return adminClient;
}
