"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParticleBackground } from "@/components/ParticleBackground";
import { useProducts } from "@/context/ProductsContext";
import { getWhatsAppUrl } from "@/data/products";

const heroSlides = [
  { image: "/PC1.jpeg", title: "PCs Gamer", subtitle: "Venda e compra com performance máxima" },
  { image: "/PC2.jpeg", title: "Equipamentos", subtitle: "Qualidade e garantia" },
  { image: "/PC3.jpeg", title: "Manutenção", subtitle: "Limpeza e ventilação correta" },
  { image: "/PC4.jpeg", title: "Tecnologia", subtitle: "Upgrade e conserto" },
  { image: "/PC4.jpeg", title: "PS5 e Video Games", subtitle: "PlayStation, Xbox, Nintendo e jogos" },
];

export function HeroSection() {
  const { products } = useProducts();
  const [current, setCurrent] = useState(0);

  const stats = [
    { value: `${products.length}`, label: "Produtos no estoque" },
    { value: "100%", label: "Atendimento via WhatsApp" },
    { value: "Garantia", label: "Em todos os produtos" },
  ];

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-[95vh] flex flex-col items-center justify-center overflow-hidden bg-nicetech-navy">
      <div className="absolute inset-0 bg-liquid pointer-events-none" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-[80%] h-[80%] rounded-full bg-nicetech-blue-dark/40 blur-3xl animate-liquid-1" />
        <div className="absolute -bottom-1/3 -right-1/4 w-[70%] h-[70%] rounded-full bg-nicetech-blue-mid/25 blur-3xl animate-liquid-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-nicetech-blue-soft/10 blur-2xl" />
      </div>
      <ParticleBackground />

      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={heroSlides[current].image}
              alt={heroSlides[current].title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-nicetech-navy/70" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setCurrent((c) => (c - 1 + heroSlides.length) % heroSlides.length)}
          aria-label="Slide anterior"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/40 bg-card/60 text-primary hover:bg-primary/20 hover:shadow-glow-sm transition-all"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Ir para slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-primary shadow-glow-sm" : "w-2 bg-primary/40 hover:bg-primary/60"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setCurrent((c) => (c + 1) % heroSlides.length)}
          aria-label="Próximo slide"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/40 bg-card/60 text-primary hover:bg-primary/20 hover:shadow-glow-sm transition-all"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      <div className="container relative z-10 py-24 md:py-28 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-nicetech-blue-soft/90 text-sm md:text-base font-semibold uppercase tracking-widest mb-4"
        >
          Vendas, Compras e Manutenção
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-nt-white max-w-5xl mx-auto leading-[1.08]"
        >
          <span className="text-nt-white">Equipamentos, </span>
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-nicetech-blue-soft via-nicetech-blue-mid to-nicetech-blue-soft bg-clip-text text-transparent">
            conserto e upgrade
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-nicetech-blue-soft/90 max-w-2xl mx-auto leading-relaxed"
        >
          Comprar e vender PCs, celulares e video games. Conserto e manutenção de computadores:
          limpeza periódica, ventilação correta e upgrade para prolongar a vida útil do seu equipamento.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            asChild
            size="lg"
            variant="default"
            className="rounded-xl px-8 h-12 text-base font-semibold shadow-glow hover:shadow-glow-strong"
          >
            <Link href="/stock" className="flex items-center gap-2">
              <Package size={22} />
              Ver Produtos
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="whatsapp"
            className="rounded-xl px-8 h-12 text-base font-semibold"
          >
            <a
              href={getWhatsAppUrl("Olá, vim pelo site Nicetech Solutions.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <MessageCircle size={22} />
              Contato via WhatsApp
            </a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-3 gap-6 md:gap-12 max-w-2xl mx-auto"
        >
          {stats.map((s, i) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-2xl md:text-3xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-nicetech-blue-soft/80 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
