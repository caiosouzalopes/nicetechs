"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  PackageCheck,
  MessageCircle,
  Video,
  CreditCard,
  Truck,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Encontre o produto que deseja",
    description:
      "Navegue pelo catálogo na página de Estoque e escolha o equipamento que atende às suas necessidades — PCs gamer, celulares, video games ou acessórios. Todas as informações e fotos estão disponíveis para você analisar.",
  },
  {
    number: "02",
    icon: PackageCheck,
    title: "Verifique se possui no estoque",
    description:
      "Os produtos exibidos estão disponíveis para venda. Caso tenha dúvida sobre disponibilidade ou queira saber sobre outros itens não listados, entre em contato pelo WhatsApp e nossa equipe confirma na hora.",
  },
  {
    number: "03",
    icon: MessageCircle,
    title: "Entre em contato no WhatsApp",
    description:
      "Envie uma mensagem pelo WhatsApp informando o produto de interesse. Respondemos rapidamente para tirar dúvidas, passar condições de pagamento e combinar os próximos passos. Sem compromisso.",
  },
  {
    number: "04",
    icon: Video,
    title: "Receba informações e vídeos da máquina",
    description:
      "Antes de fechar, você pode solicitar fotos adicionais, vídeos de teste do equipamento e detalhes de configuração. Personalizamos a apresentação do produto para você comprar com segurança e tranquilidade.",
  },
  {
    number: "05",
    icon: CreditCard,
    title: "Efetue a compra",
    description:
      "Após aprovar o produto e as condições, fechamos a compra. Aceitamos PIX, cartão (parcelado) e outras formas combinadas. Emitimos nota quando aplicável e garantia em todos os produtos.",
  },
  {
    number: "06",
    icon: Truck,
    title: "Receba ou busque o produto",
    description:
      "Você escolhe: envio por transportadora (embalagem segura) ou retirada no local, conforme combinado. Acompanhe o pedido e conte com nosso suporte pós-venda para qualquer dúvida.",
  },
];

export function ProcessSection() {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-background">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Como comprar
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Triagem do processo de compra: do catálogo até a entrega, de forma simples e segura.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-0 relative pt-2 pb-2">
          <div className="process-line-track" aria-hidden />
          <div className="process-line-fill" aria-hidden />

          {steps.map((step, i) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06 }}
                className="relative"
              >
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 pb-10 last:pb-0">
                  <div className="flex sm:flex-col items-center gap-4 sm:gap-3 shrink-0 w-14 sm:w-auto">
                    <div
                      className={`process-icon-box process-icon-${i + 1} flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/20 border border-primary/30 text-primary`}
                    >
                      <IconComponent size={28} strokeWidth={1.5} />
                    </div>
                    <span className="font-display text-2xl font-bold text-primary/70">
                      {step.number}
                    </span>
                    {i < steps.length - 1 && (
                      <div className="hidden sm:flex flex-col items-center flex-1 min-h-[24px]">
                        <ChevronDown className="text-primary/40 w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 rounded-2xl border border-border bg-card/80 p-6 md:p-8 hover:border-primary/30 transition-all">
                    <h3 className="font-display font-bold text-foreground text-lg md:text-xl mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild size="lg" variant="default" className="rounded-xl shadow-glow-sm">
            <Link href="/stock">Ver catálogo de produtos</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
