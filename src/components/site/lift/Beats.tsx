"use client";

import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { LOADS } from "../scene/choreo";

/**
 * One caption per lift: what Stroyka did to get that cost onto the job.
 * Swaps with a short mask-rise; a step counter ("03 / 06") keeps the reader
 * oriented inside a long pinned scroll.
 */
export default function Beats({ beat, compact }: { beat: number; compact: boolean }) {
  const t = useTranslations("site.lift.beats");
  if (beat < 0) return null;
  const key = beat >= LOADS.length ? "finale" : String(beat);
  const step = Math.min(beat + 1, LOADS.length);

  return (
    <div
      className={
        compact
          ? "absolute inset-x-5 top-24"
          : "absolute bottom-14 left-6 max-w-[30rem] lg:left-10 xl:bottom-20"
      }
    >
      <div className="mb-3 flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-site-paper/70">
        <span className="tabular-nums text-site-vis">{String(step).padStart(2, "0")}</span>
        <span className="h-px w-10 bg-site-paper/30">
          <motion.span
            className="block h-full origin-left bg-site-vis"
            animate={{ scaleX: step / LOADS.length }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>
        <span className="tabular-nums">{String(LOADS.length).padStart(2, "0")}</span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="font-flex text-[clamp(1.6rem,3.2vw,2.9rem)] font-semibold leading-[1] tracking-[-0.02em] text-site-paper [font-variation-settings:'wdth'_112] [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">
            {t(`${key}.title`)}
          </h3>
          <p className="mt-3 max-w-[27rem] text-[14.5px] leading-relaxed text-site-paper/80 [text-shadow:0_1px_12px_rgba(0,0,0,0.4)] md:text-[15.5px]">
            {t(`${key}.body`)}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
