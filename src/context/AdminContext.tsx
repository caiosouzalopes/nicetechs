"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Product } from "@/data/products";
import type { AnalyticsData } from "@/lib/admin-store";
import { ADMIN_PASSWORD } from "@/lib/auth";
import {
  getProducts as getStoredProducts,
  getAnalytics,
  setStoredProducts,
  trackView as storeTrackView,
  trackClick as storeTrackClick,
  updateProduct as storeUpdateProduct,
  addProduct as storeAddProduct,
  removeProduct as storeRemoveProduct,
  resetToDefaults as storeResetToDefaults,
} from "@/lib/admin-store";

async function syncProductsToCloud(products: Product[]): Promise<void> {
  try {
    const res = await fetch("/api/stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Password": ADMIN_PASSWORD,
      },
      body: JSON.stringify({ products }),
    });
    if (res.status === 503) {
      const data = await res.json().catch(() => ({}));
      console.warn("Estoque salvo localmente. Para sincronizar em todos os dispositivos:", data?.error);
    }
  } catch {
    /* offline ou erro de rede */
  }
}

type AdminContextType = {
  products: Product[];
  analytics: AnalyticsData;
  isLoading: boolean;
  refreshProducts: () => void;
  refreshAnalytics: () => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  resetToDefaults: () => void;
  trackView: (productId: string) => void;
  trackClick: (productId: string) => void;
};

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({});
  const [isLoading, setIsLoading] = useState(true);

  const refreshProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/stock");
      if (res.status === 204) {
        setProducts(getStoredProducts());
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
    setProducts(getStoredProducts());
  }, []);

  const refreshAnalytics = useCallback(() => {
    setAnalytics(getAnalytics());
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/stock");
        if (cancelled) return;
        if (res.status === 204) {
          setProducts(getStoredProducts());
          setAnalytics(getAnalytics());
          setIsLoading(false);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setProducts(data);
            setStoredProducts(data);
            setAnalytics(getAnalytics());
            setIsLoading(false);
            return;
          }
        }
      } catch {
        if (cancelled) return;
      }
      setProducts(getStoredProducts());
      setAnalytics(getAnalytics());
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    const updated = storeUpdateProduct(id, updates);
    setProducts(updated);
    setAnalytics(getAnalytics());
    syncProductsToCloud(updated);
  }, []);

  const addProduct = useCallback((product: Product) => {
    const updated = storeAddProduct(product);
    setProducts(updated);
    syncProductsToCloud(updated);
  }, []);

  const removeProduct = useCallback((id: string) => {
    const updated = storeRemoveProduct(id);
    setProducts(updated);
    syncProductsToCloud(updated);
  }, []);

  const resetToDefaults = useCallback(() => {
    const updated = storeResetToDefaults();
    setProducts(updated);
    syncProductsToCloud(updated);
  }, []);

  const trackView = useCallback((productId: string) => {
    storeTrackView(productId);
    setAnalytics(getAnalytics());
  }, []);

  const trackClick = useCallback((productId: string) => {
    storeTrackClick(productId);
    setAnalytics(getAnalytics());
  }, []);

  return (
    <AdminContext.Provider
      value={{
        products,
        analytics,
        isLoading,
        refreshProducts,
        refreshAnalytics,
        updateProduct,
        addProduct,
        removeProduct,
        resetToDefaults,
        trackView,
        trackClick,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
