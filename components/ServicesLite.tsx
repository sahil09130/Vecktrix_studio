"use client";

import { useEffect, useRef, useState } from "react";
import { categories } from "@/content/services";
import { categoryHref, featuredServices, servicesInCategory } from "@/lib/services";
import { useMediaQuery } from "@/lib/hooks";
import { ButtonLink } from "./Button";
import { LiteTile, LiteViewAll } from "./LiteTile";
import { ServicesPlayground } from "./ServicesPlayground";

/**
 * The services section without WebGL, for phones and anything that struggles.
 * Real HTML and links in every mode; motion is CSS transform and opacity only.
 * Content is fully visible before any JavaScript runs. Motion is switched on
 * after mount, and only when `animated` is true (not reduced motion).
 */
export function ServicesLite({ animated }: { animated: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  // Phones get the drag-and-play blocks; wider lite screens keep the tiles.
  const phone = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    // Switch the motion on once mounted, so server HTML is always complete.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLive(animated);
  }, [animated]);

  // One observer for every reveal element on the section.
  useEffect(() => {
    if (!live || !root.current) return;
    const els = root.current.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [live]);

  return (
    <div ref={root} className={`services-lite container-x pb-24 pt-10 ${live ? "lite-animated" : ""}`}>
      {categories.map((c, ci) => {
        const feat = featuredServices(c.slug);
        const total = servicesInCategory(c.slug).length;
        return (
          <section
            key={c.slug}
            id={`cat-${c.slug}`}
            aria-labelledby={`cat-${c.slug}-title`}
            className="lite-chapter"
          >
            {/* Sector label: sticks while you are in this practice. */}
            <p className="lite-sector eyebrow" aria-hidden="true">
              Sector {c.number} / {String(categories.length).padStart(2, "0")}
            </p>

            <header data-reveal className="lite-head">
              <p className="font-mono text-sm tracking-[0.14em] text-accent">
                <span className="lite-rule" aria-hidden="true" />
                {c.number}.
              </p>
              <h3 id={`cat-${c.slug}-title`} className="mt-4 font-display text-[clamp(2.4rem,9vw,5rem)] font-bold leading-[0.95] tracking-[-0.03em]">
                {c.title}
              </h3>
              <p className="mt-5 max-w-xl text-lg text-muted">{c.intro}</p>
            </header>

            {phone ? (
              <div data-reveal className="mt-10">
                <ServicesPlayground services={servicesInCategory(c.slug)} bay={c.number} featured={c.featured} />
                <div className="mt-8">
                  <ButtonLink href={categoryHref(c)} variant="ghost">
                    View all {total} services &rarr;
                  </ButtonLink>
                </div>
              </div>
            ) : (
              <div className="lite-tiles">
                {feat.map((s, i) => (
                  <LiteTile
                    key={s.slug}
                    service={s}
                    side={(i + ci) % 2 === 0 ? "left" : "right"}
                    index={i}
                    animated={live}
                  />
                ))}
                <LiteViewAll
                  href={categoryHref(c)}
                  count={total}
                  practice={c.title}
                  side={(feat.length + ci) % 2 === 0 ? "left" : "right"}
                  index={feat.length}
                />
              </div>
            )}

            {/* Decorative backdrop: an ember glow, a slow star layer, and every other practice a small planet. */}
            <div aria-hidden="true" className="lite-glow" data-side={ci % 2 === 0 ? "right" : "left"} />
            <div aria-hidden="true" className="lite-stars" />
            {ci % 2 === 0 && (
              <div aria-hidden="true" className="lite-planet">
                <span className="lite-planet-ring" />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
