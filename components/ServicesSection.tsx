"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { categories, servicesCopy } from "@/content/services";
import { hasWebGL, useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import {
  categoryHref,
  deliveredBy,
  featuredServices,
  serviceHref,
  serviceLabel,
  servicesInCategory,
} from "@/lib/services";
import { computeLayout, ctaKey, tileOffsetPx } from "@/lib/tiles-layout";
import { ErrorBoundary } from "./ErrorBoundary";
import { CategoryHeading } from "./CategoryHeading";
import { SoundToggle } from "./SoundToggle";
import { ServicesLite } from "./ServicesLite";
import { SectorHud } from "./SectorHud";
import type { TileItem } from "./three/ServiceScene";

// The 3D scene (three.js + R3F) is only fetched on the client, near the section.
const ServiceScene = dynamic(() => import("./three/ServiceScene"), {
  ssr: false,
  loading: () => null,
});

interface TileTarget {
  href: string;
  external: boolean;
  /** Accessible text for the hidden keyboard link. */
  text: string;
}

/** Tiles (3 featured services + "View all" per category) and where each one links. */
function buildTiles() {
  const tiles: TileItem[] = [];
  const links: Record<string, TileTarget> = {};
  const byCategory: Record<string, string[]> = {};
  for (const c of categories) {
    const all = servicesInCategory(c.slug);
    const keys: string[] = [];
    for (const s of featuredServices(c.slug)) {
      tiles.push({
        key: s.slug,
        title: s.name,
        description: s.description,
        label: serviceLabel(s),
        badge: s.group === "KritCuts" ? "KRITCUTS" : null,
        motif: s.motifs[0],
        cta: false,
      });
      links[s.slug] = {
        ...serviceHref(s),
        text: `${s.name}: ${s.description} ${deliveredBy(s.group)}.`,
      };
      keys.push(s.slug);
    }
    const key = ctaKey(c.slug);
    tiles.push({
      key,
      title: `View all ${all.length} services`,
      description: c.title,
      label: `${c.number} · Practice`,
      badge: null,
      motif: null,
      cta: true,
    });
    links[key] = {
      href: categoryHref(c),
      external: false,
      text: `View all ${all.length} ${c.title} services`,
    };
    keys.push(key);
    byCategory[c.slug] = keys;
  }
  return { tiles, links, byCategory };
}

const { tiles, links, byCategory } = buildTiles();
const sectors = categories.map((c) => ({ number: c.number, title: c.title }));

function TileLink({
  k,
  className,
  children,
  onFocus,
  onBlur,
}: {
  k: string;
  className?: string;
  children: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  const l = links[k];
  return l.external ? (
    <a href={l.href} className={className} onFocus={onFocus} onBlur={onBlur}>
      {children}
    </a>
  ) : (
    <Link href={l.href} className={className} onFocus={onFocus} onBlur={onBlur}>
      {children}
    </Link>
  );
}

export function ServicesSection() {
  const router = useRouter();
  const reduced = usePrefersReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [failed, setFailed] = useState(false);
  const [near, setNear] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [dims, setDims] = useState<{ w: number; vh: number } | null>(null);
  const [forced, setForced] = useState<"lite" | "3d" | null>(null);
  const narrow = useMediaQuery("(max-width: 767px)");
  const stage = useRef<HTMLDivElement>(null);

  // ?services=lite or ?services=3d forces a mode, to compare on a real phone.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("services");
    if (q === "lite" || q === "3d") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForced(q);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWebgl(hasWebGL());
    const measure = () => {
      const w = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      // Ignore small height changes (mobile URL bar) to avoid re-laying out mid-scroll.
      setDims((prev) =>
        prev && prev.w === w && Math.abs(prev.vh - vh) < 150 ? prev : { w, vh },
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const layout = useMemo(
    () => (dims ? computeLayout(dims.w, dims.vh, dims.w < 768) : null),
    [dims],
  );

  // Phones and browsers without WebGL get the lite layout. Desktop gets the 3D stage.
  const use3D =
    !failed &&
    !!layout &&
    webgl === true &&
    !reduced &&
    (forced === "3d" || (forced !== "lite" && !narrow));

  useEffect(() => {
    const el = stage.current;
    if (!el || !use3D) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "250px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [use3D]);

  const open = useCallback(
    (t: TileItem) => {
      const l = links[t.key];
      if (!l) return;
      if (l.external) window.location.assign(l.href);
      else router.push(l.href);
    },
    [router],
  );

  // Keyboard focus on a (visually hidden) link: bring its tile to mid-screen.
  const onFocusLink = (key: string) => {
    setFocused(key);
    const el = stage.current;
    if (!el || !layout) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + tileOffsetPx(layout, key) - window.innerHeight / 2;
    window.scrollTo({ top: Math.max(0, y), behavior: "auto" });
  };

  return (
    <section id="services" aria-labelledby="services-heading" className="relative">

      <div className="container-x pt-20 md:pt-28">
        <p className="eyebrow mb-4">{servicesCopy.eyebrow}</p>
        <h2
          id="services-heading"
          className="max-w-3xl font-display text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl"
        >
          {servicesCopy.heading}
        </h2>
        <p className="mt-5 max-w-xl text-muted md:text-lg">{servicesCopy.intro}</p>
      </div>

      {use3D && layout ? (
        <div
          ref={stage}
          className="relative [overflow-x:clip]"
          style={{ height: layout.total }}
        >
          {/* Sticky HUD: pinned to the viewport while the stage scrolls. Decorative. */}
          <div className="pointer-events-none sticky top-0 z-10 h-0">
            <div className="absolute left-0 top-0 h-[100svh] w-full">
              <SectorHud containerRef={stage} layout={layout} sectors={sectors} />
            </div>
          </div>

          {/* Sticky layer: a zero-height box that pins the sound toggle to the bottom of the viewport. */}
          <div className="pointer-events-none sticky top-0 z-20 h-0">
            <div className="pointer-events-auto absolute right-4 top-[calc(100svh-4.5rem)] md:right-8">
              <SoundToggle />
            </div>
          </div>
          <div className="sticky top-0 h-[100svh] w-full" aria-hidden="true">
            {near && (
              <ErrorBoundary onError={() => setFailed(true)}>
                <ServiceScene
                  onSlow={() => setFailed(true)}
                  tiles={tiles}
                  layout={layout}
                  focusedKey={focused}
                  onOpen={open}
                  containerRef={stage}
                />
              </ErrorBoundary>
            )}
          </div>

          <div className="pointer-events-none absolute inset-0 z-10">
            {layout.chapters.map((ch) => {
              const category = categories.find((c) => c.slug === ch.slug);
              if (!category) return null;
              return (
                <div
                  key={ch.slug}
                  id={`cat-${ch.slug}`}
                  className="absolute inset-x-0"
                  style={{ top: ch.headingTop }}
                >
                  <CategoryHeading category={category} height={ch.headingH} reduced={reduced} />
                  <ul className="sr-only" aria-labelledby={`cat-${ch.slug}-title`}>
                    {(byCategory[ch.slug] ?? []).map((key) => (
                      <li key={key}>
                        <TileLink
                          k={key}
                          onFocus={() => onFocusLink(key)}
                          onBlur={() => setFocused(null)}
                        >
                          {links[key].text}
                        </TileLink>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        <ServicesLite animated={!reduced} />
      )}
    </section>
  );
}
