"use client";

import { useTranslations } from "next-intl";
import AmbientBackdrop from "@/components/ui/AmbientBackdrop";
import PhoneShowcase, { type Screen } from "../get/PhoneShowcase";
import ProofStrip, { type Proof } from "../get/ProofStrip";
import StartCta from "./StartCta";

/**
 * /start, rebuilt 2026-09-16 in the register the /get desktop rebuild set:
 * bone ground, Fraunces headline, the product shown working rather than
 * described, field notes pinned to the screen they explain.
 *
 * THE CONSTRAINT THIS PAGE IS BUILT AGAINST. /start exists because the home
 * page takes 1.5 to 3.5 s to paint inside the Facebook and Instagram in-app
 * browsers, and a cold ad click leaves before it does — the measured cause of
 * a failed $57 test (Strategy/2026-09-12). So every decision here is made
 * twice: once for how it looks, once for what it costs to paint.
 *
 * How the polish is paid for without spending the paint budget:
 * - The page is a server component (page.tsx). The kicker, headline, promise
 *   line, CTA and the FIRST phone screen all arrive as HTML, so the largest
 *   contentful paint is a static image and static text and never waits on JS.
 * - `PhoneShowcase` and `ProofStrip` are the components /get already uses,
 *   not lookalikes. They render their initial frame during SSR; framer-motion
 *   arrives in a split chunk afterwards and only then does anything move.
 * - Everything animated is opacity and transform, which stay on the GPU.
 *   Both components already honour `useReducedMotion`.
 *
 * ORDER IS DELIBERATE AND DIFFERS FROM /get. The CTA sits directly under the
 * promise line, ABOVE the phone, so the one action is inside the first
 * screenful on a 390 px phone. /get can afford to end with its handoff card
 * because a desktop visitor is browsing; an ad click is not.
 *
 * No Navbar, unlike /get. A paid landing page offers one action; links to
 * Features and Pricing are ways to leave it.
 */
export default function StartHero({ locale }: { locale: string }) {
  const t = useTranslations("start");
  const g = useTranslations("getStarted");
  const legalPrefix = locale === "en" ? "" : `/${locale}`;

  const screens: Screen[] = (
    ["report", "projects", "tasks", "requests"] as const
  ).map((key, i) => ({
    key,
    label: g(`desktopScreens.${key}.label`),
    note: g(`desktopScreens.${key}.note`),
    // Report leads here, not Projects: the ad's promise is "know what each
    // job actually made", and the Report screen is that sentence as a
    // picture. The page and the creative have to say the same thing.
    noteTop: [38, 16, 30, 22][i],
    src: `/get/screen-${key}.jpg`,
    alt: g(`desktopScreens.${key}.alt`),
  }));

  const proofs: Proof[] = [
    { icon: "clock", title: g("desktopProof1Title"), detail: g("desktopProof1Detail") },
    { icon: "scan", title: g("desktopProof2Title"), detail: g("desktopProof2Detail") },
    { icon: "offline", title: g("desktopProof3Title"), detail: g("desktopProof3Detail") },
  ];

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4] px-6 pb-12 pt-[calc(env(safe-area-inset-top,0px)+2rem)] lg:pt-16">
      <AmbientBackdrop />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-14">
          {/* Left on desktop, top on a phone: the words and the one action. */}
          <div className="lg:py-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              {t("kicker")}
            </p>

            <h1 className="mt-4 font-display text-[40px] font-light leading-[1.05] tracking-[-0.01em] text-ink sm:text-[52px] lg:text-[60px]">
              {t("h1")}
            </h1>

            <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">
              {t("line")}
            </p>

            {/* Ink on bone, the same contrast the /get store buttons use.
                The previous CTA was brand-deep on the forest gradient, which
                measured 1.40:1 against its own background on a phone — the
                label was legible, the button did not read as a button. */}
            <div className="mt-8">
              <StartCta
                locale={locale}
                label={t("cta")}
                className="inline-flex w-full items-center justify-center rounded-full bg-ink px-8 py-4 font-heading text-[16px] font-semibold tracking-wide text-bone shadow-[0_10px_28px_-12px_rgba(46,38,28,0.55)] transition-colors hover:bg-ink-soft sm:w-auto"
              />
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                {t("bullet3")}
              </p>
            </div>
          </div>

          {/* The product, working. */}
          <div className="lg:py-6">
            <PhoneShowcase screens={screens} />
          </div>
        </div>

        <div className="mt-12 lg:mt-14">
          <ProofStrip items={proofs} />
        </div>

        <footer className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ink/10 pt-5 pb-[env(safe-area-inset-bottom,0px)] font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          <span>© {new Date().getFullYear()} Stroyka</span>
          <a className="transition-colors hover:text-ink-soft" href={`${legalPrefix}/privacy`}>
            {t("privacy")}
          </a>
          <a className="transition-colors hover:text-ink-soft" href={`${legalPrefix}/terms`}>
            {t("terms")}
          </a>
        </footer>
      </div>
    </main>
  );
}
