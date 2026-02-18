/**
 * Testa conexão usando apenas DATABASE_URL.
 * Execute: node --env-file=.env scripts/test-db-connection.mjs
 */
import pg from "pg";

const connectionString = process.env.DATABASE_URL?.trim();

if (!connectionString) {
  console.error("❌ DATABASE_URL não definida no .env");
  process.exit(1);
}

console.log("🔌 Testando conexão com o banco (DATABASE_URL)...");
console.log("   Host:", connectionString.replace(/:[^:@]+@/, ":****@").split("/")[2]?.split(":")[0] || "(oculto)");

const client = new pg.Client({ connectionString });

try {
  await client.connect();
  const res = await client.query("SELECT 1 as ok");
  console.log("✅ Conexão OK. Banco respondeu:", res.rows?.[0]?.ok === 1 ? "sim" : "não");
  const tableCheck = await client.query(`
    SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products') as products_exists
  `).catch(() => ({ rows: [{ products_exists: false }] }));
  if (tableCheck.rows?.[0]?.products_exists) {
    const count = await client.query("SELECT COUNT(*) as n FROM products");
    console.log("   Tabela 'products' existe. Registros:", count.rows?.[0]?.n ?? 0);
  } else {
    console.log("   Tabela 'products' ainda não existe. Rode o SQL em supabase/migrations/001_schema_estoque.sql");
  }
  process.exit(0);
} catch (err) {
  console.error("❌ Erro:", err.message);
  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
