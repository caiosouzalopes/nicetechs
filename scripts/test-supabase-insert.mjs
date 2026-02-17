/**
 * Teste completo: insere produto de teste no banco, verifica leitura e analytics, depois remove.
 * Execute: node --env-file=.env scripts/test-supabase-insert.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const TEST_PRODUCT_ID = "teste-banco-" + Date.now();

if (!url || !serviceKey) {
  console.error("❌ Faltam NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env");
  process.exit(1);
}

console.log("🔌 Teste de comunicação com Supabase (products + product_analytics)\n");

const supabase = createClient(url, serviceKey);

async function run() {
  try {
    // 1. Inserir produto de teste
    console.log("1️⃣  Inserindo produto de teste na tabela products...");
    const product = {
      id: TEST_PRODUCT_ID,
      name: "Produto Teste Banco",
      description: "Inserido pelo script de teste para validar comunicação com Supabase.",
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=400&fit=crop",
      price: "Sob consulta",
      category: "gamer",
    };

    const { error: insertError } = await supabase.from("products").insert(product);
    if (insertError) {
      console.error("   ❌ Erro ao inserir:", insertError.message, insertError.code);
      process.exit(1);
    }
    console.log("   ✅ Produto inserido (id:", TEST_PRODUCT_ID, ")\n");

    // 2. Ler o produto de volta
    console.log("2️⃣  Lendo produto da tabela products...");
    const { data: readProduct, error: readError } = await supabase
      .from("products")
      .select("*")
      .eq("id", TEST_PRODUCT_ID)
      .single();
    if (readError || !readProduct) {
      console.error("   ❌ Erro ao ler:", readError?.message || "Nenhum registro");
      await supabase.from("products").delete().eq("id", TEST_PRODUCT_ID);
      process.exit(1);
    }
    if (readProduct.name !== product.name) {
      console.error("   ❌ Dados diferentes. Esperado name:", product.name, "Recebido:", readProduct.name);
      await supabase.from("products").delete().eq("id", TEST_PRODUCT_ID);
      process.exit(1);
    }
    console.log("   ✅ Leitura OK:", readProduct.name, "\n");

    // 3. Verificar se product_analytics foi criado (trigger)
    console.log("3️⃣  Verificando tabela product_analytics (trigger)...");
    const { data: analytics, error: analyticsError } = await supabase
      .from("product_analytics")
      .select("product_id, views, clicks")
      .eq("product_id", TEST_PRODUCT_ID)
      .single();
    if (analyticsError || !analytics) {
      console.error("   ❌ Analytics não encontrado:", analyticsError?.message || "Nenhum registro");
      await supabase.from("products").delete().eq("id", TEST_PRODUCT_ID);
      process.exit(1);
    }
    console.log("   ✅ Linha em product_analytics criada (views:", analytics.views, ", clicks:", analytics.clicks, ")\n");

    // 4. Chamar função increment_product_view e verificar
    console.log("4️⃣  Testando função increment_product_view...");
    const { error: rpcError } = await supabase.rpc("increment_product_view", {
      p_product_id: TEST_PRODUCT_ID,
    });
    if (rpcError) {
      console.error("   ❌ Erro RPC:", rpcError.message);
      await supabase.from("products").delete().eq("id", TEST_PRODUCT_ID);
      process.exit(1);
    }
    const { data: afterView } = await supabase
      .from("product_analytics")
      .select("views")
      .eq("product_id", TEST_PRODUCT_ID)
      .single();
    if (afterView?.views !== 1) {
      console.error("   ❌ Esperado views=1, recebido:", afterView?.views);
      await supabase.from("products").delete().eq("id", TEST_PRODUCT_ID);
      process.exit(1);
    }
    console.log("   ✅ Views incrementado para 1\n");

    // 5. Remover produto de teste (CASCADE remove analytics)
    console.log("5️⃣  Removendo produto de teste...");
    const { error: deleteError } = await supabase.from("products").delete().eq("id", TEST_PRODUCT_ID);
    if (deleteError) {
      console.error("   ⚠️  Erro ao remover:", deleteError.message, "(pode remover manualmente no Supabase)");
    } else {
      console.log("   ✅ Produto de teste removido.\n");
    }

    console.log("✅ Todos os testes passaram. Comunicação com o banco está correta.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erro:", err.message);
    process.exit(1);
  }
}

run();
