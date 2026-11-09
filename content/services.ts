import type { MotifId } from "@/components/motion/ids";

/**
 * Service categories ("practices") and their services.
 *
 * Used by: the homepage 3D chapters, /services, /services/[category],
 * /services/[category]/[service], the footer, the contact form, the sitemap,
 * JSON-LD and /llms.txt.
 *
 * Editing:
 * - Each row is [slug, name, one-line description, [3 motif ids]].
 *   The 3 motifs are the slides of the service's animated carousel; the first
 *   one is also drawn on its homepage 3D tile. Motif ids are listed in
 *   components/motion/ids.ts (a typo fails the type-check).
 * - `featured` on a category picks the 3 services shown as 3D tiles on the
 *   homepage. The chapter always ends with a "View all" tile.
 * - To point a service at its own website, add it to `serviceUrls` below.
 *   Until then it links to /services/[category]/[service] ("launching soon").
 * - Every service in "02. Creative & Content Production" is delivered by
 *   KritCuts by Vectrix Studio (see CLAUDE.md). Everything else is Vectrix Studio.
 */
export type ServiceGroup = "KritCuts" | "Vectrix Studio";

export interface Category {
  slug: string;
  number: string;
  title: string;
  intro: string;
  group: ServiceGroup;
  /** Exactly 3 service slugs from this category, shown as homepage tiles. */
  featured: [string, string, string];
}

export interface Service {
  slug: string;
  name: string;
  description: string;
  category: string;
  group: ServiceGroup;
  /** The service's own website. Empty until it launches. */
  href: string;
  motifs: [MotifId, MotifId, MotifId];
}

export const servicesCopy = {
  eyebrow: "Services",
  heading: "Seven practices. One studio.",
  intro: "Scroll through each practice, open a service, or see everything a practice covers.",
  indexHeading: "Everything we do",
  indexIntro: "Seven practices, each with its own specialists. Open a practice to see every service with a short animated walkthrough.",
};

/** Set a service's own website here, by slug, when it launches. */
export const serviceUrls: Record<string, string> = {};

type Row = [slug: string, name: string, description: string, motifs: [MotifId, MotifId, MotifId]];

export const categories: Category[] = [
  {
    slug: "website-digital-experience",
    number: "01",
    title: "Website & Digital Experience",
    intro: "Building the company's digital infrastructure.",
    group: "Vectrix Studio",
    featured: ["corporate-website-development", "custom-web-application-development", "ui-ux-design"],
  },
  {
    slug: "creative-content-production",
    number: "02",
    title: "Creative & Content Production",
    intro: "Creating content that builds brand awareness and engagement.",
    group: "KritCuts",
    featured: ["ugc-video-production", "motion-graphics-2d-animation", "3d-product-visualisation-rendering"],
  },
  {
    slug: "seo-ai-search-visibility",
    number: "03",
    title: "SEO & AI Search Visibility",
    intro: "Making businesses discoverable on search engines and AI platforms.",
    group: "Vectrix Studio",
    featured: ["technical-seo", "llm-seo", "local-seo"],
  },
  {
    slug: "digital-marketing-brand-growth",
    number: "04",
    title: "Digital Marketing & Brand Growth",
    intro: "Generating awareness, traffic, leads and customers.",
    group: "Vectrix Studio",
    featured: ["meta-ads-management", "performance-marketing", "influencer-marketing"],
  },
  {
    slug: "ai-business-automation",
    number: "05",
    title: "AI & Business Automation",
    intro: "Helping companies automate marketing, operations and customer interactions.",
    group: "Vectrix Studio",
    featured: ["ai-chatbot-development", "ai-voice-calling-agents", "crm-implementation"],
  },
  {
    slug: "analytics-conversion-growth",
    number: "06",
    title: "Analytics, Conversion & Growth Optimisation",
    intro: "Measuring performance and improving business outcomes.",
    group: "Vectrix Studio",
    featured: ["ga4-implementation", "conversion-rate-optimisation", "marketing-performance-dashboards"],
  },
  {
    slug: "brand-strategy-identity",
    number: "07",
    title: "Brand Strategy & Identity",
    intro: "Building a company's identity and market positioning.",
    group: "Vectrix Studio",
    featured: ["brand-strategy-positioning", "logo-design", "visual-identity-design"],
  },
];

