/**
 * Shared helpers for the animated line illustrations on the service tiles.
 *
 * Every illustration draws into a fixed 160 x 100 design space; `drawArt`
 * (in ./index.ts) scales that space into whatever area the tile face leaves
 * free between its label row and its title. Line widths are in design units.
 */

export const DW = 160;
export const DH = 100;

/** Site tokens (see app/globals.css). Canvas can't read CSS variables cheaply per frame. */
export const ACCENT = "#ff4d2e";
const FG = "242,239,233";
const ACC = "255,77,46";

export interface Art {
  ctx: CanvasRenderingContext2D;
  /** Seconds, already scaled (runs a little faster while the tile is lit). */
  t: number;
  /** 0..1, hover / keyboard focus. */
  glow: number;
}

export type DrawFn = (a: Art) => void;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
/** Sub-progress of u between a and b, clamped to 0..1. */
export const seg = (u: number, a: number, b: number) => clamp01((u - a) / (b - a));
/** Loop position 0..1 for a period in seconds. */
export const loop = (t: number, period: number) => (t % period) / period;
export const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
/** Fade in at the start of a loop and out at the end, so build-up loops restart cleanly. */
export const edgeFade = (u: number, edge = 0.08) => Math.min(seg(u, 0, edge), 1 - seg(u, 1 - edge, 1));

/** Cream line colour. Brightens a little when the tile is lit. */
export const fg = (a: Art, alpha = 0.55) => `rgba(${FG},${Math.min(1, alpha * (1 + 0.45 * a.glow))})`;
export const faint = (a: Art) => fg(a, 0.16);
export const accent = (alpha = 1) => `rgba(${ACC},${alpha})`;

export function stroke(ctx: CanvasRenderingContext2D, style: string, lw = 1.1) {
  ctx.strokeStyle = style;
  ctx.lineWidth = lw;
  ctx.stroke();
}

export function fill(ctx: CanvasRenderingContext2D, style: string) {
  ctx.fillStyle = style;
  ctx.fill();
}

export function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
}

export function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rad = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

export function circ(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0, r), 0, Math.PI * 2);
}

export function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, style: string) {
  circ(ctx, x, y, r);
  fill(ctx, style);
}

/** A text line placeholder: a short rounded bar. */
export function textLine(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, style: string, lw = 2) {
  if (w <= 0) return;
  ctx.lineCap = "round";
  line(ctx, x, y, x + w, y);
  stroke(ctx, style, lw);
}

/** Polyline drawn up to fraction p (0..1) of its total length. */
export function partial(ctx: CanvasRenderingContext2D, pts: [number, number][], p: number) {
  ctx.beginPath();
  if (p <= 0 || pts.length < 2) return;
  const lens: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    lens.push(l);
    total += l;
  }
  let left = total * clamp01(p);
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    const l = lens[i - 1];
    if (left >= l) {
      ctx.lineTo(pts[i][0], pts[i][1]);
      left -= l;
    } else {
      const f = l === 0 ? 0 : left / l;
      ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f));
      break;
    }
  }
}

/** Point on a cubic bezier. */
export function bez(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  t: number,
): [number, number] {
  const m = 1 - t;
  const a = m * m * m;
  const b = 3 * m * m * t;
  const c = 3 * m * t * t;
  const d = t * t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
}

/** Sample a cubic bezier into points (for `partial`). */
export function bezPts(
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  n = 24,
): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i <= n; i++) out.push(bez(p0, p1, p2, p3, i / n));
  return out;
}

/** Soft accent glow for the next fills/strokes. Call `noGlow` afterwards. */
export function glowOn(a: Art, base = 4) {
  a.ctx.shadowColor = accent(0.9);
  a.ctx.shadowBlur = base + 8 * a.glow;
}
export function noGlow(a: Art) {
  a.ctx.shadowBlur = 0;
  a.ctx.shadowColor = "transparent";
}

/** Small check mark centred on (x, y). */
export function check(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, p = 1) {
  partial(
    ctx,
    [
      [x - s, y],
      [x - s * 0.3, y + s * 0.7],
      [x + s, y - s * 0.7],
    ],
    p,
  );
}

let displayFamily: string | null = null;
/** The site's display font family (Bricolage), read once from the CSS variable. */
export function displayFont(): string {
  if (displayFamily) return displayFamily;
  if (typeof document === "undefined") return "system-ui";
  displayFamily =
    getComputedStyle(document.documentElement).getPropertyValue("--font-bricolage").trim() ||
    "system-ui";
  return displayFamily;
}

/** Tiny deterministic pseudo-random in 0..1 for an integer seed. */
export const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
