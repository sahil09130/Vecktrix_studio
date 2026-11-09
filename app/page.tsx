import { Hero } from "@/components/Hero";
import { ServicesSection } from "@/components/ServicesSection";
import { LogoCarousel } from "@/components/LogoCarousel";
import { Testimonials } from "@/components/Testimonials";
import { WhyUs } from "@/components/WhyUs";
import { JsonLd } from "@/components/JsonLd";
import { categories } from "@/content/services";
import { featuredServices } from "@/lib/services";
import { serviceSchema } from "@/lib/schema";

// Only the services shown as homepage tiles; every service has its own JSON-LD on its page.
const featured = categories.flatMap((c) => featuredServices(c.slug));

export default function Home() {
  return (
    <>
      <JsonLd data={featured.map(serviceSchema)} />
      <Hero />
      <LogoCarousel />
      <ServicesSection />
      <Testimonials />
      <WhyUs />
    </>
  );
}
