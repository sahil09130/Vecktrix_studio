"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { Layout } from "@/lib/tiles-layout";

export interface Sector {
  number: string;
  title: string;
}

/**
 * Decorative spacecraft-style overlay for the services stage: which practice
 * is in view and corner brackets. It writes straight
 * to the DOM on scroll (no React re-renders), and is hidden from assistive tech.
 */
export function SectorHud({
  containerRef,
  layout,
  sectors,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  layout: Layout;
  sectors: Sector[];
}) {
  const label = useRef<HTMLSpanElement>(null);
  const name = useRef<HTMLSpanElement>(null);
  const total = sectors.length;

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = containerRef.current;
      if (!el) return;
      // Stage-local pixel at the middle of the viewport.
      const local = Math.max(0, window.innerHeight / 2 - el.getBoundingClientRect().top);
      let idx = 0;
      layout.chapters.forEach((ch, i) => {
        if (local >= ch.headingTop) idx = i;
      });
      const s = sectors[idx];
      if (label.current && s) label.current.textContent = `SECTOR ${s.number} / ${String(total).padStart(2, "0")}`;
      if (name.current && s) name.current.textContent = s.title;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [containerRef, layout, sectors, total]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
      <div className="absolute left-4 top-20 md:left-8 md:top-24">
        <span ref={label} className="block text-fg/70">
          SECTOR
        </span>
        <span ref={name} className="mt-1 block text-accent" />
      </div>

      {/* Corner brackets (desktop only) */}
      <div className="hidden md:block">
        {(["left-6 top-24 border-l border-t", "right-6 top-24 border-r border-t", "left-6 bottom-6 border-l border-b", "right-6 bottom-6 border-r border-b"] as const).map((c) => (
          <span key={c} className={`absolute h-6 w-6 border-line ${c}`} />
        ))}
      </div>
    </div>
  );
}
