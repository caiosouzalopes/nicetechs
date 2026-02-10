"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, LogIn } from "lucide-react";
import Image from "next/image";
import { ADMIN_PASSWORD } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password === ADMIN_PASSWORD) {
      if (typeof window !== "undefined") {
        localStorage.setItem("nicetech_admin_auth", "1");
      }
      router.push("/admin/dashboard");
    } else {
      setError("Senha incorreta. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="absolute inset-0 bg-liquid opacity-30 pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8 shadow-glow-sm">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/NICETECH%20LOGO.png"
                alt="Nicetech Solutions"
                width={180}
                height={50}
                className="h-12 w-auto mx-auto"
              />
            </Link>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Painel Administrativo
            </h1>
            <p className="text-muted-foreground text-sm">
              Digite a senha para acessar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                  strokeWidth={1.5}
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                  autoFocus
                  required
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-glow-sm"
            >
              <LogIn size={20} />
              Entrar
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Acesso restrito ao proprietário da Nicetech Solutions.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
