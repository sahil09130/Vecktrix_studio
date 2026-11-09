import {
  type Art,
  type DrawFn,
  accent,
  bezPts,
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
  rand,
  rr,
  seg,
  stroke,
  textLine,
} from "./kit";
import type { MotifId } from "./ids";

/** Audience rings; people drift; the accent persona lands in the centre. */
const targetRings: DrawFn = (a: Art) => {
  const { ctx, t } = a;
  const u = loop(t, 4);
  const cx = 80;
  const cy = 50;
  [40, 28, 16].forEach((r, i) => {
    circ(ctx, cx, cy, r);
    stroke(ctx, i === 2 ? fg(a, 0.35) : faint(a), 0.9);
  });
  line(ctx, cx - 46, cy, cx + 46, cy);
  stroke(ctx, faint(a), 0.6);
  line(ctx, cx, cy - 46, cx, cy + 46);
  stroke(ctx, faint(a), 0.6);

  for (let i = 0; i < 9; i++) {
    const ang = t * 0.25 + i * 0.7;
    const r = 22 + rand(i) * 22;
    dot(ctx, cx + Math.cos(ang) * r * 1.3, cy + Math.sin(ang) * r * 0.9, 1.8, fg(a, 0.45));
  }

  const m = ease(seg(u, 0.1, 0.5));
  const px = lerp(146, cx, m);
  const py = lerp(10, cy, m);
  glowOn(a, 4);
  circ(ctx, px, py - 3, 3.2);
  fill(ctx, accent());
  ctx.beginPath();
  ctx.arc(px, py + 6, 5.5, Math.PI, 0);
  fill(ctx, accent());
  noGlow(a);
  const land = seg(u, 0.5, 0.9);
  if (land > 0) {
    circ(ctx, cx, cy, 8 + land * 30);
    stroke(ctx, accent(0.8 * (1 - land)), 1);
  }
};

/** Competitor bars race; the accent bar finishes ahead. */
const compareBars: DrawFn = (a) => {
  const { ctx } = a;
  const u = loop(a.t, 4.5);
  ctx.globalAlpha = edgeFade(u);
  const rows = [
    { y: 16, to: 0.62, sp: 0.5 },
    { y: 38, to: 0.94, sp: 0.62 },
    { y: 60, to: 0.48, sp: 0.42 },
    { y: 82, to: 0.7, sp: 0.55 },
  ];
  line(ctx, 34, 6, 34, 94);
  stroke(ctx, fg(a, 0.3), 0.8);
  rows.forEach((r, i) => {
    const me = i === 1;
    dot(ctx, 14, r.y, 3, me ? accent() : fg(a, 0.3));
    textLine(ctx, 20, r.y, 8, fg(a, 0.25), 1.6);
    const p = easeOut(seg(u, 0.08, 0.08 + r.sp));
    const w = 116 * r.to * p;
    rr(ctx, 36, r.y - 5, Math.max(0.1, w), 10, 2);
    if (me) {
      glowOn(a, 2);
      fill(ctx, accent(0.9));
      noGlow(a);
    } else fill(ctx, fg(a, 0.18));
  });
  ctx.globalAlpha = 1;
};

/** Quote marks, a line types in, an accent underline sweeps; a label tag swings. */
const quoteTag: DrawFn = (a) => {
  const { ctx, t } = a;
  const u = loop(t, 5);
  ctx.globalAlpha = edgeFade(u);
  // Quote marks
  [12, 24].forEach((x) => {
    circ(ctx, x, 20, 4.5);
    fill(ctx, fg(a, 0.6));
    ctx.beginPath();
    ctx.moveTo(x + 4.2, 21);
    ctx.quadraticCurveTo(x + 4, 30, x - 3, 33);
    stroke(ctx, fg(a, 0.6), 2.2);
  });
  textLine(ctx, 14, 50, 92 * easeOut(seg(u, 0.1, 0.35)), fg(a, 0.85), 5.5);
  textLine(ctx, 14, 64, 64 * easeOut(seg(u, 0.3, 0.5)), fg(a, 0.4), 2.4);
  const ul = ease(seg(u, 0.5, 0.65));
  if (ul > 0) {
    glowOn(a, 2);
    line(ctx, 14, 58, 14 + 92 * ul, 58);
    stroke(ctx, accent(), 1.8);
    noGlow(a);
  }
  // Tag
  ctx.save();
  ctx.translate(130, 26);
  ctx.rotate(Math.sin(t * 1.6) * 0.18);
  ctx.beginPath();
  ctx.moveTo(-8, 0);
  ctx.lineTo(8, 0);
  ctx.lineTo(8, 40);
  ctx.lineTo(0, 48);
  ctx.lineTo(-8, 40);
  ctx.closePath();
  stroke(ctx, fg(a, 0.5), 1.1);
  circ(ctx, 0, 7, 2.2);
  stroke(ctx, accent(), 1);
  textLine(ctx, -4, 20, 8, fg(a, 0.35), 1.4);
  textLine(ctx, -4, 26, 6, fg(a, 0.25), 1.4);
  ctx.restore();
  line(ctx, 130, 6, 130, 26);
  stroke(ctx, faint(a), 0.8);
  ctx.globalAlpha = 1;
};

