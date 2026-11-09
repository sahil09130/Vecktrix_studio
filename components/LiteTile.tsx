import Link from "next/link";
import type { ReactNode } from "react";
import type { Service } from "@/content/services";
import { deliveredBy, serviceHref, serviceLabel } from "@/lib/services";
import { MotifCanvas } from "./MotifCanvas";
import { KritBadge } from "./KritBadge";

/** Link that is internal (Next) or external (plain anchor), like the rest of the site. */
function Target({ href, external, className, children }: { href: string; external: boolean; className: string; children: ReactNode }) {
  return external ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/** A service tile for the lite (no-WebGL) layout. Same slab look as the 3D tile, built from HTML. */
export function LiteTile({
  service: s,
  side,
  index,
  animated,
}: {
  service: Service;
  side: "left" | "right";
  index: number;
  animated: boolean;
}) {
  const { href, external } = serviceHref(s);
  return (
    <article
      data-reveal
      className={`lite-tile ${side}`}
      style={{ "--i": index } as React.CSSProperties}
    >
      <div className="lite-tile-float">
        <Target href={href} external={external} className="lite-slab group">
          <span className="flex items-center justify-between gap-3">
            <span className="font-mono text-[0.7rem] tracking-[0.14em] text-muted">{serviceLabel(s)}</span>
            {s.group === "KritCuts" && <KritBadge />}
          </span>
          <span className="lite-art">
            <MotifCanvas motif={s.motifs[0]} animated={animated} />
          </span>
          <span className="block font-display text-xl font-bold leading-tight tracking-tight">{s.name}</span>
          <span className="mt-2 block text-sm text-muted">{s.description}</span>
          <span className="eyebrow mt-4 flex items-center justify-between">
            <span>{deliveredBy(s.group)}</span>
            <span aria-hidden="true" className="text-fg/60 transition-colors group-hover:text-accent">
              &rarr;
            </span>
          </span>
        </Target>
      </div>
    </article>
  );
}

/** The "View all" tile that ends each practice. Opens the practice page. */
export function LiteViewAll({
  href,
  count,
  practice,
  side,
  index,
}: {
  href: string;
  count: number;
  practice: string;
  side: "left" | "right";
  index: number;
}) {
  return (
    <article
      data-reveal
      className={`lite-tile ${side}`}
      style={{ "--i": index } as React.CSSProperties}
    >
      <div className="lite-tile-float">
        <Link href={href} className="lite-slab lite-slab-cta group">
          <span className="font-mono text-[0.7rem] tracking-[0.14em] text-accent">Practice</span>
          <span className="lite-art lite-art-cta" aria-hidden="true">
            <svg viewBox="0 0 120 120" className="h-full w-full" fill="none" stroke="currentColor">
              <circle cx="60" cy="60" r="48" strokeWidth="1.5" className="text-accent" />
              <path d="M36 60 H82 M68 46 L84 60 L68 74" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent" />
            </svg>
          </span>
          <span className="block font-display text-xl font-bold leading-tight tracking-tight">View all {count} services</span>
          <span className="mt-2 block text-sm text-muted">{practice}</span>
          <span className="eyebrow mt-4 block text-accent transition-colors group-hover:text-fg">Open the practice &rarr;</span>
        </Link>
      </div>
    </article>
  );
}
