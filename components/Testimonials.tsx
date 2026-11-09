"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { testimonials, testimonialsCopy } from "@/content/testimonials";
import { usePrefersReducedMotion } from "@/lib/hooks";

const AUTO_MS = 4500;

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none">
      <path
        d={dir === "left" ? "M11 3L5 9l6 6" : "M7 3l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Testimonials() {
  const reduced = usePrefersReducedMotion();
  const track = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const step = useCallback((dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const amount = (card?.getBoundingClientRect().width ?? 300) + gap;
    const max = el.scrollWidth - el.clientWidth;
    let target = el.scrollLeft + dir * amount;
    if (dir === 1 && el.scrollLeft >= max - 4) target = 0;
    if (dir === -1 && el.scrollLeft <= 4) target = max;
    el.scrollTo({ left: target, behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => step(1), AUTO_MS);
    return () => window.clearInterval(id);
  }, [reduced, paused, step]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !track.current) return;
    track.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const endDrag = () => {
    const el = track.current;
    if (!drag.current || !el) return;
    drag.current = null;
    setDragging(false);
    // Snap to the nearest card once the mouse is released.
    const card = el.querySelector("li");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const w = (card?.getBoundingClientRect().width ?? 300) + gap;
    el.scrollTo({ left: Math.round(el.scrollLeft / w) * w, behavior: "smooth" });
  };

  return (
    <section
      aria-labelledby="testimonials-heading"
      aria-roledescription="carousel"
      className="py-20 md:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container-x mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-4">{testimonialsCopy.eyebrow}</p>
          <h2
            id="testimonials-heading"
            className="font-display text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl"
          >
            {testimonialsCopy.heading}
          </h2>
        </div>
        <div className="flex gap-2">
          {(["left", "right"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => step(d === "left" ? -1 : 1)}
              aria-label={d === "left" ? "Previous testimonials" : "Next testimonials"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors hover:border-accent hover:text-accent"
            >
              <Arrow dir={d} />
            </button>
          ))}
        </div>
      </div>

      <ul
        ref={track}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className={`container-x flex gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          dragging ? "cursor-grabbing select-none" : "cursor-grab snap-x snap-mandatory"
        }`}
        style={{ scrollPaddingInline: "max(1.25rem, calc((100vw - 1320px) / 2 + 2.5rem))" }}
      >
        {testimonials.map((t, i) => (
          <li
            key={i}
            className="flex aspect-[3/4] w-[78vw] max-w-[320px] shrink-0 snap-start flex-col justify-between rounded-3xl border border-line bg-surface p-6 md:w-[calc((100%-3*1.25rem)/4)] md:max-w-none md:p-7"
          >
            <figure className="flex h-full flex-col justify-between">
            <div>
              <span className="rounded-full border border-accent px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-accent">
                Placeholder
              </span>
              <blockquote className="mt-6 font-display text-xl font-medium leading-snug md:text-2xl">
                {t.quote}
              </blockquote>
            </div>
            <figcaption>
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-muted">{t.role}</p>
            </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <p className="container-x mt-6 font-mono text-xs uppercase tracking-widest text-muted">
        {testimonialsCopy.placeholderNote}
      </p>
    </section>
  );
}
