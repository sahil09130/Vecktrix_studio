import { type DrawFn, DH, DW, accent, circ, dot, faint, fg, glowOn, noGlow, stroke } from "./kit";
import { MOTIF_IDS, type MotifId } from "./ids";
import { brand } from "./brand";
import { content } from "./content";
import { search } from "./search";
import { marketing } from "./marketing";
import { automation } from "./automation";
import { strategy } from "./strategy";
import { measure } from "./measure";
import { growth } from "./growth";

export type { DrawFn } from "./kit";
export { MOTIF_IDS, type MotifId } from "./ids";

/** Fallback: dots orbiting a ring. */
const generic: DrawFn = (a) => {
  const { ctx, t } = a;
  circ(ctx, 80, 50, 34);
  stroke(ctx, faint(a), 0.8);
  circ(ctx, 80, 50, 18);
  stroke(ctx, fg(a, 0.35), 0.9);
  for (let i = 0; i < 3; i++) {
    const ang = t * (0.6 + i * 0.25) + i * 2.1;
    const r = i === 1 ? 18 : 34;
    dot(ctx, 80 + Math.cos(ang) * r, 50 + Math.sin(ang) * r, 2.2, fg(a, 0.6));
  }
  glowOn(a, 4);
  dot(ctx, 80, 50, 4, accent());
  noGlow(a);
};

const all: Partial<Record<MotifId, DrawFn>> = {
  ...brand,
  ...content,
  ...search,
  ...marketing,
  ...automation,
  ...strategy,
  ...measure,
  ...growth,
};

if (process.env.NODE_ENV !== "production") {
  const missing = MOTIF_IDS.filter((id) => !all[id]);
  if (missing.length) console.warn(`[motion] motifs without a draw function: ${missing.join(", ")}`);
}

export function getMotif(id: MotifId | undefined): DrawFn {
  return (id && all[id]) || generic;
}

/**
 * Clear the canvas and draw one frame of a motif, fitting the 160 x 100
 * design space into the canvas.
 * `align` "start" left-aligns (used on the 3D tile faces), "center" centres.
 */
export function drawArt(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  draw: DrawFn,
  t: number,
  glow: number,
  align: "start" | "center" = "start",
) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
  const s = Math.min(W / DW, H / DH);
  const ox = align === "center" ? (W - DW * s) / 2 : 0;
  ctx.setTransform(s, 0, 0, s, ox, (H - DH * s) / 2);
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
  draw({ ctx, t, glow });
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
