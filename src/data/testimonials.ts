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
