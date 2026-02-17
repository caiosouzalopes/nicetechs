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
  getAnalytics,
  setStoredProducts,
  trackView as storeTrackView,
  trackClick as storeTrackClick,
  updateProduct as storeUpdateProduct,
  addProduct as storeAddProduct,
  removeProduct as storeRemoveProduct,
  resetToDefaults as storeResetToDefaults,
} from "@/lib/admin-store";

const STOCK_UPDATED_EVENT = "nicetech-stock-updated";

async function syncProductsToCloud(products: Product[]): Promise<void> {
  try {
    const res = await fetch("/api/stock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Password": ADMIN_PASSWORD,
      },
      body: JSON.stringify({ products }),
      cache: "no-store",
    });
    if (res.ok) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent(STOCK_UPDATED_EVENT));
      }
      const data = await res.json().catch(() => ({}));
      if (data?.binId) {
        console.info("JSONBin:", data.message ?? "Bin criado. Adicione JSONBIN_BIN_ID ao .env");
      }
    } else if (res.status === 503) {
      const data = await res.json().catch(() => ({}));
      console.warn("Estoque salvo localmente. Para sincronizar em todos os dispositivos:", data?.error);
    } else if (res.status === 401) {
      console.warn("Senha do admin incorreta. Verifique ADMIN_PASSWORD / NEXT_PUBLIC_ADMIN_PASSWORD.");
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
      const res = await fetch("/api/stock", { cache: "no-store" });
      if (res.status === 204) {
        setProducts([]);
        setStoredProducts([]);
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
      /* sem cache */
    }
    setProducts([]);
    setStoredProducts([]);
  }, []);

  const refreshAnalytics = useCallback(async () => {
    try {
      const res = await fetch("/api/analytics", { cache: "no-store" });
      if (res.status === 204) {
        setAnalytics(getAnalytics());
        return;
      }
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === "object" && !Array.isArray(data)) {
          setAnalytics(data);
          return;
        }
      }
    } catch {
      /* fallback */
    }
    setAnalytics(getAnalytics());
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/stock", { cache: "no-store" });
        if (cancelled) return;
        if (res.status === 204) {
          setProducts([]);
          setStoredProducts([]);
          const ar = await fetch("/api/analytics", { cache: "no-store" });
          if (!cancelled) {
            if (ar.status === 204) setAnalytics(getAnalytics());
            else if (ar.ok) {
              const a = await ar.json().catch(() => null);
              if (a && typeof a === "object") setAnalytics(a);
              else setAnalytics(getAnalytics());
            } else setAnalytics(getAnalytics());
          }
          setIsLoading(false);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setProducts(data);
            setStoredProducts(data);
            const ar = await fetch("/api/analytics", { cache: "no-store" });
            if (!cancelled) {
              if (ar.status === 204) setAnalytics(getAnalytics());
              else if (ar.ok) {
                const a = await ar.json().catch(() => null);
                if (a && typeof a === "object") setAnalytics(a);
                else setAnalytics(getAnalytics());
              } else setAnalytics(getAnalytics());
            }
            setIsLoading(false);
            return;
          }
        }
      } catch {
        if (cancelled) return;
      }
      setProducts([]);
      setStoredProducts([]);
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

  const trackView = useCallback(async (productId: string) => {
    storeTrackView(productId);
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, type: "view" }),
      });
      refreshAnalytics();
    } catch {
      setAnalytics(getAnalytics());
    }
  }, [refreshAnalytics]);

  const trackClick = useCallback(async (productId: string) => {
    storeTrackClick(productId);
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, type: "click" }),
      });
      refreshAnalytics();
    } catch {
      setAnalytics(getAnalytics());
    }
  }, [refreshAnalytics]);

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
