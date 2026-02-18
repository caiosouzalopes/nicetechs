/**
 * Roda as migrations em database/*.sql na ordem, usando DATABASE_URL.
 * Uso: na pasta backend: npm run db:migrate
 * Requer DATABASE_URL no .env (Supabase: Settings → Database → Connection string URI).
 */
import "dotenv/config";
import pg from "pg";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const databaseDir = join(__dirname, "..", "database");

const order = ["001_schema.sql", "001b_trigger_auth_user.sql", "002_rls.sql", "003_seed.sql"];

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.error("DATABASE_URL não definida. Adicione no backend/.env (Connection string do Supabase).");
    process.exit(1);
  }

  const client = new pg.Client({ connectionString: url });
  try {
    await client.connect();
    console.log("Conectado ao banco. Rodando migrations...\n");

    for (const file of order) {
      const path = join(databaseDir, file);
      try {
        const sql = readFileSync(path, "utf8");
        await client.query(sql);
        console.log("OK:", file);
      } catch (e) {
        if (e.code === "ENOENT") {
          console.log("Skip (não encontrado):", file);
        } else {
          console.error("Erro em", file, e.message);
          throw e;
        }
      }
    }

    console.log("\nMigrations concluídas.");
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
