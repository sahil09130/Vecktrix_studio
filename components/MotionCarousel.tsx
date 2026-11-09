"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { drawArt, getMotif, type MotifId } from "@/components/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { subscribeTicker as subscribe } from "@/lib/ticker";

/** Time each slide stays up before advancing (ms). */
const INTERVAL = 4200;
/** Crossfade between slides (ms). */
const FADE = 380;
/** Motif time used for the still frame when reduced motion is on (s). */
const STILL_T = 2.4;

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/* ------------------------------------------------------------------ */

/**
 * A 3-slide animated carousel of line-art motifs for one service.
 * Auto-advances (paused on hover / focus, off-screen, or with reduced motion);
 * the dots switch slides. The canvas is decorative; the dots are labelled.
 */
export function MotionCarousel({
  motifs,
  label,
  variant = "card",
  className = "",
}: {
  motifs: readonly MotifId[];
  /** Service name, used for the accessible label. */
  label: string;
  variant?: "card" | "hero";
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const st = useRef({
    idx: 0,
    prev: -1,
    switchAt: -1e9,
    slideStart: 0,
    prevStart: 0,
    nextAt: 0,
    started: false,
    paused: false,
    buf: null as HTMLCanvasElement | null,
  });
  const key = motifs.join("|");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const draws = useMemo(() => motifs.map((m) => getMotif(m)), [key]);
  const stagger = useMemo(() => hash(label) % 1800, [label]);
  const n = draws.length;

  const go = useCallback(
    (i: number, now: number) => {
      const s = st.current;
      const next = ((i % n) + n) % n;
      if (next === s.idx) return;
      s.prev = s.idx;
      s.prevStart = s.slideStart;
      s.idx = next;
      s.switchAt = now;
      s.slideStart = now;
      s.nextAt = now + INTERVAL;
      setIndex(next);
    },
    [n],
  );

  const render = useCallback(
    (now: number) => {
      const c = canvas.current;
      const s = st.current;
      if (!c || c.width < 2) return;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      if (!s.started) {
        s.started = true;
        s.slideStart = now;
        s.nextAt = now + INTERVAL + stagger;
      }
      const W = c.width;
      const H = c.height;
      const t = reduced ? STILL_T : (now - s.slideStart) / 1000;
      const fade = reduced ? 1 : Math.min(1, (now - s.switchAt) / FADE);

      if (fade >= 1 || s.prev < 0) {
        drawArt(ctx, W, H, draws[s.idx], t, 0, "center");
      } else {
        if (!s.buf) s.buf = document.createElement("canvas");
        const buf = s.buf;
        if (buf.width !== W || buf.height !== H) {
          buf.width = W;
          buf.height = H;
        }
        const b = buf.getContext("2d");
        if (!b) return;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, W, H);
        drawArt(b, W, H, draws[s.prev], (now - s.prevStart) / 1000, 0, "center");
        ctx.globalAlpha = 1 - fade;
        ctx.drawImage(buf, 0, 0);
        drawArt(b, W, H, draws[s.idx], t, 0, "center");
        ctx.globalAlpha = fade;
        ctx.drawImage(buf, 0, 0);
        ctx.globalAlpha = 1;
      }

      if (!reduced && !s.paused && now >= s.nextAt) go(s.idx + 1, now);
    },
    [draws, reduced, stagger, go],
  );

  // Size the canvas to its box (x device pixel ratio).
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ro = new ResizeObserver(([e]) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.round(e.contentRect.width * dpr);
      const h = Math.round(e.contentRect.height * dpr);
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
        render(performance.now());
      }
    });
    ro.observe(c);
    return () => ro.disconnect();
  }, [render]);

  // Animate only while on screen; with reduced motion, draw a single still.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (reduced) {
      render(performance.now());
      return;
    }
    let unsub: (() => void) | null = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !unsub) unsub = subscribe(render);
        else if (!e.isIntersecting && unsub) {
          unsub();
          unsub = null;
        }
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      unsub?.();
    };
  }, [render, reduced]);

  // Event timestamps share performance.now()'s clock.
  const pause = (v: boolean, now: number) => {
    st.current.paused = v;
    if (!v) st.current.nextAt = Math.max(st.current.nextAt, now + 1500);
  };

  const pick = (i: number, now: number) => {
    go(i, now);
    if (reduced) render(now);
  };

  return (
    <div
      ref={wrap}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${label}: animated overview`}
      className={`relative overflow-hidden rounded-2xl border border-line bg-bg ${
        variant === "hero" ? "aspect-[16/9]" : "aspect-[16/10]"
      } ${className}`}
      onPointerEnter={(e) => pause(true, e.timeStamp)}
      onPointerLeave={(e) => pause(false, e.timeStamp)}
      onFocus={(e) => pause(true, e.timeStamp)}
      onBlur={(e) => pause(false, e.timeStamp)}
    >
      <canvas
        ref={canvas}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full ${variant === "hero" ? "p-8 md:p-12" : "p-5"}`}
      />
      <p
        aria-hidden="true"
        className="absolute left-4 top-3 font-mono text-[0.65rem] tracking-[0.14em] text-muted"
      >
        {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
      </p>
      <div className="absolute bottom-2 right-2 z-10 flex">
        {draws.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => pick(i, e.timeStamp)}
            aria-label={`Show slide ${i + 1} of ${n}`}
            aria-current={i === index ? "true" : undefined}
            className="group/dot grid h-8 w-8 place-items-center rounded-full"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-5 bg-accent" : "w-1.5 bg-fg/30 group-hover/dot:bg-fg/60"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
