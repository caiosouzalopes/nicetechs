/**
 * Testa conexão com Supabase. Execute: node --env-file=.env scripts/test-supabase.mjs
 * Ou no PowerShell: Get-Content .env | ForEach-Object { ... } depois node scripts/test-supabase.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("❌ Faltam NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env");
  process.exit(1);
}

console.log("🔌 Testando conexão com Supabase...");
console.log("   URL:", url);

try {
  const supabase = createClient(url, serviceKey);
  const { data, error } = await supabase.from("products").select("id").limit(1);
  if (error) {
    if (error.code === "42P01" || error.code === "PGRST205") {
      console.log("✅ Conexão com Supabase OK!");
      console.log("⚠️  Tabela 'products' ainda não existe.");
      console.log("   → Abra Supabase Dashboard → SQL Editor → New query");
      console.log("   → Cole o conteúdo de supabase/migrations/001_create_products.sql → Run");
      process.exit(0);
    }
    console.error("❌ Erro Supabase:", error.message, error.code);
    process.exit(1);
  }
  console.log("✅ Conexão OK. Produtos na tabela:", Array.isArray(data) ? data.length : 0, "(amostra)");
  process.exit(0);
} catch (err) {
  console.error("❌ Erro:", err.message);
  process.exit(1);
}
