"use client";

import { Fragment, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import FlapText from "../ui/FlapText";
import { ApproveVignette, OfflineVignette, PnlVignette, RolesVignette } from "./Vignettes";
import { useReduced } from "../ui/useReduced";
import { getLenis } from "@/lib/lenis";

const VIGNETTES = [OfflineVignette, RolesVignette, PnlVignette, ApproveVignette] as const;
const TOTAL = VIGNETTES.length;
/** Each card pins this much lower than the one before, so the pile shows its edges (and tabs). */
const STEP_PX = 30;
/** Where the first card pins (px from the viewport top): its tab clears the navbar. */
const BASE_TOP = 100;
const STAMP = { type: "spring", stiffness: 380, damping: 14 } as const;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The job binder: four cards that tilt in flat as they arrive and pile up
 * at the top of the screen, each earlier card sinking back into the stack.
 * Every card is a binder page — punched holes down the left edge and an
 * index tab on top, offset card by card so the buried pages' tabs stay
 * readable above the pile (click one to flip back to it). The live piece
 * of the app sits on the right; three proof chips stamp in on the left
 * as the page lands.
 */
export default function FeatureStack() {
  const t = useTranslations("site.stack");
  const ref = useRef<HTMLDivElement>(null);
  const anchors = useRef<(HTMLDivElement | null)[]>([]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // The page on top of the pile (drives the tab highlight).
  const [top, setTop] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(TOTAL - 1, Math.max(0, Math.floor(v * TOTAL + 0.15)));
    if (i !== top) setTop(i);
  });

  const flipTo = (i: number) => {
    const a = anchors.current[i];
    if (!a) return;
    // The anchor sits in normal flow right above the sticky card: scrolling
    // it to the card's pin line is exactly the moment that page lands on top.
    const y = a.getBoundingClientRect().top + window.scrollY - (BASE_TOP + i * STEP_PX);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section
      id="features"
      // overflow-x-clip, not hidden: a card tilting in (rotateX in perspective)
      // renders its near edge wider than the card and pushed the page into a
      // sideways scroll; `clip` trims it without breaking the sticky stack.
      className="relative overflow-x-clip bg-site-night pb-24 pt-24 text-site-paper md:pb-16 md:pt-36"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <FlapText
          lines={[t("headA"), t("headB")]}
          className="max-w-[16ch] font-flex text-[clamp(2.3rem,5vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.03em] [font-variation-settings:'wdth'_110]"
        />
      </div>

      <div ref={ref} className="relative mx-auto mt-14 max-w-[1400px] px-3 md:mt-20 md:px-10">
        {VIGNETTES.map((V, i) => (
          // A Fragment, not a wrapper: every sticky card must share this one
          // container, or each would stick only within its own box (no pile).
          <Fragment key={i}>
            <div ref={(el) => void (anchors.current[i] = el)} aria-hidden className="h-0" />
            <Card index={i} progress={scrollYProgress} isTop={top === i} buried={i < top} onTab={flipTo}>
              <V />
            </Card>
          </Fragment>
        ))}
      </div>
    </section>
  );
}

