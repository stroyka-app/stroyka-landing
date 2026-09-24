"use client";

import { useTranslations } from "next-intl";
import {motion} from "motion/react";
import FlapText from "../ui/FlapText";
import ProximityText from "../ui/ProximityText";
import VisButton from "../ui/VisButton";
import { useSignupHref } from "@/lib/hooks/useSignupHref";
import { useCtaTracker } from "@/lib/hooks/useCtaTracker";
import { useReduced } from "../ui/useReduced";

/** The hero's copy, laid over the idling crane. */
export default function LiftHero() {
  const t = useTranslations("site.lift");
  const signupHref = useSignupHref();
  const track = useCtaTracker("hero");
  const reduced = useReduced();
  const lines = [t("h1a"), t("h1b"), t("h1c")];

  return (
    <div className="relative h-full">
      {/* Legibility scrim: left on desktop, top on phones. */}
      <div
        aria-hidden
        className="absolute inset-0 hidden md:block"
        style={{ background: "linear-gradient(to right, rgb(var(--site-night) / var(--hero-scrim)) 0%, rgb(var(--site-night) / var(--hero-scrim-soft)) 38%, rgb(var(--site-night) / 0) 58%)" }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[78%] md:hidden"
        style={{ background: "linear-gradient(to bottom, var(--sky-top) 0%, rgb(var(--site-night) / 0.72) 62%, rgb(var(--site-night) / 0) 100%)" }}
      />

      <div className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-start px-5 pt-28 md:justify-center md:px-10 md:pt-16">
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-site-paper/75 md:mb-7"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-site-vis opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-site-vis" />
          </span>
          {t("kicker")}
        </motion.p>

        <FlapText
          as="h1"
          immediate
          delay={0.15}
          plate="rgb(var(--site-vis))"
          className="font-flex text-[clamp(2.6rem,6.4vw,6.9rem)] leading-[0.92] tracking-[-0.025em] text-site-paper md:max-w-[58vw]"
          lines={lines.map((line, i) => (
            <ProximityText
              key={i}
              text={line}
              base={i === 2 ? 820 : 600}
              peak={1000}
              wdth={112}
              className={i === 2 ? "text-site-vis" : ""}
            />
          ))}
        />

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-[34rem] text-[15px] leading-relaxed text-site-paper/85 md:mt-8 md:text-[17px]"
        >
          {t("sub")}
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 flex flex-wrap items-center gap-3 md:mt-9"
        >
          <VisButton href={signupHref} onClick={() => track("cta_start_free")}>
            {t("startFree")}
          </VisButton>
          <VisButton href="/demo" variant="ghost" onClick={() => track("cta_book_demo")}>
            {t("bookDemo")}
          </VisButton>
        </motion.div>

        <motion.ul
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 hidden flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-site-paper/60 md:flex"
        >
          {[t("spec0"), t("spec1"), t("spec2")].map((s) => (
            <li key={s} className="flex items-center gap-2">
              <span className="h-px w-3 bg-site-vis/70" />
              {s}
            </li>
          ))}
        </motion.ul>
      </div>

      {!reduced && (
        <div className="pointer-events-none absolute inset-x-0 bottom-[calc(var(--toolbar-gap,0px)+28px)] flex flex-col items-center gap-3 text-site-paper/70">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.24em]">{t("scrollCue")}</span>
          <span className="relative h-10 w-px overflow-hidden bg-site-paper/20">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-site-vis"
              animate={{ y: ["-100%", "220%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
            />
          </span>
        </div>
      )}
    </div>
  );
}
