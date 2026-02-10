"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const reasons = [
  "Venda e compra de PCs, celulares, video games e acessórios",
  "Conserto e manutenção: limpeza, ventilação e upgrade",
  "Garantia em todos os produtos e atendimento via WhatsApp",
  "Preço justo, transparência e avaliação para troca",
];

export function WhyChooseSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-background">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto p-8 md:p-12 rounded-2xl border border-border bg-card/60">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
                Por que comprar na Nicetech?
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                Vendemos e compramos equipamentos e fazemos conserto e manutenção de computadores.
                Limpeza periódica, correção de ventilação e upgrade para prolongar a vida útil do seu PC.
              </p>
            </motion.div>
            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {reasons.map((text, i) => (
                <motion.li
                  key={text}
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card/60 hover:border-primary/30 hover:bg-card/80 transition-all"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/30">
                    <Check size={20} strokeWidth={2.5} />
                  </span>
                  <span className="text-foreground font-medium">{text}</span>
                </motion.li>
              ))}
            </motion.ul>
        </div>
      </div>
    </section>
  );
}
