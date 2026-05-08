"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormState({ name: "", email: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="relative pt-28 pb-24 min-h-screen">
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="container max-w-4xl relative z-10">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/15 border border-primary/25 text-primary text-sm font-semibold mb-6">Fale conosco</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">Contato</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Fale conosco pelo WhatsApp ou envie uma mensagem. Respondemos o mais rápido possível.
          </p>
        </motion.header>

        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="instagram-gradient-border instagram-glow"
          >
            <div className="instagram-gradient-border-inner rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border bg-card/60">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <MapPin size={20} className="text-primary shrink-0" />
                  Localização
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Avenida Expedicionário Roberto Marcondes, 16 – Centro, Colina – SP
                </p>
              </div>
              <div className="relative aspect-video w-full min-h-[280px] bg-muted/50">
                <iframe
                  title="Mapa - Nicetech Solutions - Avenida Expedicionário Roberto Marcondes, 16, Centro, Colina SP"
                  src="https://www.google.com/maps/embed?pb=!4v1778213929550!6m8!1m7!1s_lTBRSeDZ2jNWmfvGHlxwQ!2m2!1d-20.71551594264744!2d-48.54298150510537!3f29.80701566848451!4f-10.819329986860112!5f0.7820865974627469"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mt-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-foreground">Informações</h2>
            <a
              href="https://wa.me/5517991940047?text=Olá%2C%20vim%20pelo%20site%20Nicetech%20Solutions."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card/80 hover:border-primary/40 hover:shadow-glow transition-all group"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] group-hover:bg-[#25D366]/20 transition-colors">
                <MessageCircle size={24} />
              </div>
              <div>
                <p className="font-medium text-foreground">WhatsApp</p>
                <p className="text-sm text-muted-foreground">Resposta rápida</p>
              </div>
            </a>
            <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card/80">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                <Mail size={24} />
              </div>
              <div>
                <p className="font-medium text-foreground">E-mail</p>
                <p className="text-sm text-muted-foreground">nicetechsolutions@outlook.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card/80">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                <MapPin size={24} />
              </div>
              <div>
                <p className="font-medium text-foreground">Endereço</p>
                <p className="text-sm text-muted-foreground">Avenida Expedicionário Roberto Marcondes, 16 – Centro, Colina – SP</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="instagram-gradient-border instagram-glow"
          >
            <div className="instagram-gradient-border-inner p-6 md:p-8 rounded-2xl">
            <h2 className="text-xl font-semibold text-foreground mb-6">Envie uma mensagem</h2>
            {submitted ? (
              <p className="text-primary font-medium text-center py-8">
                Mensagem enviada com sucesso! Em breve entraremos em contato.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                    Nome
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                    E-mail
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                    placeholder="caio_souza2016@hotmail.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition resize-none"
                    placeholder="Como podemos ajudar?"
                  />
                </div>
                <Button type="submit" variant="default" className="w-full" size="lg">
                  <Send size={20} />
                  Enviar
                </Button>
              </form>
            )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
