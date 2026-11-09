import {
  type Art,
  type DrawFn,
  accent,
  bezPts,
  check,
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

/** A chat: message in, reply out with ticks, typing dots, another message. */
const messageThread: DrawFn = (a: Art) => {
  const { ctx, t } = a;
  const u = loop(t, 5);
  ctx.globalAlpha = edgeFade(u);
  const pop = (s: number) => easeOut(seg(u, s, s + 0.08));

  const b1 = pop(0.04);
  if (b1 > 0) {
    rr(ctx, 10, 6, 74 * b1, 18, 7);
    stroke(ctx, fg(a, 0.5), 1);
    textLine(ctx, 17, 15, 56 * b1, fg(a, 0.45), 2);
  }
  const b2 = pop(0.24);
  if (b2 > 0) {
    const w = 82 * b2;
    rr(ctx, 150 - w, 30, w, 18, 7);
    fill(ctx, accent(0.16));
    stroke(ctx, accent(), 1);
    textLine(ctx, 158 - w, 39, w - 30, fg(a, 0.75), 2);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    check(ctx, 138, 40, 2.4, seg(u, 0.32, 0.36));
    stroke(ctx, accent(), 1);
    check(ctx, 142, 40, 2.4, seg(u, 0.38, 0.42));
    stroke(ctx, accent(), 1);
  }
  // Typing indicator
  if (u > 0.45 && u < 0.62) {
    rr(ctx, 10, 56, 30, 14, 7);
    stroke(ctx, fg(a, 0.4), 1);
    for (let i = 0; i < 3; i++) dot(ctx, 19 + i * 6, 63 - Math.max(0, Math.sin(t * 8 - i)) * 2, 1.6, fg(a, 0.7));
  }
  const b3 = pop(0.62);
  if (b3 > 0) {
    rr(ctx, 10, 56, 104 * b3, 30, 7);
    stroke(ctx, fg(a, 0.5), 1);
    textLine(ctx, 17, 65, 84 * b3, fg(a, 0.45), 2);
    textLine(ctx, 17, 73, 60 * b3, fg(a, 0.3), 2);
  }
  ctx.globalAlpha = 1;
};

/** A call in progress: the waveform alternates between agent (accent) and caller. */
const voiceWave: DrawFn = (a) => {
  const { ctx, t } = a;
  const agent = Math.floor(t / 2) % 2 === 0;
  const pulse = (t * 0.9) % 1;
  circ(ctx, 24, 50, 15);
  stroke(ctx, agent ? accent() : fg(a, 0.6), 1.3);
  circ(ctx, 24, 50, 15 + pulse * 10);
  stroke(ctx, agent ? accent(1 - pulse) : fg(a, 0.4 * (1 - pulse)), 0.9);
  // Handset
  ctx.save();
  ctx.translate(24, 50);
  ctx.rotate(-0.6);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(0, 4, 8, Math.PI * 1.1, Math.PI * 1.9);
  stroke(ctx, fg(a, 0.85), 2.6);
  rr(ctx, -9.5, -2, 5, 7, 2);
  fill(ctx, fg(a, 0.85));
  rr(ctx, 4.5, -2, 5, 7, 2);
  fill(ctx, fg(a, 0.85));
  ctx.restore();

  for (let i = 0; i < 26; i++) {
    const x = 48 + i * 4;
    const env = Math.sin((i / 25) * Math.PI);
    const h = 4 + 30 * env * Math.abs(Math.sin(t * 6 + i * 0.7) * Math.sin(t * 2.3 + i * 0.3));
    line(ctx, x, 50 - h / 2, x, 50 + h / 2);
    ctx.lineCap = "round";
    stroke(ctx, agent ? accent(0.85) : fg(a, 0.55), 2);
  }
  textLine(ctx, 48, 86, 30, fg(a, 0.3), 1.8);
  line(ctx, 86, 86, 150, 86);
  stroke(ctx, faint(a), 1.2);
  line(ctx, 86, 86, 86 + ((t * 0.08) % 1) * 64, 86);
  stroke(ctx, fg(a, 0.6), 1.2);
};

/** A document is scanned; extracted fields fill in on the right. */
const docScan: DrawFn = (a) => {
  const { ctx } = a;
  const u = loop(a.t, 4);
  ctx.globalAlpha = edgeFade(u);
  rr(ctx, 10, 6, 54, 88, 3);
  stroke(ctx, fg(a, 0.55), 1.1);
  textLine(ctx, 17, 15, 26, fg(a, 0.65), 2.6);
  [26, 32, 44, 50, 62, 68, 80].forEach((y, i) => textLine(ctx, 17, y, i % 3 === 2 ? 22 : 38, fg(a, 0.22), 1.6));
  const sy = lerp(8, 92, seg(u, 0.05, 0.6));
  if (u < 0.62) {
    glowOn(a, 4);
    line(ctx, 8, sy, 66, sy);
    stroke(ctx, accent(), 1.3);
    noGlow(a);
  }
  const fields = [14, 34, 54, 74];
  fields.forEach((fy, i) => {
    const p = easeOut(seg(u, 0.12 + i * 0.12, 0.22 + i * 0.12));
    rr(ctx, 82, fy, 68, 14, 3);
    stroke(ctx, p > 0 ? fg(a, 0.5) : faint(a), 0.9);
    textLine(ctx, 87, fy + 4, 14, fg(a, 0.3), 1.4);
    textLine(ctx, 87, fy + 10, 44 * p, i === 0 ? accent() : fg(a, 0.7), 2);
    if (p > 0 && p < 1) {
      line(ctx, 64, 16 + i * 20, 82, fy + 7);
      ctx.setLineDash([1.5, 2]);
      stroke(ctx, accent(0.6), 0.8);
      ctx.setLineDash([]);
    }
  });
  ctx.globalAlpha = 1;
};

function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const px = x + Math.cos(ang) * rad;
    const py = y + Math.sin(ang) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

/** Stars fill one by one, then a review card pops in. */
const starRating: DrawFn = (a) => {
  const { ctx } = a;
  const u = loop(a.t, 4.5);
  ctx.globalAlpha = edgeFade(u);
  for (let i = 0; i < 5; i++) {
    const x = 26 + i * 27;
    const f = easeOut(seg(u, 0.06 + i * 0.07, 0.12 + i * 0.07));
    star(ctx, x, 24, 10 + f * 1.5);
    if (f > 0) {
      if (i === 4) glowOn(a, 4);
      fill(ctx, accent(0.35 + 0.65 * f));
      noGlow(a);
    }
    stroke(ctx, f > 0 ? accent() : fg(a, 0.4), 1);
  }
  const c = easeOut(seg(u, 0.5, 0.62));
  if (c > 0) {
    rr(ctx, 14, 46 + (1 - c) * 8, 132, 44, 6);
    fill(ctx, "#0e1017");
    stroke(ctx, fg(a, 0.45), 1);
    dot(ctx, 28, 60 + (1 - c) * 8, 6, fg(a, 0.25));
    textLine(ctx, 40, 57 + (1 - c) * 8, 36, fg(a, 0.6), 2.2);
    textLine(ctx, 40, 64 + (1 - c) * 8, 22, accent(0.8), 1.8);
    textLine(ctx, 22, 77 + (1 - c) * 8, 110 * seg(u, 0.6, 0.8), fg(a, 0.25), 1.8);
  }
  ctx.globalAlpha = 1;
};

/** Creators orbit a product; accent pulses run from each one to the product. */
const creatorRing: DrawFn = (a) => {
  const { ctx, t } = a;
  const cx = 80;
  const cy = 50;
  const n = 6;
  const hop = 0.7;
  const k = Math.floor(t / hop) % n;
  const p = (t % hop) / hop;

  ctx.beginPath();
  ctx.ellipse(cx, cy, 60, 38, 0, 0, Math.PI * 2);
  ctx.setLineDash([2, 3]);
  stroke(ctx, faint(a), 0.7);
  ctx.setLineDash([]);

  for (let i = 0; i < n; i++) {
    const ang = t * 0.2 + (i / n) * Math.PI * 2;
    const x = cx + Math.cos(ang) * 60;
    const y = cy + Math.sin(ang) * 38;
    line(ctx, x, y, cx, cy);
    stroke(ctx, fg(a, 0.1), 0.8);
    circ(ctx, x, y, 8);
    fill(ctx, "#0b0c12");
    stroke(ctx, i === k ? accent() : fg(a, 0.5), 1);
    circ(ctx, x, y - 2, 2.4);
    fill(ctx, fg(a, 0.6));
    ctx.beginPath();
    ctx.arc(x, y + 5, 4, Math.PI, 0);
    fill(ctx, fg(a, 0.6));
    if (i === k) {
      const e = ease(p);
      glowOn(a, 4);
      dot(ctx, lerp(x, cx, e), lerp(y, cy, e), 2.2, accent());
      noGlow(a);
    }
  }
  rr(ctx, cx - 11, cy - 13, 22, 26, 4);
  fill(ctx, "#12141c");
  glowOn(a, 2 + 4 * (p > 0.85 ? 1 : 0));
  stroke(ctx, accent(), 1.2);
  noGlow(a);
  textLine(ctx, cx - 6, cy - 4, 12, fg(a, 0.6), 1.8);
  textLine(ctx, cx - 6, cy + 3, 8, fg(a, 0.3), 1.6);
};

/** A loop of touchpoints: visit, leave, see an ad, come back. */
const loopArrow: DrawFn = (a) => {
  const { ctx, t } = a;
  const cx = 80;
  const cy = 50;
  const R = 34;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  stroke(ctx, fg(a, 0.25), 1.2);
  const ang = (t * 0.9) % (Math.PI * 2);
  ctx.beginPath();
  ctx.arc(cx, cy, R, ang - 1.4, ang);
  ctx.lineCap = "round";
  glowOn(a, 3);
  stroke(ctx, accent(), 2.2);
  const hx = cx + Math.cos(ang) * R;
  const hy = cy + Math.sin(ang) * R;
  ctx.save();
  ctx.translate(hx, hy);
  ctx.rotate(ang + Math.PI / 2);
  ctx.beginPath();
  ctx.moveTo(4, 0);
  ctx.lineTo(-3, -4);
  ctx.lineTo(-3, 4);
  ctx.closePath();
  fill(ctx, accent());
  ctx.restore();
  noGlow(a);

  const nodes = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
  nodes.forEach((na, i) => {
    const x = cx + Math.cos(na) * R;
    const y = cy + Math.sin(na) * R;
    const d = Math.abs(((ang - na + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    const lit = d > Math.PI - 0.5;
    rr(ctx, x - 9, y - 9, 18, 18, 4);
    fill(ctx, "#0b0c12");
    stroke(ctx, lit ? accent() : fg(a, 0.55), 1.1);
    if (i === 0) {
      rr(ctx, x - 5, y - 4, 10, 8, 1);
      stroke(ctx, fg(a, 0.7), 0.9);
    } else if (i === 1) {
      line(ctx, x - 4, y, x + 4, y);
      stroke(ctx, fg(a, 0.7), 1);
      ctx.beginPath();
      ctx.moveTo(x + 1, y - 3);
      ctx.lineTo(x + 4, y);
      ctx.lineTo(x + 1, y + 3);
      stroke(ctx, fg(a, 0.7), 1);
    } else if (i === 2) {
      rr(ctx, x - 5, y - 3.5, 10, 7, 1);
      stroke(ctx, fg(a, 0.7), 0.9);
      dot(ctx, x + 2, y, 1.4, accent());
    } else {
      check(ctx, x, y, 3.4);
      stroke(ctx, fg(a, 0.8), 1.2);
    }
  });
  textLine(ctx, cx - 14, cy, 28, fg(a, 0.3), 2);
};

/** A page with a cursor clicking; heat blobs bloom where people click. */
const heatmap: DrawFn = (a) => {
  const { ctx, t } = a;
  const u = loop(t, 4);
  rr(ctx, 10, 4, 140, 92, 5);
  stroke(ctx, fg(a, 0.45), 1);
  textLine(ctx, 18, 16, 60, fg(a, 0.6), 3);
  textLine(ctx, 18, 24, 84, fg(a, 0.2), 1.6);
  rr(ctx, 18, 32, 28, 9, 4.5);
  stroke(ctx, fg(a, 0.5), 1);
  rr(ctx, 98, 12, 44, 30, 3);
  stroke(ctx, faint(a), 0.8);
  [0, 1, 2].forEach((i) => {
    rr(ctx, 18 + i * 44, 52, 38, 36, 3);
    stroke(ctx, faint(a), 0.8);
  });

  const spots: [number, number, number][] = [
    [32, 36, 1],
    [120, 27, 0.6],
    [37, 70, 0.5],
    [81, 70, 0.8],
  ];
  spots.forEach(([x, y, w], i) => {
    const r = (18 + 10 * Math.sin(t * 0.9 + i)) * w;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(255,77,46,${0.55 * w})`);
    g.addColorStop(0.5, `rgba(255,77,46,${0.18 * w})`);
    g.addColorStop(1, "rgba(255,77,46,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  });

  const idx = Math.floor(u * 4);
  const from = spots[(idx + 3) % 4];
  const to = spots[idx];
  const m = ease(seg((u * 4) % 1, 0, 0.6));
  const cx = lerp(from[0], to[0], m);
  const cy = lerp(from[1], to[1], m);
  const click = seg((u * 4) % 1, 0.6, 1);
  if (click > 0) {
    circ(ctx, to[0], to[1], 3 + click * 10);
    stroke(ctx, accent(1 - click), 1);
  }
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy + 10);
  ctx.lineTo(cx + 3, cy + 7.5);
  ctx.lineTo(cx + 7, cy + 8);
  ctx.closePath();
  fill(ctx, fg(a, 0.95));
};

/** A dotted journey across touchpoints; a traveller walks it, nodes light up. */
const journeyPath: DrawFn = (a) => {
  const { ctx } = a;
  const u = loop(a.t, 5);
  const nodes: [number, number][] = [
    [14, 74],
    [46, 28],
    [80, 64],
    [114, 26],
    [146, 58],
  ];
  const pts: [number, number][] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    const s = nodes[i];
    const e = nodes[i + 1];
    const mid = (s[0] + e[0]) / 2;
    const seg = bezPts(s, [mid, s[1]], [mid, e[1]], e, 16);
    pts.push(...(i === 0 ? seg : seg.slice(1)));
  }
  partial(ctx, pts, 1);
  ctx.setLineDash([2, 3]);
  stroke(ctx, fg(a, 0.3), 1);
  ctx.setLineDash([]);
  const p = ease(seg(u, 0.05, 0.85));
  partial(ctx, pts, p);
  ctx.lineCap = "round";
  stroke(ctx, accent(0.7), 1.4);

  nodes.forEach(([x, y], i) => {
    const reached = p >= i / (nodes.length - 1) - 0.001;
    const last = i === nodes.length - 1;
    circ(ctx, x, y, last ? 8 : 6.5);
    fill(ctx, "#0b0c12");
    if (reached && last) glowOn(a, 4);
    stroke(ctx, reached ? accent() : fg(a, 0.45), 1.1);
    noGlow(a);
    if (last && reached) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      check(ctx, x, y, 3.4);
      stroke(ctx, accent(), 1.4);
    } else dot(ctx, x, y, 2, reached ? fg(a, 0.9) : fg(a, 0.35));
    textLine(ctx, x - 8, y + (y > 50 ? 16 : -14), 16, fg(a, 0.25), 1.6);
  });

  // Traveller
  const n = pts.length - 1;
  const fi = p * n;
  const i0 = Math.min(n - 1, Math.floor(fi));
  const f = fi - i0;
  const tx = lerp(pts[i0][0], pts[i0 + 1][0], f);
  const ty = lerp(pts[i0][1], pts[i0 + 1][1], f);
  glowOn(a, 4);
  dot(ctx, tx, ty, 3, accent());
  noGlow(a);
};

/** A wrench works a bolt; a checklist ticks off; uptime blocks fill. */
const wrenchCycle: DrawFn = (a) => {
  const { ctx, t } = a;
  const u = loop(t, 4);
  // Bolt
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * Math.PI * 2 + Math.PI / 6;
    const x = 40 + Math.cos(ang) * 9;
    const y = 36 + Math.sin(ang) * 9;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  stroke(ctx, fg(a, 0.5), 1.1);
  circ(ctx, 40, 36, 3.5);
  stroke(ctx, fg(a, 0.4), 0.9);
  // Wrench
  ctx.save();
  ctx.translate(40, 36);
  ctx.rotate(-0.5 + Math.sin(t * 2.4) * 0.45);
  ctx.lineCap = "round";
  ctx.beginPath();
  // Open jaw (wide gap facing away from the handle) so it reads as a wrench.
  ctx.arc(0, 0, 12, Math.PI * 1.25 + 1, Math.PI * 1.25 + Math.PI * 2 - 1);
  stroke(ctx, fg(a, 0.85), 4.5);
  line(ctx, 9, 9, 34, 34);
  stroke(ctx, fg(a, 0.85), 5);
  ctx.restore();

  // Checklist
  [16, 36, 56].forEach((y, i) => {
    const p = seg(u, 0.15 + i * 0.18, 0.28 + i * 0.18);
    rr(ctx, 92, y - 6, 12, 12, 3);
    stroke(ctx, p > 0 ? accent() : fg(a, 0.4), 1);
    if (p > 0) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      check(ctx, 98, y, 3.2, p);
      stroke(ctx, accent(), 1.4);
    }
    textLine(ctx, 110, y, 36 - i * 6, fg(a, p > 0 ? 0.6 : 0.3), 2);
  });
  // Uptime blocks
  for (let i = 0; i < 18; i++) {
    const on = i < Math.floor(u * 18) + 1;
    rr(ctx, 12 + i * 7.6, 82, 5.4, 10, 1.2);
    fill(ctx, on ? (i === Math.floor(u * 18) ? accent() : fg(a, 0.35)) : faint(a));
  }
};

export const growth: Partial<Record<MotifId, DrawFn>> = {
  "message-thread": messageThread,
  "voice-wave": voiceWave,
  "doc-scan": docScan,
  "star-rating": starRating,
  "creator-ring": creatorRing,
  "loop-arrow": loopArrow,
  heatmap,
  "journey-path": journeyPath,
  "wrench-cycle": wrenchCycle,
};
