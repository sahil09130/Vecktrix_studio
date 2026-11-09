import {
  type Art,
  type DrawFn,
  accent,
  circ,
  dot,
  ease,
  easeOut,
  edgeFade,
  faint,
  fg,
  fill,
  glowOn,
  lerp,
  line,
  loop,
  noGlow,
  rr,
  seg,
  stroke,
  textLine,
} from "./kit";
import type { MotifId } from "./ids";

/** Search bar and results; the accent result climbs to the top. */
const seo: DrawFn = (a: Art) => {
  const { ctx } = a;
  const u = loop(a.t, 5);

  rr(ctx, 10, 4, 140, 14, 7);
  stroke(ctx, fg(a, 0.5));
  circ(ctx, 19, 10.5, 3);
  stroke(ctx, fg(a, 0.6), 1);
  line(ctx, 21.2, 12.7, 23.5, 15);
  stroke(ctx, fg(a, 0.6), 1);
  textLine(ctx, 30, 11, 44, fg(a, 0.3), 1.8);

  const rowY = (slot: number) => 28 + slot * 17;
  const p = lerp(3, 0, ease(seg(u, 0.2, 0.7)));
  const fade = edgeFade(u, 0.06);

  for (let i = 0; i < 3; i++) {
    const shift = Math.min(1, Math.max(0, i + 1 - p));
    const y = rowY(i + shift);
    textLine(ctx, 14, y, 52 - i * 6, fg(a, 0.45), 2.2);
    textLine(ctx, 14, y + 6, 96, fg(a, 0.16), 1.6);
  }

  ctx.globalAlpha = fade;
  const y = rowY(p);
  glowOn(a, 2);
  rr(ctx, 9, y - 4.5, 112, 15, 3);
  fill(ctx, accent(0.12));
  stroke(ctx, accent(), 1);
  noGlow(a);
  textLine(ctx, 14, y, 60, fg(a, 0.9), 2.2);
  textLine(ctx, 14, y + 6, 90, fg(a, 0.3), 1.6);
  // Up arrow
  const ax = 134;
  const ay = y + 2;
  line(ctx, ax, ay + 6, ax, ay - 5);
  stroke(ctx, accent(), 1.3);
  ctx.beginPath();
  ctx.moveTo(ax - 4, ay - 1);
  ctx.lineTo(ax, ay - 5);
  ctx.lineTo(ax + 4, ay - 1);
  stroke(ctx, accent(), 1.3);
  ctx.globalAlpha = 1;
};

/** A question, an answer typing in, and a cited source chip that lights up. */
const llmSeo: DrawFn = (a) => {
  const { ctx } = a;
  const u = loop(a.t, 6);
  ctx.globalAlpha = edgeFade(u);

  // Question
  const q = easeOut(seg(u, 0, 0.15));
  rr(ctx, 78, 4, 72, 16, 7);
  stroke(ctx, fg(a, 0.45 * q));
  textLine(ctx, 85, 12, 54 * easeOut(seg(u, 0.05, 0.2)), fg(a, 0.55), 2);

  // Answer
  const r = easeOut(seg(u, 0.2, 0.3));
  if (r > 0) {
    rr(ctx, 10, 26, 118, 44, 7);
    stroke(ctx, fg(a, 0.45 * r));
    // AI mark: small four-point spark
    const sx = 19;
    const sy = 35;
    ctx.beginPath();
    ctx.moveTo(sx, sy - 4);
    ctx.quadraticCurveTo(sx, sy, sx + 4, sy);
    ctx.quadraticCurveTo(sx, sy, sx, sy + 4);
    ctx.quadraticCurveTo(sx, sy, sx - 4, sy);
    ctx.quadraticCurveTo(sx, sy, sx, sy - 4);
    fill(ctx, accent(r));
    const lines = [86, 98, 92, 60];
    lines.forEach((w, i) => {
      const p = seg(u, 0.3 + i * 0.07, 0.37 + i * 0.07);
      textLine(ctx, i === 0 ? 28 : 18, 35 + i * 9, (i === 0 ? w - 10 : w) * p, fg(a, i === 0 ? 0.6 : 0.3), 2);
    });
  }

  // Citation
  const c = easeOut(seg(u, 0.6, 0.7));
  if (c > 0) {
    line(ctx, 30, 70, 30, 74 + 2 * c);
    stroke(ctx, accent(0.6 * c), 0.9);
    const pulse = 0.5 + 0.5 * Math.sin(a.t * 4);
    glowOn(a, 3 + 5 * pulse);
    rr(ctx, 18, 76, 58, 16, 8);
    fill(ctx, accent(0.12 * c));
    stroke(ctx, accent(c), 1.2);
    noGlow(a);
    // Link glyph
    rr(ctx, 24, 81.5, 7, 5, 2.5);
    stroke(ctx, accent(c), 1);
    rr(ctx, 28, 81.5, 7, 5, 2.5);
    stroke(ctx, accent(c), 1);
    textLine(ctx, 40, 84, 28 * c, fg(a, 0.7), 2);
  }
  ctx.globalAlpha = 1;
};

