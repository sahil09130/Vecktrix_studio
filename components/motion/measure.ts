import {
  type Art,
  type DrawFn,
  accent,
  bez,
  bezPts,
  check,
  circ,
  displayFont,
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

/** Camera body; the aperture closes, the shutter fires with a flash. */
const camera: DrawFn = (a: Art) => {
  const { ctx } = a;
  const u = loop(a.t, 2.8);
  rr(ctx, 30, 26, 100, 62, 9);
  stroke(ctx, fg(a, 0.6), 1.3);
  rr(ctx, 50, 18, 26, 10, 3);
  stroke(ctx, fg(a, 0.45), 1);
  rr(ctx, 38, 34, 14, 7, 2);
  stroke(ctx, fg(a, 0.3), 0.8);
  // Shutter button
  const press = seg(u, 0.55, 0.62) * (1 - seg(u, 0.62, 0.72));
  rr(ctx, 108, 20 + press * 2, 14, 6 - press * 2, 2);
  fill(ctx, accent());

  // Lens
  circ(ctx, 80, 57, 24);
  stroke(ctx, fg(a, 0.55), 1.2);
  circ(ctx, 80, 57, 18);
  stroke(ctx, fg(a, 0.3), 0.9);
  const close = seg(u, 0.5, 0.62) * (1 - seg(u, 0.72, 0.9));
  const r = lerp(15, 5, close);
  ctx.save();
  ctx.translate(80, 57);
  ctx.rotate(close * 0.8);
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2;
    const x = Math.cos(ang) * r;
    const y = Math.sin(ang) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  stroke(ctx, fg(a, 0.7), 1);
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2;
    line(ctx, Math.cos(ang) * r, Math.sin(ang) * r, Math.cos(ang + 0.9) * 16, Math.sin(ang + 0.9) * 16);
    stroke(ctx, fg(a, 0.25), 0.7);
  }
  ctx.restore();
  dot(ctx, 86, 51, 2, fg(a, 0.6));

  // Flash
  const flash = seg(u, 0.6, 0.64) * (1 - seg(u, 0.64, 0.8));
  if (flash > 0) {
    const g = ctx.createRadialGradient(63, 23, 0, 63, 23, 40);
    g.addColorStop(0, `rgba(242,239,233,${0.7 * flash})`);
    g.addColorStop(1, "rgba(242,239,233,0)");
    ctx.fillStyle = g;
    ctx.fillRect(20, 0, 90, 60);
  }
};

/** A cart; items drop into it, then a checkout tick appears. */
const cart: DrawFn = (a) => {
  const { ctx } = a;
  const u = loop(a.t, 4);
  ctx.globalAlpha = edgeFade(u);
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(12, 22);
  ctx.lineTo(24, 22);
  ctx.lineTo(34, 66);
  ctx.lineTo(96, 66);
  stroke(ctx, fg(a, 0.6), 1.4);
  ctx.beginPath();
  ctx.moveTo(27, 34);
  ctx.lineTo(104, 34);
  ctx.lineTo(96, 58);
  ctx.lineTo(32, 58);
  stroke(ctx, fg(a, 0.6), 1.4);
  circ(ctx, 42, 76, 5);
  stroke(ctx, fg(a, 0.6), 1.3);
  circ(ctx, 88, 76, 5);
  stroke(ctx, fg(a, 0.6), 1.3);

  const items = [
    { x: 40, w: 18, h: 14, at: 0.08 },
    { x: 62, w: 14, h: 18, at: 0.2 },
    { x: 80, w: 14, h: 12, at: 0.32 },
  ];
  items.forEach((it, i) => {
    const d = easeOut(seg(u, it.at, it.at + 0.14));
    if (d <= 0) return;
    const y = lerp(-20, 56 - it.h, d);
    rr(ctx, it.x, y, it.w, it.h, 2);
    fill(ctx, i === 1 ? accent(0.85) : "#12141c");
    stroke(ctx, i === 1 ? accent() : fg(a, 0.5), 1);
  });

  const c = easeOut(seg(u, 0.55, 0.68));
  if (c > 0) {
    glowOn(a, 4);
    circ(ctx, 132, 44, 13 * c);
    fill(ctx, accent());
    noGlow(a);
    check(ctx, 132, 44, 5.5, seg(u, 0.62, 0.75));
    stroke(ctx, "#0b0c12", 2.2);
    textLine(ctx, 118, 66, 28 * c, fg(a, 0.4), 2);
  }
  ctx.globalAlpha = 1;
};