/** A story curve draws in; its beats light up, the climax in accent. */
const storyArc: DrawFn = (a) => {
  const { ctx } = a;
  const u = loop(a.t, 5);
  ctx.globalAlpha = edgeFade(u);
  line(ctx, 10, 88, 150, 88);
  stroke(ctx, faint(a), 0.8);
  const pts = bezPts([12, 80], [60, 76], [92, 6], [148, 58], 40);
  partial(ctx, pts, 1);
  ctx.setLineDash([2, 3]);
  stroke(ctx, faint(a), 0.8);
  ctx.setLineDash([]);
  partial(ctx, pts, ease(seg(u, 0.05, 0.75)));
  ctx.lineCap = "round";
  stroke(ctx, fg(a, 0.7), 1.6);
  const beats = [0, 10, 20, 27, 40];
  beats.forEach((idx, i) => {
    const [x, y] = pts[idx];
    const on = seg(u, 0.05 + (idx / 40) * 0.7, 0.1 + (idx / 40) * 0.7);
    line(ctx, x, y, x, 88);
    ctx.setLineDash([1.5, 2.5]);
    stroke(ctx, faint(a), 0.6);
    ctx.setLineDash([]);
    const climax = i === 3;
    if (climax && on > 0) glowOn(a, 4);
    circ(ctx, x, y, climax ? 4.5 : 3);
    fill(ctx, "#0b0c12");
    stroke(ctx, on > 0 ? (climax ? accent() : fg(a, 0.8)) : faint(a), 1.1);
    if (on > 0) dot(ctx, x, y, (climax ? 2.4 : 1.4) * on, climax ? accent() : fg(a, 0.8));
    noGlow(a);
  });
  ctx.globalAlpha = 1;
};

/** Colour chips fan out from a pivot and close again. */
const swatches: DrawFn = (a) => {
  const { ctx, t } = a;
  const u = loop(t, 4);
  const open = ease(seg(u, 0.05, 0.4)) * (1 - ease(seg(u, 0.75, 1)));
  const fills = [fg(a, 0.85), fg(a, 0.5), accent(0.55), fg(a, 0.22), accent()];
  for (let i = 0; i < 5; i++) {
    const ang = (i - 2) * 0.32 * open;
    ctx.save();
    ctx.translate(80, 96);
    ctx.rotate(ang);
    rr(ctx, -14, -86, 28, 70, 3);
    fill(ctx, "#0e1017");
    stroke(ctx, fg(a, 0.4), 0.9);
    rr(ctx, -10, -82, 20, 34, 2);
    if (i === 4) glowOn(a, 2 + 4 * open);
    fill(ctx, fills[i]);
    noGlow(a);
    textLine(ctx, -9, -40, 14, fg(a, 0.35), 1.6);
    textLine(ctx, -9, -34, 9, fg(a, 0.2), 1.6);
    circ(ctx, 0, -22, 1.6);
    stroke(ctx, fg(a, 0.4), 0.7);
    ctx.restore();
  }
};

