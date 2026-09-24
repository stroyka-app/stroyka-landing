"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import {motion, useScroll, useTransform, type MotionValue} from "motion/react";
import FlapText from "../ui/FlapText";
import { ApproveVignette, OfflineVignette, PnlVignette, RolesVignette } from "./Vignettes";
import { useReduced } from "../ui/useReduced";

const VIGNETTES = [OfflineVignette, RolesVignette, PnlVignette, ApproveVignette] as const;

/**
 * Four cards that tilt in flat as they arrive and pile up at the top of the
 * screen, each earlier card shrinking back into the stack. Every card holds
 * a small working piece of the app, not a screenshot of one.
 */
export default function FeatureStack() {
  const t = useTranslations("site.stack");
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="features" className="relative bg-site-night pb-24 pt-24 text-site-paper md:pt-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <FlapText
          lines={[t("headA"), t("headB")]}
          className="max-w-[16ch] font-flex text-[clamp(2.3rem,5vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.03em] [font-variation-settings:'wdth'_110]"
        />
      </div>

      <div ref={ref} className="relative mx-auto mt-14 max-w-[1400px] px-3 md:mt-20 md:px-10">
        {VIGNETTES.map((V, i) => (
          <Card key={i} index={i} total={VIGNETTES.length} progress={scrollYProgress}>
            <V />
          </Card>
        ))}
      </div>
    </section>
  );
}

function Card({
  index,
  total,
  progress,
  children,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
}) {
  const t = useTranslations(`site.stack.items.${index}`);
  const reduced = useReduced();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start 0.25"] });
  const tilt = useTransform(enter, [0, 1], [16, 0]);
  const lift = useTransform(enter, [0, 1], [60, 0]);
  // Once later cards arrive, this one sinks back into the pile.
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - 1 - index) * 0.045]);
  const dim = useTransform(progress, [start, Math.min(1, start + 0.35)], [0, (total - 1 - index) * 0.12]);

  return (
    <div
      className="relative mb-6 md:sticky md:top-[var(--stack-top)] md:mb-0 md:h-[88vh]"
      style={{ zIndex: index + 1, ["--stack-top" as string]: `calc(8vh + ${index * 26}px)` }}
    >
      <motion.div
        ref={ref}
        style={reduced ? undefined : { rotateX: tilt, y: lift, scale, transformPerspective: 1400, transformOrigin: "50% 0%" }}
        className="relative"
      >
        <div className="relative grid gap-6 overflow-hidden rounded-[30px] bg-site-slab p-6 ring-1 ring-site-paper/[0.08] md:min-h-[68vh] md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-10 md:p-10 lg:p-14">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em]">
              <span className="text-site-vis">{String(index + 1).padStart(2, "0")}</span>
              <span className="h-px w-8 bg-site-paper/25" />
              <span className="text-site-paper/60">{t("kicker")}</span>
            </div>
            <h3 className="mt-6 max-w-[15ch] font-flex text-[clamp(1.9rem,3.6vw,3.4rem)] font-semibold leading-[0.98] tracking-[-0.025em] [font-variation-settings:'wdth'_108]">
              {t("title")}
            </h3>
            <p className="mt-5 max-w-[30rem] text-[15.5px] leading-relaxed text-site-paper/70">{t("body")}</p>
            {/* Oversized index, bottom-left, as a quiet anchor. */}
            <span
              aria-hidden
              className="mt-auto hidden select-none pt-10 font-flex text-[9rem] font-bold leading-[0.8] text-site-paper/[0.04] [font-variation-settings:'wdth'_130] md:block"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div>{children}</div>
          {!reduced && <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />}
        </div>
      </motion.div>
    </div>
  );
}
