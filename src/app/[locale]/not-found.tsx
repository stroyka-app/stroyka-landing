"use client";

// Client component: not-found.tsx has no `params` prop in Next.js App Router,
// so setRequestLocale cannot be called. Using useTranslations (client) instead,
// which works because this file is wrapped by [locale]/layout.tsx and its
// NextIntlClientProvider.

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FlapText from "@/components/site/ui/FlapText";
import VisButton from "@/components/site/ui/VisButton";
import { useReduced } from "@/components/site/ui/useReduced";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Barricade tape: forest diagonals on bone, rolled out from the left. */
const TAPE = {
  backgroundImage:
    "repeating-linear-gradient(-45deg, rgb(var(--site-vis)) 0 12px, transparent 12px 24px)",
};

export default function NotFound() {
  const t = useTranslations("errors");
  const reduced = useReduced();

  return (
    <>
      <Navbar />
      <main className="relative flex min-h-screen items-center overflow-x-clip bg-site-night pb-24 pt-32 text-site-paper md:pb-36 md:pt-40">
        <div className="mx-auto grid w-full max-w-[1400px] gap-14 px-5 md:px-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-end lg:gap-20">
          {/* The board: 404 opens like the home's headlines, then the job
              gets stamped and taped off. */}
          <div className="relative">
            <FlapText
              as="p"
              immediate
              lines={["404"]}
              className="font-flex text-[clamp(9rem,38vw,24rem)] font-semibold leading-[0.8] tracking-[-0.05em] tabular-nums [font-variation-settings:'wdth'_120]"
            />

            <motion.div
              aria-hidden
              initial={reduced ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
              className="mt-6 h-3 w-full max-w-[640px] origin-left rounded-full ring-1 ring-inset ring-site-vis/40 md:mt-8 md:h-4"
              style={TAPE}
            />

            <motion.div
              initial={reduced ? false : { scale: 0, rotate: -18, opacity: 0 }}
              animate={{ scale: 1, rotate: -9, opacity: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 14, delay: 0.7 }}
              className="pointer-events-none absolute right-2 top-[18%] origin-center sm:right-auto sm:left-[46%] md:top-[22%]"
            >
              <span className="relative block rounded-lg border-[2.5px] border-site-vis bg-site-night px-4 py-2 font-flex text-site-vis [font-variation-settings:'wdth'_125] md:px-5 md:py-2.5">
                {!reduced && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-lg ring-2 ring-site-vis"
                    initial={{ scale: 1, opacity: 0.7 }}
                    animate={{ scale: 1.85, opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.77 }}
                  />
                )}
                <span className="block whitespace-nowrap text-[20px] font-extrabold uppercase leading-none tracking-[0.04em] md:text-[28px]">
                  {t("nfEyebrow")}
                </span>
              </span>
            </motion.div>
          </div>

          <div className="lg:pb-3">
            <FlapText
              as="h1"
              immediate
              delay={0.15}
              lines={[t("nfTitle")]}
              className="font-flex text-[clamp(2rem,4.2vw,3.6rem)] font-semibold leading-[0.98] tracking-[-0.03em] [font-variation-settings:'wdth'_110]"
            />
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4, ease: EASE }}
              className="mt-6 max-w-md text-[16px] leading-relaxed text-site-paper/70 md:text-[17px]"
            >
              {t("nfBody")}
            </motion.p>
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5, ease: EASE }}
              className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8"
            >
              <VisButton href="/" size="lg">
                {t("nfBackHome")}
              </VisButton>
              <Link
                href="/demo"
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-site-paper/55 transition-colors hover:text-site-vis focus-visible:text-site-vis focus-visible:outline-none"
              >
                {t("nfBookDemo")}
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
