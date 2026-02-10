"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/data/testimonials";

export function TestimonialsSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-card/30 border-y border-border">
      <div className="container relative z-10">
        <div className="max-w-6xl mx-auto p-8 md:p-12 rounded-2xl border border-border bg-card/60">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
                O que nossos clientes dizem
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Feedback real de quem já comprou ou negociou conosco
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <motion.article
                  key={t.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative p-8 rounded-2xl border border-border bg-background hover:border-primary/30 hover:shadow-glow-sm transition-all flex flex-col h-full"
                >
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-primary/20 border border-primary/30 text-primary font-display font-bold text-xl mb-6 shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <blockquote className="text-muted-foreground leading-relaxed mb-6 flex-1">
                    &quot;{t.text}&quot;
                  </blockquote>
                  <div className="border-t border-border pt-4">
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {t.role}
                      {t.company && ` • ${t.company}`}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
        </div>
      </div>
    </section>
  );
}
