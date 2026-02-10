"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Wrench, Wind, Sparkles, Cpu, AlertTriangle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BeforeAfterHover } from "./BeforeAfterHover";

type MaintenanceTopic = {
  icon: typeof Sparkles;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  beforeImage?: string;
  afterImage?: string;
  useBeforeAfter?: boolean;
};

const maintenanceTopics: MaintenanceTopic[] = [
  {
    icon: Sparkles,
    title: "Por que fazer limpeza periódica?",
    description:
      "O acúmulo de poeira no cooler e nos ventiladores prejudica a refrigeração do processador, causa superaquecimento e pode levar a desligamentos de segurança. A poeira também reduz a rotação dos ventiladores e acelera o desgaste. Limpar a cada 3 a 6 meses prolonga a vida útil e mantém o desempenho.",
    image: "/Antes.jpeg",
    imageAlt: "Limpeza e manutenção de computador",
    beforeImage: "/Antes.jpeg",
    afterImage: "/Depois.jpeg",
    useBeforeAfter: true,
  },
  {
    icon: Wind,
    title: "Ventilação instalada corretamente",
    description:
      "Ventiladores invertidos ou mal posicionados são um dos maiores erros: o ar quente não sai e o ar frio não chega ao processador. O ideal é entrada de ar na frente, saída atrás e no topo. Nós verificamos o fluxo de ar do seu gabinete, orientamos sobre a posição correta dos fans e corrigimos instalações inadequadas.",
    image: "/VENTILAÇÃO.jpg",
    imageAlt: "Importância da ventilação no PC",
    useBeforeAfter: false,
  },
  {
    icon: Cpu,
    title: "Limpeza e upgrade de máquinas",
    description:
      "Além da limpeza interna (poeira, pasta térmica e conexões), fazemos upgrade de memória RAM, SSD, placa de vídeo e processador quando possível. Um PC limpo e bem configurado roda mais frio, mais estável e dura muito mais — evitando falhas na placa-mãe, no HD e na fonte por superaquecimento.",
    image: "/Upgrade.jpeg",
    imageAlt: "Componentes e upgrade de computador",
    useBeforeAfter: false,
  },
];

export function MaintenanceSection() {
  return (
    <section id="manutencao" className="section-corners relative py-20 md:py-28 overflow-hidden bg-card/30 border-y border-border">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/25 text-primary text-sm font-semibold mb-6">
            <Wrench size={18} />
            Conserto e Manutenção
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            A importância da limpeza e da ventilação
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            Manter o computador limpo e com ventilação correta evita superaquecimento,
            prolonga a vida dos componentes e garante melhor desempenho.
          </p>
        </motion.div>

        <div className="space-y-20 md:space-y-24">
          {maintenanceTopics.map((topic, index) => {
            const Icon = topic.icon;
            const isReversed = index % 2 === 1;
            return (
              <motion.article
                key={topic.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${isReversed ? "lg:flex-row-reverse" : ""}`}
              >
                <div className={isReversed ? "lg:order-2" : ""}>
                  {topic.useBeforeAfter && topic.beforeImage && topic.afterImage ? (
                    <div className="instagram-gradient-border instagram-glow rounded-2xl max-w-md mx-auto lg:mx-0">
                      <div className="instagram-gradient-border-inner rounded-2xl overflow-hidden">
                        <BeforeAfterHover
                          beforeImage={topic.beforeImage}
                          afterImage={topic.afterImage}
                          beforeAlt="Computador antes da limpeza"
                          afterAlt="Computador após limpeza e manutenção"
                          labelBefore="Antes"
                          labelAfter="Depois"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="card-corner-animated relative aspect-video rounded-2xl overflow-hidden border border-border bg-muted/50 shadow-glow-sm">
                      <Image
                        src={topic.image}
                        alt={topic.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                    </div>
                  )}
                </div>
                <div className={isReversed ? "lg:order-1" : ""}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 border border-primary/30 text-primary">
                      <Icon size={24} strokeWidth={1.5} />
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                      {topic.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 md:mt-24"
        >
          <div className="relative rounded-2xl overflow-hidden p-4 md:p-6 border border-border bg-card/60">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary border border-primary/30">
                <Play size={20} />
              </span>
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground">
                Vídeo: dicas de limpeza e manutenção
              </h3>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-muted/50 border border-border">
              <iframe
                title="Vídeo sobre limpeza e manutenção de PC"
                src="https://www.youtube.com/embed/AVCj61coYCs?rel=0&modestbranding=1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <p className="text-muted-foreground text-sm mt-3 text-center">
              Assista e entenda a importância da ventilação e da instalação correta do cooler.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="p-6 md:p-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <AlertTriangle size={28} />
                </span>
                <div className="flex-1">
                  <h4 className="font-display font-bold text-foreground text-lg mb-2">
                    Ventiladores invertidos ou mal configurados?
                  </h4>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
                    Se o PC desliga sozinho, trava em jogos ou está sempre quente, pode ser
                    ventilação incorreta (fans soprando no sentido errado ou todos no mesmo fluxo).
                    Trazemos seu equipamento para avaliação e corrigimos o fluxo de ar e a
                    limpeza para evitar danos aos componentes.
                  </p>
                  <Button asChild variant="default" size="lg" className="rounded-xl shadow-glow-sm">
                    <a
                      href="https://wa.me/5517991940047?text=Olá%2C%20preciso%20de%20avaliação%20para%20limpeza%20e%20ventilação%20do%20meu%20computador."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      Solicitar avaliação no WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <p className="text-muted-foreground text-sm mb-4">
            Recomendamos limpeza a cada 3 a 6 meses; em ambientes poeirentos ou com pets, a cada 1 a 3 meses.
          </p>
          <Button asChild variant="outline" size="lg" className="rounded-xl">
            <Link href="/contact">Fale conosco para orçamento</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
