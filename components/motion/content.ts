import {
  type Art,
  type DrawFn,
  accent,
  bez,
  bezPts,
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
  rand,
  rr,
  seg,
  stroke,
  textLine,
} from "./kit";
import type { MotifId } from "./ids";

function heart(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.9);
  ctx.bezierCurveTo(x - s * 1.3, y, x - s * 0.8, y - s, x, y - s * 0.3);
  ctx.bezierCurveTo(x + s * 0.8, y - s, x + s * 1.3, y, x, y + s * 0.9);
  ctx.closePath();
}

/** Vertical phone; reactions float up; the progress bar fills; engagement bars climb. */
const ugc: DrawFn = (a: Art) => {
  const { ctx, t } = a;
  const u = loop(t, 4);

  // Phone
  rr(ctx, 58, 4, 44, 92, 7);
  stroke(ctx, fg(a, 0.5));
  textLine(ctx, 74, 9, 12, faint(a), 1.6);
  // Subject
  circ(ctx, 80, 40, 9);
  stroke(ctx, fg(a, 0.45));
  ctx.beginPath();
  ctx.arc(80, 70, 18, Math.PI * 1.08, Math.PI * 1.92);
  stroke(ctx, fg(a, 0.45));
  // Caption + progress
  textLine(ctx, 64, 76, 22, fg(a, 0.3), 1.6);
  textLine(ctx, 64, 82, 14, fg(a, 0.2), 1.6);
  line(ctx, 64, 89, 96, 89);
  stroke(ctx, faint(a), 1.4);
  line(ctx, 64, 89, lerp(64, 96, u), 89);
  stroke(ctx, accent(), 1.6);
  // Side rail
  [44, 54, 64].forEach((y) => dot(ctx, 96, y, 2, fg(a, 0.35)));

  // Floating hearts
  for (let i = 0; i < 6; i++) {
    const q = (t * 0.35 + i / 6) % 1;
    const x = 112 + Math.sin(q * 6 + i) * 6 + rand(i) * 18;
    const y = 74 - q * 68;
    heart(ctx, x, y, 3 + rand(i + 9) * 2);
    fill(ctx, i % 2 ? accent(1 - q) : `rgba(242,239,233,${0.5 * (1 - q)})`);
  }

  // Engagement bars
  for (let i = 0; i < 4; i++) {
    const h = 10 + i * 12 * easeOut(seg(u, i * 0.12, 0.4 + i * 0.12));
    rr(ctx, 14 + i * 10, 90 - h, 6, h, 1.5);
    fill(ctx, i === 3 ? accent(0.9) : fg(a, 0.22));
  }
};

/** Viewer and timeline; the accent play-head scrubs; a clip slides in and snaps. */
const editing: DrawFn = (a) => {
  const { ctx, t } = a;
  const u = loop(t, 5);

  // Viewer
  rr(ctx, 10, 4, 66, 40, 4);
  stroke(ctx, fg(a, 0.45));
  ctx.beginPath();
  ctx.moveTo(39, 16);
  ctx.lineTo(50, 24);
  ctx.lineTo(39, 32);
  ctx.closePath();
  stroke(ctx, fg(a, 0.55));
  // Waveform
  for (let i = 0; i < 20; i++) {
    const h = 3 + 14 * Math.abs(Math.sin(i * 1.3 + t * 3) * Math.sin(i * 0.4));
    line(ctx, 86 + i * 3.2, 24 - h / 2, 86 + i * 3.2, 24 + h / 2);
    stroke(ctx, fg(a, 0.3), 1.2);
  }

  // Tracks
  const tracks = [54, 68, 82];
  tracks.forEach((y) => {
    line(ctx, 10, y + 5, 150, y + 5);
    stroke(ctx, faint(a), 0.6);
  });
  const clips: [number, number, number][] = [
    [0, 10, 34],
    [0, 48, 46],
    [0, 98, 30],
    [2, 10, 60],
    [2, 74, 60],
  ];
  clips.forEach(([tr, x, w]) => {
    rr(ctx, x, tracks[tr], w, 10, 2);
    fill(ctx, fg(a, 0.08));
    stroke(ctx, fg(a, 0.35), 0.9);
  });
  // Snapping clip on track 2
  const s = ease(seg(u, 0.05, 0.3));
  const cx = lerp(150, 52, s);
  rr(ctx, cx, tracks[1], 44, 10, 2);
  fill(ctx, accent(0.2));
  stroke(ctx, accent(), 1);
  if (s > 0.98 && u < 0.4) {
    line(ctx, 52, 50, 52, 92);
    ctx.setLineDash([1.5, 2]);
    stroke(ctx, accent(0.8), 0.8);
    ctx.setLineDash([]);
  }

  // Play-head
  const px = lerp(10, 150, seg(u, 0.3, 1));
  glowOn(a, 3);
  line(ctx, px, 50, px, 94);
  stroke(ctx, accent(), 1.3);
  ctx.beginPath();
  ctx.moveTo(px - 3.5, 48);
  ctx.lineTo(px + 3.5, 48);
  ctx.lineTo(px, 52);
  ctx.closePath();
  fill(ctx, accent());
  noGlow(a);
};

