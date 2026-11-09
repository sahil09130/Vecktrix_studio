"use client";

/**
 * Line-art film projector beside the hero headline. Pure SVG and CSS: reels
 * spin, the beam flickers, dust drifts. On load it plays a short attention
 * sequence (beam powers on, play dot ripples, text shine, a cursor taps the
 * screen), then settles. Every loop has a finite count; hover brings it back.
 * Motion is neutralised by the global reduced-motion rule. The whole thing is
 * one button that opens the intro video.
 */

/** Orange play circle with two soft rings that ripple outwards. */
function PlayDot({ size }: { size: number }) {
  return (
    <span
      aria-hidden="true"
      className="chip-dot relative grid shrink-0 place-items-center rounded-full bg-accent text-bg"
      style={{ width: size, height: size }}
    >
      <span className="chip-ring" />
      <span className="chip-ring chip-ring-2" />
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="currentColor" className="relative">
        <path d="M8.5 5.5v13l10.5-6.5z" />
      </svg>
    </span>
  );
}

export function HeroProjector({
  label,
  duration,
  onOpen,
  buttonRef,
}: {
  label: string;
  duration?: string;
  onOpen: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onOpen}
      aria-label={label}
      aria-haspopup="dialog"
      className="hero-projector group relative block w-[clamp(150px,15vw,240px)] cursor-pointer rounded-2xl p-2 focus-visible:outline-accent"
    >
      <svg viewBox="0 0 260 150" className="h-auto w-full overflow-visible" fill="none" aria-hidden="true">
        {/* Beam: hover brightens the group, the inner shape powers on then flickers. */}
        <g className="proj-beam">
          <polygon points="150,62 236,22 236,104" fill="url(#proj-grad)" className="proj-flick" />
          <circle cx="182" cy="50" r="1.2" fill="#f2efe9" className="proj-dust" />
          <circle cx="208" cy="66" r="1" fill="#f2efe9" className="proj-dust proj-dust-2" />
          <circle cx="196" cy="40" r="0.9" fill="#ff4d2e" className="proj-dust proj-dust-3" />
        </g>

        <defs>
          <linearGradient id="proj-grad" x1="150" x2="236" y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ff4d2e" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ff4d2e" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Screen outline at the end of the beam: flickers on, then taps when the cursor arrives. */}
        <g className="proj-screen">
          <rect x="196" y="30" width="58" height="33" rx="4" stroke="rgba(242,239,233,0.35)" strokeWidth="1" strokeDasharray="2.5 3" />
          <path d="M218 40 L232 46.5 L218 53 Z" fill="#f2efe9" opacity="0.7" />
        </g>
        <circle cx="225" cy="46.5" r="4" stroke="#ff4d2e" strokeWidth="1" className="proj-tap-ring" />

        {/* Body */}
        <rect x="36" y="60" width="100" height="50" rx="10" stroke="#f2efe9" strokeWidth="1.4" />
        <path d="M46 60 L46 52 L70 52 L70 60" stroke="#f2efe9" strokeWidth="1.2" />
        <rect x="136" y="54" width="14" height="22" rx="3" stroke="#f2efe9" strokeWidth="1.2" />

        {/* Lens with pulsing orange ring */}
        <circle cx="146" cy="65" r="9" stroke="#ff4d2e" strokeWidth="1.5" className="proj-lens" />
        <circle cx="146" cy="65" r="2.5" fill="#ff4d2e" />

        {/* Film reels */}
        <g className="proj-reel">
          <circle cx="62" cy="40" r="13" stroke="#f2efe9" strokeWidth="1.2" />
          <path d="M62 30 V50 M52 40 H72" stroke="#f2efe9" strokeWidth="0.9" opacity="0.6" />
        </g>
        <g className="proj-reel proj-reel-2">
          <circle cx="104" cy="40" r="13" stroke="#f2efe9" strokeWidth="1.2" />
          <path d="M104 30 V50 M94 40 H114" stroke="#f2efe9" strokeWidth="0.9" opacity="0.6" />
        </g>

        {/* Base */}
        <path d="M30 110 H142" stroke="rgba(242,239,233,0.25)" strokeWidth="1" />
      </svg>

      {/* Cursor hint: glides to the screen and taps it, twice, then fades away for good. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 20 24"
        width="18"
        height="22"
        className="proj-cursor pointer-events-none absolute"
        style={{ left: "84%", top: "30%" }}
      >
        <path d="M2 2 L2 18 L6.5 14 L9.5 21 L12.5 19.7 L9.6 12.8 L15.5 12.5 Z" fill="#f2efe9" stroke="#07080c" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>

      {/* Play chip: always visible. Ripples and shine run a few times, hover brings them back. */}
      <span className="proj-chip pointer-events-none absolute -bottom-2 left-0 inline-flex items-center gap-2 rounded-full border border-line bg-bg/70 py-1 pl-1 pr-3 backdrop-blur">
        <PlayDot size={22} />
        <span className="chip-text font-mono text-[0.65rem] uppercase tracking-[0.16em]">{label}</span>
        {duration && <span className="font-mono text-[0.6rem] tracking-[0.12em] text-muted">{duration}</span>}
      </span>
    </button>
  );
}

/** Compact fallback on phones, or when the headline leaves no room for the projector. */
export function ProjectorPill({
  label,
  duration,
  onOpen,
  buttonRef,
}: {
  label: string;
  duration?: string;
  onOpen: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="intro-pill inline-flex items-center gap-2.5 rounded-full border border-line py-2 pl-2 pr-5 text-sm font-semibold text-fg transition-colors duration-200 hover:border-accent focus-visible:outline-accent"
    >
      <PlayDot size={28} />
      <span className="chip-text chip-text-pill">{label}</span>
      {duration && <span className="font-mono text-[0.65rem] font-normal tracking-[0.12em] text-muted">{duration}</span>}
    </button>
  );
}
