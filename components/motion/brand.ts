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
  partial,
  rr,
  seg,
  stroke,
  textLine,
} from "./kit";
import type { MotifId } from "./ids";

/** Construction grid and circles draw in, a monogram strokes on, an accent dot lands. */
const brandIdentity: DrawFn = (a: Art) => {
  const { ctx } = a;
  const u = loop(a.t, 6);
  ctx.globalAlpha = edgeFade(u);

  const g = seg(u, 0, 0.22);
  for (const x of [40, 80, 120]) {
    line(ctx, x, 50 - 48 * g, x, 50 + 48 * g);
    stroke(ctx, faint(a), 0.6);
  }
  for (const y of [18, 50, 82]) {
    line(ctx, 80 - 76 * g, y, 80 + 76 * g, y);
    stroke(ctx, faint(a), 0.6);
  }

  const c = seg(u, 0.12, 0.45);
  const circles: [number, number, number][] = [
    [80, 50, 34],
    [62, 50, 22],
    [98, 50, 22],
  ];
  circles.forEach(([x, y, r], i) => {
    const p = seg(c, i * 0.2, 0.6 + i * 0.2);
    ctx.beginPath();
    ctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p);
    stroke(ctx, fg(a, 0.3), 0.8);
  });

  partial(
    ctx,
    [
      [56, 26],
      [80, 76],
      [104, 26],
    ],
    ease(seg(u, 0.42, 0.68)),
  );
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  stroke(ctx, fg(a, 0.85), 3.2);

  const d = seg(u, 0.66, 0.76);
  if (d > 0) {
    const bounce = Math.sin(d * Math.PI) * 6;
    glowOn(a);
    dot(ctx, 104, 26 - bounce, 4.5 * easeOut(d), accent());
    noGlow(a);
  }
  ctx.globalAlpha = 1;
};

/** App window; a chart breathes; the cursor travels to the accent button and clicks it. */
const webApp: DrawFn = (a) => {
  const { ctx, t } = a;
  const u = loop(t, 4);
  rr(ctx, 10, 6, 140, 88, 6);
  stroke(ctx, fg(a, 0.45));
  line(ctx, 10, 18, 150, 18);
  stroke(ctx, faint(a), 0.8);
  [17, 23, 29].forEach((x) => dot(ctx, x, 12, 1.6, fg(a, 0.35)));

  // Sidebar
  rr(ctx, 16, 24, 28, 64, 3);
  stroke(ctx, faint(a), 0.8);
  [32, 40, 48, 56].forEach((y, i) => textLine(ctx, 21, y, i === 1 ? 16 : 12, i === 1 ? accent(0.9) : fg(a, 0.3), 1.6));

  // Chart panel
  rr(ctx, 50, 24, 94, 40, 3);
  stroke(ctx, faint(a), 0.8);
  for (let i = 0; i < 7; i++) {
    const h = 10 + 18 * (0.5 + 0.5 * Math.sin(t * 1.4 + i * 0.9));
    rr(ctx, 58 + i * 12, 58 - h, 6, h, 1.5);
    fill(ctx, i === 4 ? accent(0.85) : fg(a, 0.22));
  }

  // Button
  const click = seg(u, 0.55, 0.68);
  const pressed = click > 0 && u < 0.85;
  rr(ctx, 108, 72, 36, 12, 6);
  if (pressed) fill(ctx, accent(0.9));
  stroke(ctx, accent(), 1);
  textLine(ctx, 56, 74, 36, fg(a, 0.3), 1.6);
  textLine(ctx, 56, 81, 24, fg(a, 0.2), 1.6);

  // Ripple
  if (click > 0 && click < 1) {
    circ(ctx, 126, 78, 4 + 14 * click);
    stroke(ctx, accent(1 - click), 1);
  }

  // Cursor
  const m = ease(seg(u, 0.1, 0.55));
  const back = ease(seg(u, 0.8, 1));
  const cx = lerp(lerp(78, 126, m), 78, back);
  const cy = lerp(lerp(40, 79, m), 40, back);
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy + 10);
  ctx.lineTo(cx + 3, cy + 7.5);
  ctx.lineTo(cx + 7, cy + 8);
  ctx.closePath();
  fill(ctx, fg(a, 0.95));
};

