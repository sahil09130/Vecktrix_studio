/**
 * Tiny zero-gravity physics for the phone "cargo bay" bricks.
 *
 * Each brick is a capsule (a line segment with a radius), which fits a rounded
 * brick closely. There is no gravity: bricks only move when pushed or thrown,
 * collide softly with each other and with the walls, and slowly lose speed.
 * No dependencies; about 17 bodies, so the cost per step is tiny.
 */

export interface Body {
  /** Centre, px. */
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Angle, radians, and angular velocity. */
  a: number;
  w: number;
  /** Brick size, px (for painting). */
  bw: number;
  bh: number;
  /** Capsule half-length (centre to segment end) and radius. */
  hl: number;
  r: number;
  invM: number;
  invI: number;
  /** Home position in the brick wall. */
  hx: number;
  hy: number;
  /** Held by a finger: steered to (tx, ty) and treated as immovable. */
  held: boolean;
  tx: number;
  ty: number;
}

export interface Bounds {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

export interface StepOptions {
  /** Glide every brick back to its home spot. */
  restack: boolean;
  /** Reduced motion: bricks get pushed out of the way but never drift or spin. */
  drift: boolean;
}

const RESTITUTION = 0.5;
const WALL_RESTITUTION = 0.45;
const LINEAR_DAMPING = 0.45; // per second: zero-g drift that fades over a few seconds
const ANGULAR_DAMPING = 1.1;
const MAX_SPEED = 1400;
const SUBSTEPS = 2;
const ITERATIONS = 3;

export function createBody(bw: number, bh: number, hx: number, hy: number): Body {
  const r = bh / 2;
  const hl = Math.max(0, bw / 2 - r);
  const m = bw * bh * 0.001;
  const I = (m * (bw * bw + bh * bh)) / 12;
  return { x: hx, y: hy, vx: 0, vy: 0, a: 0, w: 0, bw, bh, hl, r, invM: 1 / m, invI: 1 / I, hx, hy, held: false, tx: hx, ty: hy };
}

function ends(b: Body): [number, number, number, number] {
  const ex = Math.cos(b.a) * b.hl;
  const ey = Math.sin(b.a) * b.hl;
  return [b.x - ex, b.y - ey, b.x + ex, b.y + ey];
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Closest points between segments p1-q1 and p2-q2 (Ericson, Real-Time Collision Detection). */
function closest(
  p1x: number, p1y: number, q1x: number, q1y: number,
  p2x: number, p2y: number, q2x: number, q2y: number,
): [number, number, number, number] {
  const d1x = q1x - p1x, d1y = q1y - p1y;
  const d2x = q2x - p2x, d2y = q2y - p2y;
  const rx = p1x - p2x, ry = p1y - p2y;
  const a = d1x * d1x + d1y * d1y;
  const e = d2x * d2x + d2y * d2y;
  const f = d2x * rx + d2y * ry;
  let s = 0;
  let t = 0;
  if (a <= 1e-9 && e <= 1e-9) {
    s = t = 0;
  } else if (a <= 1e-9) {
    t = clamp01(f / e);
  } else {
    const c = d1x * rx + d1y * ry;
    if (e <= 1e-9) {
      s = clamp01(-c / a);
    } else {
      const b = d1x * d2x + d1y * d2y;
      const denom = a * e - b * b;
      s = denom > 1e-9 ? clamp01((b * f - c * e) / denom) : 0;
      t = (b * s + f) / e;
      if (t < 0) {
        t = 0;
        s = clamp01(-c / a);
      } else if (t > 1) {
        t = 1;
        s = clamp01((b - c) / a);
      }
    }
  }
  return [p1x + d1x * s, p1y + d1y * s, p2x + d2x * t, p2y + d2y * t];
}

function invMass(b: Body) {
  return b.held ? 0 : b.invM;
}
function invInertia(b: Body) {
  return b.held ? 0 : b.invI;
}

function collidePair(A: Body, B: Body) {
  const [a1x, a1y, a2x, a2y] = ends(A);
  const [b1x, b1y, b2x, b2y] = ends(B);
  const [cax, cay, cbx, cby] = closest(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y);
  let nx = cbx - cax;
  let ny = cby - cay;
  const dist = Math.hypot(nx, ny);
  const pen = A.r + B.r - dist;
  if (pen <= 0) return;
  if (dist > 1e-6) {
    nx /= dist;
    ny /= dist;
  } else {
    nx = 0;
    ny = 1;
  }
  const ia = invMass(A);
  const ib = invMass(B);
  const sum = ia + ib;
  if (sum === 0) return;

  // Push apart.
  const corr = (pen * 0.8) / sum;
  A.x -= nx * corr * ia;
  A.y -= ny * corr * ia;
  B.x += nx * corr * ib;
  B.y += ny * corr * ib;

  // Bounce, with spin from off-centre hits.
  const px = (cax + nx * A.r + cbx - nx * B.r) / 2;
  const py = (cay + ny * A.r + cby - ny * B.r) / 2;
  const rax = px - A.x, ray = py - A.y;
  const rbx = px - B.x, rby = py - B.y;
  const vax = A.vx - A.w * ray, vay = A.vy + A.w * rax;
  const vbx = B.vx - B.w * rby, vby = B.vy + B.w * rbx;
  const vn = (vbx - vax) * nx + (vby - vay) * ny;
  if (vn > 0) return;
  const raN = rax * ny - ray * nx;
  const rbN = rbx * ny - rby * nx;
  const iIa = invInertia(A);
  const iIb = invInertia(B);
  const denom = sum + raN * raN * iIa + rbN * rbN * iIb;
  const j = (-(1 + RESTITUTION) * vn) / denom;
  A.vx -= j * nx * ia;
  A.vy -= j * ny * ia;
  A.w -= raN * j * iIa;
  B.vx += j * nx * ib;
  B.vy += j * ny * ib;
  B.w += rbN * j * iIb;
}

/** Keep one brick end inside the cylinder, bouncing it off the wall it crossed. */
function wallPoint(b: Body, px: number, py: number, bounds: Bounds) {
  const checks: [number, number, number][] = [
    [bounds.x0 - (px - b.r), 1, 0],
    [px + b.r - bounds.x1, -1, 0],
    [bounds.y0 - (py - b.r), 0, 1],
    [py + b.r - bounds.y1, 0, -1],
  ];
  for (const [pen, nx, ny] of checks) {
    if (pen <= 0) continue;
    b.x += nx * pen;
    b.y += ny * pen;
    if (b.held) continue;
    const rx = px - b.x, ry = py - b.y;
    const vcx = b.vx - b.w * ry, vcy = b.vy + b.w * rx;
    const vn = vcx * nx + vcy * ny;
    if (vn >= 0) continue;
    const rN = rx * ny - ry * nx;
    const denom = b.invM + rN * rN * b.invI;
    const j = (-(1 + WALL_RESTITUTION) * vn) / denom;
    b.vx += j * nx * b.invM;
    b.vy += j * ny * b.invM;
    b.w += rN * j * b.invI;
  }
}

const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/**
 * Advance the world by dt seconds. Returns true when everything is at rest
 * (nothing held, nothing moving, restack finished), so the caller can stop
 * its animation loop.
 */
export function step(bodies: Body[], bounds: Bounds, dt: number, opts: StepOptions): boolean {
  if (opts.restack) {
    const k = 1 - Math.exp(-dt * 7);
    let done = true;
    for (const b of bodies) {
      b.held = false;
      b.x += (b.hx - b.x) * k;
      b.y += (b.hy - b.y) * k;
      b.a = wrapAngle(b.a) * (1 - k);
      b.vx = b.vy = b.w = 0;
      if (Math.abs(b.hx - b.x) > 0.5 || Math.abs(b.hy - b.y) > 0.5 || Math.abs(b.a) > 0.005) done = false;
    }
    if (done) {
      for (const b of bodies) {
        b.x = b.hx;
        b.y = b.hy;
        b.a = 0;
      }
    }
    return done;
  }

  const h = dt / SUBSTEPS;
  for (let s = 0; s < SUBSTEPS; s++) {
    for (const b of bodies) {
      if (b.held) {
        // Follow the finger; velocity comes from the motion so pushes feel right.
        const k = Math.min(1, h * 30);
        const nx = b.x + (b.tx - b.x) * k;
        const ny = b.y + (b.ty - b.y) * k;
        b.vx = (nx - b.x) / h;
        b.vy = (ny - b.y) / h;
        b.x = nx;
        b.y = ny;
        b.w *= 0.8;
        continue;
      }
      b.x += b.vx * h;
      b.y += b.vy * h;
      b.a += b.w * h;
      const ld = Math.max(0, 1 - LINEAR_DAMPING * h);
      const ad = Math.max(0, 1 - ANGULAR_DAMPING * h);
      b.vx *= ld;
      b.vy *= ld;
      b.w *= ad;
      const sp = Math.hypot(b.vx, b.vy);
      if (sp > MAX_SPEED) {
        b.vx *= MAX_SPEED / sp;
        b.vy *= MAX_SPEED / sp;
      }
    }
    for (let it = 0; it < ITERATIONS; it++) {
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) collidePair(bodies[i], bodies[j]);
      }
      for (const b of bodies) {
        const [x1, y1, x2, y2] = ends(b);
        wallPoint(b, x1, y1, bounds);
        wallPoint(b, x2, y2, bounds);
      }
    }
    if (!opts.drift) {
      for (const b of bodies) {
        if (b.held) continue;
        b.vx = b.vy = b.w = 0;
      }
    }
  }

  let rest = true;
  for (const b of bodies) {
    if (b.held) return false;
    if (Math.hypot(b.vx, b.vy) > 4 || Math.abs(b.w) > 0.03) rest = false;
  }
  if (rest) {
    for (const b of bodies) b.vx = b.vy = b.w = 0;
  }
  return rest;
}
