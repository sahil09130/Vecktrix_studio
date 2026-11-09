"use client";

import { motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { site } from "@/content/site";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { Starfield } from "./Starfield";
import { ButtonAnchor, ButtonLink } from "./Button";
import { HeroProjector, ProjectorPill } from "./HeroProjector";
import { VideoModal } from "./VideoModal";

/** Room needed to the right of the last word for the projector, in px. */
const PROJECTOR_ROOM = 250;

const speed = (s: string): CSSProperties =>
  ({ "--orbit-speed": s }) as CSSProperties;

function OrbitGraphic() {
  return (
    <svg
      viewBox="0 0 600 600"
      aria-hidden="true"
      className="h-full w-full"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="300" cy="300" r="60" className="text-accent" strokeWidth="1.5" />
      <circle cx="300" cy="300" r="12" fill="var(--accent)" stroke="none" />
      <g className="orbit text-fg/25" style={speed("70s")}>
        <circle cx="300" cy="300" r="130" strokeWidth="1" strokeDasharray="2 8" />
        <circle cx="430" cy="300" r="7" fill="var(--fg)" stroke="none" />
      </g>
      <g
        className="orbit text-fg/20"
        style={{ ...speed("110s"), animationDirection: "reverse" }}
      >
        <ellipse
          cx="300"
          cy="300"
          rx="210"
          ry="150"
          strokeWidth="1"
          transform="rotate(-24 300 300)"
        />
        <circle cx="94" cy="360" r="5" fill="var(--accent)" stroke="none" />
      </g>
      <g className="orbit text-fg/15" style={speed("160s")}>
        <circle cx="300" cy="300" r="270" strokeWidth="1" strokeDasharray="1 14" />
        <rect
          x="560"
          y="294"
          width="12"
          height="12"
          fill="var(--fg)"
          stroke="none"
          transform="rotate(45 566 300)"
        />
      </g>
    </svg>
  );
}

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const words = site.tagline.split(" ");
  const highlight = site.taglineHighlight.toLowerCase();

  const [videoOpen, setVideoOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const lastWord = useRef<HTMLSpanElement>(null);
  const projectorBtn = useRef<HTMLButtonElement>(null);
  const isWide = useMediaQuery("(min-width: 768px)");
  // Where the last word ends, relative to the hero section, and how much room is to its right.
  const [spot, setSpot] = useState<{ x: number; y: number; room: number } | null>(null);

  const measure = () => {
    const sec = sectionRef.current;
    const word = lastWord.current;
    if (!sec || !word) return;
    const sr = sec.getBoundingClientRect();
    const wr = word.getBoundingClientRect();
    setSpot({
      x: wr.right - sr.left,
      y: wr.top - sr.top + wr.height / 2,
      room: sr.width - (wr.right - sr.left),
    });
  };

  // Measure before paint, then follow the headline when the viewport or font changes.
  useLayoutEffect(() => {
    measure();
  }, []);
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(sec);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  const showProjector = isWide && !!spot && spot.room >= PROJECTOR_ROOM;
  const openVideo = () => setVideoOpen(true);
  const closeVideo = () => {
    setVideoOpen(false);
    // Return focus to whichever control opened the dialog.
    requestAnimationFrame(() => projectorBtn.current?.focus());
  };

  return (
    <section
      aria-labelledby="hero-heading"
      ref={sectionRef}
      className="relative isolate overflow-hidden border-b border-line"
    >
      <Starfield />
      <div className="pointer-events-none absolute -right-24 top-1/2 -z-10 h-[34rem] w-[34rem] -translate-y-1/2 opacity-40 md:right-0 md:h-[44rem] md:w-[44rem] md:opacity-100 lg:right-[4%]">
        <OrbitGraphic />
      </div>

      {showProjector && spot && (
        <div
          className="projector-in absolute z-20"
          style={{ left: spot.x + 12, top: spot.y, transform: "translateY(-50%)" }}
        >
          <HeroProjector label={site.introVideo.watchLabel} duration={site.introVideo.duration} onOpen={openVideo} buttonRef={projectorBtn} />
        </div>
      )}

      <div className="container-x relative z-10 flex min-h-[calc(100svh-4rem)] flex-col justify-center py-20 md:py-28">
        <motion.p
          className="eyebrow mb-6"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {site.eyebrow}
        </motion.p>

        <h1
          id="hero-heading"
          className="max-w-4xl font-display text-[clamp(2.75rem,8.5vw,7.25rem)] font-bold leading-[0.95] tracking-[-0.03em]"
        >
          <span className="sr-only">{site.tagline}</span>
          <span aria-hidden="true">
            {words.map((word, i) => {
              const clean = word.replace(/[^\w]/g, "").toLowerCase();
              return (
                <span
                  key={i}
                  ref={i === words.length - 1 ? lastWord : undefined}
                  className="inline-block overflow-hidden pb-[0.12em] align-bottom"
                >
                  <motion.span
                    className={`inline-block ${clean === highlight ? "text-accent" : ""}`}
                    initial={reduced ? false : { y: "110%", rotate: 4 }}
                    animate={{ y: 0, rotate: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.15 + i * 0.07,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {word}
                    {i < words.length - 1 ? " " : ""}
                  </motion.span>
                </span>
              );
            })}
          </span>
        </h1>

        <motion.p
          className="mt-8 max-w-xl text-lg text-muted md:text-xl"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          {site.subline}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap gap-3"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05 }}
        >
          <ButtonAnchor href="#services">Explore services</ButtonAnchor>
          <ButtonLink href="/contact" variant="ghost">
            Start a project
          </ButtonLink>
          {!showProjector && (
            <ProjectorPill label={site.introVideo.watchLabel} duration={site.introVideo.duration} onOpen={openVideo} buttonRef={projectorBtn} />
          )}
        </motion.div>
      </div>
      <VideoModal open={videoOpen} onClose={closeVideo} />
    </section>
  );
}
