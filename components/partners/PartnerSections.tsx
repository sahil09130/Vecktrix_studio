import { partnersCopy, partnersConfig } from "@/content/partners";
import { ButtonLink } from "@/components/Button";
import { EarningsCalculator } from "./EarningsCalculator";

/** Static sections of the partners page. Server-rendered: no client state here. */

function SectionHeading({ eyebrow, heading, id }: { eyebrow: string; heading: string; id: string }) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 id={id} className="font-display text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl">
        {heading}
      </h2>
    </div>
  );
}

export function HowItWorks() {
  const { how } = partnersCopy;
  return (
    <section id="how" aria-labelledby="how-h" className="container-x py-20 md:py-28">
      <SectionHeading eyebrow={how.eyebrow} heading={how.heading} id="how-h" />
      {/* Mobile: vertical timeline. Desktop: four steps in a row. */}
      <ol className="mt-14 grid gap-10 border-l border-line pl-6 md:grid-cols-4 md:gap-6 md:border-l-0 md:border-t md:pl-0 md:pt-10">
        {how.steps.map((s, i) => (
          <li key={s.title} className="relative md:pr-6">
            <span className="absolute -left-[31px] top-1 grid h-3 w-3 place-items-center rounded-full bg-accent md:-top-[41px] md:left-0 md:-translate-y-0" aria-hidden="true" />
            <p className="font-mono text-sm tracking-[0.14em] text-accent">0{i + 1}</p>
            <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">{s.title}</h3>
            <p className="mt-3 text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function PartnerTypes() {
  const { types } = partnersCopy;
  return (
    <section id="types" aria-labelledby="types-h" className="container-x py-20 md:py-28">
      <SectionHeading eyebrow={types.eyebrow} heading={types.heading} id="types-h" />
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {types.items.map((t) => (
          <article key={t.key} className="group flex flex-col rounded-3xl border border-line bg-surface p-8 transition-colors hover:border-accent/60 md:p-10">
            <h3 className="font-display text-3xl font-bold tracking-tight">{t.label}</h3>
            <p className="mt-4 text-muted">{t.who}</p>
            <ul className="mt-8 space-y-3 text-sm text-fg/85">
              {t.benefits.map((b) => (
                <li key={b} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-10">
              <ButtonLink href={`/partners?type=${encodeURIComponent(t.key)}#apply`} variant="ghost">
                {types.cta}
              </ButtonLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ServicesYouCanRefer() {
  const { services } = partnersCopy;
  return (
    <section aria-labelledby="services-h" className="container-x py-20 md:py-28">
      <SectionHeading eyebrow={services.eyebrow} heading={services.heading} id="services-h" />
      <p className="mt-6 max-w-xl text-lg text-muted">{services.intro}</p>
      <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {services.groups.map((g) => (
          <div key={g.title} className="bg-bg p-7">
            <h3 className="font-display text-xl font-bold leading-snug tracking-tight">{g.title}</h3>
            <ul className="mt-5 space-y-2 text-sm text-muted">
              {g.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Commission() {
  const { tiers } = partnersCopy;
  return (
    <section aria-labelledby="tiers-h" className="container-x py-20 md:py-28">
      <SectionHeading eyebrow={tiers.eyebrow} heading={tiers.heading} id="tiers-h" />
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {tiers.items.map((t) => (
          <div key={t.name} className="flex flex-col rounded-3xl border border-line bg-surface p-8">
            <h3 className="font-display text-2xl font-bold">{t.name}</h3>
            <p className="mt-8 font-display text-6xl font-bold tracking-tight text-accent">{t.rate}</p>
            <p className="eyebrow mt-3">{t.rateNote}</p>
            <p className="mt-6 text-muted">{t.who}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 max-w-2xl text-sm text-muted">{tiers.note}</p>
      <p className="mt-3 max-w-2xl text-sm text-muted">{tiers.basis}</p>
    </section>
  );
}

export function Earnings() {
  return (
    <section aria-labelledby="earn-h" className="container-x py-20 md:py-28">
      <SectionHeading eyebrow={partnersCopy.calculator.eyebrow} heading={partnersCopy.calculator.heading} id="earn-h" />
      <div className="mt-14">
        <EarningsCalculator />
      </div>
    </section>
  );
}

export function Benefits() {
  const { benefits } = partnersCopy;
  return (
    <section aria-labelledby="benefits-h" className="container-x py-20 md:py-28">
      <SectionHeading eyebrow={benefits.eyebrow} heading={benefits.heading} id="benefits-h" />
      <ul className="mt-14 grid gap-x-12 gap-y-0 md:grid-cols-2">
        {benefits.items.map((b) => (
          <li key={b} className="flex gap-4 border-b border-line py-5 text-lg text-fg/90">
            <span aria-hidden="true" className="mt-3 h-px w-5 shrink-0 bg-accent" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <ul className="mt-12 max-w-2xl space-y-2 text-sm text-muted">
        {partnersCopy.rules.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </section>
  );
}

export function Faq() {
  const { faq } = partnersCopy;
  return (
    <section aria-labelledby="faq-h" className="container-x py-20 md:py-28">
      <SectionHeading eyebrow={faq.eyebrow} heading={faq.heading} id="faq-h" />
      <div className="mt-14 divide-y divide-line border-y border-line">
        {faq.items.map((item) => (
          <details key={item.q} className="group py-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-xl font-semibold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent md:text-2xl [&::-webkit-details-marker]:hidden">
              {item.q}
              <span aria-hidden="true" className="text-accent transition-transform duration-300 group-open:rotate-45">+</span>
            </summary>
            <p className="mt-4 max-w-2xl text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function FinalCta() {
  const { finalCta } = partnersCopy;
  return (
    <section aria-labelledby="final-h" className="container-x pb-24 pt-10 md:pb-36">
      <div className="rounded-[2rem] border border-line bg-surface p-10 md:p-20">
        <p className="eyebrow mb-6">{finalCta.eyebrow}</p>
        <h2 id="final-h" className="font-display text-5xl font-bold leading-[0.98] tracking-tight md:text-8xl">
          {finalCta.headline}
        </h2>
        <p className="mt-6 max-w-xl text-lg text-muted md:text-xl">{finalCta.sub}</p>
        <div className="mt-10">
          <ButtonLink href="#apply">{finalCta.cta}</ButtonLink>
        </div>
      </div>
      <p className="mt-6 text-xs text-muted">
        Attribution is valid for {partnersConfig.attributionDays} days from referral. Indicative terms only; see your partner agreement.
      </p>
    </section>
  );
}
