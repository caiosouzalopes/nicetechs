import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato | Nicetech Solutions",
  description: "Entre em contato com a Nicetech Solutions via WhatsApp ou formulário.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
