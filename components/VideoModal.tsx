"use client";

import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import { useMediaQuery } from "@/lib/hooks";

/**
 * Intro video dialog. Uses the native <dialog> (focus trap, Esc, inert page).
 * The video or embed is mounted only while open, so it costs nothing until then.
 */
export function VideoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const v = site.introVideo;
  // Phones get the portrait cut (if there is one) in a portrait-shaped player.
  const isPhone = useMediaQuery("(max-width: 767px)");
  const portrait = isPhone && !!v.mobileSrc && !v.embedUrl;
  const src = portrait ? v.mobileSrc : v.src || v.mobileSrc;
  const hasVideo = !!(v.embedUrl || src);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  // The viewer just clicked to open this, so start playing right away.
  // If the browser refuses (autoplay rules), the controls are there to press play.
  useEffect(() => {
    if (!open) return;
    videoRef.current?.play().catch(() => {});
  }, [open]);

  // Lock page scroll while the dialog is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // Clicking the backdrop targets the dialog itself (the content fills it).
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
      aria-labelledby="intro-title"
      className="intro-dialog m-auto w-[min(94vw,980px)] rounded-3xl border border-line bg-surface p-0 text-fg backdrop:bg-bg/85 backdrop:backdrop-blur-sm"
    >
      {open && (
        <div className="p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 id="intro-title" className="font-display text-xl font-bold md:text-2xl">
              {v.title}
            </h2>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Close video"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-fg transition-colors hover:border-accent"
            >
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <div
            className={`relative overflow-hidden rounded-2xl bg-bg ${
              portrait
                ? "mx-auto aspect-[9/16] h-[min(76svh,640px)]"
                : "aspect-video w-full"
            }`}
          >
            {hasVideo && v.embedUrl ? (
              <iframe
                src={v.embedUrl}
                title={v.title}
                allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 h-full w-full"
              />
            ) : hasVideo ? (
              <video
                key={src}
                ref={videoRef}
                src={src}
                poster={v.poster || undefined}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full"
              >
                {v.captions && <track kind="captions" src={v.captions} srcLang="en" label="English" default />}
              </video>
            ) : (
              <IntroPlaceholder />
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}

/** Stand-in shown until a real video is supplied. Clearly marked, never pretends to be a video. */
function IntroPlaceholder() {
  const v = site.introVideo;
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden">
      <svg aria-hidden="true" viewBox="0 0 320 180" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" fill="none">
        <path d="M160 92 L330 40 L330 150 Z" fill="url(#ph-beam)" opacity="0.35" />
        <defs>
          <linearGradient id="ph-beam" x1="160" x2="330" y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ff4d2e" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ff4d2e" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="308" height="168" rx="10" stroke="rgba(242,239,233,0.14)" strokeDasharray="3 6" />
      </svg>
      <div className="relative flex flex-col items-center gap-5 px-6 text-center">
        <span aria-hidden="true" className="grid h-16 w-16 place-items-center rounded-full border border-accent text-accent md:h-20 md:w-20">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </span>
        <p className="max-w-sm text-base text-fg/85 md:text-lg">{v.comingSoon}</p>
        <span className="eyebrow rounded-full border border-line px-3 py-1">{v.placeholderTag}</span>
      </div>
    </div>
  );
}
