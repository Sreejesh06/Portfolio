"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "portfolio:sfx-muted";
const MASTER_VOLUME = 0.085;
const HOVER_COOLDOWN_MS = 200;
const SCROLL_SNAP_COOLDOWN_MS = 700;
const INTERACTIVE_SELECTOR =
  'button, a, [role="button"], input[type="button"], input[type="submit"], input[type="reset"], [data-sfx]';

type SfxType =
  | "thread"
  | "shimmer"
  | "breath"
  | "nucleus"
  | "flint"
  | "seal"
  | "iris"
  | "gravity"
  | "resolve";

type PortfolioSfxEventDetail = {
  type: SfxType | string;
  state?: boolean;
};

const clampVolume = (value: number) => Math.max(0, Math.min(1, value));

const LEGACY_TYPE_MAP: Record<string, SfxType> = {
  "hover-soft": "thread",
  "hover-glass": "shimmer",
  "click-pop": "flint",
  "submit-double": "nucleus",
  switch: "seal",
  "form-success": "resolve",
  "scroll-snap": "gravity",
  "first-gesture": "iris",
};

const normalizeSfxType = (value: string | null): SfxType | null => {
  if (!value) return null;

  const lowered = value.trim().toLowerCase();
  if (lowered in LEGACY_TYPE_MAP) {
    return LEGACY_TYPE_MAP[lowered];
  }

  if (
    lowered === "thread" ||
    lowered === "shimmer" ||
    lowered === "breath" ||
    lowered === "nucleus" ||
    lowered === "flint" ||
    lowered === "seal" ||
    lowered === "iris" ||
    lowered === "gravity" ||
    lowered === "resolve"
  ) {
    return lowered;
  }

  return null;
};

const isLikelyCta = (element: Element) => {
  const label = element.textContent?.toLowerCase().replace(/\s+/g, " ").trim() ?? "";
  if (!label) return false;

  return /(send enquiry|book a call|book call|hire me|contact me|get in touch)/i.test(label);
};

const getHoverSfxType = (element: Element): SfxType => {
  const explicitHover = normalizeSfxType(element.getAttribute("data-sfx-hover"));
  if (explicitHover) return explicitHover;

  if (element.closest("nav")) {
    return "thread";
  }

  if (element.closest('[data-sfx-card="true"], article, [class*="card" i], [class*="project" i]')) {
    return "shimmer";
  }

  if (
    element instanceof HTMLButtonElement ||
    (element instanceof HTMLInputElement && ["button", "submit", "reset"].includes(element.type))
  ) {
    return "breath";
  }

  return "thread";
};

const getElementSfxType = (element: Element): SfxType => {
  const explicit = normalizeSfxType(element.getAttribute("data-sfx"));
  if (explicit) return explicit;

  const role = element.getAttribute("role");
  if (role === "switch" || element.getAttribute("aria-pressed") === "true") {
    return "seal";
  }

  if (element instanceof HTMLInputElement && element.type === "submit") {
    return "nucleus";
  }

  if (element instanceof HTMLButtonElement && element.type === "submit") {
    return "nucleus";
  }

  if (element.closest("nav")) {
    return "flint";
  }

  if (isLikelyCta(element)) {
    return "nucleus";
  }

  return "flint";
};

