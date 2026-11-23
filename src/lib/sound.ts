import { useSyncExternalStore } from "react";

/**
 * Tiny sound effects, synthesised with the Web Audio API, so there are no audio files to load.
 * Each one is short and quiet, and only plays in answer to something the visitor did (browsers
 * won't play audio before a click anyway). The speaker button in the top bar mutes them all, and
 * the choice is remembered.
 */

type Sound = "tap" | "toggle" | "open" | "close" | "flick" | "pop" | "duck" | "buzz" | "boop";

const KEY = "sound";
const listeners = new Set<() => void>();
let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

function readMuted() {
  try {
    return localStorage.getItem(KEY) === "off";
  } catch {
    return false;
  }
}
let muted = typeof window === "undefined" ? false : readMuted();

export function setMuted(next: boolean) {
  muted = next;
  try {
    localStorage.setItem(KEY, next ? "off" : "on");
  } catch {
    // Private windows can refuse storage; the toggle still works for this visit.
  }
  listeners.forEach((l) => l());
}

export function useMuted() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => muted,
    () => false,
  );
}

function audio() {
  if (typeof window === "undefined" || muted) return null;
  if (!ctx) {
    const Ctx =
      window.AudioContext ??
      (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
    // One second of white noise, reused for every papery sound.
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** A gain envelope: a fast attack to `peak`, then an exponential fade over `length` seconds. */
function envelope(ac: AudioContext, at: number, peak: number, length: number, attack = 0.004) {
  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
  gain.connect(ac.destination);
  return gain;
}

/** Filtered noise: paper, card and cloth sounds. The filter sweeps from `from` to `to` Hz. */
function rustle(
  ac: AudioContext,
  at: number,
  length: number,
  peak: number,
  from: number,
  to: number,
  q = 0.9,
) {
  const src = ac.createBufferSource();
  src.buffer = noise;
  const filter = ac.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = q;
  filter.frequency.setValueAtTime(from, at);
  filter.frequency.exponentialRampToValueAtTime(to, at + length);
  src.connect(filter).connect(envelope(ac, at, peak, length, 0.012));
  src.start(at, Math.random() * 0.5, length + 0.05);
}

/** A pitched blip that glides from one note to another. */
function tone(
  ac: AudioContext,
  at: number,
  length: number,
  peak: number,
  from: number,
  to: number,
  type: OscillatorType = "sine",
) {
  const osc = ac.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, at);
  osc.frequency.exponentialRampToValueAtTime(to, at + length);
  osc.connect(envelope(ac, at, peak, length));
  osc.start(at);
  osc.stop(at + length + 0.02);
}

export function play(sound: Sound) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + 0.005;
  switch (sound) {
    case "tap": // a soft key click
      rustle(ac, t, 0.035, 0.12, 4200, 2600, 1.4);
      tone(ac, t, 0.03, 0.025, 1900, 1200, "triangle");
      break;
    case "toggle": // a light switch: click down, click up
      rustle(ac, t, 0.03, 0.16, 3600, 2400, 1.6);
      rustle(ac, t + 0.07, 0.03, 0.1, 5200, 3200, 1.6);
      break;
    case "open": // a book slid off the shelf and its cover lifting
      rustle(ac, t, 0.24, 0.1, 900, 3400, 0.7);
      tone(ac, t, 0.09, 0.05, 140, 90);
      break;
    case "close":
      rustle(ac, t, 0.16, 0.07, 2800, 900, 0.7);
      tone(ac, t + 0.1, 0.07, 0.04, 120, 80);
      break;
    case "flick": // a ticket flicked off the pile
      rustle(ac, t, 0.17, 0.12, 1600, 5200, 0.8);
      break;
    case "pop": // a critter popping up
      tone(ac, t, 0.12, 0.08, 380, 820);
      tone(ac, t + 0.05, 0.08, 0.03, 900, 1300, "triangle");
      break;
    case "duck": // and ducking back down
      tone(ac, t, 0.12, 0.06, 620, 260);
      break;
    case "boop": // poking the mascot
      tone(ac, t, 0.16, 0.08, 520, 340, "triangle");
      break;
    case "buzz": {
      // A phone buzzing on a desk, for the waving hand: a low hum pulsed three times.
      for (let i = 0; i < 3; i++) {
        const at = t + i * 0.13;
        const osc = ac.createOscillator();
        osc.type = "square";
        osc.frequency.value = 150;
        const lowpass = ac.createBiquadFilter();
        lowpass.type = "lowpass";
        lowpass.frequency.value = 480;
        osc.connect(lowpass).connect(envelope(ac, at, 0.045, 0.09, 0.008));
        osc.start(at);
        osc.stop(at + 0.11);
      }
      break;
    }
  }
}

/** A short haptic tick on phones that support it. Harmless everywhere else. */
export function haptic(ms = 12) {
  if (muted || typeof navigator === "undefined") return;
  navigator.vibrate?.(ms);
}
