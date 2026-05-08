"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { ProductImage } from "./ProductImage";
import type { Product } from "@/data/products";
import { getWhatsAppProductMessage, getWhatsAppUrl } from "@/data/products";
import { cn } from "@/lib/utils";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  if (!product) return null;

  const images = Array.isArray(product.image) ? product.image : [product.image];
  const hasMultipleImages = images.length > 1;
  const whatsAppUrl = getWhatsAppUrl(getWhatsAppProductMessage(product.name));

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl max-h-[90vh] bg-background rounded-2xl overflow-hidden shadow-2xl border border-border flex flex-col md:flex-row"
            >
              {/* Close Button - Fixed position outside scroll */}
              <button
                onClick={onClose}
                className="fixed top-6 right-6 z-[100000] flex items-center justify-center w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl transition-all hover:scale-110"
              >
                <X size={24} />
              </button>

              {/* Image Section */}
              <div className="relative aspect-square md:aspect-auto md:w-1/2 bg-muted shrink-0">
                <ProductImage
                  src={images[currentImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                    >
                      <ChevronLeft size={28} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                    >
                      <ChevronRight size={28} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                      {images.map((_, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "w-3 h-3 rounded-full transition-colors",
                            idx === currentImageIndex ? "bg-white" : "bg-white/50"
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Content Section - Scrollable */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {product.name}
                  </h2>
                  {product.price && (
                    <p className="text-primary font-bold text-2xl md:text-3xl mb-2">{product.price}</p>
                  )}
                  {product.installments && (
                    <p className="text-sm md:text-base text-muted-foreground mb-6 font-medium">
                      em até {product.installments.count}x de {product.installments.value}
                    </p>
                  )}
                  <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-2 text-lg">Descrição</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {product.description}
                    </p>
                  </div>
                  <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-2 text-lg">Categoria</h3>
                    <p className="text-muted-foreground capitalize">
                      {product.category === "gamer" && "PC Gamer"}
                      {product.category === "smartphone" && "Smartphone"}
                      {product.category === "games" && "Consoles/Jogos"}
                      {product.category === "accessories" && "Acessórios"}
                    </p>
                  </div>
                </div>
                {/* Fixed bottom action */}
                <div className="p-6 md:p-8 border-t border-border bg-card/50 backdrop-blur-sm shrink-0">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg transition-colors shadow-lg hover:shadow-xl"
                  >
                    <MessageCircle size={24} />
                    Comprar no WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