/** A speed gauge; the needle swings up to fast with a little overshoot. */
const speedGauge: DrawFn = (a) => {
  const { ctx } = a;
  const u = loop(a.t, 4);
  const cx = 80;
  const cy = 82;
  const R = 58;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(cx, cy, R, Math.PI, Math.PI * 2);
  stroke(ctx, faint(a), 6);
  for (let i = 0; i <= 10; i++) {
    const ang = Math.PI + (i / 10) * Math.PI;
    const r1 = R - 10;
    const r2 = R - (i % 5 === 0 ? 17 : 13);
    line(ctx, cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1, cx + Math.cos(ang) * r2, cy + Math.sin(ang) * r2);
    stroke(ctx, fg(a, 0.35), 1);
  }
  const rise = seg(u, 0.1, 0.55);
  const back = ease(seg(u, 0.85, 1));
  const over = rise < 1 ? easeOut(rise) * 1.06 - 0.06 * Math.sin(rise * Math.PI) : 1;
  const v = lerp(0.08, 0.9, Math.min(1, over)) * (1 - back) + 0.08 * back;
  glowOn(a, 3);
  ctx.beginPath();
  ctx.arc(cx, cy, R, Math.PI, Math.PI + Math.PI * v);
  stroke(ctx, accent(), 6);
  noGlow(a);
  const ang = Math.PI + Math.PI * v;
  line(ctx, cx, cy, cx + Math.cos(ang) * (R - 20), cy + Math.sin(ang) * (R - 20));
  stroke(ctx, fg(a, 0.9), 2);
  dot(ctx, cx, cy, 4, fg(a, 0.9));
  textLine(ctx, cx - 12, cy + 12, 24, fg(a, 0.35), 2);
};

/** A shield; a scan line passes, the lock closes and the shield turns accent. */
const shield: DrawFn = (a) => {
  const { ctx } = a;
  const u = loop(a.t, 4);
  const path = () => {
    ctx.beginPath();
    ctx.moveTo(80, 6);
    ctx.lineTo(112, 18);
    ctx.bezierCurveTo(112, 56, 98, 80, 80, 94);
    ctx.bezierCurveTo(62, 80, 48, 56, 48, 18);
    ctx.closePath();
  };
  const locked = seg(u, 0.55, 0.65) * (1 - seg(u, 0.9, 1));
  path();
  fill(ctx, `rgba(255,77,46,${0.08 * locked})`);
  if (locked > 0.5) glowOn(a, 4);
  stroke(ctx, locked > 0.5 ? accent() : fg(a, 0.6), 1.4);
  noGlow(a);

  ctx.save();
  path();
  ctx.clip();
  const sy = lerp(4, 96, seg(u, 0.05, 0.5));
  if (u < 0.52) {
    const g = ctx.createLinearGradient(0, sy - 14, 0, sy);
    g.addColorStop(0, "rgba(255,77,46,0)");
    g.addColorStop(1, "rgba(255,77,46,0.35)");
    ctx.fillStyle = g;
    ctx.fillRect(40, sy - 14, 80, 14);
    line(ctx, 40, sy, 120, sy);
    stroke(ctx, accent(), 1);
  }
  ctx.restore();

  // Lock
  const drop = 5 * (1 - locked);
  ctx.beginPath();
  ctx.arc(80, 44 - drop, 7, Math.PI, 0);
  ctx.lineTo(87, 50 - drop);
  ctx.moveTo(73, 44 - drop);
  ctx.lineTo(73, 50 - drop);
  stroke(ctx, fg(a, 0.85), 1.8);
  rr(ctx, 69, 48, 22, 18, 3);
  fill(ctx, "#12141c");
  stroke(ctx, fg(a, 0.85), 1.4);
  dot(ctx, 80, 56, 2, locked > 0.5 ? accent() : fg(a, 0.7));

  // Side checks
  [24, 136].forEach((x, i) => {
    circ(ctx, x, 50, 7);
    stroke(ctx, faint(a), 0.9);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    check(ctx, x, 50, 3, seg(u, 0.62 + i * 0.05, 0.72 + i * 0.05));
    stroke(ctx, fg(a, 0.6), 1.2);
  });
};

