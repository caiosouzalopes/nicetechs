export function isSupabaseConfigured(): boolean {
  return false;
}

export function getSupabaseServer(): never {
  throw new Error("Este projeto não usa mais o provedor anterior. Use Neon/Postgres.");
}
