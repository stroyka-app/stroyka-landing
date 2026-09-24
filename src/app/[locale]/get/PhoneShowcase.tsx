"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useReduced } from "@/components/site/ui/useReduced";

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
 *
 * Morning Bone (2026-09-24): the shell is ink, not slate, so the device
 * reads as an object on the bone page; the chip row is a slab track with a
 * forest pill; the field note is a slab tag with a forest pin; the drain bar
 * fills by `scaleX` (transform only), not width.
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
  const prefersReduced = useReduced();
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
        className="mx-auto mb-5 flex w-fit max-w-full gap-0.5 rounded-full bg-site-slab p-1 ring-1 ring-site-paper/[0.08]"
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
              className={`relative rounded-full px-3 py-1.5 text-[13px] font-medium tracking-[-0.005em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-vis sm:px-3.5 ${
                active ? "text-site-on-vis" : "text-site-paper/65 hover:text-site-paper"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="get-chip"
                  className="absolute inset-0 rounded-full bg-site-vis"
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
        {/* Contact shadow: the phone stands on the bone page rather than
            floating in a glow. Static, so the bob reads as lift. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[12%] -bottom-5 h-10 rounded-[50%] bg-site-paper/[0.16] blur-2xl"
        />
        <motion.div
          animate={prefersReduced ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        >
          <motion.figure
            ref={ref}
            onMouseEnter={() => setHover(true)}
            onMouseMove={onMove}
            onMouseLeave={() => { setHover(false); px.set(0.5); py.set(0.5); }}
            style={{
              ...(tilt ? { rotateX, rotateY, transformStyle: "preserve-3d" as const } : {}),
              background:
                "linear-gradient(150deg, rgb(var(--site-paper) / 0.86) 0%, rgb(var(--site-paper)) 55%)",
              boxShadow:
                "0 44px 70px -34px rgb(var(--site-paper) / 0.55), 0 0 0 1px rgb(var(--site-paper) / 0.9), inset 0 1px 0 rgb(var(--site-on-vis) / 0.14)",
            }}
            className="relative m-0 rounded-[46px] p-[9px]"
          >
            <div className="relative aspect-[960/1791] overflow-hidden rounded-[37px] bg-site-slab">
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
            {/* Glass: one soft diagonal sheen across the screen. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-[9px] z-[3] rounded-[37px]"
              style={{
                background:
                  "linear-gradient(115deg, rgb(var(--site-on-vis) / 0.12) 0%, rgb(var(--site-on-vis) / 0.03) 28%, transparent 46%)",
              }}
            />
            {/* Side keys, so the shell reads as hardware and not a frame. */}
            <span aria-hidden className="absolute -left-[3px] top-[22%] h-9 w-[3px] rounded-l-sm bg-site-paper" />
            <span aria-hidden className="absolute -left-[3px] top-[31%] h-14 w-[3px] rounded-l-sm bg-site-paper" />
            <span aria-hidden className="absolute -right-[3px] top-[27%] h-20 w-[3px] rounded-r-sm bg-site-paper" />
          </motion.figure>
        </motion.div>

        {/* The field note for this screen, stamped onto the phone's left edge
            (the gap side, so it never runs off the page's right margin). A
            slab tag with a forest pin where it meets the shell. */}
        {notes && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screen.key}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.82, rotate: -5, y: 6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 380, damping: 16, mass: 0.7 }}
            style={{ top: `${screen.noteTop}%` }}
            className="absolute right-[calc(100%-22px)] z-10 hidden w-[208px] rounded-[16px] bg-site-slab px-4 py-3.5 ring-1 ring-site-paper/[0.1] sm:block"
          >
            <span aria-hidden className="absolute -right-[5px] top-4 h-2.5 w-2.5 rounded-full bg-site-vis ring-[3px] ring-site-slab" />
            <span className="mb-1.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-site-vis">
              <span aria-hidden className="h-px w-3 bg-site-vis" />
              {screen.label}
            </span>
            <span className="block text-[13px] leading-snug text-site-paper/80">{screen.note}</span>
          </motion.div>
        </AnimatePresence>
        )}
      </div>

      {/* Narrow: the note under the phone. */}
      {notes && (
        <div className="mx-auto mt-6 max-w-[300px] text-center sm:hidden">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-site-vis">{screen.label}</p>
          <p className="text-[13.5px] leading-snug text-site-paper/70">{screen.note}</p>
        </div>
      )}

      {/* Autoplay drain: a forest rule that fills by scaleX (transform only). */}
      {!prefersReduced && (
        <div className="mx-auto mt-6 h-[3px] w-[120px] overflow-hidden rounded-full bg-site-paper/10" aria-hidden>
          <motion.div
            key={cycle}
            className="h-full w-full origin-left rounded-full bg-site-vis"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: paused ? undefined : 1 }}
            transition={{ duration: DWELL_MS / 1000, ease: "linear" }}
          />
        </div>
      )}
    </div>
  );
}
