import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { MaintenanceSection } from "@/components/home/MaintenanceSection";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { InstagramSection } from "@/components/home/InstagramSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <MaintenanceSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <ProcessSection />
      <InstagramSection />
    </>
  );
}
