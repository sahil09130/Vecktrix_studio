import type { Metadata } from "next";
import { getCategory, getService } from "@/lib/services";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with Vectrix Studio. Tell us what you need.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; practice?: string }>;
}) {
  const { service, practice } = await searchParams;
  const s = service ? getService(service) : undefined;
  const preselected = getCategory(s?.category ?? practice ?? "")?.title;

  return (
    <section className="container-x grid gap-12 py-20 md:py-28 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <p className="eyebrow mb-4">Contact</p>
        <h1 className="font-display text-5xl font-bold leading-[0.98] tracking-tight md:text-7xl">
          Start a project
        </h1>
        <p className="mt-6 max-w-md text-lg text-muted">
          Tell us what you need. One person will get back to you.
        </p>
      </div>
      <ContactForm preselected={preselected} topic={s?.name} />
    </section>
  );
}
