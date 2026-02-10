const fs = require('fs');
const path = require('path');

// Função para criar diretórios recursivamente
function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Função para criar arquivo
function createFile(filePath, content) {
  createDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Criado: ${filePath}`);
}

console.log('🚀 Criando estrutura do projeto...\n');

// Arquivos de configuração raiz
createFile('package.json', `{
  "name": "landing-page-base",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.16",
    "lucide-react": "^0.294.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}`);

createFile('vite.config.ts', `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
`);

createFile('tsconfig.json', `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
`);

createFile('tsconfig.node.json', `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
`);

createFile('tailwind.config.js', `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
`);

createFile('postcss.config.js', `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`);

createFile('index.html', `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Landing Page - Alta Conversão</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`);

createFile('.eslintrc.cjs', `module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
`);

createFile('.gitignore', `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`);

createFile('components.json', `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
`);

createFile('README.md', `# Landing Page Base - Alta Conversão

Landing page profissional, moderna e responsiva criada com React + TypeScript, Vite, Tailwind CSS, shadcn/ui e Framer Motion.

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite** - Build tool rápida
- **Tailwind CSS** - Estilização utilitária
- **shadcn/ui** - Componentes UI de alta qualidade
- **Framer Motion** - Animações suaves

## 📦 Instalação

1. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

2. Execute o projeto em desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`

3. Build para produção:
\`\`\`bash
npm run build
\`\`\`

## 📁 Estrutura do Projeto

\`\`\`
src/
 ├─ components/
 │   ├─ layout/
 │   │   ├─ Header.tsx      # Cabeçalho fixo
 │   │   ├─ Footer.tsx      # Rodapé
 │   ├─ ui/                 # Componentes shadcn/ui
 │   ├─ Hero.tsx            # Seção hero principal
 │   ├─ Benefits.tsx        # Seção de benefícios
 │   ├─ SocialProof.tsx     # Depoimentos
 │   ├─ CTA.tsx             # Call-to-action final
 │   ├─ WhatsAppButton.tsx  # Botão flutuante WhatsApp
 │
 ├─ pages/
 │   └─ Home.tsx            # Página principal
 │
 ├─ data/
 │   ├─ benefits.ts         # Dados dos benefícios
 │   ├─ testimonials.ts     # Dados dos depoimentos
 │
 ├─ styles/
 │   └─ globals.css         # Estilos globais + Tailwind
 │
 ├─ lib/
 │   └─ utils.ts            # Utilitários (cn function)
 │
 ├─ App.tsx
 └─ main.tsx
\`\`\`

## ✏️ Personalização

### Cores Primárias
Edite as variáveis CSS em \`src/styles/globals.css\`:
\`\`\`css
--primary: 221.2 83.2% 53.3%; /* Cor primária */
\`\`\`

### Conteúdo
- **Benefícios**: Edite \`src/data/benefits.ts\`
- **Depoimentos**: Edite \`src/data/testimonials.ts\`
- **Hero**: Edite \`src/components/Hero.tsx\`
- **Header/Footer**: Edite \`src/components/layout/Header.tsx\` e \`Footer.tsx\`

### WhatsApp
Edite o número em \`src/components/WhatsAppButton.tsx\`:
\`\`\`typescript
const WHATSAPP_NUMBER = "5511999999999";
\`\`\`

## 🎨 Características

- ✅ Totalmente responsivo (mobile first)
- ✅ Animações suaves com Framer Motion
- ✅ Componentes reutilizáveis
- ✅ Código limpo e comentado
- ✅ Fácil de personalizar
- ✅ Pronto para produção

## 📝 Licença

Este projeto é uma base livre para uso em projetos pessoais e comerciais.
`);

// Arquivos src/
createFile('src/lib/utils.ts', `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`);

createFile('src/styles/globals.css', `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`);

createFile('src/data/benefits.ts', `// EDITAR: Adicione ou modifique os benefícios aqui
export interface Benefit {
  icon: string; // Nome do ícone do lucide-react
  title: string;
  description: string;
}

export const benefits: Benefit[] = [
  {
    icon: "Zap",
    title: "Resultados Rápidos",
    description: "Veja resultados concretos em pouco tempo com nossa metodologia comprovada."
  },
  {
    icon: "Shield",
    title: "100% Confiável",
    description: "Milhares de clientes satisfeitos confiam em nossos serviços há anos."
  },
  {
    icon: "TrendingUp",
    title: "Crescimento Garantido",
    description: "Estratégias que impulsionam seu negócio para o próximo nível."
  },
  {
    icon: "Headphones",
    title: "Suporte Dedicado",
    description: "Equipe especializada pronta para ajudar você sempre que precisar."
  },
  {
    icon: "Award",
    title: "Qualidade Premium",
    description: "Produtos e serviços de alta qualidade que superam expectativas."
  },
  {
    icon: "DollarSign",
    title: "Melhor Custo-Benefício",
    description: "Investimento inteligente com retorno garantido para seu negócio."
  }
];
`);

createFile('src/data/testimonials.ts', `// EDITAR: Adicione ou modifique os depoimentos aqui
export interface Testimonial {
  name: string;
  role: string;
  company?: string;
  text: string;
  avatar?: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Maria Silva",
    role: "CEO",
    company: "Tech Solutions",
    text: "Incrível como os resultados apareceram rapidamente. Superou todas as nossas expectativas e transformou nosso negócio completamente.",
  },
  {
    name: "João Santos",
    role: "Diretor de Marketing",
    company: "Inovação Digital",
    text: "Profissionalismo e dedicação em cada detalhe. Recomendo sem hesitação para qualquer empresa que busca crescimento real.",
  },
  {
    name: "Ana Costa",
    role: "Empreendedora",
    company: "StartupXYZ",
    text: "O investimento valeu cada centavo. Em poucos meses já vimos um retorno significativo. Melhor decisão que tomamos!",
  },
];
`);

createFile('src/components/ui/button.tsx', `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
`);

createFile('src/components/ui/card.tsx', `import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
`);

createFile('src/components/layout/Header.tsx', `import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// EDITAR: Altere o texto do logo e links de navegação
const Header = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* EDITAR: Logo ou nome da empresa */}
          <div className="text-2xl font-bold text-primary">
            Sua Marca
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#inicio" className="text-gray-700 hover:text-primary transition-colors">
              Início
            </a>
            <a href="#beneficios" className="text-gray-700 hover:text-primary transition-colors">
              Benefícios
            </a>
            <a href="#depoimentos" className="text-gray-700 hover:text-primary transition-colors">
              Depoimentos
            </a>
            <Button>Contato</Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button className="md:hidden" size="sm">
            Menu
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
`);

createFile('src/components/layout/Footer.tsx', `// EDITAR: Personalize as informações do rodapé
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna 1: Sobre */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Sua Marca</h3>
            <p className="text-sm">
              Transformando ideias em resultados. Soluções inovadoras para seu negócio crescer.
            </p>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#inicio" className="hover:text-white transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#beneficios" className="hover:text-white transition-colors">
                  Benefícios
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-white transition-colors">
                  Depoimentos
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Contato */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: contato@suamarca.com</li>
              <li>Telefone: (11) 99999-9999</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} Sua Marca. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
`);

createFile('src/components/Hero.tsx', `import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// EDITAR: Personalize o título, subtítulo e texto do botão
const Hero = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Título Principal */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Transforme Seu Negócio em{" "}
            <span className="text-primary">Sucesso Real</span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto"
          >
            Soluções inovadoras que impulsionam resultados. Junte-se a milhares de empresas que já transformaram seus resultados conosco.
          </motion.p>

          {/* Botões CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" className="text-lg px-8 py-6 group">
              Solicitar Orçamento
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Saiba Mais
            </Button>
          </motion.div>

          {/* Estatísticas (Opcional) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
          >
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-gray-600">Clientes Satisfeitos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-gray-600">Taxa de Satisfação</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600">Suporte Disponível</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
`);

createFile('src/components/Benefits.tsx', `import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { benefits } from "@/data/benefits";
import * as LucideIcons from "lucide-react";

// EDITAR: Os benefícios podem ser editados em src/data/benefits.ts
const Benefits = () => {
  // Função para obter o componente de ícone dinamicamente
  const getIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent ? <IconComponent className="h-8 w-8" /> : null;
  };

  return (
    <section id="beneficios" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Título da Seção */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Por Que Escolher Nós?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubra os benefícios que fazem a diferença para o seu negócio
          </p>
        </motion.div>

        {/* Grid de Benefícios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-2 hover:border-primary/50">
                <CardHeader>
                  <div className="text-primary mb-4">
                    {getIcon(benefit.icon)}
                  </div>
                  <CardTitle>{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
`);

createFile('src/components/SocialProof.tsx', `import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "@/data/testimonials";
import { Quote } from "lucide-react";

// EDITAR: Os depoimentos podem ser editados em src/data/testimonials.ts
const SocialProof = () => {
  return (
    <section id="depoimentos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Título da Seção */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Depoimentos reais de pessoas que transformaram seus negócios
          </p>
        </motion.div>

        {/* Grid de Depoimentos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-primary mb-4" />
                  <p className="text-gray-700 mb-6 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}
                      {testimonial.company && \` • \${testimonial.company}\`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
`);

createFile('src/components/CTA.tsx', `import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

// EDITAR: Personalize o texto e o botão de CTA
const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto Para Transformar Seu Negócio?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Não perca mais tempo. Comece hoje mesmo e veja resultados reais em pouco tempo.
            Nossa equipe está pronta para ajudar você a alcançar seus objetivos.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 group bg-white text-primary hover:bg-gray-100"
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
`);

createFile('src/components/WhatsAppButton.tsx', `import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

// EDITAR: Altere o número do WhatsApp (formato: 5511999999999 - sem caracteres especiais)
const WHATSAPP_NUMBER = "5511999999999";
const WHATSAPP_MESSAGE = "Olá! Gostaria de saber mais sobre seus serviços.";

const WhatsAppButton = () => {
  const whatsappUrl = \`https://wa.me/\${WHATSAPP_NUMBER}?text=\${encodeURIComponent(WHATSAPP_MESSAGE)}\`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center gap-3 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
    >
      <MessageCircle className="h-6 w-6" />
      <span className="hidden sm:block font-semibold pr-2">
        Fale Conosco
      </span>
    </motion.a>
  );
};

export default WhatsAppButton;
`);

createFile('src/pages/Home.tsx', `import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import SocialProof from "@/components/SocialProof";
import CTA from "@/components/CTA";
import WhatsAppButton from "@/components/WhatsAppButton";

const Home = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Benefits />
        <SocialProof />
        <CTA />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
};

export default Home;
`);

createFile('src/App.tsx', `import Home from "./pages/Home";
import "./styles/globals.css";

function App() {
  return <Home />;
}

export default App;
`);

createFile('src/main.tsx', `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`);

createFile('src/vite-env.d.ts', `/// <reference types="vite/client" />
`);

console.log('\n✅ Estrutura do projeto criada com sucesso!');
console.log('\n📦 Próximos passos:');
console.log('1. Execute: npm install');
console.log('2. Execute: npm run dev');
console.log('\n🎉 Projeto pronto para desenvolvimento!\n');