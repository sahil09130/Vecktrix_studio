/**
 * PLACEHOLDER wordmarks for the "Trusted by" carousel.
 * These are NOT real clients. Replace with real names (and later real logos)
 * once you have permission to show them, and set `placeholder` to false.
 */
export type WordmarkStyle = "heavy" | "light" | "mono" | "italic" | "wide";

export interface Client {
  name: string;
  style: WordmarkStyle;
  placeholder: boolean;
}

export const clients: Client[] = [
  { name: "Brand 01", style: "heavy", placeholder: true },
  { name: "Creator 02", style: "italic", placeholder: true },
  { name: "Brand 03", style: "wide", placeholder: true },
  { name: "Studio 04", style: "light", placeholder: true },
  { name: "Creator 05", style: "mono", placeholder: true },
  { name: "Brand 06", style: "heavy", placeholder: true },
  { name: "Brand 07", style: "italic", placeholder: true },
  { name: "Creator 08", style: "wide", placeholder: true },
  { name: "Studio 09", style: "light", placeholder: true },
  { name: "Brand 10", style: "mono", placeholder: true },
];

export const clientsCopy = {
  eyebrow: "Trusted by",
  heading: "Trusted by brands and creators",
  placeholderNote:
    "Placeholder wordmarks. Real clients will appear here once confirmed.",
};