/** Three pages connected by links; an accent pulse travels them. */
const linkChain: DrawFn = (a) => {
  const { ctx } = a;
  const u = loop(a.t, 3.6);
  const pages: [number, number][] = [
    [10, 14],
    [64, 50],
    [118, 14],
  ];
  const centre = (p: [number, number]): [number, number] => [p[0] + 16, p[1] + 20];
  const links: [number, number][] = [
    [0, 1],
    [1, 2],
  ];
  links.forEach(([i, j], k) => {
    const s = centre(pages[i]);
    const e = centre(pages[j]);
    const c1: [number, number] = [lerp(s[0], e[0], 0.5), s[1] - 6];
    const c2: [number, number] = [lerp(s[0], e[0], 0.5), e[1] + 6];
    partial(ctx, bezPts(s, c1, c2, e), 1);
    ctx.setLineDash([2, 3]);
    stroke(ctx, fg(a, 0.3), 0.9);
    ctx.setLineDash([]);
    const [mx, my] = bez(s, c1, c2, e, 0.5);
    ctx.save();
    ctx.translate(mx, my);
    ctx.rotate(-0.6);
    rr(ctx, -8, -3, 10, 6, 3);
    stroke(ctx, fg(a, 0.6), 1.1);
    rr(ctx, -2, -3, 10, 6, 3);
    stroke(ctx, fg(a, 0.6), 1.1);
    ctx.restore();
    const p = seg(u, k * 0.45, k * 0.45 + 0.4);
    if (p > 0 && p < 1) {
      const [x, y] = bez(s, c1, c2, e, ease(p));
      glowOn(a, 4);
      dot(ctx, x, y, 2.6, accent());
      noGlow(a);
    }
  });
  pages.forEach((p, i) => {
    const lit = (i === 1 && u > 0.4 && u < 0.6) || (i === 2 && u > 0.85);
    rr(ctx, p[0], p[1], 32, 40, 3);
    fill(ctx, "#0e1017");
    stroke(ctx, lit ? accent() : fg(a, 0.55), 1.1);
    textLine(ctx, p[0] + 5, p[1] + 8, 16, fg(a, 0.6), 2.2);
    [16, 21, 26].forEach((y) => textLine(ctx, p[0] + 5, p[1] + y, 20, fg(a, 0.2), 1.4));
  });
};

/** Variants A and B; their results grow and B wins. */
const abSplit: DrawFn = (a) => {
  const { ctx } = a;
  const u = loop(a.t, 5);
  ctx.globalAlpha = edgeFade(u);
  const variant = (x: number, label: string, win: boolean) => {
    rr(ctx, x, 6, 64, 54, 4);
    stroke(ctx, win && u > 0.6 ? accent() : fg(a, 0.5), 1.1);
    textLine(ctx, x + 7, 16, 34, fg(a, 0.6), 2.6);
    textLine(ctx, x + 7, 24, 46, fg(a, 0.22), 1.6);
    rr(ctx, x + 7, 32, 50, 14, 2);
    stroke(ctx, faint(a), 0.8);
    rr(ctx, x + 7, 50, 20, 6, 3);
    fill(ctx, win ? accent() : fg(a, 0.35));
    ctx.font = `700 11px ${displayFont()}`;
    ctx.fillStyle = fg(a, 0.7);
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + 54, 14);
    // Result
    const p = easeOut(seg(u, 0.15, 0.6));
    line(ctx, x, 78, x + 64, 78);
    stroke(ctx, faint(a), 4);
    ctx.lineCap = "round";
    line(ctx, x, 78, x + 64 * (win ? 0.78 : 0.44) * p, 78);
    stroke(ctx, win ? accent() : fg(a, 0.5), 4);
  };
  variant(10, "A", false);
  variant(86, "B", true);
  const w = easeOut(seg(u, 0.62, 0.72));
  if (w > 0) {
    glowOn(a, 3);
    circ(ctx, 150, 90, 7 * w);
    fill(ctx, accent());
    noGlow(a);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    check(ctx, 150, 90, 3, seg(u, 0.68, 0.78));
    stroke(ctx, "#0b0c12", 1.6);
  }
  ctx.globalAlpha = 1;
};

/** KPI tiles, a sparkline that draws in, and a donut that fills. */
const dashboard: DrawFn = (a) => {
  const { ctx, t } = a;
  const u = loop(t, 5);
  [10, 60, 110].forEach((x, i) => {
    rr(ctx, x, 6, 42, 24, 3);
    stroke(ctx, fg(a, 0.35), 0.9);
    textLine(ctx, x + 6, 13, 14, fg(a, 0.3), 1.4);
    textLine(ctx, x + 6, 22, 22 + Math.sin(t * 1.3 + i) * 4, i === 0 ? accent(0.9) : fg(a, 0.7), 3.2);
  });
  rr(ctx, 10, 36, 100, 58, 3);
  stroke(ctx, fg(a, 0.35), 0.9);
  [52, 68, 84].forEach((y) => {
    line(ctx, 16, y, 104, y);
    stroke(ctx, faint(a), 0.6);
  });
  const pts: [number, number][] = [];
  for (let i = 0; i <= 10; i++) {
    const x = 16 + i * 8.8;
    const y = 84 - (i * 3.2 + Math.sin(i * 1.7) * 6 + 4);
    pts.push([x, y]);
  }
  const p = ease(seg(u, 0.05, 0.6));
  partial(ctx, pts, p);
  ctx.lineJoin = "round";
  stroke(ctx, fg(a, 0.75), 1.3);
  if (p > 0) {
    const idx = Math.min(10, Math.floor(p * 10));
    const f = p * 10 - idx;
    const end = idx < 10 ? [lerp(pts[idx][0], pts[idx + 1][0], f), lerp(pts[idx][1], pts[idx + 1][1], f)] : pts[10];
    glowOn(a, 3);
    dot(ctx, end[0], end[1], 2.6, accent());
    noGlow(a);
  }
  // Donut
  ctx.lineCap = "butt";
  circ(ctx, 134, 64, 14);
  stroke(ctx, faint(a), 6);
  ctx.beginPath();
  ctx.arc(134, 64, 14, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.68 * ease(seg(u, 0.2, 0.7)));
  stroke(ctx, accent(), 6);
  textLine(ctx, 124, 88, 20, fg(a, 0.3), 1.6);
};

