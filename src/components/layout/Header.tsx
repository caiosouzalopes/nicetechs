"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, Package, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/stock", label: "Estoque", icon: Package },
  { href: "/contact", label: "Contato", icon: MessageCircle },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{
        y: 0,
        boxShadow: scrolled
          ? "0 4px 30px rgba(74, 127, 167, 0.08), 0 0 0 1px rgba(74, 127, 167, 0.06)"
          : "none",
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "py-3 border-b border-primary/10 dark:border-primary/20"
          : "py-5 border-b border-transparent"
      )}
      style={{
        background: scrolled
          ? "hsl(var(--card) / 0.82)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
      }}
    >
      {scrolled && (
        <div
          className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(74, 127, 167, 0.4) 20%, rgba(74, 127, 167, 0.6) 50%, rgba(74, 127, 167, 0.4) 80%, transparent 100%)",
          }}
        />
      )}

      <div className="container flex items-center justify-between gap-4 h-24 min-h-24 shrink-0">
        <Link
          href="/"
          className="group flex items-center shrink-0 h-full max-h-24"
          aria-label="Nicetech Solutions - Início"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative h-full max-h-24 w-auto aspect-square flex items-center justify-center"
          >
            <Image
              src="/NICETECH%20LOGO.png"
              alt="Nicetech Solutions"
              width={500}
              height={500}
              className="h-full w-full object-contain"
              priority
            />
          </motion.div>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                initial={false}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={item.href} className="relative block">
                  <motion.span
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-200",
                        isActive && "text-primary"
                      )}
                    />
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="header-active"
                        className="absolute inset-0 rounded-xl bg-primary/15 border border-primary/25 -z-10"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.4,
                        }}
                      />
                    )}
                  </motion.span>
                </Link>
              </motion.div>
            );
          })}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              asChild
              size="sm"
              variant="whatsapp"
              className="rounded-xl shadow-glow-sm border border-[#25D366]/30 hover:shadow-[0_0_25px_-5px_rgba(37,211,102,0.4)] transition-shadow duration-300"
            >
              <a
                href="https://wa.me/5517991940047?text=Olá%2C%20vim%20pelo%20site%20Nicetech%20Solutions."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>
        <motion.button
          type="button"
          className="lg:hidden flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card/80 text-foreground hover:bg-primary/10 hover:border-primary/30 transition-all"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <Menu size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-border/50"
            style={{
              background: "hsl(var(--card) / 0.95)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
          >
            <nav className="container py-4 flex flex-col gap-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ delay: index * 0.04, duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "text-primary bg-primary/15 border border-primary/25"
                          : "text-foreground hover:bg-card/80"
                      )}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ delay: navItems.length * 0.04, duration: 0.2 }}
                className="flex items-center gap-3 px-4 py-3 mt-2"
              >
                <ThemeToggle />
                <Button
                  asChild
                  variant="whatsapp"
                  size="sm"
                  className="flex-1 rounded-xl"
                >
                  <a
                    href="https://wa.me/5517991940047?text=Olá%2C%20vim%20pelo%20site%20Nicetech%20Solutions."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={18} />
                    WhatsApp
                  </a>
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
