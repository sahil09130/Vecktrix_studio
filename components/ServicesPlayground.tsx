"use client";

import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { Service } from "@/content/services";
import { serviceHref } from "@/lib/services";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { createBody, step, type Body, type Bounds } from "@/lib/zero-g";

/**
 * Phone-only layout for one practice: the services as bricks in a
 * spaceship-like cylinder ("cargo bay"). They start as a neat brick wall.
 * Drag one and it moves like in zero gravity: it keeps drifting after you let
 * go, knocks other bricks, bounces off the walls and slowly comes to rest.
 * A tap without a drag opens the service. "Restack" rebuilds the wall.
 *
 * The physics (lib/zero-g.ts) writes transforms straight to the DOM through
 * refs, and its loop only runs while something moves and the bay is on screen.
 */

const LINE = 15.5; // brick text line height, px
const GAP = 6;
const SIDE = 18; // inner padding left/right
const TOP = 70; // room for the rim and HUD strip
const BOTTOM = 34; // room for the bottom rim
const HEADROOM = 200; // empty space above the wall

type Tone = "ember" | "rust" | "smoke" | "graphite";
/** Non-featured bricks cycle these, chosen by wall position so neighbours differ. */
const CYCLE: Tone[] = ["rust", "smoke", "graphite"];

interface Brick {
  service: Service;
  tone: Tone;
  w: number;
  h: number;
  hx: number;
  hy: number;
}

/** Lay the services out as a running-bond brick wall resting at the bottom. */
function buildWall(services: Service[], W: number, featured: readonly string[]) {
  const innerW = W - SIDE * 2;
  // Two bricks fit side by side; longer names wrap inside a half-width brick.
  const half = (innerW - GAP) / 2;
  const sized = services.map((s) => {
    const textW = s.name.length * 6.4;
    const pad = 26 + (s.group === "KritCuts" ? 12 : 0);
    const one = textW + pad;
    const w = one <= half ? Math.max(one, half * 0.62) : half;
    const lines = one <= half ? 1 : Math.ceil(textW / (w - pad));
    const h = 21 + lines * LINE;
    return { s, w, h };
  });

  const rows: { items: typeof sized; width: number; h: number }[] = [];
  let cur = { items: [] as typeof sized, width: 0, h: 0 };
  for (const it of sized) {
    const add = (cur.items.length ? GAP : 0) + it.w;
    if (cur.items.length && cur.width + add > innerW) {
      rows.push(cur);
      cur = { items: [], width: 0, h: 0 };
    }
    cur.width += (cur.items.length ? GAP : 0) + it.w;
    cur.items.push(it);
    cur.h = Math.max(cur.h, it.h);
  }
  if (cur.items.length) rows.push(cur);

  const wallH = rows.reduce((t, r) => t + r.h, 0) + GAP * Math.max(0, rows.length - 1);
  const height = TOP + HEADROOM + wallH + BOTTOM;
  const bricks: Brick[] = [];
  let bottom = height - BOTTOM;
  rows.forEach((row, ri) => {
    const cy = bottom - row.h / 2;
    // Alternate a small offset per row so the wall reads as running bond.
    const slack = innerW - row.width;
    const offset = (ri % 2 === 0 ? -1 : 1) * Math.min(14, slack / 2);
    let x = SIDE + slack / 2 + offset;
    row.items.forEach((it, ci) => {
      // Featured services glow warmest; the rest cycle so side and vertical neighbours differ.
      const tone: Tone = featured.includes(it.s.slug) ? "ember" : CYCLE[(ri + ci * 2) % CYCLE.length];
      bricks.push({ service: it.s, tone, w: it.w, h: it.h, hx: x + it.w / 2, hy: cy });
      x += it.w + GAP;
    });
    bottom -= row.h + GAP;
  });

  // Keep DOM order the same as the service order for keyboard and screen readers.
  const order = new Map(services.map((s, i) => [s.slug, i]));
  bricks.sort((a, b) => (order.get(a.service.slug) ?? 0) - (order.get(b.service.slug) ?? 0));

  const bounds: Bounds = { x0: 8, x1: W - 8, y0: TOP - 22, y1: height - 16 };
  return { bricks, height, bounds };
}

