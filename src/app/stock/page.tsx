import { StockProductsGrid } from "@/components/products/StockProductsGrid";

export const metadata = {
  title: "Estoque | Nicetech Solutions",
  description: "Confira nossos produtos: PCs gamer, smartphones, consoles e acessórios.",
};

export default function StockPage() {
  return (
    <div className="relative pt-28 pb-24 min-h-screen">
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="container relative z-10">
        <header className="text-center mb-16 md:mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/15 border border-primary/25 text-primary text-sm font-semibold mb-6">
            Catálogo
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Nossos Produtos
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            PCs gamer, smartphones, jogos e acessórios. Clique em um produto ou em &quot;Comprar no WhatsApp&quot; para falar conosco.
          </p>
        </header>

        <StockProductsGrid />
      </div>
    </div>
  );
}
