"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { AdminProvider } from "@/context/AdminContext";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLogin = pathname === "/admin" || pathname === "/admin/login" || !pathname;

  useEffect(() => {
    if (!isLogin && typeof window !== "undefined") {
      const auth = localStorage.getItem("nicetech_admin_auth");
      if (!auth) router.replace("/admin");
    }
  }, [isLogin, router]);

  if (isLogin) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-background">{children}</div>
      </ThemeProvider>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("nicetech_admin_auth");
    router.push("/admin");
  };

  return (
    <ThemeProvider>
      <AdminProvider>
        <div className="min-h-screen bg-background flex">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              />
            )}
          </AnimatePresence>

          <aside
            className={`fixed lg:static inset-y-0 left-0 z-50 w-[280px] shrink-0 border-r border-border bg-card/80 backdrop-blur-xl overflow-hidden transition-transform lg:transform-none ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          >
            <div className="flex h-full flex-col p-6">
              <div className="flex items-center justify-between mb-10">
                <Link href="/admin/dashboard" className="flex items-center gap-3">
                  <Image
                    src="/NICETECH%20LOGO.png"
                    alt="Nicetech Admin"
                    width={120}
                    height={36}
                    className="h-9 w-auto"
                  />
                  <span className="font-display text-sm font-bold text-primary">
                    Admin
                  </span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-primary/10 text-foreground"
                  aria-label="Fechar menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                <Link
                  href="/admin/dashboard"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === "/admin/dashboard"
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                  }`}
                >
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>
                <Link
                  href="/admin/products"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname?.startsWith("/admin/products")
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                  }`}
                >
                  <Package size={20} />
                  Produtos
                </Link>
              </nav>

              <div className="pt-4 border-t border-border">
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-colors mb-2"
                >
                  Ver site
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={20} />
                  Sair
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col min-w-0">
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/60 backdrop-blur-xl px-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-primary/10 text-foreground"
                aria-label="Abrir menu"
              >
                <Menu size={24} />
              </button>
              <h1 className="font-display text-lg font-bold text-foreground">
                Painel Administrativo
              </h1>
            </header>

            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </AdminProvider>
    </ThemeProvider>
  );
}