/** Put every brick straight back in its wall spot (used for reduced motion). */
function snapHome(bodies: Body[]) {
  for (const b of bodies) {
    b.x = b.hx;
    b.y = b.hy;
    b.a = 0;
    b.vx = b.vy = b.w = 0;
    b.held = false;
  }
}

const transformOf = (x: number, y: number, a: number, w: number, h: number) =>
  `translate3d(${x - w / 2}px, ${y - h / 2}px, 0) rotate(${a}rad)`;

export function ServicesPlayground({
  services,
  bay,
  featured,
}: {
  services: Service[];
  bay: string;
  /** Slugs of the practice's featured services; they get the warm ember tone. */
  featured: readonly string[];
}) {
  const reduced = usePrefersReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const [W, setW] = useState(350);
  const [moving, setMoving] = useState(false);
  const [held, setHeld] = useState<string | null>(null);

  const wall = useMemo(() => buildWall(services, W, featured), [services, W, featured]);

  const bodies = useRef<Body[]>([]);
  const els = useRef<(HTMLElement | null)[]>([]);
  const loop = useRef({ raf: 0, running: false, last: 0, visible: true, restack: false });
  const drag = useRef<{
    i: number;
    sx: number;
    sy: number;
    offX: number;
    offY: number;
    left: number;
    top: number;
    moved: boolean;
    hist: { x: number; y: number; t: number }[];
  } | null>(null);

  // Measure the bay width (and follow rotation or resizing).
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const paint = () => {
    bodies.current.forEach((b, i) => {
      const el = els.current[i];
      if (el) el.style.transform = transformOf(b.x, b.y, b.a, b.bw, b.bh);
    });
  };

  // (Re)build the bodies whenever the wall changes (first measure, rotation).
  useLayoutEffect(() => {
    bodies.current = wall.bricks.map((b) => createBody(b.w, b.h, b.hx, b.hy));
    paint();
  }, [wall]);

  const frame = (now: number) => {
    const l = loop.current;
    const dt = Math.min(0.033, (now - l.last) / 1000);
    l.last = now;
    const rest = step(bodies.current, wall.bounds, dt, { restack: l.restack, drift: !reduced });
    if (rest && l.restack) l.restack = false;
    paint();
    if (rest || !l.visible) {
      l.running = false;
      setMoving(false);
      return;
    }
    l.raf = requestAnimationFrame(frame);
  };

  // `now` comes from the event that woke the loop (same clock as requestAnimationFrame).
  const wake = (now: number) => {
    const l = loop.current;
    if (l.running || !l.visible) return;
    l.running = true;
    l.last = now;
    setMoving(true);
    l.raf = requestAnimationFrame(frame);
  };

  // Only simulate while the bay is on screen.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const l = loop.current;
    const io = new IntersectionObserver(([e]) => {
      l.visible = e.isIntersecting;
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(l.raf);
      l.running = false;
    };
  }, []);

  const down = (e: ReactPointerEvent<HTMLElement>, i: number) => {
    const b = bodies.current[i];
    const rect = box.current?.getBoundingClientRect();
    if (!b || !rect) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const lx = e.clientX - rect.left;
    const ly = e.clientY - rect.top;
    drag.current = {
      i,
      sx: e.clientX,
      sy: e.clientY,
      offX: lx - b.x,
      offY: ly - b.y,
      left: rect.left,
      top: rect.top,
      moved: false,
      hist: [{ x: e.clientX, y: e.clientY, t: e.timeStamp }],
    };
    loop.current.restack = false;
  };

  const move = (e: ReactPointerEvent<HTMLElement>, i: number) => {
    const d = drag.current;
    const b = bodies.current[i];
    if (!d || d.i !== i || !b) return;
    if (!d.moved && Math.abs(e.clientX - d.sx) + Math.abs(e.clientY - d.sy) < 6) return;
    if (!d.moved) {
      d.moved = true;
      b.held = true;
      setHeld(wall.bricks[i].service.slug);
    }
    b.tx = e.clientX - d.left - d.offX;
    b.ty = e.clientY - d.top - d.offY;
    const now = e.timeStamp;
    d.hist.push({ x: e.clientX, y: e.clientY, t: now });
    while (d.hist.length > 2 && now - d.hist[0].t > 100) d.hist.shift();
    wake(now);
  };

  const release = (i: number, now: number) => {
    const d = drag.current;
    const b = bodies.current[i];
    if (!d || d.i !== i || !b) return;
    if (d.moved) {
      b.held = false;
      // Throw: keep the finger's recent velocity (zero with reduced motion).
      const first = d.hist[0];
      const last = d.hist[d.hist.length - 1];
      const dt = Math.max(16, last.t - first.t) / 1000;
      b.vx = reduced ? 0 : (last.x - first.x) / dt;
      b.vy = reduced ? 0 : (last.y - first.y) / dt;
      setHeld(null);
      wake(now);
    }
  };

  const restack = (now: number) => {
    if (reduced) {
      snapHome(bodies.current);
      paint();
      return;
    }
    loop.current.restack = true;
    wake(now);
  };

  return (
    <div>
      <p className="lite-hint eyebrow mb-3" aria-hidden="true">
        Drag and throw · tap to open
      </p>
      <div ref={box} className="zg-bay" data-bay={bay} style={{ height: wall.height }}>
        <span aria-hidden="true" className="zg-rim zg-rim-top" />
        <span aria-hidden="true" className="zg-rim zg-rim-bottom" />
        <span aria-hidden="true" className="zg-seams" />
        <span aria-hidden="true" className="zg-glare" />

        <div className="zg-hud">
          <span aria-hidden="true" className="flex items-center gap-2">
            <span className={`zg-light ${moving ? "on" : ""}`} />
            Cargo bay {bay}
          </span>
          <button type="button" onClick={(e) => restack(e.timeStamp)} className="zg-restack">
            Restack
          </button>
        </div>

        {wall.bricks.map((b, i) => {
          const s = b.service;
          const { href, external } = serviceHref(s);
          const common = {
            ref: (el: HTMLElement | null) => {
              els.current[i] = el;
            },
            className: `zg-brick zg-tone-${b.tone} ${held === s.slug ? "is-held" : ""}`,
            draggable: false,
            onPointerDown: (e: ReactPointerEvent<HTMLElement>) => down(e, i),
            onPointerMove: (e: ReactPointerEvent<HTMLElement>) => move(e, i),
            onPointerUp: (e: ReactPointerEvent<HTMLElement>) => release(i, e.timeStamp),
            onPointerCancel: (e: ReactPointerEvent<HTMLElement>) => release(i, e.timeStamp),
            onDragStart: (e: React.DragEvent) => e.preventDefault(),
            onClick: (e: React.MouseEvent) => {
              // A drag should not also open the service.
              if (drag.current?.i === i && drag.current.moved) e.preventDefault();
              drag.current = null;
            },
            style: {
              width: b.w,
              height: b.h,
              transform: transformOf(b.hx, b.hy, 0, b.w, b.h),
            } as React.CSSProperties,
          };
          const inner = (
            <>
              <span className="zg-brick-name">{s.name}</span>
              {s.group === "KritCuts" && <span className="zg-kc" aria-hidden="true" />}
            </>
          );
          return external ? (
            <a key={s.slug} href={href} {...common} ref={common.ref as React.Ref<HTMLAnchorElement>}>
              {inner}
            </a>
          ) : (
            <Link key={s.slug} href={href} {...common} ref={common.ref as React.Ref<HTMLAnchorElement>}>
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
