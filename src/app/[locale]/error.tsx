"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import { Link } from "@/i18n/navigation";
import FlapText from "@/components/site/ui/FlapText";
import { useReduced } from "@/components/site/ui/useReduced";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Barricade tape, as on the 404: the work stopped here, not the site. */
const TAPE = {
  backgroundImage:
    "repeating-linear-gradient(-45deg, rgb(var(--site-vis)) 0 12px, transparent 12px 24px)",
};

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");
  const reduced = useReduced();
  // The eyebrow string carries a leading "•" from the old SectionLabel era;
  // the mono kicker doesn't use a dot.
  const kicker = t("eyebrow").replace(/^•\s*/, "");

  return (
    <main className="relative flex min-h-screen items-center overflow-x-clip bg-site-night py-24 text-site-paper">
      <div className="mx-auto w-full max-w-[1400px] px-5 md:px-10">
        <div className="max-w-2xl">
          <motion.div
            aria-hidden
            initial={reduced ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="mb-10 h-3 w-40 origin-left rounded-full ring-1 ring-inset ring-site-vis/40 md:h-4 md:w-56"
            style={TAPE}
          />
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-site-vis">
            {kicker}
          </p>
          <FlapText
            as="h1"
            immediate
            lines={[t("title")]}
            className="font-flex text-[clamp(2.4rem,5.6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.03em] [font-variation-settings:'wdth'_110]"
          />
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: EASE }}
            className="mt-6 max-w-md text-[16px] leading-relaxed text-site-paper/70 md:text-[17px]"
          >
            {t("body")}
          </motion.p>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: EASE }}
            className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8"
          >
            {/* VisButton's shape as a <button> — reset is an action, not a
                route. The knob turns once on hover instead of the arrow. */}
            <button
              type="button"
              onClick={reset}
              className="group inline-flex h-14 items-center gap-4 rounded-full bg-site-vis pl-7 pr-2 text-[16px] font-medium tracking-[-0.005em] text-site-on-vis transition-[background-color,transform] duration-200 ease-out hover:bg-site-vis-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-vis focus-visible:ring-offset-2 focus-visible:ring-offset-site-night"
            >
              <span>{t("tryAgain")}</span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-site-on-vis text-site-vis">
                <RotateCcw
                  size={17}
                  strokeWidth={2.2}
                  className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-[200deg] motion-reduce:transition-none"
                />
              </span>
            </button>
            <Link
              href="/"
              className="font-mono text-[11px] uppercase tracking-[0.2em] text-site-paper/55 transition-colors hover:text-site-vis focus-visible:text-site-vis focus-visible:outline-none"
            >
              {t("backHome")}
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