/** Browser frame; page blocks build top to bottom; the scroll thumb moves. */
const website: DrawFn = (a) => {
  const { ctx } = a;
  const u = loop(a.t, 5);
  ctx.globalAlpha = edgeFade(u);
  rr(ctx, 10, 6, 140, 88, 6);
  stroke(ctx, fg(a, 0.45));
  rr(ctx, 44, 9.5, 72, 6, 3);
  stroke(ctx, faint(a), 0.8);
  [17, 23, 29].forEach((x) => dot(ctx, x, 12.5, 1.6, fg(a, 0.35)));
  line(ctx, 10, 19, 150, 19);
  stroke(ctx, faint(a), 0.8);

  const step = (i: number) => easeOut(seg(u, 0.08 + i * 0.1, 0.2 + i * 0.1));

  // Hero
  const s0 = step(0);
  ctx.globalAlpha = edgeFade(u) * s0;
  textLine(ctx, 18, 30 - (1 - s0) * 4, 62, fg(a, 0.8), 4);
  textLine(ctx, 18, 39, 44, fg(a, 0.35), 2);
  rr(ctx, 18, 45, 24, 8, 4);
  fill(ctx, accent(0.95));

  // Image
  const s1 = step(1);
  ctx.globalAlpha = edgeFade(u) * s1;
  rr(ctx, 96, 25, 40, 30, 3);
  stroke(ctx, fg(a, 0.35), 0.9);
  line(ctx, 96, 55, 136, 25);
  stroke(ctx, faint(a), 0.7);
  circ(ctx, 106, 34, 4);
  stroke(ctx, faint(a), 0.7);

  // Cards
  for (let i = 0; i < 3; i++) {
    const s = step(2 + i);
    ctx.globalAlpha = edgeFade(u) * s;
    rr(ctx, 18 + i * 40, 62 + (1 - s) * 6, 34, 24, 3);
    stroke(ctx, fg(a, 0.3), 0.9);
    textLine(ctx, 23 + i * 40, 69 + (1 - s) * 6, 18, fg(a, 0.4), 1.6);
    textLine(ctx, 23 + i * 40, 75 + (1 - s) * 6, 22, fg(a, 0.2), 1.6);
  }

  // Scrollbar
  ctx.globalAlpha = edgeFade(u);
  const ty = lerp(23, 70, ease(seg(u, 0.1, 0.9)));
  ctx.lineCap = "round";
  line(ctx, 145, ty, 145, ty + 16);
  stroke(ctx, fg(a, 0.4), 2.2);
  ctx.globalAlpha = 1;
};

