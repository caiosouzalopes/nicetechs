"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Monitor,
  Smartphone,
  Gamepad2,
  Headphones,
  Wrench,
  Zap,
  Shield,
  Award,
  Package,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Monitor,
    title: "PCs Gamer",
    description: "Venda e compra de configurações potentes. Montamos o PC ideal para você.",
    gradient: "from-nicetech-blue-mid/30 to-nicetech-blue-dark/30",
  },
  {
    icon: Smartphone,
    title: "Celulares",
    description: "Smartphones com garantia e suporte. Troca e venda com avaliação justa.",
    gradient: "from-nicetech-blue-soft/20 to-nicetech-blue-mid/20",
  },
  {
    icon: Gamepad2,
    title: "Video Games",
    description: "PlayStation, Xbox e Nintendo. Lançamentos e clássicos em mídia física e digital.",
    gradient: "from-nicetech-blue-mid/30 to-nicetech-navy/30",
  },
  {
    icon: Wrench,
    title: "Conserto e Manutenção",
    description: "Limpeza periódica, ventilação correta e upgrade. Seu PC dura mais e roda melhor.",
    gradient: "from-nicetech-blue-dark/30 to-nicetech-blue-mid/30",
  },
  {
    icon: Headphones,
    title: "Acessórios",
    description: "Headsets, teclados, mouses e controles. Equipamento completo para seu setup.",
    gradient: "from-nicetech-blue-dark/30 to-nicetech-blue-mid/30",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export function FeaturesSection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden min-h-[600px]">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(74,127,167,0.08),transparent_50%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-primary/10 blur-3xl rounded-full" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/25 text-primary text-sm font-semibold mb-6"
          >
            <Zap size={18} />
            O que oferecemos
          </motion.span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5 tracking-tight">
            Tecnologia para cada etapa
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            Compre, venda ou conserte. Equipamentos com qualidade, preço justo e atendimento humanizado.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 md:gap-6"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item} className="group relative">
              <div
                className={`
                  card-corner-animated relative h-full p-6 md:p-8 rounded-2xl border border-border/80
                  bg-card/80 backdrop-blur-sm
                  bg-gradient-to-br ${f.gradient}
                  hover:border-primary/50 hover:shadow-glow transition-all duration-300
                  overflow-hidden
                `}
              >
                <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/15 transition-colors" />
                <div className="relative flex flex-col items-start text-left">
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/20 border border-primary/30 text-primary mb-5 group-hover:bg-primary/30 group-hover:shadow-glow-sm transition-all duration-300">
                    <f.icon size={28} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display font-bold text-foreground text-lg mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-5 w-5 text-primary shrink-0" />
            Garantia em todos os produtos
          </span>
          <span className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="h-5 w-5 text-primary shrink-0" />
            Atendimento premium
          </span>
          <Button asChild variant="default" size="lg" className="rounded-xl shadow-glow-sm shrink-0">
            <Link href="/stock" className="flex items-center gap-2">
              <Package size={20} />
              Ver produtos
            </Link>
          </Button>
          <Button
            asChild
            variant="whatsapp"
            size="lg"
            className="rounded-xl shrink-0"
          >
            <a
              href="https://wa.me/5517991940047?text=Olá%2C%20vim%20pelo%20site%20Nicetech%20Solutions."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <MessageCircle size={20} />
              Chamar no WhatsApp
            </a>
          </Button>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </section>
  );
}
