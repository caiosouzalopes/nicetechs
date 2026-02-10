"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Product } from "@/data/products";
import {
  getProducts as getStoredProducts,
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

  const refreshProducts = useCallback(() => {
    setProducts(getStoredProducts());
  }, []);

  useEffect(() => {
    setProducts(getStoredProducts());
    setIsLoading(false);
  }, []);

  const trackView = useCallback((productId: string) => {
    storeTrackView(productId);
  }, []);

  const trackClick = useCallback((productId: string) => {
    storeTrackClick(productId);
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
