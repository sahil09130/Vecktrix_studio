"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface Star {
  x: number;
  y: number;
  z: number; // 0.2 (far) to 1 (near)
  tw: number;
}

/** Lightweight 2D canvas starfield. Static when reduced motion is on. */
export function Starfield({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let raf = 0;
    let visible = true;
    const pointer = { x: 0, y: 0, cx: 0, cy: 0 };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const px = (((s.x + pointer.cx * 24 * s.z) % w) + w) % w;
        const py = (((s.y + pointer.cy * 24 * s.z) % h) + h) % h;
        ctx.globalAlpha =
          0.25 + 0.55 * s.z * (0.6 + 0.4 * Math.sin(t * 0.0012 + s.tw));
        ctx.fillStyle = s.z > 0.92 ? "#ff4d2e" : "#f2efe9";
        ctx.beginPath();
        ctx.arc(px, py, 0.4 + s.z * 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(220, (w * h) / 9000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.2 + Math.random() * 0.8,
        tw: Math.random() * Math.PI * 2,
      }));
      draw(0);
    };

    const tick = (t: number) => {
      if (visible) {
        for (const s of stars) {
          s.x -= 0.04 * s.z;
          s.y -= 0.015 * s.z;
          if (s.x < 0) s.x += w;
          if (s.y < 0) s.y += h;
        }
        pointer.cx += (pointer.x - pointer.cx) * 0.04;
        pointer.cy += (pointer.y - pointer.cy) * 0.04;
        draw(t);
      }
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth - 0.5;
      pointer.y = e.clientY / window.innerHeight - 0.5;
    };

    resize();
    window.addEventListener("resize", resize);

    let io: IntersectionObserver | undefined;
    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
      });
      io.observe(canvas);
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
