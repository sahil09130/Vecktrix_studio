import { partnerTypes } from "@/content/partners";

/** Shared by the partner form (client) and /api/partners (server). Pure, no imports of React. */

export const EXPECTED_REFERRALS = ["1–2", "3–5", "6–10", "More than 10"] as const;

export interface PartnerPayload {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  partnershipType: string;
  industry: string;
  referralPlan: string;
  expectedReferrals: string;
  additional: string;
  consent: boolean;
}

export type PartnerFieldErrors = Partial<Record<keyof PartnerPayload, string>>;

export function validatePartner(
  input: unknown,
): { ok: true; data: PartnerPayload } | { ok: false; errors: PartnerFieldErrors } {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const errors: PartnerFieldErrors = {};

  const data: PartnerPayload = {
    name: str(raw.name),
    email: str(raw.email),
    phone: str(raw.phone),
    company: str(raw.company),
    website: str(raw.website),
    partnershipType: str(raw.partnershipType),
    industry: str(raw.industry),
    referralPlan: str(raw.referralPlan),
    expectedReferrals: str(raw.expectedReferrals),
    additional: str(raw.additional),
    consent: raw.consent === true,
  };

  if (data.name.length < 2 || data.name.length > 100) errors.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 200)
    errors.email = "Please enter a valid email address.";
  const digits = data.phone.replace(/[\s()-]/g, "");
  if (!/^\+?\d{7,15}$/.test(digits)) errors.phone = "Please enter a valid phone number.";
  if (data.company.length > 120) errors.company = "Company name is too long.";
  if (data.website.length > 200) errors.website = "Website or profile link is too long.";
  if (!partnerTypes.includes(data.partnershipType)) errors.partnershipType = "Choose a partnership type.";
  if (data.industry.length < 2 || data.industry.length > 200)
    errors.industry = "Tell us your industry or professional background.";
  if (data.referralPlan.length < 10 || data.referralPlan.length > 1000)
    errors.referralPlan = "Tell us a little about how you plan to refer (10 to 1000 characters).";
  if (data.expectedReferrals && !(EXPECTED_REFERRALS as readonly string[]).includes(data.expectedReferrals))
    errors.expectedReferrals = "Choose a range.";
  if (data.additional.length > 2000) errors.additional = "Please keep this under 2000 characters.";
  if (!data.consent) errors.consent = "Please accept the terms and privacy policy to continue.";

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data };
}
