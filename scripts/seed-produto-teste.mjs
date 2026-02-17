/**
 * Insere um produto de teste no banco e deixa (não remove).
 * Execute: node --env-file=.env scripts/seed-produto-teste.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("❌ Faltam variáveis Supabase no .env");
  process.exit(1);
}

const product = {
  id: "produto-teste-banco",
  name: "Produto Teste Banco",
  description: "Produto inserido para validar comunicação com Supabase. Pode editar ou remover pelo admin.",
  image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=400&fit=crop",
  price: "Sob consulta",
  category: "gamer",
};

const supabase = createClient(url, serviceKey);
const { error } = await supabase.from("products").upsert(product, { onConflict: "id" });
if (error) {
  console.error("❌ Erro:", error.message);
  process.exit(1);
}
console.log("✅ Produto inserido e mantido no banco:", product.name, "(id:", product.id, ")");
