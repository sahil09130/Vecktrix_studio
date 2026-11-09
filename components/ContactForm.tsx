"use client";

import { useState } from "react";
import { categories } from "@/content/services";
import { site } from "@/content/site";
import type { FieldErrors } from "@/lib/validation";

type Status = "idle" | "sending" | "success" | "error";

const field =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-fg placeholder:text-muted/70 focus:border-accent";

export function ContactForm({
  preselected,
  topic,
}: {
  /** Practice (category) title to tick by default. */
  preselected?: string;
  /** Service name, used to start the message. */
  topic?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus("sending");
    setErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          brand: fd.get("brand"),
          email: fd.get("email"),
          services: fd.getAll("services"),
          budget: fd.get("budget"),
          message: fd.get("message"),
          website: fd.get("website"), // honeypot
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus("success");
        form.reset();
        return;
      }
      if (json.errors) setErrors(json.errors);
      setMessage(json.error ?? "Please check the highlighted fields.");
      setStatus("error");
    } catch {
      setMessage("Something went wrong sending your message. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-3xl border border-accent p-8 md:p-10"
      >
        <h2 className="font-display text-3xl font-bold">Thanks. We have your enquiry.</h2>
        <p className="mt-3 text-muted">We will reply by email.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm underline underline-offset-4 hover:text-accent"
        >
          Send another
        </button>
      </div>
    );
  }

  const err = (k: keyof FieldErrors) =>
    errors[k] ? (
      <p id={`${k}-error`} className="mt-1.5 text-sm text-accent">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6" aria-describedby={status === "error" ? "form-error" : undefined}>
      {status === "error" && (
        <p id="form-error" role="alert" className="rounded-xl border border-accent px-4 py-3 text-sm">
          {message}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="eyebrow mb-2 block">Name</label>
          <input id="name" name="name" required autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="brand" className="eyebrow mb-2 block">Brand</label>
          <input id="brand" name="brand" autoComplete="organization" className={field} aria-invalid={!!errors.brand} />
          {err("brand")}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="eyebrow mb-2 block">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
        {err("email")}
      </div>

      <fieldset>
        <legend className="eyebrow mb-3">What do you need?</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {categories.map((c) => (
            <label
              key={c.slug}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-4 py-3 text-sm has-[:checked]:border-accent has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent"
            >
              <input
                type="checkbox"
                name="services"
                value={c.title}
                defaultChecked={c.title === preselected}
                className="h-4 w-4 shrink-0 accent-[var(--accent)]"
              />
              <span>
                <span className="mr-2 font-mono text-xs text-accent">{c.number}</span>
                {c.title}
              </span>
            </label>
          ))}
        </div>
        {err("services")}
      </fieldset>

      <div>
        <label htmlFor="budget" className="eyebrow mb-2 block">Budget range</label>
        <select id="budget" name="budget" defaultValue="" className={field}>
          <option value="">Select a range</option>
          {site.budgets.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        {err("budget")}
      </div>

      <div>
        <label htmlFor="message" className="eyebrow mb-2 block">Message</label>
        <textarea id="message" name="message" rows={6} required defaultValue={topic ? `I am interested in ${topic}. ` : undefined} className={field} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined} />
        {err("message")}
      </div>

      {/* Honeypot: hidden from people, bots tend to fill it. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-bg transition-colors hover:bg-fg disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send enquiry"}
      </button>
    </form>
  );
}
