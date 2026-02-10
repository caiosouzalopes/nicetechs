"use client";

import { motion } from "framer-motion";
import { Package, Eye, MousePointer, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import { ProductImage } from "@/components/products/ProductImage";

export default function AdminDashboardPage() {
  const { products, analytics } = useAdmin();

  const topViewed = Object.entries(analytics)
    .sort(([, a], [, b]) => (b?.views ?? 0) - (a?.views ?? 0))
    .slice(0, 5)
    .map(([id]) => products.find((p) => p.id === id))
    .filter(Boolean);

  const topClicked = Object.entries(analytics)
    .sort(([, a], [, b]) => (b?.clicks ?? 0) - (a?.clicks ?? 0))
    .slice(0, 5)
    .map(([id]) => products.find((p) => p.id === id))
    .filter(Boolean);

  const totalViews = Object.values(analytics).reduce((acc, a) => acc + (a?.views ?? 0), 0);
  const totalClicks = Object.values(analytics).reduce((acc, a) => acc + (a?.clicks ?? 0), 0);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do estoque e do desempenho dos produtos
          </p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 border border-primary/30 text-primary font-medium hover:bg-primary/30 transition-colors"
        >
          Gerenciar produtos
          <ArrowUpRight size={18} />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="rounded-2xl border border-border bg-card/80 p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 text-primary">
              <Package size={24} />
            </span>
            <div>
              <p className="text-2xl font-bold text-foreground">{products.length}</p>
              <p className="text-sm text-muted-foreground">Produtos no estoque</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/80 p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <Eye size={24} />
            </span>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalViews}</p>
              <p className="text-sm text-muted-foreground">Visualizações</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/80 p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400">
              <MousePointer size={24} />
            </span>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalClicks}</p>
              <p className="text-sm text-muted-foreground">Cliques WhatsApp</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/80 p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-400">
              <TrendingUp size={24} />
            </span>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {products.length > 0
                  ? ((totalClicks / Math.max(totalViews, 1)) * 100).toFixed(1)
                  : "0"}
                %
              </p>
              <p className="text-sm text-muted-foreground">Taxa de conversão</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-card/80 p-6"
        >
          <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Eye size={20} className="text-primary" />
            Produtos mais visualizados
          </h2>
          <ul className="space-y-3">
            {topViewed.length > 0 ? (
              topViewed.map((p, i) => {
                if (!p) return null;
                const stats = analytics[p.id];
                return (
                  <li
                    key={p.id}
                    className="flex items-center gap-4 p-3 rounded-xl border border-border bg-background/50 hover:border-primary/30 transition-colors"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary text-sm font-bold">
                      {i + 1}
                    </span>
                    <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-muted">
                      <ProductImage
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {stats?.views ?? 0} visualizações
                      </p>
                    </div>
                  </li>
                );
              })
            ) : (
              <p className="text-muted-foreground text-sm py-4">
                Nenhuma visualização registrada ainda.
              </p>
            )}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-card/80 p-6"
        >
          <h2 className="font-display text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <MousePointer size={20} className="text-amber-500" />
            Produtos com mais cliques (WhatsApp)
          </h2>
          <ul className="space-y-3">
            {topClicked.length > 0 ? (
              topClicked.map((p, i) => {
                if (!p) return null;
                const stats = analytics[p.id];
                return (
                  <li
                    key={p.id}
                    className="flex items-center gap-4 p-3 rounded-xl border border-border bg-background/50 hover:border-primary/30 transition-colors"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-bold">
                      {i + 1}
                    </span>
                    <div className="relative h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-muted">
                      <ProductImage
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {stats?.clicks ?? 0} cliques
                      </p>
                    </div>
                  </li>
                );
              })
            ) : (
              <p className="text-muted-foreground text-sm py-4">
                Nenhum clique registrado ainda.
              </p>
            )}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