/** A document writes itself; keywords highlight; the score gauge fills. */
const contentSeo: DrawFn = (a) => {
  const { ctx } = a;
  const u = loop(a.t, 6);
  ctx.globalAlpha = edgeFade(u);

  rr(ctx, 10, 4, 78, 92, 4);
  stroke(ctx, fg(a, 0.45));
  textLine(ctx, 17, 14, 44 * easeOut(seg(u, 0, 0.1)), fg(a, 0.75), 3.2);

  const widths = [62, 58, 64, 40, 60, 62, 48, 56];
  const keys: Record<number, [number, number]> = { 1: [20, 18], 4: [8, 20], 6: [26, 16] };
  widths.forEach((w, i) => {
    const y = 26 + i * 8.5;
    const p = seg(u, 0.08 + i * 0.05, 0.14 + i * 0.05);
    textLine(ctx, 17, y, w * p, fg(a, 0.25), 1.8);
    const k = keys[i];
    if (k) {
      const h = easeOut(seg(u, 0.55 + i * 0.02, 0.62 + i * 0.02));
      if (h > 0) {
        rr(ctx, 17 + k[0] - 1.5, y - 3, k[1] * h + 3, 6, 2);
        fill(ctx, accent(0.25));
        textLine(ctx, 17 + k[0], y, k[1] * h, accent(), 1.8);
      }
    }
  });

  // Gauge
  const g = ease(seg(u, 0.3, 0.8));
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(124, 62, 24, Math.PI, Math.PI * 2);
  stroke(ctx, faint(a), 4);
  glowOn(a, 2);
  ctx.beginPath();
  ctx.arc(124, 62, 24, Math.PI, Math.PI + Math.PI * 0.92 * g);
  stroke(ctx, accent(), 4);
  noGlow(a);
  const ang = Math.PI + Math.PI * 0.92 * g;
  line(ctx, 124, 62, 124 + Math.cos(ang) * 15, 62 + Math.sin(ang) * 15);
  stroke(ctx, fg(a, 0.7), 1.2);
  dot(ctx, 124, 62, 2.2, fg(a, 0.8));
  textLine(ctx, 110, 76, 28, fg(a, 0.25), 1.8);
  ctx.globalAlpha = 1;
};

/** Street map; the accent pin drops and sends out ripples. */
const localSeo: DrawFn = (a) => {
  const { ctx, t } = a;
  const u = loop(t, 4);

  rr(ctx, 10, 4, 140, 92, 5);
  stroke(ctx, fg(a, 0.35));
  ctx.save();
  rr(ctx, 10, 4, 140, 92, 5);
  ctx.clip();
  // Streets
  [24, 52, 78].forEach((y) => {
    line(ctx, 10, y, 150, y + 4);
    stroke(ctx, faint(a), 2.2);
  });
  [36, 74, 118].forEach((x) => {
    line(ctx, x, 4, x - 6, 96);
    stroke(ctx, faint(a), 2.2);
  });
  line(ctx, 10, 92, 150, 8);
  stroke(ctx, fg(a, 0.1), 3);
  // Blocks
  [
    [42, 30, 26, 16],
    [80, 60, 30, 13],
    [14, 58, 16, 14],
    [124, 30, 20, 18],
  ].forEach(([x, y, w, h]) => {
    rr(ctx, x, y, w, h, 2);
    stroke(ctx, fg(a, 0.14), 0.7);
  });
  // Other places
  [
    [52, 72],
    [128, 72],
    [30, 16],
  ].forEach(([x, y]) => dot(ctx, x, y, 2, fg(a, 0.3)));
  ctx.restore();

  const px = 92;
  const base = 52;
  // Ripples
  for (let i = 0; i < 3; i++) {
    const r = (u * 1.4 + i / 3) % 1;
    if (u < 0.3) break;
    ctx.beginPath();
    ctx.ellipse(px, base, 6 + r * 34, (6 + r * 34) * 0.4, 0, 0, Math.PI * 2);
    stroke(ctx, accent(0.7 * (1 - r)), 1);
  }
  // Pin
  const d = seg(u, 0, 0.3);
  const bounce = d < 1 ? (1 - easeOut(d)) * 44 - Math.sin(d * Math.PI) * 3 : 0;
  const py = base - bounce;
  ctx.beginPath();
  ctx.ellipse(px, base, 4, 1.6, 0, 0, Math.PI * 2);
  fill(ctx, `rgba(0,0,0,${0.4 * d})`);
  glowOn(a);
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.bezierCurveTo(px - 3, py - 6, px - 9, py - 10, px - 9, py - 17);
  ctx.arc(px, py - 17, 9, Math.PI, 0);
  ctx.bezierCurveTo(px + 9, py - 10, px + 3, py - 6, px, py);
  ctx.closePath();
  fill(ctx, accent());
  noGlow(a);
  dot(ctx, px, py - 17, 3.2, "#0b0c12");
};

export const search: Partial<Record<MotifId, DrawFn>> = {
  "search-rank": seo,
  "chat-cite": llmSeo,
  "doc-keywords": contentSeo,
  "map-pin": localSeo,
};
