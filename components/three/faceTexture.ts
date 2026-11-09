import * as THREE from "three";

export interface Fonts {
  display: string;
  body: string;
  mono: string;
}

/** Corner radius of the slab, in scene units. Keep in sync with RoundedBox. */
export const SLAB_RADIUS = 0.18;

export async function loadFonts(): Promise<Fonts> {
  const cs = getComputedStyle(document.documentElement);
  const get = (v: string, fb: string) => cs.getPropertyValue(v).trim() || fb;
  const fonts: Fonts = {
    display: get("--font-bricolage", "system-ui"),
    body: get("--font-dm-sans", "system-ui"),
    mono: get("--font-jetbrains", "ui-monospace"),
  };
  try {
    await Promise.all([
      document.fonts.load(`700 40px ${fonts.display}`),
      document.fonts.load(`400 20px ${fonts.body}`),
      document.fonts.load(`500 14px ${fonts.mono}`),
    ]);
  } catch {
    /* fall back to whatever is available */
  }
  return fonts;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Free area on the face for the animated illustration, as fractions of the face (y from the top). */
export interface ArtRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** What a tile face shows. Kept structural so this file doesn't depend on the scene. */
export interface FaceItem {
  title: string;
  description: string;
  label: string;
  badge: string | null;
  cta: boolean;
}

export function makeFaceTexture(opts: {
  item: FaceItem;
  w: number;
  h: number;
  fonts: Fonts;
  pxPerUnit: number;
  anisotropy: number;
}): { texture: THREE.CanvasTexture; art: ArtRect } {
  const { item, w, h, fonts, pxPerUnit } = opts;
  const { label } = item;
  const W = Math.round(w * pxPerUnit);
  const H = Math.round(h * pxPerUnit);
  const k = pxPerUnit / 200;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const r = SLAB_RADIUS * pxPerUnit;
  const pad = 26 * k;

  // Face
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, item.cta ? "#22161a" : "#161924");
  grad.addColorStop(1, "#0b0c12");
  roundRect(ctx, 0, 0, W, H, r);
  ctx.fillStyle = grad;
  ctx.fill();
  roundRect(ctx, 1.5 * k, 1.5 * k, W - 3 * k, H - 3 * k, r);
  ctx.strokeStyle = item.cta ? "rgba(255,77,46,0.6)" : "rgba(242,239,233,0.16)";
  ctx.lineWidth = (item.cta ? 3 : 2) * k;
  ctx.stroke();

  // Index and accent tick
  ctx.fillStyle = "#ff4d2e";
  ctx.fillRect(pad, pad + 4 * k, 10 * k, 10 * k);
  ctx.font = `500 ${17 * k}px ${fonts.mono}`;
  ctx.fillStyle = "#9a978f";
  ctx.textBaseline = "top";
  ctx.fillText(label, pad + 20 * k, pad + 2 * k);

  // KritCuts badge
  if (item.badge) {
    const badge = item.badge;
    ctx.font = `600 ${14 * k}px ${fonts.mono}`;
    const tw = ctx.measureText(badge).width;
    const bw = tw + 22 * k;
    const bh = 26 * k;
    const bx = W - pad - bw;
    roundRect(ctx, bx, pad - 2 * k, bw, bh, bh / 2);
    ctx.fillStyle = "rgba(255,77,46,0.14)";
    ctx.fill();
    ctx.strokeStyle = "#ff4d2e";
    ctx.lineWidth = 1.5 * k;
    ctx.stroke();
    ctx.fillStyle = "#ff4d2e";
    ctx.fillText(badge, bx + 11 * k, pad - 2 * k + 7 * k);
  }

  // Description, then name above it, anchored to the bottom
  const maxW = W - pad * 2;
  const descSize = 21 * k;
  ctx.font = `400 ${descSize}px ${fonts.body}`;
  const descLines = wrap(ctx, item.description, maxW);
  const descLH = descSize * 1.4;
  const descH = descLines.length * descLH;

  let nameSize = (w > 3 ? 54 : w > 2.4 ? 48 : 42) * k;
  let nameLines: string[] = [];
  const maxNameH = H * 0.46;
  for (let i = 0; i < 12; i++) {
    ctx.font = `700 ${nameSize}px ${fonts.display}`;
    nameLines = wrap(ctx, item.title, maxW);
    if (nameLines.length * nameSize * 1.05 <= maxNameH) break;
    nameSize -= 2 * k;
  }
  const nameLH = nameSize * 1.05;

  let y = H - pad - descH - 12 * k - nameLines.length * nameLH;
  const artTop = pad + 26 * k + 16 * k;
  const artBottom = y - 18 * k;
  const art: ArtRect = {
    x: pad / W,
    y: artTop / H,
    w: (W - pad * 2) / W,
    h: Math.max(0, artBottom - artTop) / H,
  };
  if (item.cta && artBottom - artTop > 40 * k) {
    // Big arrow in a ring, in the space where service tiles show their motif.
    const r = Math.min((artBottom - artTop) / 2, W * 0.2);
    const cx = pad + r;
    const cy = artTop + (artBottom - artTop) / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = "#ff4d2e";
    ctx.lineWidth = 3 * k;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.42, cy);
    ctx.lineTo(cx + r * 0.42, cy);
    ctx.moveTo(cx + r * 0.12, cy - r * 0.3);
    ctx.lineTo(cx + r * 0.42, cy);
    ctx.lineTo(cx + r * 0.12, cy + r * 0.3);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 4 * k;
    ctx.stroke();
  }

  ctx.fillStyle = "#f2efe9";
  ctx.font = `700 ${nameSize}px ${fonts.display}`;
  for (const l of nameLines) {
    ctx.fillText(l, pad, y);
    y += nameLH;
  }
  y += 12 * k;
  ctx.fillStyle = "#9a978f";
  ctx.font = `400 ${descSize}px ${fonts.body}`;
  for (const l of descLines) {
    ctx.fillText(l, pad, y);
    y += descLH;
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = opts.anisotropy;
  tex.needsUpdate = true;
  return { texture: tex, art };
}

let haloTexture: THREE.CanvasTexture | null = null;
export function getHaloTexture(): THREE.CanvasTexture {
  if (haloTexture) return haloTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,77,46,0.85)");
  g.addColorStop(0.45, "rgba(255,77,46,0.25)");
  g.addColorStop(1, "rgba(255,77,46,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  haloTexture = new THREE.CanvasTexture(c);
  haloTexture.colorSpace = THREE.SRGBColorSpace;
  return haloTexture;
}