function Card({
  index,
  progress,
  isTop,
  buried,
  onTab,
  children,
}: {
  index: number;
  progress: MotionValue<number>;
  isTop: boolean;
  buried: boolean;
  onTab: (i: number) => void;
  children: React.ReactNode;
}) {
  const t = useTranslations(`site.stack.items.${index}`);
  const proof = t.raw("proof") as string[];
  const reduced = useReduced();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start 0.3"] });
  const tilt = useTransform(enter, [0, 1], [16, 0]);
  const lift = useTransform(enter, [0, 1], [60, 0]);
  // Once later cards arrive, this one sinks back into the pile.
  const start = index / TOTAL;
  const scale = useTransform(progress, [start, 1], [1, 1 - (TOTAL - 1 - index) * 0.04]);
  const dim = useTransform(progress, [start, Math.min(1, start + 0.35)], [0, (TOTAL - 1 - index) * 0.1]);
  // The page has "landed" once it's (almost) flat: proof chips stamp then.
  const [landed, setLanded] = useState(false);
  useMotionValueEvent(enter, "change", (v) => {
    const on = v > 0.85;
    if (on !== landed) setLanded(on);
  });
  const stamped = reduced || landed;

  return (
    <div
      className={`relative mb-6 md:sticky md:top-[var(--stack-top)] md:mb-0 ${index === TOTAL - 1 ? "" : "md:h-[82vh]"}`}
      style={{ zIndex: index + 1, ["--stack-top" as string]: `${BASE_TOP + index * STEP_PX}px` }}
    >
      <motion.div
        ref={ref}
        style={reduced ? undefined : { rotateX: tilt, y: lift, scale, transformPerspective: 1400, transformOrigin: "50% 0%" }}
        className="relative"
      >
        {/* Index tab — offset per page so every tab in the pile stays readable. */}
        <button
          type="button"
          onClick={() => onTab(index)}
          aria-label={`${pad(index + 1)} · ${t("kicker")}`}
          data-tab={index}
          data-top={isTop ? "1" : "0"}
          className={`group absolute bottom-full hidden h-[34px] items-center gap-2 rounded-t-[14px] px-4 font-mono text-[10.5px] uppercase tracking-[0.18em] ring-1 ring-site-paper/[0.08] transition-colors duration-200 md:flex ${
            isTop ? "bg-site-vis text-site-on-vis" : "bg-site-slab text-site-paper/60 hover:text-site-paper"
          }`}
          style={{ left: `calc(2.5rem + ${index} * 13.5rem)` }}
        >
          <span className={isTop ? "text-site-on-vis" : "text-site-vis"}>{pad(index + 1)}</span>
          <span>{t("kicker")}</span>
        </button>

        <div
          className={`relative grid gap-6 overflow-hidden rounded-[30px] bg-site-slab p-6 ring-1 ring-site-paper/[0.08] md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-10 md:py-10 md:pl-16 md:pr-10 lg:gap-14 ${
            buried ? "" : "shadow-[0_40px_80px_-50px_rgb(var(--site-paper)/0.45)]"
          }`}
        >
          {/* Binder punches down the left edge. */}
          <div aria-hidden className="absolute bottom-0 left-5 top-0 hidden flex-col justify-center gap-[18%] md:flex">
            {[0, 1, 2].map((k) => (
              <span key={k} className="h-3.5 w-3.5 rounded-full bg-site-night shadow-[inset_0_1px_2px_rgb(var(--site-paper)/0.25)]" />
            ))}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] md:hidden">
              <span className="text-site-vis">{pad(index + 1)}</span>
              <span className="h-px w-8 bg-site-paper/25" />
              <span className="text-site-paper/60">{t("kicker")}</span>
            </div>
            <h3 className="mt-5 max-w-[15ch] font-flex text-[clamp(1.9rem,3.4vw,3.2rem)] font-semibold leading-[0.98] tracking-[-0.025em] [font-variation-settings:'wdth'_108] md:mt-0">
              {t("title")}
            </h3>
            <p className="mt-5 max-w-[30rem] text-[15.5px] leading-relaxed text-site-paper/70">{t("body")}</p>

            {/* Proof chips: restate what the card promises, stamped on as it lands. */}
            <ul data-proof className="mt-7 flex flex-wrap gap-2.5">
              {proof.map((p, k) => (
                <motion.li
                  key={p}
                  initial={false}
                  animate={stamped ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0.6, rotate: -8, opacity: 0 }}
                  transition={reduced ? { duration: 0 } : { ...STAMP, delay: stamped ? 0.08 + k * 0.09 : 0 }}
                  className="flex items-center gap-2 rounded-full bg-site-night px-3.5 py-2 text-[13px] font-medium ring-1 ring-site-paper/10"
                >
                  <svg aria-hidden viewBox="0 0 14 14" className="h-3.5 w-3.5 flex-shrink-0 text-site-vis">
                    <circle cx="7" cy="7" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <motion.path
                      d="M4.2 7.2 L6.2 9.1 L9.8 5.2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={false}
                      animate={{ pathLength: stamped ? 1 : 0 }}
                      transition={{ duration: reduced ? 0 : 0.35, delay: stamped ? 0.25 + k * 0.09 : 0 }}
                    />
                  </svg>
                  {p}
                </motion.li>
              ))}
            </ul>
          </div>
          <div>{children}</div>
          {!reduced && <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-site-night" style={{ opacity: dim }} />}
        </div>
      </motion.div>
    </div>
  );
}
