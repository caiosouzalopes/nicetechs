"use client";

import { useState } from "react";
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[90vh] bg-card rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="relative aspect-square md:aspect-auto md:w-1/2 bg-muted">
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
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                      {images.map((_, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "w-2 h-2 rounded-full transition-colors",
                            idx === currentImageIndex ? "bg-white" : "bg-white/50"
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {product.name}
                </h2>
                {product.price && (
                  <p className="text-primary font-semibold text-xl mb-4">{product.price}</p>
                )}
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2">Descrição</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-2">Categoria</h3>
                  <p className="text-muted-foreground capitalize">
                    {product.category === "gamer" && "PC Gamer"}
                    {product.category === "smartphone" && "Smartphone"}
                    {product.category === "games" && "Consoles/Jogos"}
                    {product.category === "accessories" && "Acessórios"}
                  </p>
                </div>
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                >
                  <MessageCircle size={20} />
                  Comprar no WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
