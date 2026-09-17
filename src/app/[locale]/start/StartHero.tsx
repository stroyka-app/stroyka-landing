"use client";

import { useTranslations } from "next-intl";
import AmbientBackdrop from "@/components/ui/AmbientBackdrop";
import PhoneShowcase, { type Screen } from "../get/PhoneShowcase";
import ProofStrip, { type Proof } from "../get/ProofStrip";
import LedgerCard from "./LedgerCard";
import StartCta from "./StartCta";

/**
 * /start, rebuilt 2026-09-16 in the register the /get desktop rebuild set:
 * bone ground, Fraunces headline, the product shown working rather than
 * described.
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
 *
 * WHY THIS IS NOT JUST /get WITHOUT THE QR CARD. The two pages share a
 * palette and two components, and for one draft they shared a shape too —
 * Maks called it, 2026-09-16: they looked like duplicates. They are not the
 * same job.
 *
 *   /get is a HANDOFF. The visitor already decided: they scanned a code or
 *   typed the short link. The page's work is to reach a store.
 *
 *   /start is a PITCH. The visitor decided nothing. They tapped an ad out of
 *   a feed, owe us nothing, and leave by reflex.
 *
 * So the pitch gets the element the handoff has no reason to want: LedgerCard,
 * the job's real figures set in type at headline scale. That is the documented
 * reason the screen-recording creative beat the polished one, applied to the
 * page instead of the ad.
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
    // min-h-svh is load-bearing, not cosmetic: the gradient lives on <main>,
    // so a main shorter than the viewport lets the layout's own background
    // show through below the footer as a lighter band. Dropping it in the
    // rebuild is exactly what produced that seam.
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4] px-6 pb-[calc(env(safe-area-inset-bottom,0px)+3rem)] pt-[calc(env(safe-area-inset-top,0px)+2rem)] lg:pt-16">
      <AmbientBackdrop />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center">
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

            <LedgerCard />

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
            <PhoneShowcase screens={screens} notes={false} />
          </div>
        </div>

        <div className="mt-12 lg:mt-14">
          <ProofStrip items={proofs} />
        </div>

        {/* The ask, repeated after the proof.
            The ledger card pushes the first CTA to roughly 646 px down a
            390x852 phone — inside the first screenful there, but below it on
            a 667 px iPhone SE. Arguing before asking is right for a pitch, so
            the order stays and the ask comes back instead. Both are StartCta,
            so both report the tap; `location` is "start" either way and the
            two are not told apart on purpose — we want how many people tapped,
            not which button they used. */}
        <div className="mt-10 lg:hidden">
          <StartCta
            locale={locale}
            label={t("cta")}
            className="inline-flex w-full items-center justify-center rounded-full bg-ink px-8 py-4 font-heading text-[16px] font-semibold tracking-wide text-bone shadow-[0_10px_28px_-12px_rgba(46,38,28,0.55)] transition-colors hover:bg-ink-soft"
          />
        </div>

        <footer className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ink/10 pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
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
