import type { Metadata } from "next";
import { partnersCopy, partnerTypes } from "@/content/partners";
import { site } from "@/content/site";
import { JsonLd } from "@/components/JsonLd";
import { PartnerForm } from "@/components/partners/PartnerForm";
import { PartnerHero } from "@/components/partners/PartnerHero";
import {
  Benefits,
  Commission,
  Earnings,
  Faq,
  FinalCta,
  HowItWorks,
  PartnerTypes,
  ServicesYouCanRefer,
} from "@/components/partners/PartnerSections";

const url = `${site.url}/partners`;

export const metadata: Metadata = {
  title: partnersCopy.meta.title,
  description: partnersCopy.meta.description,
  alternates: { canonical: "/partners" },
  openGraph: {
    type: "website",
    title: `${partnersCopy.meta.title} | ${site.name}`,
    description: partnersCopy.meta.description,
    url,
    siteName: site.name,
  },
};

export default async function PartnersPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  // Only accept a known partnership type from the link, never arbitrary text.
  const preselected = type && partnerTypes.includes(type) ? type : undefined;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: partnersCopy.faq.items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <PartnerHero />
      <HowItWorks />
      <PartnerTypes />
      <ServicesYouCanRefer />
      <Commission />
      <Earnings />
      <Benefits />
      <section id="apply" aria-labelledby="apply-h" className="container-x py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow mb-4">{partnersCopy.form.eyebrow}</p>
            <h2 id="apply-h" className="font-display text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl">
              {partnersCopy.form.heading}
            </h2>
            <p className="mt-6 max-w-md text-lg text-muted">{partnersCopy.form.intro}</p>
          </div>
          <div>
            <PartnerForm preselected={preselected} />
          </div>
        </div>
      </section>
      <Faq />
      <FinalCta />
    </>
  );
}
