import { clients, clientsCopy, type WordmarkStyle } from "@/content/clients";

const styles: Record<WordmarkStyle, string> = {
  heavy: "font-display font-extrabold tracking-tight",
  light: "font-display font-light tracking-wide",
  mono: "font-mono font-medium uppercase tracking-widest text-xl",
  italic: "font-sans font-semibold italic tracking-tight",
  wide: "font-display font-semibold uppercase tracking-[0.3em] text-xl",
};

function Row({ hiddenFromAT = false }: { hiddenFromAT?: boolean }) {
  return (
    <ul
      className={`flex shrink-0 items-center ${hiddenFromAT ? "marquee-dup" : ""}`}
      aria-hidden={hiddenFromAT || undefined}
    >
      {clients.map((c) => (
        <li
          key={c.name}
          className={`mx-8 whitespace-nowrap text-2xl text-fg/70 md:mx-12 md:text-3xl ${styles[c.style]}`}
        >
          {c.name}
        </li>
      ))}
    </ul>
  );
}

export function LogoCarousel() {
  return (
    <section
      id="trusted"
      aria-labelledby="trusted-heading"
      className="border-b border-line py-20 md:py-28"
    >
      <div className="container-x mb-12">
        <p className="eyebrow mb-4">{clientsCopy.eyebrow}</p>
        <h2
          id="trusted-heading"
          className="max-w-3xl font-display text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl"
        >
          {clientsCopy.heading}
        </h2>
      </div>

      <div className="marquee relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="marquee-track flex">
          <Row />
          <Row hiddenFromAT />
        </div>
      </div>

      <p className="container-x mt-8 font-mono text-xs uppercase tracking-widest text-accent">
        {clientsCopy.placeholderNote}
      </p>
    </section>
  );
}
