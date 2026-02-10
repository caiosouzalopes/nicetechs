"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300",
        "border-primary/30 bg-card/80 hover:border-primary/60 hover:shadow-glow-sm",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
      )}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-primary" aria-hidden />
        ) : (
          <Moon className="h-5 w-5 text-primary" aria-hidden />
        )}
      </span>
      <span className="sr-only">{theme === "dark" ? "Modo claro" : "Modo escuro"}</span>
    </button>
  );
}