/** "Aa" on a baseline grid, cycling through weights; a type scale beside it. */
const typeSpecimen: DrawFn = (a) => {
  const { ctx, t } = a;
  const lines: [number, string][] = [
    [18, faint(a)],
    [40, faint(a)],
    [72, fg(a, 0.35)],
  ];
  lines.forEach(([y, s]) => {
    line(ctx, 8, y, 104, y);
    stroke(ctx, s, 0.7);
  });
  const weights = [300, 500, 700, 800, 600, 400];
  const w = weights[Math.floor(t / 0.9) % weights.length];
  ctx.font = `${w} 60px ${displayFont()}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = fg(a, 0.9);
  ctx.fillText("Aa", 10, 72);
  const tw = ctx.measureText("Aa").width;
  // Caret
  if (Math.floor(t * 2) % 2 === 0) {
    line(ctx, 14 + tw, 24, 14 + tw, 76);
    stroke(ctx, accent(), 1.6);
  }
  // Scale
  [7, 5.5, 4, 3, 2].forEach((h, i) => {
    textLine(ctx, 116, 16 + i * 16, 32 - i * 4, i === 0 ? accent(0.9) : fg(a, 0.4), h);
  });
  textLine(ctx, 10, 88, 40, fg(a, 0.25), 1.6);
};

/** An open guide book; a page turns, revealing swatches and rules. */
const guideBook: DrawFn = (a) => {
  const { ctx, t } = a;
  const u = loop(t, 3.4);
  const L = 18;
  const R = 142;
  const S = 80;
  const top = 10;
  const bot = 88;
  // Left page
  rr(ctx, L, top, S - L, bot - top, 3);
  stroke(ctx, fg(a, 0.45), 1);
  textLine(ctx, L + 8, 22, 26, fg(a, 0.7), 3);
  [32, 38, 44].forEach((y) => textLine(ctx, L + 8, y, 40, fg(a, 0.22), 1.6));
  [0, 1, 2].forEach((i) => {
    rr(ctx, L + 8 + i * 15, 56, 11, 11, 2);
    fill(ctx, i === 0 ? accent(0.9) : fg(a, 0.25 + i * 0.2));
  });
  // Right page
  rr(ctx, S, top, R - S, bot - top, 3);
  stroke(ctx, fg(a, 0.45), 1);
  circ(ctx, S + 20, 36, 12);
  stroke(ctx, fg(a, 0.35), 0.9);
  textLine(ctx, S + 38, 30, 16, fg(a, 0.35), 1.6);
  textLine(ctx, S + 38, 36, 12, fg(a, 0.22), 1.6);
  [58, 64, 70].forEach((y) => textLine(ctx, S + 8, y, 44, fg(a, 0.2), 1.6));

  // Turning page: scaleX from 1 (on the right) to -1 (on the left)
  const p = ease(seg(u, 0.2, 0.8));
  const sx = Math.cos(p * Math.PI);
  ctx.save();
  ctx.translate(S, 0);
  ctx.scale(sx, 1);
  rr(ctx, 0, top, R - S, bot - top, 3);
  fill(ctx, "#12141c");
  stroke(ctx, sx > 0 ? fg(a, 0.6) : accent(0.8), 1);
  textLine(ctx, 8, 22, 30, fg(a, 0.4), 2.4);
  [32, 38].forEach((y) => textLine(ctx, 8, y, 44, fg(a, 0.18), 1.6));
  ctx.restore();
  line(ctx, S, top, S, bot);
  stroke(ctx, fg(a, 0.5), 1.1);
};

/** A slide deck advances: title, chart, then key points. */
const deckSlides: DrawFn = (a) => {
  const { ctx, t } = a;
  const per = 1.6;
  const k = Math.floor(t / per) % 3;
  const v = (t % per) / per;
  const fx = 10;
  const fy = 6;
  const fw = 108;
  const fh = 62;

  ctx.save();
  rr(ctx, fx, fy, fw, fh, 4);
  ctx.clip();
  const drawSlide = (i: number, ox: number) => {
    ctx.save();
    ctx.translate(ox, 0);
    if (i === 0) {
      textLine(ctx, fx + 10, fy + 24, 64, fg(a, 0.85), 5);
      textLine(ctx, fx + 10, fy + 36, 40, fg(a, 0.35), 2);
      rr(ctx, fx + 10, fy + 44, 18, 6, 3);
      fill(ctx, accent());
    } else if (i === 1) {
      textLine(ctx, fx + 10, fy + 12, 40, fg(a, 0.6), 2.4);
      const grow = i === k ? easeOut(seg(v, 0.1, 0.6)) : 1;
      [16, 24, 20, 34, 44].forEach((h, j) => {
        const hh = h * grow;
        rr(ctx, fx + 12 + j * 18, fy + fh - 8 - hh, 10, hh, 1.5);
        fill(ctx, j === 4 ? accent(0.9) : fg(a, 0.25));
      });
    } else {
      textLine(ctx, fx + 10, fy + 12, 44, fg(a, 0.6), 2.4);
      [24, 34, 44].forEach((y, j) => {
        dot(ctx, fx + 13, fy + y, 1.8, j === 0 ? accent() : fg(a, 0.5));
        textLine(ctx, fx + 19, fy + y, 56 - j * 8, fg(a, 0.3), 1.8);
      });
    }
    ctx.restore();
  };
  const slide = ease(seg(v, 0.82, 1));
  drawSlide(k, -slide * fw);
  if (slide > 0) drawSlide((k + 1) % 3, (1 - slide) * fw);
  ctx.restore();
  rr(ctx, fx, fy, fw, fh, 4);
  stroke(ctx, fg(a, 0.55), 1.1);

  // Thumbnails
  for (let i = 0; i < 3; i++) {
    rr(ctx, 128, 6 + i * 22, 24, 16, 2);
    stroke(ctx, i === k ? accent() : fg(a, 0.25), i === k ? 1.2 : 0.8);
  }
  // Presenter bar
  textLine(ctx, fx, 80, 60, fg(a, 0.2), 1.6);
  dot(ctx, fx + 66 + (k / 2) * 40, 80, 2.4, accent());
  line(ctx, fx + 66, 80, fx + 106, 80);
  stroke(ctx, faint(a), 0.8);
};

/** An isometric box whose lid opens and closes; accent label on the front. */
const packageBox: DrawFn = (a) => {
  const { ctx, t } = a;
  const s = 34;
  const cx = 72;
  const cy = 64;
  const c30 = Math.cos(Math.PI / 6);
  const s30 = 0.5;
  const P = (x: number, y: number, z: number): [number, number] => [
    cx + (x - z) * c30 * s,
    cy + (x + z) * s30 * s - y * s,
  ];
  const h = 0.8;
  const quad = (pts: [number, number][]) => {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
  };

  // Floor shadow
  ctx.beginPath();
  ctx.ellipse(cx, cy + 34, 44, 7, 0, 0, Math.PI * 2);
  stroke(ctx, faint(a), 0.8);

  const theta = (Math.PI * 0.62) * (0.5 - 0.5 * Math.cos(t * 1.4));
  // Lid (behind front faces when open)
  const lid: [number, number][] = [
    P(0, h, 0),
    P(1, h, 0),
    P(1, h + Math.sin(theta), Math.cos(theta)),
    P(0, h + Math.sin(theta), Math.cos(theta)),
  ];
  // Inside back faces when open
  quad([P(0, 0, 0), P(1, 0, 0), P(1, h, 0), P(0, h, 0)]);
  fill(ctx, "rgba(242,239,233,0.04)");
  quad(lid);
  fill(ctx, "#12141c");
  stroke(ctx, fg(a, 0.6), 1.1);
  // Front faces
  const front: [number, number][] = [P(0, 0, 1), P(1, 0, 1), P(1, h, 1), P(0, h, 1)];
  const side: [number, number][] = [P(1, 0, 0), P(1, 0, 1), P(1, h, 1), P(1, h, 0)];
  quad(side);
  fill(ctx, "#0e1017");
  stroke(ctx, fg(a, 0.55), 1.1);
  quad(front);
  fill(ctx, "#12141c");
  stroke(ctx, fg(a, 0.7), 1.1);
  // Rim of the open top
  ctx.beginPath();
  const r1 = P(0, h, 1);
  const r2 = P(0, h, 0);
  ctx.moveTo(r1[0], r1[1]);
  ctx.lineTo(r2[0], r2[1]);
  stroke(ctx, fg(a, 0.45), 0.9);
  // Label on the front face
  const l: [number, number][] = [P(0.25, 0.25, 1), P(0.75, 0.25, 1), P(0.75, 0.55, 1), P(0.25, 0.55, 1)];
  glowOn(a, 2);
  quad(l);
  fill(ctx, accent(0.85));
  noGlow(a);

  // Dieline hint
  ctx.setLineDash([2, 3]);
  rr(ctx, 122, 20, 30, 40, 1);
  stroke(ctx, faint(a), 0.8);
  line(ctx, 122, 34, 152, 34);
  stroke(ctx, faint(a), 0.8);
  line(ctx, 122, 46, 152, 46);
  stroke(ctx, faint(a), 0.8);
  ctx.setLineDash([]);
};

export const strategy: Partial<Record<MotifId, DrawFn>> = {
  "target-rings": targetRings,
  "compare-bars": compareBars,
  "quote-tag": quoteTag,
  "story-arc": storyArc,
  swatches,
  "type-specimen": typeSpecimen,
  "guide-book": guideBook,
  "deck-slides": deckSlides,
  "package-box": packageBox,
};
