"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Category } from "@/content/services";

/**
 * Big chapter heading for a service category. It drifts slower than the page
 * (so it feels pinned), fades in, holds, then fades out and lifts away before
 * the category's tiles reach the middle of the screen.
 */
export function CategoryHeading({
  category,
  height,
  reduced,
}: {
  category: Category;
  height: number;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0.1, 0.32, 0.6, 0.78], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["-45vh", "45vh"]);
  const scale = useTransform(scrollYProgress, [0.15, 0.4, 0.78], [0.94, 1, 1.06]);
  const blur = useTransform(scrollYProgress, [0.6, 0.78], ["blur(0px)", "blur(8px)"]);

  return (
    <div ref={ref} style={{ height }} className="flex items-center">
      <motion.div
        className="container-x origin-left"
        style={reduced ? undefined : { opacity, y, scale, filter: blur }}
      >
        <h3
          id={`cat-${category.slug}-title`}
          className="max-w-5xl font-display text-[clamp(2.4rem,7vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.03em]"
        >
          <span className="mb-4 block font-mono text-sm font-medium tracking-[0.14em] text-accent md:text-base">
            {category.number}.
          </span>
          {category.title}
        </h3>
        <p className="mt-6 max-w-xl text-lg text-muted md:text-xl">{category.intro}</p>
      </motion.div>
    </div>
  );
}
