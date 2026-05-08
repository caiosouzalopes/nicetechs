export function getSupabasePublic(): never {
  throw new Error("Este backend não usa mais o provedor anterior. Use Neon/Postgres via pg.");
}

export function getSupabaseAdmin(): never {
  throw new Error("Este backend não usa mais o provedor anterior. Use Neon/Postgres via pg.");
}
