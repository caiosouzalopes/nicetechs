"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, Mail, MapPin, Instagram } from "lucide-react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { INSTAGRAM_URL, getWhatsAppUrl } from "@/data/products";

const links = [
  { href: "/", label: "Home" },
  { href: "/stock", label: "Estoque" },
  { href: "/contact", label: "Contato" },
];

const social = [
  { href: INSTAGRAM_URL, icon: Instagram, label: "Instagram" },
  { href: getWhatsAppUrl("Olá, vim pelo site Nicetech Solutions."), icon: MessageCircle, label: "WhatsApp" },
];

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-card/50 border-t border-border">
      <div className="absolute inset-0 bg-liquid opacity-40 pointer-events-none" />
      <ParticleBackground
        className="opacity-50"
        options={{
          fullScreen: { enable: false },
          particles: {
            number: { value: 30, density: { enable: true, width: 800, height: 300 } },
            color: { value: ["#4A7FA7", "#B3CFE5", "#1A3D63"] },
            shape: { type: "circle" },
            opacity: { value: { min: 0.08, max: 0.25 } },
            size: { value: { min: 0.5, max: 1.5 } },
            move: { enable: true, speed: 0.5 },
          },
        }}
      />
      <div className="container relative z-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <Link href="/" className="inline-block">
                <Image
                  src="/NICETECH%20LOGO.png"
                  alt="Nicetech Solutions"
                  width={500}
                  height={500}
                  className="h-20 sm:h-24 md:h-28 w-20 sm:w-24 md:w-28 object-contain"
                />
              </Link>
            </motion.div>
            <p className="text-muted-foreground text-sm max-w-md mb-8 leading-relaxed">
              Venda e compra de equipamentos: PCs, celulares, video games e acessórios. Conserto e
              manutenção de computadores, limpeza e ventilação correta. Atendimento via WhatsApp.
            </p>
            <a
              href={getWhatsAppUrl("Olá, vim pelo site Nicetech Solutions.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] font-semibold hover:bg-[#25D366]/25 hover:shadow-glow-sm transition-all"
            >
              <MessageCircle size={20} />
              Fale conosco no WhatsApp
            </a>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-6 text-lg">Links</h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-foreground mb-6 text-lg">Contato</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-primary shrink-0" />
                Rua 5, 211 – Nova Colina, Colina – SP
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                nicetechsolutions@outlook.com
              </li>
            </ul>
            <div className="flex gap-3 mt-6">
              {social.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/25 text-primary hover:bg-primary/25 hover:shadow-glow-sm transition-all"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nicetech Solutions. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Desenvolvido por{" "}
            <a
              href="https://www.hbstudiodev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              HB Studio Dev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
