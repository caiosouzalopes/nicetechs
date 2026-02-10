"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/5517991940047?text=Olá%2C%20vim%20pelo%20site%20Nicetech%20Solutions.";

export function WhatsAppFloat() {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-glow transition-shadow"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle size={28} />
    </motion.a>
  );
}
