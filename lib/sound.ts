"use client";

import { useSyncExternalStore } from "react";

/**
 * Soft space whoosh for the homepage 3D tiles. Generated with the Web Audio
 * API, so there are no audio files. Off by default: browsers only allow sound
 * after a user gesture, so it starts only from the toggle's click.
 *
 * Tune the feel with the constants below.
 */
const MASTER = 0.3; // overall loudness
const MAX_VOICES = 3; // sounds allowed at once
const MIN_GAP = 0.07; // seconds between sounds
const ARRIVE_SEC = 0.5;
const LEAVE_SEC = 0.4;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let enabled = false;
let lastAt = -1;
let voices = 0;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 4;
    master = ctx.createGain();
    master.gain.value = MASTER;
    master.connect(comp).connect(ctx.destination);
    // One second of soft noise, reused by every sound.
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noise.getChannelData(0);
    let b = 0;
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1;
      b = 0.97 * b + 0.03 * w;
      d[i] = b * 3.5;
    }
    document.addEventListener("visibilitychange", () => {
      if (!ctx) return;
      if (document.hidden) ctx.suspend();
      else if (enabled) ctx.resume();
    });
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

/** Turn sound on or off. Turning on must come from a user gesture. */
export function setSoundEnabled(on: boolean) {
  enabled = on;
  if (on) {
    const c = ensure();
    if (c) playBlip(c);
  }
  emit();
}

export function isSoundOn() {
  return enabled;
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

/** For the toggle button: re-renders when sound changes. */
export function useSoundEnabled() {
  return useSyncExternalStore(subscribe, () => enabled, () => false);
}

/** Short confirmation tone so the person hears that sound is working. */
function playBlip(c: AudioContext) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(660, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(990, c.currentTime + 0.12);
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.12, c.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.18);
  o.connect(g).connect(master!);
  o.start();
  o.stop(c.currentTime + 0.2);
}

interface Shape {
  /** -1 (left) to 1 (right). */
  pan: number;
  /** 0 (small) to 1 (large) tile. */
  size: number;
  /** Scroll speed, 0 (still) to 1 (fast). Fast scroll is quieter and sparser. */
  speed: number;
}

/** Returns false when the sound was skipped (off, too soon, too many). */
function gate(c: AudioContext, speed: number): boolean {
  if (!enabled || !master || !noise) return false;
  if (voices >= MAX_VOICES) return false;
  const now = c.currentTime;
  if (lastAt >= 0 && now - lastAt < MIN_GAP) return false;
  // Fast flicks: play only some of them so they sound like a gentle sweep.
  if (speed > 0.6 && Math.random() < (speed - 0.6) * 2) return false;
  lastAt = now;
  return true;
}

function sweep(c: AudioContext, s: Shape, dur: number, up: boolean, peak: number) {
  const now = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = noise!;
  src.loop = true;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 1.2;
  const lo = (up ? 300 : 1800) * (1 - s.size * 0.25);
  const hi = (up ? 1800 : 300) * (1 - s.size * 0.25);
  bp.frequency.setValueAtTime(lo, now);
  bp.frequency.exponentialRampToValueAtTime(hi, now + dur);
  const g = c.createGain();
  const vol = peak * (1 - s.speed * 0.5);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(vol, now + dur * 0.45);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  const pan = c.createStereoPanner();
  pan.pan.value = Math.max(-1, Math.min(1, s.pan));
  src.connect(bp).connect(g).connect(pan).connect(master!);
  voices++;
  src.start(now);
  src.stop(now + dur + 0.05);
  src.onended = () => {
    voices = Math.max(0, voices - 1);
  };
}

/** A tile has arrived: whoosh up, then a soft low settle. */
export function playArrive(s: Shape) {
  const c = ensure();
  if (!c || !gate(c, s.speed)) return;
  sweep(c, s, ARRIVE_SEC, true, 0.9);
  const now = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  const pan = c.createStereoPanner();
  o.type = "sine";
  o.frequency.value = 140 - s.size * 50;
  g.gain.setValueAtTime(0.0001, now + ARRIVE_SEC * 0.8);
  g.gain.exponentialRampToValueAtTime(0.25 * (1 - s.speed * 0.5), now + ARRIVE_SEC * 0.85);
  g.gain.exponentialRampToValueAtTime(0.0001, now + ARRIVE_SEC * 0.8 + 0.18);
  pan.pan.value = Math.max(-1, Math.min(1, s.pan));
  o.connect(g).connect(pan).connect(master!);
  o.start(now + ARRIVE_SEC * 0.8);
  o.stop(now + ARRIVE_SEC * 0.8 + 0.2);
}