/** Motion path with keyframes; an accent shape eases along it with a ghost trail. */
const motion: DrawFn = (a) => {
  const { ctx, t } = a;
  const u = loop(t, 3.2);
  const p0: [number, number] = [16, 80];
  const p1: [number, number] = [56, -6];
  const p2: [number, number] = [104, 108];
  const p3: [number, number] = [146, 20];

  ctx.setLineDash([2, 3]);
  partial(ctx, bezPts(p0, p1, p2, p3), 1);
  stroke(ctx, fg(a, 0.25), 0.9);
  ctx.setLineDash([]);
  // Handles
  [
    [p0, p1],
    [p3, p2],
  ].forEach(([s, h]) => {
    line(ctx, s[0], s[1], lerp(s[0], h[0], 0.45), lerp(s[1], h[1], 0.45));
    stroke(ctx, faint(a), 0.7);
    dot(ctx, lerp(s[0], h[0], 0.45), lerp(s[1], h[1], 0.45), 1.6, fg(a, 0.35));
  });
  // Keyframes
  [p0, p3, bez(p0, p1, p2, p3, 0.5)].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.moveTo(x, y - 4);
    ctx.lineTo(x + 4, y);
    ctx.lineTo(x, y + 4);
    ctx.lineTo(x - 4, y);
    ctx.closePath();
    fill(ctx, "#0b0c12");
    stroke(ctx, fg(a, 0.7), 1);
  });

  // Ghost trail then the shape
  const drawAt = (v: number, alpha: number, main: boolean) => {
    const e = ease(Math.min(1, Math.max(0, v)));
    const [x, y] = bez(p0, p1, p2, p3, e);
    const s = main ? 6 : 5;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(e * Math.PI * 1.5);
    rr(ctx, -s, -s, s * 2, s * 2, 2.5);
    if (main) {
      glowOn(a);
      fill(ctx, accent());
      noGlow(a);
    } else stroke(ctx, accent(alpha), 0.9);
    ctx.restore();
  };
  for (let i = 4; i >= 1; i--) drawAt(u * 1.15 - i * 0.05, 0.12 * (5 - i), false);
  drawAt(u * 1.15, 1, true);

  // Mini graph editor curve
  ctx.beginPath();
  ctx.moveTo(118, 92);
  ctx.bezierCurveTo(132, 92, 134, 70, 148, 70);
  stroke(ctx, fg(a, 0.3), 0.9);
  const ge = Math.min(1, u * 1.15);
  const gp = bez([118, 92], [132, 92], [134, 70], [148, 70], ge);
  dot(ctx, gp[0], gp[1], 1.8, accent());
};

/** One creative morphs between square, story and banner formats. */
const creatives: DrawFn = (a) => {
  const { ctx, t } = a;
  const formats: [number, number][] = [
    [62, 62],
    [40, 72],
    [128, 32],
  ];
  // Faint outlines of all formats
  formats.forEach(([w, h]) => {
    rr(ctx, 80 - w / 2, 50 - h / 2, w, h, 3);
    ctx.setLineDash([2, 3]);
    stroke(ctx, faint(a), 0.7);
    ctx.setLineDash([]);
  });

  const period = 1.8;
  const k = Math.floor(t / period) % 3;
  const n = (k + 1) % 3;
  const m = ease(seg((t % period) / period, 0.55, 1));
  const w = lerp(formats[k][0], formats[n][0], m);
  const h = lerp(formats[k][1], formats[n][1], m);
  const x = 80 - w / 2;
  const y = 50 - h / 2;

  rr(ctx, x, y, w, h, 3);
  fill(ctx, "rgba(11,12,18,0.85)");
  stroke(ctx, fg(a, 0.75), 1.2);

  // Contents scale with the frame
  const wide = w > h * 1.6;
  const ir = Math.min(w, h) * (wide ? 0.28 : 0.2);
  circ(ctx, x + (wide ? ir + 6 : w / 2), y + (wide ? h / 2 : ir + 7), ir);
  stroke(ctx, fg(a, 0.4), 0.9);
  const tx = wide ? x + ir * 2 + 12 : x + 6;
  const ty = wide ? y + h / 2 - 5 : y + ir * 2 + 14;
  const tw = wide ? w - ir * 2 - 46 : w - 12;
  textLine(ctx, tx, ty, tw * 0.9, fg(a, 0.6), 2.4);
  textLine(ctx, tx, ty + 6, tw * 0.6, fg(a, 0.25), 1.6);
  // CTA pill
  const cw = Math.min(26, w * 0.4);
  glowOn(a, 2);
  rr(ctx, x + w - cw - 5, y + h - 12, cw, 7, 3.5);
  fill(ctx, accent());
  noGlow(a);
};

export const content: Partial<Record<MotifId, DrawFn>> = {
  "phone-reactions": ugc,
  "timeline": editing,
  "bezier-path": motion,
  "format-morph": creatives,
};
