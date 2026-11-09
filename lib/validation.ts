import { categories } from "@/content/services";
import { site } from "@/content/site";

export interface ContactPayload {
  name: string;
  brand: string;
  email: string;
  /** Category titles the enquiry is about. */
  services: string[];
  budget: string;
  message: string;
}

export type FieldErrors = Partial<Record<keyof ContactPayload, string>>;

const validServices = new Set(categories.map((c) => c.title));
const validBudgets = new Set<string>(site.budgets);

export function validateContact(
  input: unknown,
): { ok: true; data: ContactPayload } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  const name = str(raw.name);
  const brand = str(raw.brand);
  const email = str(raw.email);
  const budget = str(raw.budget);
  const message = str(raw.message);
  const picked = Array.isArray(raw.services)
    ? raw.services.filter((v): v is string => typeof v === "string")
    : [];

  if (name.length < 2 || name.length > 100) errors.name = "Please enter your name.";
  if (brand.length > 120) errors.brand = "Brand name is too long.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200)
    errors.email = "Please enter a valid email address.";
  if (picked.length === 0 || !picked.every((s) => validServices.has(s)))
    errors.services = "Choose at least one area.";
  if (budget && !validBudgets.has(budget)) errors.budget = "Choose a budget range.";
  if (message.length < 10 || message.length > 3000)
    errors.message = "Tell us a little more (10 to 3000 characters).";

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { name, brand, email, services: picked, budget, message } };
}
