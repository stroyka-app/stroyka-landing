"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {motion, useMotionValueEvent, useScroll, useSpring, useTransform} from "motion/react";
import { useReduced } from "../ui/useReduced";

/**
 * "Know every ___." A fixed prefix; the words scroll past a spotlight and
 * only the one on the line is lit. Pinned for a few screens so each word
 * gets its moment. Reduced motion: the full list, all lit, no pin.
 *
 * The prefix and the rolling word share one line, and the words differ by
 * locale ("gallon of fuel." vs "галлон топлива."), so the line's type size
 * is fitted to the widest word: never larger than the design clamp, scaled
 * down only when prefix + gap + widest word would run past the container.
 */
export default function KnowEvery() {
  const t = useTranslations("site.know");
  const words = t.raw("words") as string[];
  const reduced = useReduced();
  const compact = useCompact();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
  // Word index as a continuous value, 0 → n−1.
  const pos = useTransform(smooth, [0.08, 0.92], [0, words.length - 1], { clamp: true });
  const y = useTransform(pos, (v) => `${-v * 1.08}em`);
  const [active, setActive] = useState(0);
  useMotionValueEvent(pos, "change", (v) => setActive(Math.round(v)));
  const { rowRef, prefixRef, measureRef, fit } = useFitLine(words.join("\n"), !compact && !reduced);

  // Phones: no pin. A 400vh sticky stage parked the closing line a
  // screen away from the words, and a full-height sticky at the bottom
  // edge is exactly what iOS 26 samples into its toolbar tint. Instead
  // the words flow as a list and each lights as it crosses mid-screen.
  if (compact && !reduced) {
    return (
      <section id="know" className="bg-site-night px-5 py-24 text-site-paper">
        <div className="font-flex text-[clamp(2.3rem,10vw,3.4rem)] font-semibold leading-[1.06] tracking-[-0.035em] [font-variation-settings:'wdth'_108]">
          <p>{t("prefix")}</p>
          <ul className="mt-1">
            {words.map((w) => (
              <motion.li
                key={w}
                initial={{ color: "rgb(var(--site-paper) / 0.5)" }}
                whileInView={{ color: "rgb(var(--site-vis))" }}
                viewport={{ margin: "-42% 0px -42% 0px" }}
                transition={{ duration: 0.25 }}
              >
                {w}
              </motion.li>
            ))}
          </ul>
        </div>
        <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-site-paper/70">{t("foot")}</p>
      </section>
    );
  }

  if (reduced) {
    return (
      <section id="know" className="bg-site-night px-5 py-28 text-site-paper md:px-10">
        <p className="mx-auto max-w-[1400px] font-flex text-[clamp(2.4rem,6vw,5.6rem)] font-semibold leading-[1.08] tracking-[-0.03em]">
          {t("prefix")} <span className="text-site-vis">{words.join(" · ")}</span>
        </p>
      </section>
    );
  }

  return (
    <section
      id="know"
      ref={ref}
      className="relative bg-site-night text-site-paper"
      style={{ height: `${words.length * 70 + 60}vh`, ["--know-fit" as string]: fit ? `${fit}px` : undefined }}
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* Spotlight band */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-[1.3em] -translate-y-1/2 font-flex text-[length:min(clamp(2.6rem,7.4vw,7.6rem),var(--know-fit,7.6rem))] md:block">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-site-vis/[0.06] to-transparent" />
        </div>
        <div
          ref={rowRef}
          className="relative mx-auto flex w-full max-w-[1400px] flex-col items-start gap-[0.12em] px-5 font-flex text-[length:min(clamp(2.3rem,8.4vw,7.6rem),var(--know-fit,7.6rem))] md:flex-row md:items-center md:gap-[0.28em] md:text-[length:min(clamp(2.6rem,7.4vw,7.6rem),var(--know-fit,7.6rem))] font-semibold leading-none tracking-[-0.035em] [font-variation-settings:'wdth'_108] md:px-10"
        >
          <span ref={prefixRef} className="shrink-0">{t("prefix")}</span>
          {/* Measuring copies of every word, same type, never painted. */}
          <span ref={measureRef} aria-hidden className="invisible absolute left-0 top-0 flex flex-col">
            {words.map((w) => (
              <span key={w} className="whitespace-nowrap">{w}</span>
            ))}
          </span>
          <span className="relative h-[1.08em] w-full min-w-0 md:flex-1">
            {/* Fade the list out above and below the line. */}
            <span
              className="absolute inset-x-0 -top-[3.3em] block h-[7.7em]"
              style={{ maskImage: "linear-gradient(to bottom, transparent 0%, #000 38%, #000 62%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 38%, #000 62%, transparent 100%)" }}
            >
              <motion.span className="absolute inset-x-0 top-[3.3em] block" style={{ y }}>
                {words.map((w, i) => (
                  <span
                    key={w}
                    className={`block h-[1.08em] whitespace-nowrap transition-colors duration-300 ${i === active ? "text-site-vis" : "text-site-paper/50"}`}
                  >
                    {w}
                  </span>
                ))}
              </motion.span>
            </span>
          </span>
        </div>
        <p className="absolute bottom-10 left-5 max-w-sm text-[14px] leading-relaxed text-site-paper/70 md:left-10">{t("foot")}</p>
      </div>
    </section>
  );
}

/**
 * Fits the pinned line to its container. Widths are read in em (font-size
 * independent, since tracking and the gap are em too), so the result is a
 * single px cap: `available / (prefix + gap + widest word)`. The CSS keeps
 * min(design clamp, cap), so wide screens and short words keep the design
 * size and nothing animates. Re-measures on resize and once fonts load.
 */
function useFitLine(wordsKey: string, pinned: boolean) {
  const rowRef = useRef<HTMLDivElement>(null);
  const prefixRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [fit, setFit] = useState<number | null>(null);

  useLayoutEffect(() => {
    const row = rowRef.current;
    const prefix = prefixRef.current;
    const measure = measureRef.current;
    if (!row || !prefix || !measure) return;
    const run = () => {
      const cs = getComputedStyle(row);
      const fs = parseFloat(cs.fontSize);
      if (!fs) return;
      const stacked = cs.flexDirection === "column";
      const widest = Math.max(...[...measure.children].map((c) => (c as HTMLElement).getBoundingClientRect().width));
      const prefixW = prefix.getBoundingClientRect().width;
      const gap = parseFloat(cs.columnGap) || 0;
      const available = row.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      // Stacked (prefix above the word): each line fits on its own.
      const needEm = stacked ? Math.max(prefixW, widest) / fs : (prefixW + gap + widest) / fs;
      // A hair of slack so subpixel rounding never clips the final period.
      const cap = Math.floor((available / (needEm + 0.04)) * 100) / 100;
      setFit((prev) => (prev === cap ? prev : cap));
    };
    run();
    const ro = new ResizeObserver(run);
    ro.observe(row);
    let alive = true;
    document.fonts?.ready.then(() => alive && run());
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, [wordsKey, pinned]);

  return { rowRef, prefixRef, measureRef, fit };
}

/** ≤767px, after mount (SSR renders the pinned desktop version). */
function useCompact(): boolean {
  const [c, setC] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setC(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return c;
}
