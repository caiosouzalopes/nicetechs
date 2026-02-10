"use client";

import { ProductImage } from "./ProductImage";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";
import { getWhatsAppProductMessage, getWhatsAppUrl } from "@/data/products";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
  className?: string;
  onWhatsAppClick?: () => void;
}

export function ProductCard({ product, index = 0, className, onWhatsAppClick }: ProductCardProps) {
  const whatsAppUrl = getWhatsAppUrl(getWhatsAppProductMessage(product.name));

  const handleClick = () => {
    onWhatsAppClick?.();
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        "group rounded-2xl overflow-hidden border border-border bg-card/80 backdrop-blur-sm",
        "hover:border-primary/40 hover:shadow-glow transition-all duration-400 flex flex-col",
        className
      )}
    >
      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block relative aspect-[4/3] overflow-hidden bg-muted"
      >
        <ProductImage
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nicetech-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-white">
            <MessageCircle size={18} />
            Comprar no WhatsApp
          </span>
        </div>
      </a>
      <div className="p-6 flex flex-col flex-1 border-t border-border">
        <h3 className="font-display font-bold text-foreground text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-2 leading-relaxed">{product.description}</p>
        {product.price && (
          <p className="text-primary font-semibold text-sm mb-4">{product.price}</p>
        )}
        <Button asChild variant="whatsapp" size="sm" className="w-full rounded-xl h-11 font-semibold">
          <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" onClick={handleClick} className="flex items-center justify-center gap-2">
            <MessageCircle size={18} />
            Comprar no WhatsApp
          </a>
        </Button>
      </div>
    </motion.article>
  );
}