const rows: Record<string, Row[]> = {
  "brand-strategy-identity": [
    ["brand-strategy-positioning", "Brand Strategy & Positioning", "Where the brand sits in its market, who it is for and what sets it apart.", ["target-rings", "compare-bars", "story-arc"]],
    ["market-competitor-research", "Market & Competitor Research", "Research into the market, the competition and the gaps between them.", ["compare-bars", "search-rank", "dashboard"]],
    ["target-audience-research", "Target Audience Research", "Who the customers are, what they need and how they decide.", ["journey-path", "message-thread", "target-rings"]],
    ["brand-naming-tagline-creation", "Brand Naming & Tagline Creation", "Names and taglines developed, tested and shortlisted.", ["quote-tag", "type-specimen", "compare-bars"]],
    ["brand-messaging-storytelling", "Brand Messaging & Storytelling", "The brand story, voice and key messages for every channel.", ["story-arc", "quote-tag", "fan-out"]],
    ["logo-design", "Logo Design", "Logo concepts, refinement and final marks for every use.", ["brand-construct", "bezier-path", "format-morph"]],
    ["visual-identity-design", "Visual Identity Design", "The full visual system: colour, type, imagery and layout.", ["swatches", "type-specimen", "format-morph"]],
    ["brand-guidelines-brand-books", "Brand Guidelines & Brand Books", "Rules and examples so the brand is applied consistently.", ["guide-book", "swatches", "type-specimen"]],
    ["typography-colour-systems", "Typography & Colour Systems", "Type scales and colour palettes built for screen and print.", ["type-specimen", "swatches", "brand-construct"]],
    ["corporate-presentation-pitch-deck-design", "Corporate Presentation & Pitch Deck Design", "Investor, sales and company decks designed to be presented.", ["deck-slides", "story-arc", "dashboard"]],
    ["packaging-design", "Packaging Design", "Packaging concepts, dielines and print-ready artwork.", ["package-box", "wireframe-box", "swatches"]],
    ["copywriting-brand-communication", "Copywriting & Brand Communication", "Website, campaign and brand copy in one consistent voice.", ["doc-keywords", "quote-tag", "message-thread"]],
  ],
  "website-digital-experience": [
    ["corporate-website-development", "Corporate Website Development", "Company websites that explain the business clearly.", ["browser-build", "cms-cards", "speed-gauge"]],
    ["landing-page-development", "Landing Page Development", "Focused pages built for one campaign and one action.", ["ab-split", "funnel", "browser-build"]],
    ["e-commerce-website-development", "E-commerce Website Development", "Online stores with catalogue, checkout and payments.", ["cart", "browser-build", "funnel"]],
    ["custom-web-application-development", "Custom Web Application Development", "Portals, dashboards and tools built around your process.", ["app-window", "workflow", "sync"]],
    ["ui-ux-design", "UI/UX Design", "Research, user flows, wireframes and interface design.", ["journey-path", "app-window", "heatmap"]],
    ["website-redesign-modernisation", "Website Redesign & Modernisation", "Rebuilding an existing site on a modern design and stack.", ["browser-build", "format-morph", "speed-gauge"]],
    ["cms-development-integration", "CMS Development & Integration", "Content management set up so your team can edit the site.", ["cms-cards", "sync", "browser-build"]],
    ["wordpress-development", "WordPress Development", "Custom WordPress themes, plugins and set-ups.", ["wrench-cycle", "cms-cards", "browser-build"]],
    ["shopify-development", "Shopify Development", "Shopify stores, themes and app integrations.", ["cart", "cms-cards", "app-window"]],
    ["webflow-development", "Webflow Development", "Webflow sites with CMS collections and interactions.", ["browser-build", "bezier-path", "cms-cards"]],
    ["headless-cms-implementation", "Headless CMS Implementation", "A content API feeding a fast, custom front end.", ["cms-cards", "sync", "tag-brackets"]],
    ["website-maintenance-support", "Website Maintenance & Support", "Updates, fixes, backups and monitoring after launch.", ["wrench-cycle", "shield", "speed-gauge"]],
    ["website-performance-optimisation", "Website Performance Optimisation", "Faster load times and healthier Core Web Vitals.", ["speed-gauge", "dashboard", "browser-build"]],
    ["website-security-technical-optimisation", "Website Security & Technical Optimisation", "Hardening, updates and technical clean-up.", ["shield", "wrench-cycle", "tag-brackets"]],
    ["conversion-focused-website-development", "Conversion-Focused Website Development", "Sites structured around enquiries, sign-ups and sales.", ["funnel", "heatmap", "ab-split"]],
  ],
  "creative-content-production": [
    ["ugc-video-production", "UGC Video Production", "Creator-style videos made for ads and social.", ["phone-reactions", "creator-ring", "timeline"]],
    ["viral-style-short-form-video-editing", "Viral-Style Short-Form Video Editing", "Fast-paced edits with hooks, captions and pacing for social.", ["timeline", "phone-reactions", "bezier-path"]],
    ["instagram-reels-youtube-shorts-editing", "Instagram Reels & YouTube Shorts Editing", "Vertical edits sized and paced for each platform.", ["format-morph", "phone-reactions", "timeline"]],
    ["youtube-long-form-video-editing", "YouTube Long-Form Video Editing", "Long-form edits with structure, graphics and chapters.", ["player-chart", "story-arc", "timeline"]],
    ["corporate-video-production", "Corporate Video Production", "Company films, interviews and internal videos.", ["camera", "timeline", "story-arc"]],
    ["product-advertisement-videos", "Product Advertisement Videos", "Product ads made for paid social and video platforms.", ["timeline", "format-morph", "camera"]],
    ["explainer-videos", "Explainer Videos", "Short videos that explain a product or idea simply.", ["story-arc", "bezier-path", "player-chart"]],
    ["motion-graphics-2d-animation", "Motion Graphics & 2D Animation", "Animated graphics, titles and 2D sequences.", ["bezier-path", "format-morph", "timeline"]],
    ["3d-product-modelling", "3D Product Modelling", "Accurate 3D models of products from drawings or samples.", ["wireframe-box", "package-box", "bezier-path"]],
    ["3d-product-visualisation-rendering", "3D Product Visualisation & Rendering", "Photoreal renders and product animations from 3D models.", ["camera", "swatches", "wireframe-box"]],
    ["product-photography", "Product Photography", "Studio and lifestyle photography of products.", ["package-box", "swatches", "camera"]],
    ["graphic-design", "Graphic Design", "Print and digital design for campaigns and brand assets.", ["brand-construct", "swatches", "format-morph"]],
    ["social-media-creatives", "Social Media Creatives", "Post, story and carousel designs for social channels.", ["format-morph", "phone-reactions", "calendar"]],
    ["ad-creative-production", "Ad Creative Production", "Static and video ad variations ready for testing.", ["ab-split", "funnel", "format-morph"]],
    ["thumbnails-cover-designs", "Thumbnails & Cover Designs", "Thumbnails and covers designed to stand out in a feed.", ["player-chart", "format-morph", "ab-split"]],
    ["infographics-illustrations", "Infographics & Illustrations", "Data, process and concept visuals drawn to explain.", ["dashboard", "bezier-path", "guide-book"]],
    ["video-repurposing-content-distribution", "Video Repurposing & Content Distribution", "One video turned into clips and formats for every channel.", ["fan-out", "format-morph", "calendar"]],
  ],
  "seo-ai-search-visibility": [
    ["technical-seo", "Technical SEO", "Crawling, indexing, site structure and page speed.", ["tag-brackets", "speed-gauge", "search-rank"]],
    ["on-page-seo", "On-Page SEO", "Titles, headings, content and internal links, page by page.", ["doc-keywords", "search-rank", "tag-brackets"]],
    ["off-page-seo-link-building", "Off-Page SEO & Link Building", "Earning relevant links and mentions from other sites.", ["link-chain", "search-rank", "star-rating"]],
    ["local-seo", "Local SEO", "Maps, Business Profile and local search visibility.", ["map-pin", "star-rating", "search-rank"]],
    ["e-commerce-seo", "E-commerce SEO", "Category and product page SEO for online stores.", ["cart", "search-rank", "doc-keywords"]],
    ["content-seo", "Content SEO", "Content planned and written around how people search.", ["doc-keywords", "search-rank", "story-arc"]],
    ["keyword-research", "Keyword Research", "Finding the terms customers use and how hard each is to win.", ["search-rank", "compare-bars", "target-rings"]],
    ["seo-audits", "SEO Audits", "A full review of technical, content and link health.", ["doc-scan", "tag-brackets", "dashboard"]],
    ["llm-seo", "LLM SEO", "Making your content easy for large language models to find and cite.", ["chat-cite", "doc-keywords", "link-chain"]],
    ["generative-engine-optimisation", "Generative Engine Optimisation (GEO)", "Visibility inside AI-generated answers and overviews.", ["agent-orbit", "search-rank", "chat-cite"]],
    ["answer-engine-optimisation", "Answer Engine Optimisation (AEO)", "Structuring content so it answers questions directly.", ["message-thread", "doc-keywords", "chat-cite"]],
    ["ai-search-visibility-optimisation", "AI Search Visibility Optimisation", "Tracking and improving how AI platforms describe your brand.", ["chat-cite", "dashboard", "target-rings"]],
    ["website-content-optimisation", "Website Content Optimisation", "Improving existing pages for search and readability.", ["doc-keywords", "ab-split", "browser-build"]],
    ["blog-article-writing", "Blog & Article Writing", "Researched articles written for readers and search.", ["guide-book", "calendar", "doc-keywords"]],
    ["topical-authority-building", "Topical Authority Building", "Content clusters that cover a subject in depth.", ["link-chain", "doc-keywords", "fan-out"]],
    ["seo-performance-monitoring", "SEO Performance Monitoring", "Rankings, traffic and visibility tracked over time.", ["dashboard", "search-rank", "loop-arrow"]],
  ],
  "digital-marketing-brand-growth": [
    ["meta-ads-management", "Meta Ads Management (Facebook & Instagram)", "Campaigns, creatives and budgets across Facebook and Instagram.", ["funnel", "format-morph", "dashboard"]],
    ["google-ads-management", "Google Ads Management", "Search, Performance Max and display campaigns.", ["search-rank", "funnel", "dashboard"]],
    ["youtube-advertising", "YouTube Advertising", "Video ad campaigns on YouTube.", ["player-chart", "funnel", "target-rings"]],
    ["performance-marketing", "Performance Marketing", "Paid campaigns run against cost-per-lead and revenue targets.", ["dashboard", "funnel", "ab-split"]],
    ["social-media-strategy", "Social Media Strategy", "Channels, content pillars and goals for social.", ["target-rings", "calendar", "story-arc"]],
    ["social-media-account-management", "Social Media Account Management", "Day-to-day posting and running of your accounts.", ["calendar", "message-thread", "phone-reactions"]],
    ["social-media-content-planning", "Social Media Content Planning", "Monthly content plans and calendars.", ["fan-out", "format-morph", "calendar"]],
    ["content-marketing", "Content Marketing", "Content that attracts and educates your audience.", ["doc-keywords", "story-arc", "fan-out"]],
    ["influencer-marketing", "Influencer Marketing", "Finding influencers and running partnerships with them.", ["creator-ring", "star-rating", "fan-out"]],
    ["creator-ugc-campaign-management", "Creator & UGC Campaign Management", "Briefing, managing and approving creator content.", ["phone-reactions", "pipeline", "creator-ring"]],
    ["lead-generation-campaigns", "Lead Generation Campaigns", "Campaigns built to capture qualified enquiries.", ["funnel", "pipeline", "envelope"]],
    ["email-marketing", "Email Marketing", "Newsletters, campaigns and automated sequences.", ["envelope", "calendar", "ab-split"]],
    ["whatsapp-marketing", "WhatsApp Marketing", "Broadcasts and campaigns over WhatsApp Business.", ["message-thread", "fan-out", "envelope"]],
    ["marketing-campaign-management", "Marketing Campaign Management", "Planning, launching and running multi-channel campaigns.", ["calendar", "dashboard", "workflow"]],
    ["retargeting-remarketing", "Retargeting & Remarketing", "Re-engaging people who visited but did not act.", ["loop-arrow", "funnel", "format-morph"]],
    ["community-management", "Community Management", "Replying to, moderating and growing your community.", ["message-thread", "creator-ring", "star-rating"]],
    ["online-reputation-management", "Online Reputation Management", "Monitoring and responding to reviews and mentions.", ["star-rating", "message-thread", "shield"]],
  ],
  "ai-business-automation": [
    ["ai-marketing-automation", "AI Marketing Automation", "AI-assisted campaigns, segments and content workflows.", ["workflow", "envelope", "fan-out"]],
    ["ai-sales-automation", "AI Sales Automation", "AI that qualifies, follows up and updates the pipeline.", ["pipeline", "workflow", "message-thread"]],
    ["ai-chatbot-development", "AI Chatbot Development", "Chatbots for websites and messaging apps, trained on your content.", ["message-thread", "agent-orbit", "chat-cite"]],
    ["ai-voice-calling-agents", "AI Voice Calling Agents", "Voice agents that answer and make calls.", ["voice-wave", "agent-orbit", "calendar"]],
    ["lead-qualification-automation", "Lead Qualification Automation", "Scoring and routing leads automatically.", ["funnel", "workflow", "pipeline"]],
    ["automated-lead-follow-ups", "Automated Lead Follow-ups", "Timely follow-ups by email, SMS or WhatsApp.", ["envelope", "message-thread", "loop-arrow"]],
    ["crm-implementation", "CRM Implementation", "Choosing, setting up and migrating to a CRM.", ["sync", "pipeline", "dashboard"]],
    ["crm-customisation-integration", "CRM Customisation & Integration", "Custom fields, pipelines and connections to your tools.", ["workflow", "tag-brackets", "sync"]],
    ["whatsapp-automation", "WhatsApp Automation", "Automated WhatsApp flows, replies and notifications.", ["message-thread", "workflow", "agent-orbit"]],
    ["email-automation", "Email Automation", "Triggered email sequences based on behaviour.", ["envelope", "workflow", "loop-arrow"]],
    ["appointment-booking-automation", "Appointment Booking Automation", "Booking, reminders and rescheduling without manual work.", ["calendar", "message-thread", "sync"]],
    ["ai-customer-support-agents", "AI Customer Support Agents", "AI agents that resolve common support questions.", ["agent-orbit", "message-thread", "doc-scan"]],
    ["marketing-workflow-automation", "Marketing Workflow Automation", "Connecting marketing tools so routine tasks run themselves.", ["workflow", "calendar", "sync"]],
    ["sales-pipeline-automation", "Sales Pipeline Automation", "Deals that move stages and trigger tasks automatically.", ["pipeline", "sync", "dashboard"]],
    ["intelligent-document-processing", "Intelligent Document Processing", "Extracting data from invoices, forms and other documents.", ["doc-scan", "workflow", "sync"]],
    ["custom-ai-agent-development", "Custom AI Agent Development", "Agents built for your own processes and tools.", ["agent-orbit", "workflow", "tag-brackets"]],
    ["third-party-api-integrations", "Third-Party API Integrations", "Connecting your systems through their APIs.", ["sync", "tag-brackets", "link-chain"]],
  ],
  "analytics-conversion-growth": [
    ["ga4-implementation", "Google Analytics 4 Implementation", "GA4 set up with the events and reports you need.", ["dashboard", "tag-brackets", "journey-path"]],
    ["google-tag-manager-setup", "Google Tag Manager Setup", "Tags, triggers and variables managed in one place.", ["tag-brackets", "workflow", "sync"]],
    ["meta-pixel-conversion-api-integration", "Meta Pixel & Conversion API Integration", "Browser and server-side tracking for Meta ads.", ["sync", "funnel", "tag-brackets"]],
    ["conversion-tracking", "Conversion Tracking", "Measuring the actions that matter, across channels.", ["funnel", "tag-brackets", "dashboard"]],
    ["marketing-performance-dashboards", "Marketing Performance Dashboards", "Live dashboards pulling data from every channel.", ["dashboard", "compare-bars", "sync"]],
    ["campaign-performance-reporting", "Campaign Performance Reporting", "Regular reports on spend, results and next steps.", ["doc-scan", "compare-bars", "dashboard"]],
    ["conversion-rate-optimisation", "Conversion Rate Optimisation (CRO)", "Research and testing to turn more visitors into customers.", ["heatmap", "ab-split", "funnel"]],
    ["ab-testing", "A/B Testing", "Controlled experiments on pages, ads and emails.", ["ab-split", "dashboard", "heatmap"]],
    ["landing-page-optimisation", "Landing Page Optimisation", "Improving landing pages through data and testing.", ["browser-build", "heatmap", "ab-split"]],
    ["customer-journey-analysis", "Customer Journey Analysis", "Mapping how customers find, compare and buy.", ["journey-path", "target-rings", "dashboard"]],
    ["funnel-optimisation", "Funnel Optimisation", "Finding and fixing drop-off at each stage of the funnel.", ["funnel", "ab-split", "dashboard"]],
    ["customer-retention-strategy", "Customer Retention Strategy", "Keeping customers coming back and buying again.", ["loop-arrow", "envelope", "star-rating"]],
    ["marketing-roi-analysis", "Marketing ROI Analysis", "What each channel costs and what it returns.", ["compare-bars", "dashboard", "pipeline"]],
  ],
};

export const services: Service[] = categories.flatMap((c) =>
  (rows[c.slug] ?? []).map(([slug, name, description, motifs]) => ({
    slug,
    name,
    description,
    category: c.slug,
    group: c.group,
    href: serviceUrls[slug] ?? "",
    motifs,
  })),
);
