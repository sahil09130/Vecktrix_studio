"use client";

import { useEffect, useMemo, useRef } from "react";
import { drawArt, getMotif, type MotifId } from "@/components/motion";
import { subscribeTicker } from "@/lib/ticker";

/**
 * One line-art motif on a small 2D canvas. Cheap compared with WebGL: it only
 * draws while on screen, on the shared 30 fps ticker, at capped pixel density.
 * With `animated` false it draws a single still frame.
 */
export function MotifCanvas({ motif, animated }: { motif: MotifId | null; animated: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const draw = useMemo(() => getMotif(motif ?? undefined), [motif]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const t0 = performance.now();

    const size = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      c.width = Math.max(1, Math.round(r.width * dpr));
      c.height = Math.max(1, Math.round(r.height * dpr));
    };
    const paint = (now: number) => {
      if (c.width < 2) return;
      drawArt(ctx, c.width, c.height, draw, (now - t0) / 1000, 0, "center");
    };

    size();
    paint(performance.now());
    if (!animated) return;

    let unsub: (() => void) | null = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !unsub) unsub = subscribeTicker(paint);
        else if (!e.isIntersecting && unsub) {
          unsub();
          unsub = null;
        }
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(c);
    const ro = new ResizeObserver(() => {
      size();
      paint(performance.now());
    });
    ro.observe(c);
    return () => {
      io.disconnect();
      ro.disconnect();
      unsub?.();
    };
  }, [draw, animated]);

  return <canvas ref={ref} aria-hidden="true" className="h-full w-full" />;
}