/** A </> tag fires events down three lanes into a collector. */
const tagBrackets: DrawFn = (a) => {
  const { ctx, t } = a;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(30, 32);
  ctx.lineTo(14, 50);
  ctx.lineTo(30, 68);
  ctx.moveTo(62, 32);
  ctx.lineTo(78, 50);
  ctx.lineTo(62, 68);
  stroke(ctx, fg(a, 0.8), 2.4);
  line(ctx, 52, 28, 40, 72);
  stroke(ctx, accent(), 2.4);

  const lanes = [34, 50, 66];
  lanes.forEach((y) => {
    line(ctx, 86, y, 128, y);
    ctx.setLineDash([2, 3]);
    stroke(ctx, faint(a), 0.8);
    ctx.setLineDash([]);
  });
  for (let i = 0; i < 6; i++) {
    const q = (t * 0.6 + i / 6) % 1;
    const y = lanes[i % 3];
    const x = lerp(86, 128, q);
    const acc = i % 3 === 1;
    if (acc) glowOn(a, 3);
    dot(ctx, x, y, 2.2, acc ? accent(Math.min(1, (1 - q) * 5)) : fg(a, 0.6 * Math.min(1, (1 - q) * 5)));
    noGlow(a);
  }
  rr(ctx, 132, 22, 20, 56, 3);
  stroke(ctx, fg(a, 0.5), 1);
  const level = 0.3 + 0.6 * ((t * 0.12) % 1);
  rr(ctx, 135, 75 - 50 * level, 14, 50 * level, 2);
  fill(ctx, accent(0.35));
};

/** An envelope opens, the letter rises and a notification pulses. */
const envelope: DrawFn = (a) => {
  const { ctx } = a;
  const u = loop(a.t, 4);
  ctx.globalAlpha = edgeFade(u);
  const x = 40;
  const y = 40;
  const w = 80;
  const h = 50;
  const open = ease(seg(u, 0.1, 0.35));
  const rise = easeOut(seg(u, 0.3, 0.6));

  // Letter
  ctx.save();
  rr(ctx, x, y - 60, w, h + 60, 0);
  ctx.clip();
  rr(ctx, x + 8, y + 6 - rise * 34, w - 16, 44, 2);
  fill(ctx, "#12141c");
  stroke(ctx, fg(a, 0.6), 1);
  textLine(ctx, x + 15, y + 15 - rise * 34, 30, fg(a, 0.7), 2.4);
  [22, 28, 34].forEach((dy) => textLine(ctx, x + 15, y + dy - rise * 34, 44, fg(a, 0.25), 1.6));
  ctx.restore();

  // Body
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w / 2, y + h * 0.55);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  fill(ctx, "#0e1017");
  stroke(ctx, fg(a, 0.65), 1.2);
  // Flap
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w / 2, y + h * 0.55 * (1 - 2 * open));
  ctx.lineTo(x + w, y);
  stroke(ctx, fg(a, 0.65), 1.2);

  // Notification
  const n = seg(u, 0.6, 0.7);
  if (n > 0) {
    glowOn(a, 4);
    dot(ctx, x + w, y - 2, 6 * easeOut(n), accent());
    noGlow(a);
    const r = seg(u, 0.65, 0.95);
    circ(ctx, x + w, y - 2, 6 + r * 14);
    stroke(ctx, accent(1 - r), 1);
  }
  // Motion lines
  [0, 1, 2].forEach((i) => {
    const l = 8 + i * 4;
    line(ctx, 12, 52 + i * 10, 12 + l, 52 + i * 10);
    stroke(ctx, faint(a), 1.2);
  });
  ctx.globalAlpha = 1;
};

export const measure: Partial<Record<MotifId, DrawFn>> = {
  camera,
  cart,
  "speed-gauge": speedGauge,
  shield,
  "link-chain": linkChain,
  "ab-split": abSplit,
  dashboard,
  "tag-brackets": tagBrackets,
  envelope,
};
