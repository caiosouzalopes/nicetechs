import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GlobalParticles } from "@/components/GlobalParticles";
import { LayoutSwitcher } from "@/components/layout/LayoutSwitcher";
import { ProductsProvider } from "@/context/ProductsContext";

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Nicetech Solutions | Vendas, Compras e Manutenção de Computadores, Celulares e Video Games",
  description:
    "Venda e compra de equipamentos: PCs gamer, celulares, video games e acessórios. Conserto e manutenção de computadores, limpeza periódica, correção de ventilação e upgrade. Atendimento via WhatsApp.",
  icons: {
    icon: [{ url: "/NICETECH.png", type: "image/png", sizes: "32x32" }],
  },
  openGraph: {
    title: "Nicetech Solutions | Vendas, Compras e Manutenção",
    description: "Equipamentos de tecnologia, conserto e manutenção de PCs. Limpeza e ventilação correta para maior vida útil.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${orbitron.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('nicetech-theme');document.documentElement.classList.add(t==='light'?'light':'dark');})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground relative">
        <ThemeProvider>
          <GlobalParticles />
          <div className="relative z-10 flex min-h-screen flex-col">
            <ProductsProvider>
              <LayoutSwitcher>{children}</LayoutSwitcher>
            </ProductsProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
