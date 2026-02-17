"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Product } from "@/data/products";
import {
  getProducts as getProductsFromStore,
  setStoredProducts,
  trackView as storeTrackView,
  trackClick as storeTrackClick,
} from "@/lib/admin-store";

type ProductsContextType = {
  products: Product[];
  isLoading: boolean;
  refreshProducts: () => void;
  trackView: (productId: string) => void;
  trackClick: (productId: string) => void;
};

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/stock", { cache: "no-store" });
      if (res.status === 204) {
        setProducts(getProductsFromStore());
        return;
      }
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
          setStoredProducts(data);
          return;
        }
      }
    } catch {
      /* fallback local */
    }
    setProducts(getProductsFromStore());
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/stock", { cache: "no-store" });
        if (cancelled) return;
        if (res.status === 204) {
          setProducts(getProductsFromStore());
          setIsLoading(false);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setProducts(data);
            setStoredProducts(data);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        if (cancelled) return;
      }
      setProducts(getProductsFromStore());
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Escuta quando o admin atualiza o estoque (mesma aba ou outra)
  useEffect(() => {
    const handler = () => refreshProducts();
    window.addEventListener("nicetech-stock-updated", handler);
    return () => window.removeEventListener("nicetech-stock-updated", handler);
  }, [refreshProducts]);

  const trackView = useCallback((productId: string) => {
    storeTrackView(productId);
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, type: "view" }),
    }).catch(() => {});
  }, []);

  const trackClick = useCallback((productId: string) => {
    storeTrackClick(productId);
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, type: "click" }),
    }).catch(() => {});
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        isLoading,
        refreshProducts,
        trackView,
        trackClick,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
