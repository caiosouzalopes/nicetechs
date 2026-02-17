import type { Product } from "@/data/products";
import { products as defaultProducts } from "@/data/products";

const STORAGE_KEY_PRODUCTS = "nicetech_admin_products";
const STORAGE_KEY_ANALYTICS = "nicetech_admin_analytics";

export type ProductAnalytics = {
  views: number;
  clicks: number;
};

export type AnalyticsData = Record<string, ProductAnalytics>;

export function getStoredProducts(): Product[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (!raw) return null;
    return JSON.parse(raw) as Product[];
  } catch {
    return null;
  }
}

export function setStoredProducts(products: Product[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
}

export function getProducts(): Product[] {
  const stored = getStoredProducts();
  return stored ?? [];
}

export function getAnalytics(): AnalyticsData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ANALYTICS);
    if (!raw) return {};
    return JSON.parse(raw) as AnalyticsData;
  } catch {
    return {};
  }
}

function setAnalytics(data: AnalyticsData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(data));
}

export function trackView(productId: string): void {
  const data = getAnalytics();
  if (!data[productId]) data[productId] = { views: 0, clicks: 0 };
  data[productId].views += 1;
  setAnalytics(data);
}

export function trackClick(productId: string): void {
  const data = getAnalytics();
  if (!data[productId]) data[productId] = { views: 0, clicks: 0 };
  data[productId].clicks += 1;
  setAnalytics(data);
}

export function updateProduct(productId: string, updates: Partial<Product>): Product[] {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === productId);
  if (index === -1) return products;
  products[index] = { ...products[index], ...updates };
  setStoredProducts(products);
  return products;
}

export function addProduct(product: Product): Product[] {
  const products = getProducts();
  const newProducts = [...products, product];
  setStoredProducts(newProducts);
  return newProducts;
}

export function removeProduct(productId: string): Product[] {
  const products = getProducts().filter((p) => p.id !== productId);
  setStoredProducts(products);
  return products;
}

export function resetToDefaults(): Product[] {
  setStoredProducts([...defaultProducts]);
  return [...defaultProducts];
}