export function SoundEffectProvider() {
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const hasGestureRef = useRef(false);
  const introPlayedRef = useRef(false);
  const lastHoverAtRef = useRef(0);
  const lastScrollSnapAtRef = useRef(0);
  const scrollDebounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    const storedMuted = window.localStorage.getItem(STORAGE_KEY);
    if (storedMuted === "true") {
      setMuted(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, muted ? "true" : "false");
  }, [muted]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const getOrCreateContext = () => {
      if (audioContextRef.current) return audioContextRef.current;

      const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;

      audioContextRef.current = new AudioCtx();
      return audioContextRef.current;
    };

    const resumeContext = () => {
      const ctx = getOrCreateContext();
      if (!ctx) return null;
      if (ctx.state === "suspended") {
        void ctx.resume();
      }
      return ctx;
    };

    const createGainEnvelope = (
      ctx: AudioContext,
      startAt: number,
      attack: number,
      decay: number,
      sustainLevel: number,
      release: number,
      peak: number,
    ) => {
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(clampVolume(peak), startAt + attack);
      gain.gain.exponentialRampToValueAtTime(clampVolume(sustainLevel), startAt + attack + decay);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + attack + decay + release);
      return gain;
    };

    const createMasterBus = (ctx: AudioContext) => {
      const master = ctx.createGain();
      master.gain.setValueAtTime(clampVolume(MASTER_VOLUME), ctx.currentTime);
      master.connect(ctx.destination);
      return master;
    };

    const createWaveshaper = (ctx: AudioContext, drive: number) => {
      const shaper = ctx.createWaveShaper();
      const curve = new Float32Array(2048);
      for (let i = 0; i < curve.length; i += 1) {
        const x = (i / (curve.length - 1)) * 2 - 1;
        curve[i] = Math.tanh(x * drive);
      }
      shaper.curve = curve;
      shaper.oversample = "2x";
      return shaper;
    };

    const triggerTone = (
      ctx: AudioContext,
      opts: {
        frequency: number;
        type: OscillatorType;
        at: number;
        duration: number;
        peak: number;
        sustain?: number;
        attack?: number;
        decay?: number;
        release?: number;
        detune?: number;
        frequencyEnd?: number;
        destination?: AudioNode;
      },
    ) => {
      const osc = ctx.createOscillator();
      const gain = createGainEnvelope(
        ctx,
        opts.at,
        opts.attack ?? 0.003,
        opts.decay ?? Math.max(opts.duration * 0.25, 0.01),
        opts.sustain ?? opts.peak * 0.35,
        opts.release ?? Math.max(opts.duration * 0.75, 0.04),
        opts.peak,
      );

      osc.type = opts.type;
      osc.frequency.setValueAtTime(opts.frequency, opts.at);
      if (typeof opts.frequencyEnd === "number") {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.frequencyEnd), opts.at + opts.duration);
      }
      if (typeof opts.detune === "number") {
        osc.detune.setValueAtTime(opts.detune, opts.at);
      }

      osc.connect(gain);
      gain.connect(opts.destination ?? ctx.destination);
      osc.start(opts.at);
      osc.stop(opts.at + opts.duration);
    };

    const triggerNoise = (
      ctx: AudioContext,
      opts: {
        at: number;
        duration: number;
        peak: number;
        attack?: number;
        release?: number;
        highpass?: number;
        bandpass?: { frequency: number; q: number };
        destination?: AudioNode;
      },
    ) => {
      const frameCount = Math.max(1, Math.floor(ctx.sampleRate * opts.duration));
      const buffer = ctx.createBuffer(1, frameCount, ctx.sampleRate);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i += 1) {
        channelData[i] = Math.random() * 2 - 1;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gain = createGainEnvelope(
        ctx,
        opts.at,
        opts.attack ?? 0.002,
        0.01,
        opts.peak * 0.3,
        opts.release ?? Math.max(opts.duration * 0.6, 0.02),
        opts.peak,
      );

      let output: AudioNode = gain;

      if (typeof opts.highpass === "number") {
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.setValueAtTime(opts.highpass, opts.at);
        gain.connect(hp);
        output = hp;
      }

      if (opts.bandpass) {
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.setValueAtTime(opts.bandpass.frequency, opts.at);
        bp.Q.setValueAtTime(opts.bandpass.q, opts.at);
        output.connect(bp);
        output = bp;
      }

      output.connect(opts.destination ?? ctx.destination);
      source.connect(gain);
      source.start(opts.at);
      source.stop(opts.at + opts.duration);
    };

    const playSfx = (type: SfxType, options?: { state?: boolean }) => {
      if (mutedRef.current || !hasGestureRef.current) return;

      const ctx = resumeContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const master = createMasterBus(ctx);

      if (type === "thread") {
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.setValueAtTime(2800, now);
        hp.Q.setValueAtTime(0.8, now);
        hp.connect(master);

        triggerTone(ctx, {
          frequency: 3400,
          type: "sine",
          at: now,
          duration: 0.03,
          peak: 0.1,
          sustain: 0.015,
          attack: 0.001,
          release: 0.02,
          destination: hp,
        });
        return;
      }

      if (type === "shimmer") {
        triggerNoise(ctx, {
          at: now,
          duration: 0.08,
          peak: 0.13,
          highpass: 1600,
          bandpass: { frequency: 2800, q: 1.8 },
          destination: master,
        });

        triggerTone(ctx, {
          frequency: 1320,
          type: "triangle",
          at: now + 0.004,
          duration: 0.06,
          peak: 0.06,
          sustain: 0.01,
          release: 0.05,
          destination: master,
        });
        return;
      }

      if (type === "breath") {
        triggerTone(ctx, {
          frequency: 180,
          frequencyEnd: 220,
          type: "sine",
          at: now,
          duration: 0.24,
          peak: 0.13,
          sustain: 0.028,
          attack: 0.03,
          release: 0.2,
          destination: master,
        });
        return;
      }

      if (type === "nucleus") {
        triggerTone(ctx, {
          frequency: 140,
          frequencyEnd: 40,
          type: "sine",
          at: now,
          duration: 0.12,
          peak: 0.24,
          sustain: 0.05,
          attack: 0.002,
          release: 0.11,
          destination: master,
        });

        triggerTone(ctx, {
          frequency: 920,
          frequencyEnd: 620,
          type: "sine",
          at: now + 0.008,
          duration: 0.08,
          peak: 0.08,
          sustain: 0.02,
          release: 0.07,
          destination: master,
        });
        return;
      }

      if (type === "flint") {
        triggerNoise(ctx, {
          at: now,
          duration: 0.025,
          peak: 0.19,
          highpass: 2500,
          destination: master,
        });
        return;
      }

      if (type === "seal") {
        const softener = createWaveshaper(ctx, 1.6);
        softener.connect(master);
        const lower = options?.state ? 466 : 440;
        const upper = options?.state ? 494 : 466;

        triggerTone(ctx, {
          frequency: lower,
          type: "square",
          at: now,
          duration: 0.055,
          peak: 0.15,
          sustain: 0.022,
          release: 0.05,
          destination: softener,
        });

        triggerTone(ctx, {
          frequency: upper,
          type: "sine",
          at: now + 0.024,
          duration: 0.065,
          peak: 0.13,
          sustain: 0.018,
          release: 0.05,
          destination: softener,
        });
        return;
      }

      if (type === "iris") {
        const notes = [261.63, 329.63, 392.0];
        notes.forEach((note, index) => {
          triggerTone(ctx, {
            frequency: note,
            type: "sine",
            at: now + index * 0.09,
            duration: 0.28,
            peak: 0.07,
            sustain: 0.018,
            attack: 0.02,
            decay: 0.08,
            release: 0.22,
            destination: master,
          });
        });
        return;
      }

      if (type === "gravity") {
        triggerTone(ctx, {
          frequency: 96,
          frequencyEnd: 38,
          type: "sine",
          at: now,
          duration: 0.22,
          peak: 0.15,
          sustain: 0.03,
          attack: 0.002,
          release: 0.2,
          destination: master,
        });
        return;
      }

      if (type === "resolve") {
        triggerTone(ctx, {
          frequency: 392,
          type: "sine",
          at: now,
          duration: 0.11,
          peak: 0.11,
          sustain: 0.024,
          release: 0.09,
          destination: master,
        });

        triggerTone(ctx, {
          frequency: 587.33,
          type: "sine",
          at: now + 0.08,
          duration: 0.14,
          peak: 0.11,
          sustain: 0.026,
          release: 0.12,
          destination: master,
        });
        return;
      }

      triggerNoise(ctx, {
        at: now,
        duration: 0.02,
        peak: 0.1,
        highpass: 2200,
        destination: master,
      });
    };

    const unlockAudio = () => {
      hasGestureRef.current = true;
      resumeContext();
      if (!introPlayedRef.current) {
        introPlayedRef.current = true;
        playSfx("iris");
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      if (target.closest('[data-sfx-ignore="true"]')) return;

      const interactiveNode = target.closest(INTERACTIVE_SELECTOR);
      if (interactiveNode) {
        hasGestureRef.current = true;
        const type = getElementSfxType(interactiveNode);
        const state = interactiveNode.getAttribute("aria-pressed") === "true";
        playSfx(type, { state });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      if (!supportsHover || !hasGestureRef.current) return;

      const target = e.target as Element | null;
      if (!target) return;
      if (target.closest('[data-sfx-ignore="true"]')) return;

      const interactiveNode = target.closest(INTERACTIVE_SELECTOR);
      if (!interactiveNode) return;

      const relatedNode = e.relatedTarget as Element | null;
      // Prevent redundant sounds when moving over children inside the same interactive container
      if (relatedNode && interactiveNode.contains(relatedNode)) return;

      const now = Date.now();
      if (now - lastHoverAtRef.current < HOVER_COOLDOWN_MS) return;
      lastHoverAtRef.current = now;

      const hoverType = getHoverSfxType(interactiveNode);
      playSfx(hoverType);
    };

    const handleSubmit = (e: SubmitEvent) => {
      const target = e.target;
      if (!(target instanceof HTMLFormElement)) return;
      if (target.closest('[data-sfx-ignore="true"]')) return;

      hasGestureRef.current = true;
      playSfx("nucleus");
    };

    const handleScroll = () => {
      if (!hasGestureRef.current) return;
      const enabled = document.body.getAttribute("data-sfx-scroll") === "true";
      if (!enabled) return;

      if (scrollDebounceTimerRef.current) {
        window.clearTimeout(scrollDebounceTimerRef.current);
      }

      scrollDebounceTimerRef.current = window.setTimeout(() => {
        const now = Date.now();
        if (now - lastScrollSnapAtRef.current < SCROLL_SNAP_COOLDOWN_MS) return;
        lastScrollSnapAtRef.current = now;
        playSfx("gravity");
      }, 120);
    };

    const handlePortfolioSfxEvent = (e: Event) => {
      const customEvent = e as CustomEvent<PortfolioSfxEventDetail>;
      const requestedType = normalizeSfxType(customEvent.detail?.type ?? null);
      if (!requestedType) return;

      hasGestureRef.current = true;
      playSfx(requestedType, { state: customEvent.detail?.state });
    };

    document.addEventListener("pointerdown", unlockAudio, true);
    document.addEventListener("keydown", unlockAudio, true);
    document.addEventListener("click", handleClick, true); // use capture phase to catch before stopPropagation
    document.addEventListener("mouseover", handleMouseOver, true);
    document.addEventListener("submit", handleSubmit, true);
    document.addEventListener("scroll", handleScroll, { capture: true, passive: true });
    window.addEventListener("portfolio:sfx", handlePortfolioSfxEvent as EventListener);

    return () => {
      document.removeEventListener("pointerdown", unlockAudio, true);
      document.removeEventListener("keydown", unlockAudio, true);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("mouseover", handleMouseOver, true);
      document.removeEventListener("submit", handleSubmit, true);
      document.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("portfolio:sfx", handlePortfolioSfxEvent as EventListener);
      if (scrollDebounceTimerRef.current) {
        window.clearTimeout(scrollDebounceTimerRef.current);
      }
      if (audioContextRef.current?.state !== "closed") {
        void audioContextRef.current?.close();
      }
    };
  }, []);

  return (
    <button
      type="button"
      data-sfx-ignore="true"
      onClick={() => {
        setMuted((prev: boolean) => !prev);
      }}
      className="fixed bottom-20 right-4 z-70 inline-flex h-10 items-center gap-2 rounded-full border border-neutral-300 bg-white/85 px-3 py-2 text-xs font-medium text-neutral-800 shadow-sm backdrop-blur-sm transition hover:bg-white dark:border-neutral-700 dark:bg-neutral-900/85 dark:text-neutral-100 dark:hover:bg-neutral-900"
      aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
      aria-pressed={muted}
      title={muted ? "Sound effects off" : "Sound effects on"}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10v4h4l5 4V6L7 10H3z" />
        {muted ? <path d="m16 9 5 6M21 9l-5 6" /> : <path d="M16 9a4 4 0 0 1 0 6M19 7a7 7 0 0 1 0 10" />}
      </svg>
      <span>{muted ? "Muted" : "SFX"}</span>
    </button>
  );
}
