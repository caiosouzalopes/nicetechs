/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
    },
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        nicetech: {
          navy: "#0A1931",
          "blue-dark": "#1A3D63",
          "blue-mid": "#4A7FA7",
          "blue-soft": "#B3CFE5",
          white: "#F6FAFD",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-futuristic": "linear-gradient(135deg, #0A1931 0%, #1A3D63 50%, #0A1931 100%)",
        "gradient-hero-dark": "linear-gradient(180deg, #0A1931 0%, #1A3D63 40%, rgba(74,127,167,0.15) 100%)",
        "gradient-hero-light": "linear-gradient(180deg, #F6FAFD 0%, #B3CFE5 40%, #F6FAFD 100%)",
        "glow-gradient": "linear-gradient(180deg, transparent 0%, rgba(74, 127, 167, 0.12) 100%)",
      },
      boxShadow: {
        glow: "0 0 50px -10px rgba(74, 127, 167, 0.5)",
        "glow-sm": "0 0 30px -8px rgba(74, 127, 167, 0.35)",
        "glow-strong": "0 0 60px -5px rgba(74, 127, 167, 0.4)",
        glass: "0 8px 32px 0 rgba(10, 25, 49, 0.15)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        float: { from: { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" }, to: { transform: "translateY(0)" } },
        "pulse-glow": { from: { opacity: "0.6" }, "50%": { opacity: "1" }, to: { opacity: "0.6" } },
        "fade-in-up": { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "liquid-1": { from: { transform: "translate(0, 0) scale(1)" }, "33%": { transform: "translate(2%, -3%) scale(1.02)" }, "66%": { transform: "translate(-1%, 2%) scale(0.98)" }, to: { transform: "translate(0, 0) scale(1)" } },
        "liquid-2": { from: { transform: "translate(0, 0) scale(1)" }, "50%": { transform: "translate(-2%, 2%) scale(1.03)" }, to: { transform: "translate(0, 0) scale(1)" } },
        "corner-line": { from: { opacity: "0", transform: "scale(0)" }, to: { opacity: "1", transform: "scale(1)" } },
        "border-glow": { "0%, 100%": { opacity: "0.5" }, "50%": { opacity: "1" } },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "liquid-1": "liquid-1 15s ease-in-out infinite",
        "liquid-2": "liquid-2 18s ease-in-out infinite",
        "corner-line": "corner-line 0.5s ease-out forwards",
        "border-glow": "border-glow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