/** A tile has left: a quieter downward sweep. */
export function playLeave(s: Shape) {
  const c = ensure();
  if (!c || !gate(c, s.speed)) return;
  sweep(c, s, LEAVE_SEC, false, 0.5);
}

/* ------------------------------------------------------------------ */
/* Pointer sounds: hover (glassy tick), release, and click confirmation. */

const HOVER_GAP = 0.06; // seconds between hover sounds
const HOVER_NOTES = [1200, 1350, 1500, 1800, 2000, 2200]; // one note per tile, consistent
let lastHover = -1;

function hoverGate(c: AudioContext): boolean {
  if (!enabled || !master || !noise) return false;
  if (voices >= MAX_VOICES) return false;
  const now = c.currentTime;
  if (lastHover >= 0 && now - lastHover < HOVER_GAP) return false;
  lastHover = now;
  return true;
}

function panNode(c: AudioContext, pan: number) {
  const p = c.createStereoPanner();
  p.pan.value = Math.max(-1, Math.min(1, pan));
  return p;
}

/** Glassy tick with a faint shimmer when the mouse arrives on a tile. */
export function playHover({ pan, pitch }: { pan: number; pitch: number }) {
  const c = ensure();
  if (!c || !hoverGate(c)) return;
  const now = c.currentTime;
  const f = HOVER_NOTES[Math.floor(Math.max(0, Math.min(0.999, pitch)) * HOVER_NOTES.length)];
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.16, now + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.value = f;
  // Quiet overtone for the glassy ring.
  const o2 = c.createOscillator();
  o2.type = "sine";
  o2.frequency.value = f * 2.01;
  const g2 = c.createGain();
  g2.gain.value = 0.2;
  o.connect(g);
  o2.connect(g2).connect(g);
  // Faint high shimmer.
  const src = c.createBufferSource();
  src.buffer = noise!;
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 4000;
  const sg = c.createGain();
  sg.gain.setValueAtTime(0.03, now);
  sg.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
  src.connect(hp).connect(sg).connect(g);
  g.connect(panNode(c, pan)).connect(master!);
  voices += 2;
  o.start(now);
  o2.start(now);
  src.start(now, Math.random() * 0.5);
  o.stop(now + 0.16);
  o2.stop(now + 0.16);
  src.stop(now + 0.14);
  o.onended = () => {
    voices = Math.max(0, voices - 2);
  };
}

/** Softer, lower release when the mouse leaves a tile. */
export function playHoverEnd({ pan, pitch }: { pan: number; pitch: number }) {
  const c = ensure();
  if (!c || !hoverGate(c)) return;
  const now = c.currentTime;
  const f = HOVER_NOTES[Math.floor(Math.max(0, Math.min(0.999, pitch)) * HOVER_NOTES.length)] * 0.75;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.08, now + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.value = f;
  o.connect(g).connect(panNode(c, pan)).connect(master!);
  voices++;
  o.start(now);
  o.stop(now + 0.11);
  o.onended = () => {
    voices = Math.max(0, voices - 1);
  };
}

/** Short low "thock" when a tile is clicked, before its page opens. */
export function playClick({ pan }: { pan: number }) {
  const c = ensure();
  if (!c || !gate(c, 0)) return;
  const now = c.currentTime;
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(180, now);
  o.frequency.exponentialRampToValueAtTime(90, now + 0.12);
  const g = c.createGain();
  g.gain.setValueAtTime(0.28, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
  o.connect(g).connect(panNode(c, pan)).connect(master!);
  voices++;
  o.start(now);
  o.stop(now + 0.15);
  o.onended = () => {
    voices = Math.max(0, voices - 1);
  };
  // Very short tick on top.
  const src = c.createBufferSource();
  src.buffer = noise!;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2000;
  bp.Q.value = 2;
  const tg = c.createGain();
  tg.gain.setValueAtTime(0.1, now);
  tg.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
  src.connect(bp).connect(tg).connect(panNode(c, pan)).connect(master!);
  src.start(now);
  src.stop(now + 0.03);
}
