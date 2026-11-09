import {
  type Art,
  type DrawFn,
  accent,
  bez,
  bezPts,
  check,
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
  partial,
  rand,
  rr,
  seg,
  stroke,
  textLine,
} from "./kit";
import type { MotifId } from "./ids";

/** Funnel: audience dots pour in, most drop off, the converters leave in accent. */
const ads: DrawFn = (a: Art) => {
  const { ctx, t } = a;
  // Funnel outline
  ctx.beginPath();
  ctx.moveTo(30, 12);
  ctx.lineTo(70, 66);
  ctx.lineTo(70, 92);
  ctx.moveTo(130, 12);
  ctx.lineTo(90, 66);
  ctx.lineTo(90, 92);
  ctx.lineJoin = "round";
  stroke(ctx, fg(a, 0.5), 1.2);
  ctx.beginPath();
  ctx.ellipse(80, 12, 50, 4, 0, 0, Math.PI * 2);
  stroke(ctx, fg(a, 0.35), 0.9);
  [30, 48].forEach((y) => {
    const half = lerp(50, 10, (y - 12) / 54);
    ctx.setLineDash([2, 3]);
    line(ctx, 80 - half, y, 80 + half, y);
    stroke(ctx, faint(a), 0.7);
    ctx.setLineDash([]);
  });

  const N = 16;
  for (let i = 0; i < N; i++) {
    const q = (t * 0.28 + i / N) % 1;
    const x0 = 36 + rand(i) * 88;
    const y = -2 + q * 98;
    const narrow = seg(y, 12, 66);
    const x = 80 + (x0 - 80) * (1 - narrow * 0.86);
    const converts = i % 4 === 0;
    let alpha = Math.min(1, q * 8);
    if (!converts) alpha *= 1 - seg(y, 36, 62);
    if (alpha <= 0.01) continue;
    if (converts && y > 64) {
      glowOn(a, 3);
      dot(ctx, x, y, 2.6, accent(alpha));
      noGlow(a);
    } else dot(ctx, x, y, 1.9, fg(a, 0.7 * alpha));
  }

  // Result bars on the right
  for (let i = 0; i < 3; i++) {
    const h = 14 + i * 9 + 4 * Math.sin(t * 1.2 + i);
    rr(ctx, 136 + i * 7, 92 - h, 4.5, h, 1.5);
    fill(ctx, i === 2 ? accent(0.85) : fg(a, 0.2));
  }
};

/** Content calendar: posts drop into their days, the last one gets a published tick. */
const social: DrawFn = (a) => {
  const { ctx } = a;
  const u = loop(a.t, 6);
  ctx.globalAlpha = edgeFade(u);

  rr(ctx, 10, 4, 140, 92, 5);
  stroke(ctx, fg(a, 0.45));
  line(ctx, 10, 16, 150, 16);
  stroke(ctx, faint(a), 0.8);
  for (let c = 0; c < 7; c++) textLine(ctx, 16 + c * 20, 10, 6, fg(a, 0.3), 1.6);
  for (let c = 1; c < 7; c++) {
    line(ctx, 10 + c * 20, 16, 10 + c * 20, 96);
    stroke(ctx, faint(a), 0.6);
  }
  [42, 69].forEach((y) => {
    line(ctx, 10, y, 150, y);
    stroke(ctx, faint(a), 0.6);
  });

  const slots: [number, number][] = [
    [0, 0],
    [2, 0],
    [4, 1],
    [1, 2],
    [5, 0],
    [6, 2],
  ];
  slots.forEach(([c, r], i) => {
    const p = easeOut(seg(u, 0.08 + i * 0.1, 0.18 + i * 0.1));
    if (p <= 0) return;
    const x = 13 + c * 20;
    const y = 20 + r * 27 - (1 - p) * 12;
    const last = i === slots.length - 1;
    ctx.globalAlpha = edgeFade(u) * p;
    rr(ctx, x, y, 14, 19, 2);
    if (last) {
      fill(ctx, accent(0.18));
      stroke(ctx, accent(), 1);
    } else {
      fill(ctx, fg(a, 0.06));
      stroke(ctx, fg(a, 0.45), 0.9);
    }
    rr(ctx, x + 2.5, y + 2.5, 9, 7, 1);
    stroke(ctx, last ? accent(0.8) : fg(a, 0.25), 0.7);
    textLine(ctx, x + 3, y + 13, 8, last ? accent(0.8) : fg(a, 0.3), 1.4);
  });

  const tk = seg(u, 0.75, 0.85);
  if (tk > 0) {
    ctx.globalAlpha = edgeFade(u);
    glowOn(a, 3);
    dot(ctx, 139 + 8, 84 - 4, 6 * easeOut(tk), accent());
    noGlow(a);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    check(ctx, 147, 80, 2.6, seg(u, 0.8, 0.9));
    stroke(ctx, "#0b0c12", 1.5);
  }
  ctx.globalAlpha = 1;
};

