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

  const refreshProducts = useCallback(() => {
    setProducts(getStoredProducts());
  }, []);

  const refreshAnalytics = useCallback(() => {
    setAnalytics(getAnalytics());
  }, []);

  useEffect(() => {
    refreshProducts();
    refreshAnalytics();
    setIsLoading(false);
  }, [refreshProducts, refreshAnalytics]);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    const updated = storeUpdateProduct(id, updates);
    setProducts(updated);
    setAnalytics(getAnalytics());
  }, []);

  const addProduct = useCallback((product: Product) => {
    const updated = storeAddProduct(product);
    setProducts(updated);
  }, []);

  const removeProduct = useCallback((id: string) => {
    const updated = storeRemoveProduct(id);
    setProducts(updated);
  }, []);

  const resetToDefaults = useCallback(() => {
    const updated = storeResetToDefaults();
    setProducts(updated);
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
