"use client";

import { motion, useReducedMotion } from "framer-motion";
import { partnersCopy } from "@/content/partners";
import { ButtonLink } from "@/components/Button";

/** Five nodes around a central studio node, with pulses along the links. */
const NODES: [number, number, string][] = [
  [50, 50, "studio"],
  [16, 22, "partner"],
  [84, 18, "client"],
  [88, 70, "partner"],
  [20, 78, "client"],
  [52, 12, "partner"],
];

function Network({ reduced }: { reduced: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="pn-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff4d2e" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ff4d2e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(242,239,233,0.1)" strokeWidth="0.25" strokeDasharray="0.6 1.2" />
      <circle cx="50" cy="50" r="22" fill="url(#pn-core)" />
      {NODES.slice(1).map(([x, y], i) => (
        <g key={i}>
          <line x1="50" y1="50" x2={x} y2={y} stroke="rgba(242,239,233,0.22)" strokeWidth="0.3" />
          {!reduced && (
            <circle r="0.8" fill="#ff4d2e">
              <animateMotion dur={`${3.2 + i * 0.4}s`} repeatCount="indefinite" path={`M50 50 L${x} ${y}`} />
            </circle>
          )}
        </g>
      ))}
      {NODES.map(([x, y, kind], i) => (
        <g key={`n${i}`}>
          <circle cx={x} cy={y} r={kind === "studio" ? 4.2 : 2.6} fill="#0b0c12" stroke={kind === "studio" ? "#ff4d2e" : "rgba(242,239,233,0.6)"} strokeWidth="0.4" />
          <circle cx={x} cy={y} r={kind === "studio" ? 1.4 : 0.8} fill={kind === "studio" ? "#ff4d2e" : "#f2efe9"} />
        </g>
      ))}
    </svg>
  );
}

export function PartnerHero() {
  const reduced = useReducedMotion();
  const { hero } = partnersCopy;
  const rise = (i: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.2, 0.7, 0.2, 1] as const } };

  return (
    <section aria-labelledby="partners-hero" className="container-x grid items-center gap-12 pb-20 pt-16 md:pb-28 md:pt-24 lg:grid-cols-[1.15fr_1fr]">
      <div>
        <motion.p {...rise(0)} className="eyebrow mb-6">{hero.eyebrow}</motion.p>
        <motion.h1 id="partners-hero" {...rise(1)} className="font-display text-5xl font-bold leading-[0.96] tracking-tight md:text-7xl lg:text-8xl">
          {hero.headline.map((line) => (
            <span key={line} className="block">{line}</span>
          ))}
        </motion.h1>
        <motion.p {...rise(2)} className="mt-8 max-w-xl text-lg text-muted md:text-xl">{hero.sub}</motion.p>
        <motion.div {...rise(3)} className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="#apply">{hero.primary}</ButtonLink>
          <ButtonLink href="#types" variant="ghost">{hero.secondary}</ButtonLink>
        </motion.div>
      </div>

      <motion.div
        {...(reduced ? {} : { initial: { opacity: 0, scale: 0.94 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 1.2, ease: [0.2, 0.7, 0.2, 1] as const } })}
        className="relative aspect-square w-full max-w-[560px] justify-self-center"
      >
        <Network reduced={!!reduced} />
      </motion.div>
    </section>
  );
}