/** One article fans out to several channel nodes; pulses travel each link in turn. */
const contentMarketing: DrawFn = (a) => {
  const { ctx, t } = a;
  const u = loop(t, 4);

  rr(ctx, 12, 28, 46, 44, 4);
  fill(ctx, "rgba(11,12,18,0.9)");
  stroke(ctx, fg(a, 0.6), 1.1);
  rr(ctx, 17, 33, 36, 12, 2);
  stroke(ctx, fg(a, 0.25), 0.8);
  [50, 56, 62].forEach((y, i) => textLine(ctx, 18, y, i === 2 ? 20 : 32, fg(a, 0.3), 1.6));

  const nodes: [number, number][] = [
    [128, 12],
    [142, 38],
    [142, 62],
    [128, 88],
  ];
  const start: [number, number] = [58, 50];
  nodes.forEach((n, i) => {
    const c1: [number, number] = [90, 50];
    const c2: [number, number] = [96, n[1]];
    partial(ctx, bezPts(start, c1, c2, n), 1);
    stroke(ctx, fg(a, 0.22), 0.9);

    const active = Math.floor(u * 4) === i;
    const lp = (u * 4) % 1;
    ctx.beginPath();
    ctx.arc(n[0], n[1], 7, 0, Math.PI * 2);
    fill(ctx, "#0b0c12");
    const hit = active && lp > 0.75;
    stroke(ctx, hit ? accent() : fg(a, 0.5), 1.1);
    // glyphs
    if (i === 0) textLine(ctx, n[0] - 3, n[1], 6, fg(a, 0.6), 1.4);
    if (i === 1) {
      ctx.beginPath();
      ctx.moveTo(n[0] - 2, n[1] - 3);
      ctx.lineTo(n[0] + 3, n[1]);
      ctx.lineTo(n[0] - 2, n[1] + 3);
      ctx.closePath();
      fill(ctx, fg(a, 0.6));
    }
    if (i === 2) {
      ctx.beginPath();
      ctx.arc(n[0], n[1], 3, 0, Math.PI * 2);
      stroke(ctx, fg(a, 0.6), 1);
    }
    if (i === 3) {
      rr(ctx, n[0] - 3.5, n[1] - 2.5, 7, 5, 1);
      stroke(ctx, fg(a, 0.6), 1);
    }

    if (active) {
      const [x, y] = bez(start, c1, c2, n, ease(Math.min(1, lp / 0.8)));
      glowOn(a, 4);
      dot(ctx, x, y, 2.6, accent());
      noGlow(a);
    }
  });
};

/** Video player with a pulsing accent play button; the views chart grows. */
const youtube: DrawFn = (a) => {
  const { ctx, t } = a;
  const u = loop(t, 5);

  rr(ctx, 10, 4, 86, 54, 6);
  stroke(ctx, fg(a, 0.5));
  const pulse = 1 + 0.08 * Math.sin(t * 4);
  ctx.save();
  ctx.translate(53, 31);
  ctx.scale(pulse, pulse);
  // Generic play control (deliberately not any platform's logo).
  glowOn(a, 4);
  ctx.beginPath();
  ctx.arc(0, 0, 11, 0, Math.PI * 2);
  stroke(ctx, accent(), 1.4);
  ctx.beginPath();
  ctx.moveTo(-3.5, -5.5);
  ctx.lineTo(6, 0);
  ctx.lineTo(-3.5, 5.5);
  ctx.closePath();
  fill(ctx, accent());
  noGlow(a);
  ctx.restore();
  // Progress
  line(ctx, 16, 52, 90, 52);
  stroke(ctx, faint(a), 1.4);
  line(ctx, 16, 52, lerp(16, 90, u), 52);
  stroke(ctx, accent(), 1.6);
  // Title + channel
  dot(ctx, 16, 70, 5, fg(a, 0.2));
  textLine(ctx, 26, 67, 60, fg(a, 0.5), 2.2);
  textLine(ctx, 26, 74, 38, fg(a, 0.22), 1.6);

  // Views chart
  line(ctx, 106, 92, 150, 92);
  stroke(ctx, fg(a, 0.3), 0.8);
  const heights = [16, 24, 30, 44, 66];
  heights.forEach((h0, i) => {
    const h = h0 * easeOut(seg(u, i * 0.09, 0.3 + i * 0.09));
    rr(ctx, 107 + i * 9, 92 - h, 6, h, 1.5);
    fill(ctx, i === 4 ? accent(0.9) : fg(a, 0.22));
  });
  // Trend line
  const pts = heights.map((h, i) => [110 + i * 9, 86 - h] as [number, number]);
  partial(ctx, pts, ease(seg(u, 0.4, 0.75)));
  ctx.setLineDash([2, 2]);
  stroke(ctx, fg(a, 0.45), 0.8);
  ctx.setLineDash([]);
};

export const marketing: Partial<Record<MotifId, DrawFn>> = {
  "funnel": ads,
  "calendar": social,
  "fan-out": contentMarketing,
  "player-chart": youtube,
};
