import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/content/services";
import {
  categoryHref,
  deliveredBy,
  getCategory,
  getServiceIn,
  servicePagePath,
  servicesInCategory,
} from "@/lib/services";
import { serviceSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { ButtonLink } from "@/components/Button";
import { MotionCarousel } from "@/components/MotionCarousel";
import { KritBadge } from "@/components/KritBadge";

type Params = { category: string; service: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return services.map((s) => ({ category: s.category, service: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category, service } = await params;
  const s = getServiceIn(category, service);
  if (!s) return {};
  return {
    title: s.name,
    description: `${s.description} ${deliveredBy(s.group)}.`,
    alternates: { canonical: servicePagePath(s) },
  };
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { category, service } = await params;
  const s = getServiceIn(category, service);
  const c = getCategory(category);
  if (!s || !c) notFound();
  const siblings = servicesInCategory(c.slug).filter((o) => o.slug !== s.slug).slice(0, 6);

  return (
    <div className="container-x py-20 md:py-28">
      <JsonLd data={serviceSchema(s)} />
      <nav aria-label="Breadcrumb" className="eyebrow mb-8">
        <Link href="/services" className="hover:text-fg">
          Services
        </Link>
        <span aria-hidden="true" className="mx-2">
          /
        </span>
        <Link href={categoryHref(c)} className="hover:text-fg">
          {c.title}
        </Link>
      </nav>

      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="eyebrow mb-6 flex flex-wrap items-center gap-3">
            <span>
              {c.number}. {c.title} &middot; Launching soon
            </span>
            {s.group === "KritCuts" && <KritBadge />}
          </p>
          <h1 className="max-w-3xl font-display text-5xl font-bold leading-[0.98] tracking-tight md:text-7xl">
            {s.name}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted md:text-xl">{s.description}</p>
          <p className="mt-4 max-w-xl text-muted">
            {s.group === "KritCuts"
              ? "This service is delivered by KritCuts by Vectrix Studio. Its own website is launching soon."
              : "This service has its own website launching soon. In the meantime, tell us what you need."}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={`/contact?service=${s.slug}`}>Enquire about {s.name}</ButtonLink>
            <ButtonLink href={categoryHref(c)} variant="ghost">
              All {c.title}
            </ButtonLink>
          </div>
        </div>
        <MotionCarousel motifs={s.motifs} label={s.name} variant="hero" />
      </div>

      {siblings.length > 0 && (
        <section aria-labelledby="more-title" className="mt-24 border-t border-line pt-10">
          <h2 id="more-title" className="eyebrow mb-6">
            More in {c.title}
          </h2>
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((o) => (
              <li key={o.slug}>
                <Link
                  href={servicePagePath(o)}
                  className="group flex items-baseline gap-3 border-b border-line/60 py-3"
                >
                  <span className="font-display text-lg font-semibold">{o.name}</span>
                  <span aria-hidden="true" className="ml-auto text-muted group-hover:text-accent">
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
