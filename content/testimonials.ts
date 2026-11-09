/**
 * PLACEHOLDER testimonials. These are NOT real quotes.
 * Replace each entry with a real, approved testimonial and set
 * `placeholder` to false. The card shows a "Placeholder" tag while it is true.
 */
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  placeholder: boolean;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Placeholder testimonial. Replace this text with a real quote from a real client.",
    name: "Client name",
    role: "Role, Brand",
    placeholder: true,
  },
  {
    quote:
      "Placeholder testimonial. A short line about working with one team across video, web and marketing goes here.",
    name: "Client name",
    role: "Role, Brand",
    placeholder: true,
  },
  {
    quote:
      "Placeholder testimonial. Add a real quote about the work, the process or the result once approved.",
    name: "Creator name",
    role: "Channel or brand",
    placeholder: true,
  },
  {
    quote:
      "Placeholder testimonial. This card is sample copy only and is not feedback from a real client.",
    name: "Client name",
    role: "Role, Brand",
    placeholder: true,
  },
  {
    quote:
      "Placeholder testimonial. Replace with a real quote. Keep it short, specific and in the client's own words.",
    name: "Creator name",
    role: "Channel or brand",
    placeholder: true,
  },
  {
    quote:
      "Placeholder testimonial. Sample copy only, to be replaced before launch.",
    name: "Client name",
    role: "Role, Brand",
    placeholder: true,
  },
];

export const testimonialsCopy = {
  eyebrow: "Testimonials",
  heading: "What clients say",
  placeholderNote: "Placeholder testimonials. Real feedback will replace these.",
};
