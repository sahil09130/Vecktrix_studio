import { whyUs, whyUsCopy } from "@/content/why-us";

export function WhyUs() {
  return (
    <section
      id="why"
      aria-labelledby="why-heading"
      className="border-t border-line py-20 md:py-28"
    >
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="eyebrow mb-4">{whyUsCopy.eyebrow}</p>
          <h2
            id="why-heading"
            className="font-display text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl"
          >
            {whyUsCopy.heading}
          </h2>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
          {whyUs.map((p, i) => (
            <li key={p.title} className="bg-bg p-7 md:p-8">
              <span className="font-mono text-xs text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold leading-tight">
                {p.title}
              </h3>
              <p className="mt-3 text-muted">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
