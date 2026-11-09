import {
  type Art,
  type DrawFn,
  accent,
  bez,
  bezPts,
  check,
  circ,
  dot,
  ease,
  easeOut,
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

function spark(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.quadraticCurveTo(x, y, x + s, y);
  ctx.quadraticCurveTo(x, y, x, y + s);
  ctx.quadraticCurveTo(x, y, x - s, y);
  ctx.quadraticCurveTo(x, y, x, y - s);
}

/** Trigger -> AI -> three actions; an accent pulse runs the workflow. */
const marketingAutomation: DrawFn = (a: Art) => {
  const { ctx, t } = a;
  const u = loop(t, 3);
  const trig: [number, number] = [36, 50];
  const ai: [number, number] = [72, 50];
  const acts: [number, number][] = [
    [116, 18],
    [116, 50],
    [116, 82],
  ];

  line(ctx, trig[0], trig[1], ai[0] - 13, ai[1]);
  stroke(ctx, fg(a, 0.3), 1);
  const curves = acts.map(
    (p) => [[ai[0] + 13, ai[1]], [96, ai[1]], [96, p[1]], [p[0], p[1]]] as [number, number][],
  );
  curves.forEach((c) => {
    partial(ctx, bezPts(c[0], c[1], c[2], c[3]), 1);
    stroke(ctx, fg(a, 0.3), 1);
  });

  // Trigger node
  const firstHalf = u < 0.45;
  rr(ctx, 8, 40, 28, 20, 4);
  fill(ctx, "#0b0c12");
  stroke(ctx, u < 0.1 ? accent() : fg(a, 0.55), 1.1);
  // bolt
  ctx.beginPath();
  ctx.moveTo(24, 43);
  ctx.lineTo(18, 51);
  ctx.lineTo(23, 51);
  ctx.lineTo(20, 57);
  ctx.lineTo(27, 48);
  ctx.lineTo(22, 48);
  ctx.closePath();
  fill(ctx, fg(a, 0.6));

  // AI node
  const aiLit = seg(u, 0.35, 0.45) * (1 - seg(u, 0.6, 0.7));
  circ(ctx, ai[0], ai[1], 13);
  fill(ctx, "#0b0c12");
  stroke(ctx, aiLit > 0.1 ? accent() : fg(a, 0.6), 1.2);
  ctx.save();
  ctx.translate(ai[0], ai[1]);
  ctx.rotate(t * 0.8);
  ctx.setLineDash([2, 3]);
  circ(ctx, 0, 0, 17);
  stroke(ctx, faint(a), 0.8);
  ctx.restore();
  glowOn(a, 2 + 6 * aiLit);
  spark(ctx, ai[0], ai[1], 6);
  fill(ctx, accent(0.6 + 0.4 * aiLit));
  noGlow(a);

  // Action nodes
  acts.forEach((p, i) => {
    const lit = seg(u, 0.88, 0.95);
    rr(ctx, p[0], p[1] - 8, 36, 16, 4);
    fill(ctx, "#0b0c12");
    stroke(ctx, lit > 0 ? accent(0.5 + 0.5 * lit) : fg(a, 0.5), 1.1);
    textLine(ctx, p[0] + 6, p[1] - 2, 22 - i * 4, fg(a, 0.45), 1.6);
    textLine(ctx, p[0] + 6, p[1] + 3, 14, fg(a, 0.2), 1.6);
  });

  // Pulse
  glowOn(a, 4);
  if (firstHalf) {
    const p = ease(seg(u, 0.05, 0.4));
    dot(ctx, lerp(trig[0], ai[0] - 13, p), trig[1], 2.6, accent());
  } else if (u < 0.92) {
    const p = ease(seg(u, 0.5, 0.9));
    curves.forEach((c) => {
      const [x, y] = bez(c[0], c[1], c[2], c[3], p);
      dot(ctx, x, y, 2.4, accent());
    });
  }
  noGlow(a);
};

/** Pipeline board; the deal card hops stage to stage and closes as won. */
const sales: DrawFn = (a) => {
  const { ctx } = a;
  const u = loop(a.t, 6);
  const colX = (i: number) => 8 + i * 37;

  for (let i = 0; i < 4; i++) {
    rr(ctx, colX(i), 4, 33, 92, 4);
    stroke(ctx, i === 3 ? fg(a, 0.35) : faint(a), 0.9);
    textLine(ctx, colX(i) + 5, 11, i === 3 ? 10 : 16, i === 3 ? accent(0.9) : fg(a, 0.4), 1.8);
    [60, 76].forEach((y, j) => {
      if ((i + j) % 3 === 2) return;
      rr(ctx, colX(i) + 4, y, 25, 12, 2);
      stroke(ctx, fg(a, 0.2), 0.8);
      textLine(ctx, colX(i) + 8, y + 6, 12, fg(a, 0.2), 1.4);
    });
  }

  // Stage the deal is in: hops at fixed beats.
  const beats = [0.12, 0.32, 0.52];
  let pos = 0;
  beats.forEach((b) => (pos += ease(seg(u, b, b + 0.1))));
  const x = colX(0) + 4 + pos * 37;
  const lift = beats.reduce((m, b) => Math.max(m, Math.sin(seg(u, b, b + 0.1) * Math.PI)), 0);
  const y = 20 - lift * 6;
  const won = seg(u, 0.66, 0.74);
  const fade = 1 - seg(u, 0.92, 1);

  ctx.globalAlpha = Math.min(fade, seg(u, 0, 0.06));
  glowOn(a, 2 + lift * 6 + won * 4);
  rr(ctx, x, y, 25, 30, 3);
  fill(ctx, won > 0 ? accent(0.15 + 0.75 * won) : "#0b0c12");
  stroke(ctx, accent(), 1.1);
  noGlow(a);
  textLine(ctx, x + 4, y + 7, 14, won > 0.5 ? "#0b0c12" : fg(a, 0.75), 1.8);
  textLine(ctx, x + 4, y + 13, 10, won > 0.5 ? "rgba(11,12,18,0.6)" : fg(a, 0.3), 1.6);
  if (won > 0) {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    check(ctx, x + 12.5, y + 22, 4, seg(u, 0.72, 0.8));
    stroke(ctx, "#0b0c12", 1.8);
  }
  ctx.globalAlpha = 1;
};

/** An agent core with tool nodes in orbit; a spark hops out to each tool and back. */
const agents: DrawFn = (a) => {
  const { ctx, t } = a;
  const cx = 80;
  const cy = 50;
  const n = 5;
  const rot = t * 0.25;
  const nodes = Array.from({ length: n }, (_, i) => {
    const ang = rot + (i / n) * Math.PI * 2;
    return [cx + Math.cos(ang) * 58, cy + Math.sin(ang) * 36] as [number, number];
  });

  ctx.beginPath();
  ctx.ellipse(cx, cy, 58, 36, 0, 0, Math.PI * 2);
  ctx.setLineDash([2, 3]);
  stroke(ctx, faint(a), 0.7);
  ctx.setLineDash([]);

  const hop = 0.9;
  const k = Math.floor(t / hop) % n;
  const p = (t % hop) / hop;

  nodes.forEach(([x, y], i) => {
    line(ctx, cx, cy, x, y);
    stroke(ctx, fg(a, 0.14), 0.8);
    const lit = i === k && p > 0.4 && p < 0.7;
    rr(ctx, x - 7, y - 7, 14, 14, 3.5);
    fill(ctx, "#0b0c12");
    stroke(ctx, lit ? accent() : fg(a, 0.5), 1.1);
    dot(ctx, x, y, 1.8, lit ? accent() : fg(a, 0.45));
  });

  // Core
  circ(ctx, cx, cy, 15);
  fill(ctx, "#0b0c12");
  stroke(ctx, fg(a, 0.7), 1.3);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-t * 0.9);
  rr(ctx, -6, -6, 12, 12, 2);
  stroke(ctx, accent(0.9), 1.1);
  ctx.restore();
  dot(ctx, cx, cy, 2.2, accent());

  // Spark: out and back
  const [nx, ny] = nodes[k];
  const out = p < 0.5 ? easeOut(p * 2) : 1 - ease((p - 0.5) * 2);
  glowOn(a, 4);
  dot(ctx, lerp(cx, nx, out), lerp(cy, ny, out), 2.6, accent());
  noGlow(a);
};

