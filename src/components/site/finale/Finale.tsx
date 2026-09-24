"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import {motion, useScroll, useTransform} from "motion/react";
import FlapText from "../ui/FlapText";
import VisButton from "../ui/VisButton";
import { useSignupHref } from "@/lib/hooks/useSignupHref";
import { useCtaTracker } from "@/lib/hooks/useCtaTracker";
import { useReduced } from "../ui/useReduced";

/**
 * The close: hi-vis field, one line of type set as big as the screen allows,
 * two buttons. A faint crane silhouette drifts across behind the type as you
 * scroll through, the last echo of the opening scene.
 */
export default function Finale() {
  const t = useTranslations("cta");
  const signupHref = useSignupHref();
  const track = useCtaTracker("cta_banner");
  const reduced = useReduced();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["18%", "-22%"]);

  return (
    <section id="finale" ref={ref} className="relative overflow-hidden bg-site-vis text-site-on-vis">
      {!reduced && (
        <motion.svg
          aria-hidden
          style={{ x }}
          viewBox="0 0 600 300"
          className="pointer-events-none absolute -bottom-2 right-0 h-[82%] w-auto opacity-[0.09]"
        >
          {/* mast */}
          <path d="M300 300 V40" stroke="currentColor" strokeWidth="10" />
          {Array.from({ length: 13 }).map((_, i) => (
            <path key={i} d={`M292 ${290 - i * 20} L308 ${280 - i * 20}`} stroke="currentColor" strokeWidth="3" />
          ))}
          {/* jib + counter-jib */}
          <path d="M140 40 H590" stroke="currentColor" strokeWidth="8" />
          <path d="M300 10 L590 40 M300 10 L140 40 M300 10 V40" stroke="currentColor" strokeWidth="3" fill="none" />
          <rect x="140" y="40" width="40" height="30" fill="currentColor" />
          {/* hook + load */}
          <path d="M470 44 V170" stroke="currentColor" strokeWidth="2" />
          <rect x="430" y="170" width="80" height="54" fill="currentColor" />
        </motion.svg>
      )}

      <div className="relative mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
        <FlapText
          lines={[t("run"), t("cleaner"), t("jobsite")]}
          plate="rgb(var(--site-on-vis))"
          className="font-flex text-[clamp(3.4rem,11vw,11.5rem)] font-bold leading-[0.86] tracking-[-0.04em] [font-variation-settings:'wdth'_118]"
        />
        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <p className="max-w-xl text-[17px] leading-relaxed text-site-on-vis/80 md:text-[19px]">{t("subhead")}</p>
          <div className="flex flex-wrap gap-3">
            <VisButton href={signupHref} variant="dark" size="lg" onClick={() => track("cta_start_free")}>
              {t("startFree")}
            </VisButton>
            <VisButton
              href="/demo"
              size="lg"
              variant="line"
              onClick={() => track("cta_book_demo")}
            >
              {t("bookDemo").replace(" →", "")}
            </VisButton>
          </div>
        </div>
        <p className="mt-20 border-t border-site-on-vis/20 pt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-site-on-vis/70">
          {t("freeUpTo5")}
          <span className="mx-3 opacity-40">/</span>
          {t("jobCostingFree")}
          <span className="mx-3 opacity-40">/</span>
          {t("cancelAnytime")}
        </p>
      </div>
    </section>
  );
}
