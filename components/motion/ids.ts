/**
 * Every animated motif, by id. Services in content/services.ts pick 3 of these
 * for their carousel (the first one is also used on the homepage 3D tile).
 * Adding an id here without a draw function fails the type-check in ./index.ts.
 */
export const MOTIF_IDS = [
  // Brand & web
  "brand-construct",
  "app-window",
  "browser-build",
  "cms-cards",
  "wireframe-box",
  // Content
  "phone-reactions",
  "timeline",
  "bezier-path",
  "format-morph",
  // Search
  "search-rank",
  "chat-cite",
  "doc-keywords",
  "map-pin",
  // Marketing
  "funnel",
  "calendar",
  "fan-out",
  "player-chart",
  // Automation
  "workflow",
  "pipeline",
  "agent-orbit",
  "sync",
  // Strategy and identity
  "target-rings",
  "compare-bars",
  "quote-tag",
  "story-arc",
  "swatches",
  "type-specimen",
  "guide-book",
  "deck-slides",
  "package-box",
  // Build and measure
  "camera",
  "cart",
  "speed-gauge",
  "shield",
  "link-chain",
  "ab-split",
  "dashboard",
  "tag-brackets",
  "envelope",
  // Conversation and growth
  "message-thread",
  "voice-wave",
  "doc-scan",
  "star-rating",
  "creator-ring",
  "loop-arrow",
  "heatmap",
  "journey-path",
  "wrench-cycle",
] as const;

export type MotifId = (typeof MOTIF_IDS)[number];
