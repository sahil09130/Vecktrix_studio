/**
 * One shared animation loop for every small canvas on the page (carousels and
 * phone illustrations), capped at 30 fps. Each subscriber gets a timestamp.
 */
type Tick = (now: number) => void;

const ticks = new Set<Tick>();
let raf = 0;
let last = 0;

function frame(now: number) {
  raf = ticks.size ? requestAnimationFrame(frame) : 0;
  if (now - last < 1000 / 30 - 2) return;
  last = now;
  ticks.forEach((f) => f(now));
}

export function subscribeTicker(f: Tick) {
  ticks.add(f);
  if (!raf) raf = requestAnimationFrame(frame);
  return () => {
    ticks.delete(f);
  };
}
