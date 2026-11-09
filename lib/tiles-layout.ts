import { categories } from "@/content/services";
import { featuredServices } from "@/lib/services";

/**
 * Layout of the services "chapters": for each category, a heading block then a
 * block of 3D tiles (its 3 featured services plus a "View all" tile). Both the
 * DOM (heading positions, stage height) and the 3D scene (tile positions) read
 * this, so they always line up.
 *
 * Pixel values are measured from the top of the stage. Tile slots are in scene
 * units (1 unit = 100px at z = 0), with y = -(pixels from stage top) / 100.
 */
export type TileSize = "sm" | "md" | "lg" | "xl";

const SIZES: Record<TileSize, { w: number; h: number }> = {
  sm: { w: 2.2, h: 2.4 },
  md: { w: 2.6, h: 2.8 },
  lg: { w: 3.2, h: 2.9 },
  xl: { w: 3.6, h: 3.2 },
};

/**
 * Desktop arrangement of a chapter's 4 tiles: x -1..1, y 0..1 inside the tile
 * block, z a small depth nudge. The last entry is the "View all" tile.
 * Every other chapter is mirrored left/right so the page zig-zags.
 */
const PRESET: { x: number; y: number; z: number; size: TileSize }[] = [
  { x: -0.7, y: 0.02, z: 0.2, size: "lg" },
  { x: 0.66, y: 0.12, z: -0.25, size: "md" },
  { x: -0.08, y: 0.68, z: 0.4, size: "lg" },
  { x: 0.7, y: 1, z: -0.1, size: "sm" },
];

/** Key of a chapter's "View all" tile. */
export const ctaKey = (categorySlug: string) => `cta:${categorySlug}`;

export interface Slot {
  key: string;
  x: number;
  y: number;
  z: number;
  w: number;
  h: number;
}

export interface Chapter {
  slug: string;
  headingTop: number;
  headingH: number;
  tilesTop: number;
  tilesH: number;
}

export interface Layout {
  slots: Record<string, Slot>;
  chapters: Chapter[];
  total: number;
  mobile: boolean;
}

export function computeLayout(widthPx: number, vhPx: number, mobile: boolean): Layout {
  const viewW = widthPx / 100;
  const slots: Record<string, Slot> = {};
  const chapters: Chapter[] = [];
  const headingH = Math.round(vhPx * (mobile ? 0.85 : 0.9));
  let cursor = 0;

  categories.forEach((cat, ci) => {
    const keys = [...featuredServices(cat.slug).map((s) => s.slug), ctaKey(cat.slug)];
    const headingTop = cursor;
    cursor += headingH;
    const tilesTop = cursor;
    let tilesH: number;

    if (mobile) {
      const w = Math.min(viewW * 0.66, 2.7);
      const h = w * 0.85;
      const step = h + 0.3;
      const pad = 60;
      keys.forEach((key, i) => {
        const side = (i + ci) % 2 === 0 ? -1 : 1;
        slots[key] = {
          key,
          x: side * Math.max(0, viewW / 2 - w / 2 - 0.22),
          y: -(tilesTop + pad + (h * 100) / 2 + i * step * 100) / 100,
          z: 0,
          w,
          h,
        };
      });
      tilesH = pad * 2 + keys.length * step * 100;
    } else {
      const scale = Math.min(1.2, Math.max(0.6, viewW / 14.4));
      const block = Math.max(scale, 0.75);
      tilesH = 1050 * block;
      const pad = 180 * block;
      const flip = ci % 2 === 1 ? -1 : 1;
      keys.forEach((key, i) => {
        const p = PRESET[Math.min(i, PRESET.length - 1)];
        const base = SIZES[p.size];
        const w = base.w * scale;
        const h = base.h * scale;
        const usable = viewW / 2 - w / 2 - 0.4;
        slots[key] = {
          key,
          x: p.x * flip * usable,
          y: -(tilesTop + pad + p.y * (tilesH - pad * 2)) / 100,
          z: p.z * 0.8,
          w,
          h,
        };
      });
    }

    cursor += tilesH;
    chapters.push({ slug: cat.slug, headingTop, headingH, tilesTop, tilesH });
  });

  return { slots, chapters, total: Math.round(cursor + (mobile ? 80 : 120)), mobile };
}

/** Pixel offset of a tile's centre from the top of the stage. */
export function tileOffsetPx(layout: Layout, slug: string): number {
  const slot = layout.slots[slug];
  return slot ? -slot.y * 100 : 0;
}
