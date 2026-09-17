"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

export interface Screen {
  key: string;
  /** Chip label, e.g. "Projects". */
  label: string;
  /** The field note pinned to this screen. */
  note: string;
  /** Where the note sits, as a percentage of the phone's height. */
  noteTop: number;
  src: string;
  alt: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const DWELL_MS = 4200;

/**
 * The product, shown working: a device shell that cycles through real
 * screens, a chip row to pick one, an autoplay bar that drains between
 * switches and pauses under the pointer, and one field note per screen that
 * stamps itself onto the phone. A slow whole-pixel bob and a magnetic tilt
 * while hovered (2D at rest so the screenshot text stays crisp). Reduced
 * motion: no bob, no tilt, no autoplay; the chips still switch screens.
 */
export default function PhoneShowcase({
  screens,
  onSelect,
  notes = true,
}: {
  screens: Screen[];
  onSelect?: (key: string, how: "tap" | "auto") => void;
  /**
   * Show the per-screen field note (floating beside the phone on wide
   * viewports, under it on narrow ones). Default true, which is /get.
   *
   * /start passes false: it carries LedgerCard, which makes the same point
   * with the job's actual figures. Two stone cards of the same treatment
   * sitting side by side collided at 1440 and said it twice.
   */
  notes?: boolean;
}) {
  const prefersReduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0); // restarts the drain bar
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  const go = useCallback(
    (i: number, how: "tap" | "auto") => {
      const next = (i + screens.length) % screens.length;
      setIndex(next);
      setCycle((c) => c + 1);
      onSelect?.(screens[next].key, how);
    },
    [screens, onSelect],
  );

  useEffect(() => {
    if (prefersReduced || paused) return;
    const id = window.setTimeout(() => go(index + 1, "auto"), DWELL_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, prefersReduced, go, cycle]);

  // Magnetic tilt
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(px, [0, 1], [-5, 5]), { stiffness: 160, damping: 18, mass: 0.5 });
  const rotateX = useSpring(useTransform(py, [0, 1], [5, -5]), { stiffness: 160, damping: 18, mass: 0.5 });
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  const tilt = !prefersReduced && hover;
  const screen = screens[index];

  return (
    <div
      className="relative mx-auto w-full max-w-[420px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Chips: which screen. */}
      <div
        role="tablist"
        aria-label="App screens"
        className="mx-auto mb-5 flex w-fit max-w-full gap-1 rounded-full bg-ink/[0.06] p-1 backdrop-blur-sm"
      >
        {screens.map((s, i) => {
          const active = i === index;
          return (
            <button
              key={s.key}
              role="tab"
              aria-selected={active}
              onClick={() => go(i, "tap")}
              onMouseEnter={() => go(i, "tap")}
              className={`relative rounded-full px-3.5 py-1.5 font-heading text-[12.5px] font-semibold transition-colors ${
                active ? "text-bone" : "text-ink-soft hover:text-ink"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="get-chip"
                  className="absolute inset-0 rounded-full bg-brand-deep"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Phone */}
      <div className="relative mx-auto w-[260px] sm:w-[300px] lg:w-[320px]">
        <motion.div
          animate={prefersReduced ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        >
          <motion.figure
            ref={ref}
            onMouseEnter={() => setHover(true)}
            onMouseMove={onMove}
            onMouseLeave={() => { setHover(false); px.set(0.5); py.set(0.5); }}
            style={tilt ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
            className="relative m-0 rounded-[44px] bg-gradient-to-br from-[#3a4a52] to-[#24313a] p-[10px] shadow-[0_40px_80px_-24px_rgba(20,28,22,0.65),0_0_0_1px_rgba(202,210,197,0.10),0_0_90px_rgba(82,121,111,0.16)]"
          >
            <div className="relative aspect-[960/1791] overflow-hidden rounded-[34px] bg-[#1d3a30]">
              {/* Every screen stays mounted (no reload on switch); the active
                  one slides in over the last. */}
              {screens.map((s, i) => (
                <motion.div
                  key={s.key}
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    opacity: i === index ? 1 : 0,
                    x: prefersReduced ? 0 : i === index ? 0 : i < index ? -18 : 18,
                    scale: i === index ? 1 : 0.985,
                  }}
                  transition={{ duration: 0.5, ease: EASE }}
                  style={{ zIndex: i === index ? 2 : 1 }}
                  aria-hidden={i !== index}
                >
                  <Image src={s.src} alt={s.alt} fill priority={i === 0} sizes="320px" className="object-cover object-top" />
                </motion.div>
              ))}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-[10px] rounded-[34px]"
              style={{ background: "linear-gradient(115deg, rgba(255,253,243,0.10) 0%, rgba(255,253,243,0.02) 28%, transparent 46%)" }}
            />
          </motion.figure>
        </motion.div>

        {/* The field note for this screen, stamped onto the phone's left edge
            (the gap side, so it never runs off the page's right margin). */}
        {notes && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screen.key}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.82, rotate: -5, y: 6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 380, damping: 16, mass: 0.7 }}
            style={{ top: `${screen.noteTop}%` }}
            className="card-stone-sage absolute right-[calc(100%-22px)] hidden w-[200px] rounded-[14px] px-3.5 py-3 sm:block"
          >
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-brand-forest">
              {screen.label}
            </span>
            <span className="block text-[12.5px] leading-snug text-ink">{screen.note}</span>
          </motion.div>
        </AnimatePresence>
        )}
      </div>

      {/* Narrow: the note under the phone. */}
      {notes && (
        <div className="mx-auto mt-4 max-w-[300px] text-center sm:hidden">
          <p className="text-[13px] leading-snug text-ink-soft">{screen.note}</p>
        </div>
      )}

      {/* Autoplay drain */}
      {!prefersReduced && (
        <div className="mx-auto mt-5 h-[3px] w-[120px] overflow-hidden rounded-full bg-ink/10" aria-hidden>
          <motion.div
            key={cycle}
            className="h-full rounded-full bg-brand-forest"
            initial={{ width: "0%" }}
            animate={{ width: paused ? undefined : "100%" }}
            transition={{ duration: DWELL_MS / 1000, ease: "linear" }}
          />
        </div>
      )}
    </div>
  );
}
