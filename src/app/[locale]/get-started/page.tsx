import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GetStartedFlow from "@/components/GetStartedFlow";
import { localeAlternates, canonicalFor, ogLocale, ogAlternateLocales } from "@/i18n/alternates";
import { PRICING_TIERS } from "@/data/pricing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const canonical = canonicalFor(locale, "/get-started");
  return {
    title: { absolute: t("getStartedTitle") },
    description: t("getStartedDescription"),
    alternates: { canonical, languages: localeAlternates("/get-started") },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "Stroyka",
      title: t("getStartedTitle"),
      description: t("getStartedDescription"),
      locale: ogLocale[locale],
      alternateLocale: ogAlternateLocales(locale),
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Stroyka — Construction Management App" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("getStartedTitle"),
      description: t("getStartedDescription"),
      images: ["/og-image.png"],
    },
  };
}

/**
 * Server-rendered stand-in for the client flow.
 *
 * `GetStartedFlow` is a client component using `useSearchParams()`, so it is
 * suspended during SSR. With a bare `<Suspense>` and no fallback that meant
 * this route served Navbar + Footer and NOTHING else: 77 words, no `<h1>`,
 * at sitemap priority 0.9 — and Search Console duly filed pages under
 * "Crawled - currently not indexed".
 *
 * The fallback carries the real step-1 heading and subhead, so a crawler that
 * does not execute JavaScript still gets a titled page with a proposition on
 * it. On hydration the flow replaces this wholesale, so the document never
 * holds two `<h1>`s at once. It doubles as a genuine loading state, which the
 * route also lacked.
 */
async function GetStartedFallback({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "getStarted" });
  return (
    <section className="relative bg-site-night pb-16 pt-32 text-site-paper md:pb-24 md:pt-40">
      <div className="mx-auto max-w-[1200px] px-5 md:px-10">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-site-vis">01 / 02</p>
        <h1 className="max-w-[16ch] font-flex text-[clamp(2.4rem,5.6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.03em] [font-variation-settings:'wdth'_110]">
          {t("chooseYourPlan")}
        </h1>
        <p className="mt-6 max-w-lg text-[16.5px] leading-relaxed text-site-paper/70">
          {t("noPerSeatFees")}
        </p>

        {/*
          The plans, server-rendered. An <h1> alone would not have fixed this:
          "Crawled - currently not indexed" is Google's verdict on a page too
          thin to be worth a slot, and Navbar + heading + subhead is still thin.
          Reading PRICING_TIERS rather than hardcoding also means this stays
          true through the repricing without anyone remembering to edit it.
        */}
        <ul className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3">
          {PRICING_TIERS.map((tier) => (
            <li
              key={tier.name}
              className="rounded-[28px] bg-site-slab p-7 ring-1 ring-site-paper/[0.08] md:p-9"
            >
              <p className="font-flex text-[22px] font-semibold [font-variation-settings:'wdth'_115]">
                {tier.name}
              </p>
              <p className="mt-6 flex items-end gap-2">
                <span className="font-flex text-[clamp(3.2rem,6vw,4.2rem)] font-semibold leading-[0.9] tracking-[-0.03em] tabular-nums [font-variation-settings:'wdth'_110]">
                  {tier.monthlyPrice === 0 ? "$0" : `$${tier.monthlyPrice}`}
                </span>
                <span className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-site-paper/55">
                  {t("perMonthShort")}
                </span>
              </p>
              <p className="mt-4 text-[14px] leading-relaxed text-site-paper/65">
                {tier.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default async function GetStartedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Navbar />
      <Suspense fallback={<GetStartedFallback locale={locale} />}>
        <GetStartedFlow />
      </Suspense>
      <Footer />
    </>
  );
}
