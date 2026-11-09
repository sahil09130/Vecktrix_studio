import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories } from "@/content/services";
import { site } from "@/content/site";
import { categoryHref, deliveredBy, getCategory, servicesInCategory } from "@/lib/services";
import { categorySchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { ServiceCard } from "@/components/ServiceCard";
import { ButtonLink } from "@/components/Button";
import { KritBadge } from "@/components/KritBadge";

type Params = { category: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) return {};
  const count = servicesInCategory(c.slug).length;
  return {
    title: c.title,
    description: `${c.intro} ${count} services from ${deliveredBy(c.group)}.`,
    alternates: { canonical: categoryHref(c) },
  };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) notFound();
  const list = servicesInCategory(c.slug);
  const i = categories.findIndex((x) => x.slug === c.slug);
  const prev = categories[i - 1];
  const next = categories[i + 1];

  return (
    <div className="container-x py-20 md:py-28">
      <JsonLd data={categorySchema(c)} />
      <nav aria-label="Breadcrumb" className="eyebrow mb-8">
        <Link href="/services" className="hover:text-fg">
          Services
        </Link>
        <span aria-hidden="true" className="mx-2">
          /
        </span>
        <span aria-current="page">{c.title}</span>
      </nav>

      <header className="max-w-4xl">
        <p className="font-mono text-sm tracking-[0.14em] text-accent">
          {c.number}. &middot; {list.length} services
        </p>
        <h1 className="mt-4 font-display text-5xl font-bold leading-[0.98] tracking-tight md:text-8xl">
          {c.title}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted md:text-xl">{c.intro}</p>
        {c.group === "KritCuts" && (
          <p className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted">
            <KritBadge />
            Every service in this practice is delivered by {deliveredBy("KritCuts")}.
          </p>
        )}
      </header>

      <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <li key={s.slug}>
            <ServiceCard service={s} headingLevel={2} />
          </li>
        ))}
      </ul>

      <section className="mt-24 flex flex-col items-start gap-6 rounded-3xl border border-line bg-surface p-8 md:flex-row md:items-center md:justify-between md:p-12">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Need more than one of these?
          </h2>
          <p className="mt-3 max-w-lg text-muted">
            Tell us what you are working on. One person at {site.name} will put the right mix together.
          </p>
        </div>
        <ButtonLink href={`/contact?practice=${c.slug}`}>Start a project</ButtonLink>
      </section>

      <nav aria-label="Other practices" className="mt-16 grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
        {prev ? (
          <Link href={categoryHref(prev)} className="group">
            <span className="eyebrow">&larr; Previous practice</span>
            <span className="mt-2 block font-display text-2xl font-bold group-hover:text-accent">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={categoryHref(next)} className="group sm:text-right">
            <span className="eyebrow">Next practice &rarr;</span>
            <span className="mt-2 block font-display text-2xl font-bold group-hover:text-accent">
              {next.title}
            </span>
          </Link>
        )}
      </nav>
    </div>
  );
}
