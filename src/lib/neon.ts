import { neon } from "@neondatabase/serverless";

function getDatabaseUrl(): string | null {
  const url =
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.NEON_DATABASE_URL?.trim() ||
    null;
  return url || null;
}

export function isNeonConfigured(): boolean {
  return !!getDatabaseUrl();
}

export function getNeonSql() {
  const url = getDatabaseUrl();
  if (!url) {
    throw new Error(
      "DATABASE_URL (ou POSTGRES_URL/NEON_DATABASE_URL) é obrigatória para conectar no Neon"
    );
  }
  return neon(url);
}
