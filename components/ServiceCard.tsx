import Link from "next/link";
import type { Service } from "@/content/services";
import { deliveredBy, serviceHref, serviceLabel } from "@/lib/services";
import { MotionCarousel } from "./MotionCarousel";
import { KritBadge } from "./KritBadge";

/**
 * A sub-service card: animated 3-slide carousel, then name, description and
 * who delivers it. The whole card links to the service (a stretched link);
 * the carousel dots sit above it so they stay clickable.
 */
export function ServiceCard({ service: s, headingLevel = 3 }: { service: Service; headingLevel?: 2 | 3 }) {
  const { href, external } = serviceHref(s);
  const H = headingLevel === 2 ? "h2" : "h3";
  const linkClass =
    "after:absolute after:inset-0 after:rounded-3xl after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-accent";

  return (
    <article className="group relative flex h-full flex-col rounded-3xl border border-line bg-surface p-3 transition-colors hover:border-accent/60 md:p-4">
      <MotionCarousel motifs={s.motifs} label={s.name} />
      <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-xs tracking-[0.14em] text-muted">{serviceLabel(s)}</span>
          {s.group === "KritCuts" && <KritBadge />}
        </div>
        <H className="mt-3 font-display text-xl font-bold leading-tight tracking-tight md:text-2xl">
          {external ? (
            <a href={href} className={linkClass}>
              {s.name}
            </a>
          ) : (
            <Link href={href} className={linkClass}>
              {s.name}
            </Link>
          )}
        </H>
        <p className="mt-2 text-muted">{s.description}</p>
        <p className="eyebrow mt-auto flex items-center justify-between pt-6">
          <span>{deliveredBy(s.group)}</span>
          <span aria-hidden="true" className="text-fg/60 transition-colors group-hover:text-accent">
            Open &rarr;
          </span>
        </p>
      </div>
    </article>
  );
}
