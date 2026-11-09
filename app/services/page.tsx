import type { Metadata } from "next";
import Link from "next/link";
import { servicesCopy } from "@/content/services";
import { site } from "@/content/site";
import { categoryHref, serviceHref, servicesByCategory } from "@/lib/services";
import { KritBadge } from "@/components/KritBadge";
import { ButtonLink } from "@/components/Button";

export const metadata: Metadata = {
  title: "Services",
  description: `Every service from ${site.name}, across seven practices: brand, websites, creative and content, SEO and AI search, marketing, AI automation, and analytics.`,
  alternates: { canonical: "/services" },
};

export default function ServicesIndex() {
  const groups = servicesByCategory();
  return (
    <div className="container-x py-20 md:py-28">
      <p className="eyebrow mb-4">{servicesCopy.eyebrow}</p>
      <h1 className="max-w-4xl font-display text-5xl font-bold leading-[0.98] tracking-tight md:text-8xl">
        {servicesCopy.indexHeading}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-muted">{servicesCopy.indexIntro}</p>

      <nav aria-label="Practices" className="mt-12 flex flex-wrap gap-2">
        {groups.map(({ category: c }) => (
          <a
            key={c.slug}
            href={`#${c.slug}`}
            className="rounded-full border border-line px-4 py-2 text-sm text-fg/80 transition-colors hover:border-accent hover:text-fg"
          >
            <span className="mr-2 font-mono text-xs text-accent">{c.number}</span>
            {c.title}
          </a>
        ))}
      </nav>

      <div className="mt-20 space-y-24">
        {groups.map(({ category: c, services }) => (
          <section key={c.slug} id={c.slug} aria-labelledby={`${c.slug}-title`} className="scroll-mt-28">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
              <div>
                <p className="font-mono text-sm tracking-[0.14em] text-accent">{c.number}.</p>
                <h2
                  id={`${c.slug}-title`}
                  className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl"
                >
                  {c.title}
                </h2>
                <p className="mt-4 max-w-xl text-muted md:text-lg">{c.intro}</p>
              </div>
              <div className="flex items-center gap-4">
                {c.group === "KritCuts" && <KritBadge />}
                <ButtonLink href={categoryHref(c)} variant="ghost">
                  See all {services.length} with animations &rarr;
                </ButtonLink>
              </div>
            </div>
            <ul className="mt-8 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => {
                const { href, external } = serviceHref(s);
                const cls =
                  "group flex items-baseline gap-3 border-b border-line/60 py-3 text-fg/85 transition-colors hover:text-fg";
                const inner = (
                  <>
                    <span className="font-display text-lg font-semibold leading-snug">{s.name}</span>
                    <span aria-hidden="true" className="ml-auto text-muted transition-colors group-hover:text-accent">
                      &rarr;
                    </span>
                  </>
                );
                return (
                  <li key={s.slug}>
                    {external ? (
                      <a href={href} className={cls}>
                        {inner}
                      </a>
                    ) : (
                      <Link href={href} className={cls}>
                        {inner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