/** Content cards on the left; the accent card is picked up and slotted into the page. */
const cms: DrawFn = (a) => {
  const { ctx } = a;
  const u = loop(a.t, 5);

  // Stack of entries
  [16, 36, 56, 76].forEach((y, i) => {
    rr(ctx, 10, y, 54, 14, 3);
    stroke(ctx, i === 1 ? faint(a) : fg(a, 0.3), 0.9);
    if (i !== 1) {
      dot(ctx, 17, y + 7, 2, fg(a, 0.35));
      textLine(ctx, 23, y + 5, 30, fg(a, 0.35), 1.6);
      textLine(ctx, 23, y + 10, 20, fg(a, 0.18), 1.6);
    }
  });

  // Page
  rr(ctx, 92, 6, 58, 88, 4);
  stroke(ctx, fg(a, 0.45));
  textLine(ctx, 99, 15, 30, fg(a, 0.7), 3);
  textLine(ctx, 99, 23, 42, fg(a, 0.22), 1.6);
  rr(ctx, 98, 34, 46, 18, 3);
  ctx.setLineDash([2, 2]);
  stroke(ctx, faint(a), 0.8);
  ctx.setLineDash([]);
  [60, 66, 72, 78].forEach((y, i) => textLine(ctx, 99, y, i === 3 ? 26 : 42, fg(a, 0.22), 1.6));

  // Path hint
  ctx.setLineDash([2, 3]);
  ctx.beginPath();
  ctx.moveTo(66, 43);
  ctx.bezierCurveTo(78, 43, 80, 43, 92, 43);
  stroke(ctx, faint(a), 0.8);
  ctx.setLineDash([]);

  // Moving card
  const m = ease(seg(u, 0.2, 0.55));
  const out = seg(u, 0.85, 1);
  const x = lerp(10, 97, m);
  const y = lerp(36, 36, m) - Math.sin(m * Math.PI) * 10;
  const w = lerp(54, 48, m);
  ctx.globalAlpha = 1 - out;
  glowOn(a, 2 + 4 * m);
  rr(ctx, x, y, w, 14, 3);
  fill(ctx, accent(0.18 + 0.2 * m));
  stroke(ctx, accent(), 1.1);
  noGlow(a);
  dot(ctx, x + 7, y + 7, 2, accent());
  textLine(ctx, x + 13, y + 5, w * 0.5, fg(a, 0.7), 1.6);
  textLine(ctx, x + 13, y + 10, w * 0.35, fg(a, 0.3), 1.6);
  ctx.globalAlpha = 1;
};

/** Rotating wireframe box with accent vertices over a faint ground ellipse. */
const modelling: DrawFn = (a) => {
  const { ctx, t } = a;
  const ry = t * 0.7;
  const rx = 0.42;
  const verts: [number, number, number][] = [];
  for (const x of [-1.25, 1.25]) for (const y of [-0.8, 0.8]) for (const z of [-0.8, 0.8]) verts.push([x, y, z]);
  const P = verts.map(([x, y, z]) => {
    const x1 = x * Math.cos(ry) + z * Math.sin(ry);
    const z1 = -x * Math.sin(ry) + z * Math.cos(ry);
    const y2 = y * Math.cos(rx) - z1 * Math.sin(rx);
    const z2 = y * Math.sin(rx) + z1 * Math.cos(rx);
    const f = 5 / (5 + z2);
    return [80 + x1 * 26 * f, 46 + y2 * 26 * f, z2] as [number, number, number];
  });

  // Ground
  ctx.beginPath();
  ctx.ellipse(80, 86, 46, 7, 0, 0, Math.PI * 2);
  stroke(ctx, faint(a), 0.8);
  ctx.setLineDash([2, 3]);
  ctx.beginPath();
  ctx.ellipse(80, 86, 62, 10, 0, 0, Math.PI * 2);
  stroke(ctx, faint(a), 0.6);
  ctx.setLineDash([]);

  // Edges: vertices differ in exactly one coordinate.
  for (let i = 0; i < 8; i++)
    for (let j = i + 1; j < 8; j++) {
      const d = (i ^ j).toString(2).replace(/0/g, "").length;
      if (d !== 1) continue;
      const back = (P[i][2] + P[j][2]) / 2 > 0.3;
      line(ctx, P[i][0], P[i][1], P[j][0], P[j][1]);
      stroke(ctx, back ? fg(a, 0.2) : fg(a, 0.7), back ? 0.8 : 1.3);
    }

  glowOn(a, 3);
  P.forEach(([x, y, z]) => dot(ctx, x, y, z > 0.3 ? 1.4 : 2.2, accent(z > 0.3 ? 0.5 : 1)));
  noGlow(a);
};

export const brand: Partial<Record<MotifId, DrawFn>> = {
  "brand-construct": brandIdentity,
  "app-window": webApp,
  "browser-build": website,
  "cms-cards": cms,
  "wireframe-box": modelling,
};
