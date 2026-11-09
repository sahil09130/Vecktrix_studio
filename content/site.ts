/**
 * Global site copy and settings. Edit text here, not in components.
 */
export const site = {
  name: "Vectrix Studio",
  parentName: "Vectrix",
  parentLine: "A Vectrix company",
  /** Set NEXT_PUBLIC_SITE_URL in production. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  // Hero (placeholder tagline, edit freely)
  eyebrow: "Digital growth and creative studio",
  tagline: "Content, code and campaigns that grow your brand.",
  /** The one word in the tagline that is set in the accent colour. */
  taglineHighlight: "grow",
  subline: "One studio for video, web, AI and marketing.",

  description:
    "Vectrix Studio is a digital growth and creative studio working across seven practices: brand strategy and identity, websites and digital experience, creative and content production (through KritCuts), SEO and AI search visibility, digital marketing, AI and business automation, and analytics and conversion optimisation. A Vectrix company.",

  /**
   * Company intro video, opened from the hero projector.
   * Until a video is supplied, the placeholder shows (leave src and embedUrl empty).
   * src: a self-hosted landscape file (used on tablets and desktops), kept in /public.
   * mobileSrc: an optional portrait cut, used on phones (under 768px wide).
   * Optional poster and captions (.vtt).
   * embedUrl: a YouTube (youtube-nocookie.com) or Vimeo embed URL, used instead of src.
   */
  introVideo: {
    title: "Introducing Vectrix Studio",
    watchLabel: "Watch the intro",
    /** Length of the supplied videos. Update this if the video changes. Leave empty to hide. */
    duration: "0:30",
    comingSoon: "Our introduction video is coming soon.",
    placeholderTag: "Placeholder",
    src: "/Vecktrix_studio_web.mp4",
    mobileSrc: "/vecktrix_studio_mobile.mp4",
    poster: "",
    captions: "",
    embedUrl: "",
  },

  // PLACEHOLDER: replace with the real address.
  email: "hello@vectrixstudio.example",

  // PLACEHOLDER: add real URLs. Entries with an empty href render as plain text.
  socials: [
    { label: "LinkedIn", href: "" },
    { label: "Instagram", href: "" },
    { label: "YouTube", href: "" },
  ],

  nav: [
    { label: "Services", href: "/services" },
    { label: "Trusted by", href: "/#trusted" },
    { label: "Why us", href: "/#why" },
    { label: "Partners", href: "/partners" },
    { label: "Contact", href: "/contact" },
  ],

  budgets: [
    "Not sure yet",
    "Under 1,000",
    "1,000 to 5,000",
    "5,000 to 15,000",
    "15,000 and above",
  ],
} as const;
