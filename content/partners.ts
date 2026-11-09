/**
 * Partner & Affiliate Programme copy and rules. Edit text here, not in components.
 *
 * Commercial terms are indicative. The actual commission, payout timing and
 * eligibility are set in each partner's agreement. Do not add guarantees here.
 */

export const partnersConfig = {
  /** Referral attribution window, in days. Business rule: 90 days, configurable. */
  attributionDays: 90,
  /** Example fee for the earnings calculator (INR). Illustrative only. */
  exampleFee: 100000,
  /** Commission rates offered in the calculator (percent). */
  calculatorRates: [10, 12, 15],
  /**
   * Legal page links. Leave empty until the pages exist; the form then shows
   * the wording without a link. Do not point these at pages that don't exist.
   */
  termsUrl: "",
  privacyUrl: "",
};

export const partnersCopy = {
  meta: {
    title: "Partner Network",
    description:
      "Join the Vectrix Studio Partner Network. Refer businesses to a full digital growth studio and earn commission when eligible payments are collected.",
  },
  hero: {
    eyebrow: "Partner Network",
    headline: ["Your Network.", "Your Referrals.", "Your Earnings."],
    sub: "Connect businesses with the right digital growth solutions. Refer clients to Vectrix Studio and earn commissions while we handle strategy, execution and delivery.",
    primary: "Become a Partner",
    secondary: "Explore Partnership Opportunities",
  },
  how: {
    eyebrow: "How it works",
    heading: "Four steps from introduction to commission.",
    steps: [
      { title: "Join the Network", body: "Register as a Vectrix Studio partner." },
      { title: "Refer a Business", body: "Introduce businesses that need digital services." },
      { title: "We Execute", body: "Our team handles consultation, proposals and project delivery." },
      { title: "Earn Commission", body: "Receive your commission after eligible client payments are collected." },
    ],
  },
  types: {
    eyebrow: "Partnership types",
    heading: "Four ways to partner.",
    items: [
      {
        key: "Referral Partner",
        label: "Referral Partner",
        who: "For freelancers, consultants, entrepreneurs and professionals who can introduce potential clients.",
        benefits: ["Simple referral process.", "No project execution responsibilities.", "Earn commission on successful referrals."],
      },
      {
        key: "Agency Partner",
        label: "Agency Partner",
        who: "For branding agencies, marketing agencies, web development agencies and creative studios.",
        benefits: ["Expand your service portfolio.", "Outsource services to Vectrix Studio.", "Generate additional revenue.", "Build long-term business relationships."],
      },
      {
        key: "Creator / Influencer Partner",
        label: "Creator & Influencer Partner",
        who: "For LinkedIn creators, YouTubers, business influencers and content creators.",
        benefits: ["Monetise your professional audience.", "Earn from qualified business referrals.", "Build a business partnership with Vectrix Studio."],
      },
      {
        key: "White-label Partner",
        label: "White-label Partner",
        who: "For agencies that want to sell Vectrix Studio services under their own brand.",
        benefits: ["Wholesale service pricing.", "Behind-the-scenes project execution.", "Expand delivery capacity without hiring an entire team."],
      },
    ],
    cta: "Apply as a Partner",
  },
  services: {
    eyebrow: "What you can refer",
    heading: "A full digital growth studio, under one roof.",
    intro: "Refer a single service or a complete digital growth project.",
    groups: [
      { title: "Branding & Identity", items: ["Brand Strategy & Identity", "Logo and visual identity", "Packaging design"] },
      { title: "Website & Web App Development", items: ["Website and web app development", "UI/UX and CMS development", "3D product modelling"] },
      { title: "Video Editing & UGC Production", items: ["UGC and video production", "YouTube and short-form editing", "Graphic design and motion graphics"] },
      { title: "SEO & LLM Visibility", items: ["Traditional SEO", "GEO and LLM SEO", "Content strategy"] },
      { title: "Digital Marketing & Paid Advertising", items: ["Meta Ads and Google Ads", "Performance marketing", "Lead generation"] },
      { title: "Social Media Management", items: ["Social media management", "Content marketing", "Influencer marketing"] },
      { title: "AI & Sales Automation", items: ["AI marketing automation", "AI sales automation", "AI chatbots and voice agents"] },
      { title: "CRM & Business Automation", items: ["CRM implementation", "Workflow and business automation", "AI agents"] },
    ],
  },
  tiers: {
    eyebrow: "Commission",
    heading: "Indicative partner tiers.",
    note: "Indicative starting rates, subject to service eligibility, agreement and project margins.",
    items: [
      { name: "Referral Partner", rate: "10%", rateNote: "Starting commission", who: "For individuals and independent referrers." },
      { name: "Growth Partner", rate: "12–15%", rateNote: "Commission range", who: "For consultants, creators and partners generating consistent qualified referrals." },
      { name: "Agency Partner", rate: "Custom", rateNote: "Agreed per partner", who: "For agencies with recurring business opportunities. Custom commission and partnership agreement." },
    ],
    basis:
      "Commission is calculated on eligible service fees actually collected, excluding GST, advertising budgets, software subscriptions and third-party expenses.",
  },
  calculator: {
    eyebrow: "Earnings example",
    heading: "What a referral could look like.",
    intro: "An illustrative calculation. It is not a promise of earnings.",
    feeLabel: "Eligible project fee (₹)",
    rateLabel: "Commission rate",
    resultLabel: "Commission, once the fee is collected",
    example: "A partner refers a website project worth ₹1,00,000. At 10% commission, the partner earns ₹10,000 after the eligible payment is collected.",
  },
  benefits: {
    eyebrow: "Why partner",
    heading: "Built to make referring easy.",
    items: [
      "No need to manage project execution.",
      "Access to multiple digital services.",
      "Dedicated business coordination.",
      "Transparent referral tracking.",
      "Opportunity for recurring referral commissions where agreed.",
      "Long-term agency partnerships.",
      "White-label delivery opportunities.",
    ],
  },
  form: {
    eyebrow: "Apply",
    heading: "Apply to the Partner Network.",
    intro: "Tell us about you and how you plan to refer. We review every application personally.",
    submit: "Apply to Become a Partner",
    consent: "I accept the partner programme terms and the privacy policy.",
    success: "Thanks. We have your application and will be in touch.",
    fail: "Something went wrong sending your application. Please try again.",
  },
  faq: {
    eyebrow: "Questions",
    heading: "Frequently asked.",
    items: [
      { q: "Who can become a Vectrix Studio partner?", a: "Anyone with a professional network: freelancers, consultants, agencies, creators and business professionals. We review each application." },
      { q: "How does the referral programme work?", a: "You introduce a business that needs digital services. We contact them, run the consultation and deliver the project. Once an eligible payment is collected, your commission is calculated." },
      { q: "How much commission can I earn?", a: "Starting rates are 10%, with 12–15% for consistent qualified referrals and custom terms for agencies. Rates are indicative and set out in your partner agreement." },
      { q: "When will I receive my commission?", a: "Commission is calculated once the eligible client payment has been collected. The payout date and method are set out in your partner agreement." },
      { q: "Can I refer multiple clients?", a: "Yes. There is no limit on referrals. Existing clients and active opportunities are excluded unless we approve them in writing." },
      { q: "Can agencies partner with Vectrix Studio?", a: "Yes. Agency partners can outsource services, build their portfolio and agree custom commission terms." },
      { q: "What is a white-label partnership?", a: "You sell Vectrix Studio services under your own brand, and we handle the behind-the-scenes delivery. White-label pricing and terms are set in a separate agreement." },
      { q: "Do I need technical knowledge?", a: "No. Referral partners do not need technical skills. We handle the technical and creative work." },
      { q: "Can I earn recurring commissions?", a: "Recurring commissions are available only where your partner agreement says so." },
      { q: "What happens if a referred client does not convert?", a: `Referrals are attributed for ${partnersConfig.attributionDays} days. If the client does not convert in that time, no commission is due. Refunds, cancellations and unpaid invoices are also excluded.` },
    ],
  },
  finalCta: {
    eyebrow: "Partner Network",
    headline: "Let's Grow Together.",
    sub: "Bring the opportunities. We'll bring the execution. Let's build something valuable together.",
    cta: "Join the Vectrix Partner Network",
  },
  rules: [
    "Commission applies only to eligible referrals.",
    "Commission is payable only after successful client payment collection.",
    "No commission on GST, advertising spend, software costs or third-party expenses.",
    "Existing clients and active opportunities are excluded unless specifically approved.",
    "Refunds, cancellations and unpaid invoices are excluded.",
  ],
};

export const partnerTypes = partnersCopy.types.items.map((t) => t.key);
