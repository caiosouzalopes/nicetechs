"use client";

import { useRef, useEffect } from "react";
import { useProducts } from "@/context/ProductsContext";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/data/products";

export function StockProductsGrid() {
  const { products, isLoading, trackView, trackClick } = useProducts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card/80 h-[320px] animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {products.map((product, index) => (
        <ProductCardWithTracking
          key={product.id}
          product={product}
          index={index}
          onView={() => trackView(product.id)}
          onClick={() => trackClick(product.id)}
        />
      ))}
    </div>
  );
}

function ProductCardWithTracking({
  product,
  index,
  onView,
  onClick,
}: {
  product: Product;
  index: number;
  onView: () => void;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const viewed = useRef(false);

  useEffect(() => {
    if (viewed.current) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !viewed.current) {
          viewed.current = true;
          onView();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [onView]);

  return (
    <div ref={ref}>
      <ProductCard
        product={product}
        index={index}
        onWhatsAppClick={onClick}
      />
    </div>
  );
}