/** Two systems side by side; data packets cross both ways; a sync tick lands. */
const crm: DrawFn = (a) => {
  const { ctx, t } = a;
  const u = loop(t, 3);

  const block = (x: number, accentRow: number) => {
    rr(ctx, x, 18, 46, 64, 5);
    stroke(ctx, fg(a, 0.55), 1.1);
    line(ctx, x, 30, x + 46, 30);
    stroke(ctx, faint(a), 0.8);
    textLine(ctx, x + 6, 24, 18, fg(a, 0.45), 2);
    for (let r = 0; r < 4; r++) {
      const y = 38 + r * 11;
      dot(ctx, x + 8, y, 2, r === accentRow ? accent() : fg(a, 0.3));
      textLine(ctx, x + 14, y, 24 - (r % 2) * 8, fg(a, 0.22), 1.6);
    }
  };
  block(8, Math.floor(u * 4) % 4);
  block(106, (Math.floor(u * 4) + 2) % 4);

  // Lanes
  ctx.setLineDash([2, 3]);
  line(ctx, 58, 42, 102, 42);
  stroke(ctx, fg(a, 0.25), 0.9);
  line(ctx, 58, 58, 102, 58);
  stroke(ctx, fg(a, 0.25), 0.9);
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(98, 39);
  ctx.lineTo(102, 42);
  ctx.lineTo(98, 45);
  ctx.moveTo(62, 55);
  ctx.lineTo(58, 58);
  ctx.lineTo(62, 61);
  stroke(ctx, fg(a, 0.45), 1);

  // Packets
  glowOn(a, 3);
  for (let i = 0; i < 2; i++) {
    const q = (u + i * 0.5) % 1;
    rr(ctx, lerp(58, 96, q), 39, 6, 6, 1.5);
    fill(ctx, accent(Math.min(1, q * 6, (1 - q) * 6)));
    const r = (u + 0.25 + i * 0.5) % 1;
    rr(ctx, lerp(96, 58, r), 55, 6, 6, 1.5);
    fill(ctx, `rgba(242,239,233,${0.7 * Math.min(1, r * 6, (1 - r) * 6)})`);
  }
  noGlow(a);

  // Sync badge
  const b = 0.5 + 0.5 * Math.sin(t * 2.1);
  circ(ctx, 80, 80, 8);
  fill(ctx, "#0b0c12");
  stroke(ctx, accent(0.5 + 0.5 * b), 1.1);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  check(ctx, 80, 80, 3.4);
  stroke(ctx, accent(), 1.4);
};

export const automation: Partial<Record<MotifId, DrawFn>> = {
  "workflow": marketingAutomation,
  "pipeline": sales,
  "agent-orbit": agents,
  "sync": crm,
};
