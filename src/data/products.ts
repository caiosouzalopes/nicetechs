export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price?: string;
  category: "gamer" | "smartphone" | "games" | "accessories";
}

export const products: Product[] = [
  {
    id: "pc-gamer-1",
    name: "PC Gamer Nicetech Pro",
    description: "Ryzen 5 5600X, RTX 3060, 16GB RAM, SSD 512GB. Pronto para jogar em alta qualidade.",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=400&fit=crop",
    price: "Sob consulta",
    category: "gamer",
  },
  {
    id: "pc-gamer-2",
    name: "PC Gamer Elite",
    description: "Intel i7-13700K, RTX 4070, 32GB DDR5, SSD 1TB NVMe. Performance máxima.",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&h=400&fit=crop",
    price: "Sob consulta",
    category: "gamer",
  },
  {
    id: "smartphone-1",
    name: "Smartphone Premium",
    description: "Tela AMOLED 6.5\", 128GB, câmera tripla. Design moderno e bateria de longa duração.",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop",
    price: "Sob consulta",
    category: "smartphone",
  },
  {
    id: "smartphone-2",
    name: "Smartphone Gamer",
    description: "Processador potente, tela 120Hz, refrigeração ativa. Ideal para jogos mobile.",
    image: "https://images.unsplash.com/photo-1592286927505-d6f92a9e0b9f?w=600&h=400&fit=crop",
    price: "Sob consulta",
    category: "smartphone",
  },
  {
    id: "ps5",
    name: "PlayStation 5",
    description: "Console Sony PS5. Experiência de jogo em 4K com ray tracing e SSD ultrarrápido.",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&h=400&fit=crop",
    price: "Sob consulta",
    category: "games",
  },
  {
    id: "xbox",
    name: "Xbox Series X",
    description: "Microsoft Xbox Series X. 4K, 120fps, Game Pass. A biblioteca que você merece.",
    image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=400&fit=crop",
    price: "Sob consulta",
    category: "games",
  },
  {
    id: "nintendo",
    name: "Nintendo Switch OLED",
    description: "Tela OLED 7\", modo portátil e dock. Jogue em casa ou em qualquer lugar.",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&h=400&fit=crop",
    price: "Sob consulta",
    category: "games",
  },
  {
    id: "headset",
    name: "Headset Gamer 7.1",
    description: "Áudio surround virtual, microfone removível, RGB. Imersão total nos jogos.",
    image: "https://images.unsplash.com/photo-1618366712010-4f9ae11e3f88?w=600&h=400&fit=crop",
    price: "Sob consulta",
    category: "accessories",
  },
  {
    id: "teclado",
    name: "Teclado Mecânico RGB",
    description: "Switches Blue, iluminação RGB, base em metal. Precisão e estilo.",
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600&h=400&fit=crop",
    price: "Sob consulta",
    category: "accessories",
  },
  {
    id: "mouse",
    name: "Mouse Gamer 16000 DPI",
    description: "Sensor óptico de alta precisão, 6 botões programáveis, design ergonômico.",
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=400&fit=crop",
    price: "Sob consulta",
    category: "accessories",
  },
  {
    id: "controle-ps",
    name: "Controle DualSense PS5",
    description: "Controle oficial PlayStation 5 com haptic feedback e áudio 3D.",
    image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&h=400&fit=crop",
    price: "Sob consulta",
    category: "accessories",
  },
  {
    id: "jogo-1",
    name: "Jogo PlayStation 5",
    description: "Lançamentos e clássicos para PS5. Mídia física ou digital.",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&h=400&fit=crop",
    price: "Sob consulta",
    category: "games",
  },
];

export const WHATSAPP_NUMBER = "5517991940047";
export const INSTAGRAM_URL = "https://www.instagram.com/nicetechsolutions/";

export function getWhatsAppProductMessage(productName: string): string {
  return `Olá, tenho interesse no produto *${productName}* do site Nicetech Solutions.`;
}

export function getWhatsAppUrl(message?: string): string {
  const encoded = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${WHATSAPP_NUMBER}${encoded ? `?text=${encoded}` : ""}`;
}
