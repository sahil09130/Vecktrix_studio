"use client";

import { useState } from "react";
import { partnersConfig, partnersCopy, partnerTypes } from "@/content/partners";
import { EXPECTED_REFERRALS, validatePartner, type PartnerFieldErrors } from "@/lib/partner-validation";

type Status = "idle" | "sending" | "success" | "error";

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-fg placeholder:text-muted/70 focus:border-accent";
const label = "eyebrow mb-2 block";

function Legal({ text, url, linkLabel }: { text: string; url: string; linkLabel: string }) {
  return url ? (
    <a href={url} className="underline underline-offset-4 hover:text-accent">
      {linkLabel}
    </a>
  ) : (
    <span>{text}</span>
  );
}

export function PartnerForm({ preselected }: { preselected?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<PartnerFieldErrors>({});
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      company: fd.get("company"),
      website: fd.get("website"),
      partnershipType: fd.get("partnershipType"),
      industry: fd.get("industry"),
      referralPlan: fd.get("referralPlan"),
      expectedReferrals: fd.get("expectedReferrals"),
      additional: fd.get("additional"),
      consent: fd.get("consent") === "on",
      nickname: fd.get("nickname"), // honeypot
    };

    // Client-side validation first, so people see problems without a round trip.
    const local = validatePartner(payload);
    if (!local.ok) {
      setErrors(local.errors);
      setMessage("Please check the highlighted fields.");
      setStatus("error");
      document.getElementById(`pf-${Object.keys(local.errors)[0]}`)?.focus();
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus("success");
        form.reset();
        return;
      }
      if (json.errors) setErrors(json.errors);
      setMessage(json.error ?? partnersCopy.form.fail);
      setStatus("error");
    } catch {
      setMessage(partnersCopy.form.fail);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-3xl border border-accent p-8 md:p-10">
        <h3 className="font-display text-3xl font-bold">{partnersCopy.form.success}</h3>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm underline underline-offset-4 hover:text-accent"
        >
          Submit another application
        </button>
      </div>
    );
  }

  const err = (k: keyof PartnerFieldErrors) =>
    errors[k] ? (
      <p id={`pf-${k}-error`} className="mt-1.5 text-sm text-accent">
        {errors[k]}
      </p>
    ) : null;
  const invalid = (k: keyof PartnerFieldErrors) => !!errors[k];
  const describedBy = (k: keyof PartnerFieldErrors) => (errors[k] ? `pf-${k}-error` : undefined);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {status === "error" && (
        <p role="alert" className="rounded-xl border border-accent px-4 py-3 text-sm">
          {message}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="pf-name" className={label}>Full name</label>
          <input id="pf-name" name="name" required autoComplete="name" className={field} aria-invalid={invalid("name")} aria-describedby={describedBy("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="pf-email" className={label}>Email address</label>
          <input id="pf-email" name="email" type="email" required autoComplete="email" className={field} aria-invalid={invalid("email")} aria-describedby={describedBy("email")} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="pf-phone" className={label}>Phone number</label>
          <input id="pf-phone" name="phone" type="tel" required autoComplete="tel" className={field} aria-invalid={invalid("phone")} aria-describedby={describedBy("phone")} />
          {err("phone")}
        </div>
        <div>
          <label htmlFor="pf-company" className={label}>Company or agency <span className="normal-case tracking-normal text-muted">(optional)</span></label>
          <input id="pf-company" name="company" autoComplete="organization" className={field} aria-invalid={invalid("company")} aria-describedby={describedBy("company")} />
          {err("company")}
        </div>
        <div>
          <label htmlFor="pf-website" className={label}>Website or LinkedIn profile <span className="normal-case tracking-normal text-muted">(optional)</span></label>
          <input id="pf-website" name="website" type="url" className={field} aria-invalid={invalid("website")} aria-describedby={describedBy("website")} />
          {err("website")}
        </div>
        <div>
          <label htmlFor="pf-partnershipType" className={label}>Partnership type</label>
          <select id="pf-partnershipType" name="partnershipType" required defaultValue={preselected ?? ""} className={field} aria-invalid={invalid("partnershipType")} aria-describedby={describedBy("partnershipType")}>
            <option value="" disabled>Choose a type</option>
            {partnerTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {err("partnershipType")}
        </div>
      </div>

      <div>
        <label htmlFor="pf-industry" className={label}>Industry or professional background</label>
        <input id="pf-industry" name="industry" required className={field} aria-invalid={invalid("industry")} aria-describedby={describedBy("industry")} />
        {err("industry")}
      </div>

      <div>
        <label htmlFor="pf-referralPlan" className={label}>How do you plan to refer businesses?</label>
        <textarea id="pf-referralPlan" name="referralPlan" rows={4} required className={field} aria-invalid={invalid("referralPlan")} aria-describedby={describedBy("referralPlan")} />
        {err("referralPlan")}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="pf-expectedReferrals" className={label}>Expected referrals per month <span className="normal-case tracking-normal text-muted">(optional)</span></label>
          <select id="pf-expectedReferrals" name="expectedReferrals" defaultValue="" className={field} aria-invalid={invalid("expectedReferrals")} aria-describedby={describedBy("expectedReferrals")}>
            <option value="">Choose a range</option>
            {EXPECTED_REFERRALS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {err("expectedReferrals")}
        </div>
      </div>

      <div>
        <label htmlFor="pf-additional" className={label}>Anything else? <span className="normal-case tracking-normal text-muted">(optional)</span></label>
        <textarea id="pf-additional" name="additional" rows={3} className={field} aria-invalid={invalid("additional")} aria-describedby={describedBy("additional")} />
        {err("additional")}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-fg/85">
          <input
            id="pf-consent"
            name="consent"
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--accent)]"
            aria-invalid={invalid("consent")}
            aria-describedby={describedBy("consent")}
          />
          <span>
            I accept the{" "}
            <Legal text="partner programme terms" url={partnersConfig.termsUrl} linkLabel="partner programme terms" />
            {" "}and the{" "}
            <Legal text="privacy policy" url={partnersConfig.privacyUrl} linkLabel="privacy policy" />.
          </span>
        </label>
        {err("consent")}
      </div>

      {/* Honeypot: hidden from people, bots tend to fill it. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Nickname
          <input type="text" name="nickname" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-bg transition-colors hover:bg-fg disabled:opacity-60"
      >
        {status === "sending" ? "Sending application…" : partnersCopy.form.submit}
      </button>
    </form>
  );
}
