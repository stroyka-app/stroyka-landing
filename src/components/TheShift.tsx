"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useTranslations } from "next-intl";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

const ITEM_INDICES = [0, 1, 2, 3];

/**
 * Before column — literally warmer/messier.
 *   - warm tan bg tint (clay-family)
 *   - crosshatch "newsprint" texture overlay
 *   - clay accent ink
 *   - cluttered, slightly tilted time labels
 *
 * Motion: items enter LATE (80ms behind their AFTER twin), with a tiny
 * lateral jitter that reads as ink-smear/flutter. The crosshatch texture
 * itself drifts ~0.4° over 60s — never settles. Hover a row → the paired
 * row in AFTER raises in sympathy (handled at parent level).
 */
function BeforeColumn({
  hoverIdx,
  setHoverIdx,
}: {
  hoverIdx: number | null;
  setHoverIdx: (i: number | null) => void;
}) {
  const t = useTranslations("theShift");
  const prefersReduced = useReducedMotion();
  return (
    <div className="relative">
      {/* Warm tan card with crosshatch noise — texture itself wanders */}
      <motion.div
        animate={
          prefersReduced
            ? undefined
            : { rotate: [0, 0.4, 0, -0.3, 0] }
        }
        transition={
          prefersReduced
            ? undefined
            : { duration: 60, repeat: Infinity, ease: "linear" }
        }
        style={{ transformOrigin: "center center" }}
        className="card-stone-warm texture-crosshatch rounded-2xl border border-ink-soft/25 p-8 lg:p-10 relative overflow-hidden"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full opacity-30 blur-[60px]"
          style={{ background: "radial-gradient(circle, #8F7B5C 0%, transparent 70%)" }}
        />

        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-soft mb-4 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-ink-soft" aria-hidden />
          {t("beforeLabel")}
        </p>
        <h3 className="font-display font-light text-3xl lg:text-[42px] leading-[1.05] text-ink mb-3">
          {t("beforeTitle")}
        </h3>
        <p className="text-[15px] text-ink-soft leading-relaxed mb-10 max-w-md">
          {t("beforeBody")}
        </p>

        <ul className="space-y-0 border-t border-ink-soft/20">
          {ITEM_INDICES.map((i) => (
            <motion.li
              key={i}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              initial={prefersReduced ? false : { opacity: 0, x: -6 }}
              whileInView={
                prefersReduced
                  ? undefined
                  : {
                      opacity: 1,
                      // jitter on entry — flutter, not slide
                      x: [-6, 3, -2, 1, 0],
                    }
              }
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                // Late by 0.08s relative to AFTER index → "chaos misses the beat"
                delay: 0.08 + i * 0.12,
                duration: 0.65,
                ease: [0.34, 1.4, 0.64, 1],
              }}
              animate={
                hoverIdx === i
                  ? { scale: 1.01, x: 0 }
                  : { scale: 1 }
              }
              className="grid grid-cols-[88px_1fr] gap-5 py-5 border-b border-ink-soft/20 relative"
              style={{
                transform: `rotate(${i % 2 === 0 ? 0.2 : -0.15}deg)`,
              }}
            >
              <span className="font-mono text-[12px] tracking-[0.08em] uppercase text-ink-soft pt-1">
                {t(`before.items.${i}.time` as `before.items.${number}.time`)}
              </span>
              <div>
                <p className="font-display text-[19px] leading-snug text-ink mb-1.5">
                  {t(`before.items.${i}.title` as `before.items.${number}.title`)}
                </p>
                <p className="text-[13.5px] text-ink-muted leading-relaxed">
                  {t(`before.items.${i}.caption` as `before.items.${number}.caption`)}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

/**
 * After column — literally cleaner/calmer.
 *   - crisp cream card (warmer than section bg so it reads raised)
 *   - sage-bright accent ink, subtle sage glow halo
 *   - tight vertical alignment, no tilt
 *
 * Motion: items land ON the beat (zero delay relative to scroll-trigger),
 * single ease, no jitter. A SAGE THROUGHLINE (motion.line, pathLength
 * driven by section scroll) draws down the inner edge as the user reads —
 * a literal through-line. Time-label sage dot pulses on enter.
 */
function AfterColumn({
  hoverIdx,
  setHoverIdx,
  pathProgress,
}: {
  hoverIdx: number | null;
  setHoverIdx: (i: number | null) => void;
  pathProgress: import("framer-motion").MotionValue<number>;
}) {
  const t = useTranslations("theShift");
  const prefersReduced = useReducedMotion();
  return (
    <div className="relative">
      <div className="card-stone-sage relative rounded-2xl border border-brand-sage/30 p-8 lg:p-10 overflow-hidden">
        {/* Sage throughline — draws as the user scrolls the section */}
        {!prefersReduced && (
          <svg
            aria-hidden
            className="pointer-events-none absolute left-2 top-32 bottom-8 w-[2px]"
            preserveAspectRatio="none"
            viewBox="0 0 2 400"
          >
            <motion.line
              x1="1"
              y1="0"
              x2="1"
              y2="400"
              stroke="#8AAA91"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ pathLength: pathProgress, opacity: 0.55 }}
            />
          </svg>
        )}

        <span
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full opacity-35 blur-[60px]"
          style={{ background: "radial-gradient(circle, #B8D4BD 0%, transparent 70%)" }}
        />

        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-brand-forest mb-4 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-sage-bright" aria-hidden />
          {t("afterLabel")}
        </p>
        <h3 className="font-display font-light text-3xl lg:text-[42px] leading-[1.05] text-ink mb-3">
          {t("afterTitle")}
        </h3>
        <p className="text-[15px] text-ink-soft leading-relaxed mb-10 max-w-md">
          {t("afterBody")}
        </p>

        <ul className="space-y-0 border-t border-brand-sage/30">
          {ITEM_INDICES.map((i) => (
            <motion.li
              key={i}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              initial={prefersReduced ? false : { opacity: 0, y: 8 }}
              whileInView={
                prefersReduced ? undefined : { opacity: 1, y: 0 }
              }
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                delay: i * 0.12,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              animate={
                hoverIdx === i
                  ? { scale: 1.015, y: -2 }
                  : { scale: 1, y: 0 }
              }
              className="grid grid-cols-[88px_1fr] gap-5 py-5 border-b border-brand-sage/30 relative"
            >
              <span className="font-mono text-[12px] tracking-[0.08em] uppercase text-brand-forest pt-1 inline-flex items-center gap-2">
                {/* Sage dot pulses on enter — "this beat just landed" */}
                <motion.span
                  aria-hidden
                  className="inline-block w-1 h-1 rounded-full bg-brand-sage-bright"
                  initial={prefersReduced ? false : { scale: 0 }}
                  whileInView={
                    prefersReduced
                      ? undefined
                      : { scale: [0, 1.8, 1] }
                  }
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    delay: i * 0.12 + 0.2,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
                {t(`after.items.${i}.time` as `after.items.${number}.time`)}
              </span>
              <div>
                <p className="font-display text-[19px] leading-snug text-ink mb-1.5">
                  {t(`after.items.${i}.title` as `after.items.${number}.title`)}
                </p>
                <p className="text-[13.5px] text-ink-soft/80 leading-relaxed">
                  {t(`after.items.${i}.caption` as `after.items.${number}.caption`)}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function TheShift() {
  const t = useTranslations("theShift");
  // Shared hover state — links paired rows across columns by index
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // Section-bound scroll progress drives the AFTER throughline draw.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 20%"],
  });
  const pathProgress = useSpring(
    useTransform(scrollYProgress, [0.05, 0.65], [0, 1]),
    { stiffness: 100, damping: 28, mass: 0.5 },
  );

  return (
    <section
      ref={sectionRef}
      id="the-shift"
      className="relative bg-gradient-to-b from-[#A89E85] to-[#BFB49C] py-24 lg:py-32"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-20 lg:mb-24">
          <FadeIn>
            <SectionLabel>{t("eyebrow")}</SectionLabel>
          </FadeIn>
          <TextReveal
            as="h2"
            className="font-display font-light text-5xl lg:text-7xl leading-[0.95] tracking-[-0.02em] text-ink mb-6"
          >
            {t("heading")}
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="text-lg text-ink-soft leading-relaxed max-w-xl">
              {t("subhead")}
            </p>
          </FadeIn>
        </div>

        {/* Two columns — intentionally different bg, texture, and accent
            colors so the visual difference carries the story even before
            you read a line item. */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <FadeIn>
            <BeforeColumn hoverIdx={hoverIdx} setHoverIdx={setHoverIdx} />
          </FadeIn>
          <FadeIn delay={0.12}>
            <AfterColumn
              hoverIdx={hoverIdx}
              setHoverIdx={setHoverIdx}
              pathProgress={pathProgress}
            />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
