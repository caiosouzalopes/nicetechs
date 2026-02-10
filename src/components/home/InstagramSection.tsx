"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const INSTAGRAM_PHOTOS = ["/PC1.jpeg", "/PC2.jpeg", "/PC3.jpeg", "/PC4.jpeg"];

const INSTAGRAM_URL = "https://www.instagram.com/nicetechsolutions/";

export function InstagramSection() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden" aria-label="Instagram">
      <div className="container relative z-10">
        <div className="instagram-gradient-border instagram-glow rounded-2xl">
          <div className="instagram-gradient-border-inner flex flex-col md:flex-row md:items-center md:justify-between gap-8 p-6 md:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/15 border border-primary/30 text-primary"
              >
                <Instagram size={32} strokeWidth={1.5} />
              </motion.div>
              <div>
                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="font-display text-xl md:text-2xl font-bold text-foreground uppercase tracking-tight mb-2"
                >
                  Nosso perfil no Instagram
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 }}
                  className="text-muted-foreground text-sm md:text-base max-w-md"
                >
                  Acompanhe novidades, promoções e o dia a dia da Nicetech Solutions.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="mt-4"
                >
                  <Button
                    asChild
                    size="lg"
                    variant="default"
                    className="rounded-xl shadow-glow-sm bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Instagram size={20} />
                      Seguir agora
                    </a>
                  </Button>
                </motion.div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 md:gap-3 w-full max-w-md shrink-0">
              {INSTAGRAM_PHOTOS.map((src, i) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * (i + 1) }}
                  className="aspect-square rounded-xl overflow-hidden border-2 border-primary/20 bg-muted/30 hover:border-primary/40 transition-colors"
                >
                  <Image
                    src={src}
                    alt={`Foto ${i + 1} Nicetech`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
