"use client";

import { useTranslations } from "next-intl";
import { MotionConfig } from "framer-motion";
import AmbientBackdrop from "@/components/ui/AmbientBackdrop";
import PhoneShowcase, { type Screen } from "../get/PhoneShowcase";
import ProofStrip, { type Proof } from "../get/ProofStrip";
import LedgerCard from "./LedgerCard";
import StartCta from "./StartCta";

/**
 * /start, rebuilt 2026-09-16 in the register the /get desktop rebuild set,
 * re-skinned 2026-09-24 into Morning Bone (docs/design/morning-bone-system.md):
 * bone page, Roboto Flex semibold headline, mono forest kicker, slab ledger,
 * forest CTA pill, the product shown working rather than described. Nothing
 * new is imported for it: `MotionConfig` ships in the framer chunk the page
 * already loads, and every new movement is CSS or an existing motion.div.
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

  const cta = "inline-flex w-full items-center justify-between gap-4 rounded-full bg-site-vis py-2 pl-7 pr-2 text-[16px] font-medium tracking-[-0.005em] text-site-on-vis transition-[background-color,transform] duration-200 ease-out hover:bg-site-vis-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-site-vis focus-visible:ring-offset-2 focus-visible:ring-offset-site-night group sm:w-auto sm:justify-start";

  return (
    // min-h-svh is load-bearing, not cosmetic: the background lives on <main>,
    // so a main shorter than the viewport lets the layout's own background
    // show through below the footer as a lighter band. Dropping it in the
    // rebuild is exactly what produced that seam.
    <MotionConfig reducedMotion="user">
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-site-night px-5 pb-[calc(env(safe-area-inset-bottom,0px)+3rem)] pt-[calc(env(safe-area-inset-top,0px)+2rem)] text-site-paper md:px-10 lg:pt-16">
      <AmbientBackdrop />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:gap-16">
          {/* Left on desktop, top on a phone: the words and the one action. */}
          <div className="lg:py-6">
            <p className="flex items-start gap-2.5 font-mono text-[11px] uppercase leading-[1.5] tracking-[0.2em] text-site-vis">
              <span className="relative mt-[0.35em] flex h-2 w-2 shrink-0" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-site-vis opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-site-vis" />
              </span>
              {t("kicker")}
            </p>

            {/* Static on purpose: this is the LCP text on a phone, so it
                paints with the HTML and never waits on a reveal. */}
            <h1 className="mt-5 max-w-[14ch] font-flex text-[clamp(2.3rem,9.6vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-site-paper [font-variation-settings:'wdth'_110]">
              {t("h1")}
            </h1>

            <p className="mt-5 max-w-[44ch] text-[16px] leading-relaxed text-site-paper/70 sm:text-[17px]">
              {t("line")}
            </p>

            <LedgerCard />

            <div className="mt-8">
              <StartCta locale={locale} label={t("cta")} className={cta} />
              <p className="mt-3.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-site-paper/55">
                <span aria-hidden className="h-px w-4 bg-site-vis" />
                {t("bullet3")}
              </p>
            </div>
          </div>

          {/* The product, working. */}
          <div className="lg:py-6">
            <PhoneShowcase screens={screens} notes={false} />
          </div>
        </div>

        <div className="mt-14 lg:mt-16">
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
          <StartCta locale={locale} label={t("cta")} className={cta} />
        </div>

        <footer className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-site-paper/10 pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-site-paper/45">
          <span>© {new Date().getFullYear()} Stroyka</span>
          <a className="transition-colors hover:text-site-paper" href={`${legalPrefix}/privacy`}>
            {t("privacy")}
          </a>
          <a className="transition-colors hover:text-site-paper" href={`${legalPrefix}/terms`}>
            {t("terms")}
          </a>
        </footer>
      </div>
    </main>
    </MotionConfig>
  );
}
