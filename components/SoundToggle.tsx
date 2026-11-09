"use client";

import { isSoundOn, setSoundEnabled, useSoundEnabled } from "@/lib/sound";

/** Small pill that turns the asteroid sounds on or off. Off until pressed. */
export function SoundToggle() {
  const on = useSoundEnabled();
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => setSoundEnabled(!isSoundOn())}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest backdrop-blur transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        on ? "border-accent text-accent" : "border-line bg-bg/70 text-muted hover:text-fg"
      }`}
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5 6 9H3v6h3l5 4z" />
        {on ? (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </>
        ) : (
          <path d="m16 9 6 6m0-6-6 6" />
        )}
      </svg>
      {on ? "Sound on" : "Sound off"}
    </button>
  );
}
