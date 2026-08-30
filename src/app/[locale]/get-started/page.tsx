import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GetStartedFlow from "@/components/GetStartedFlow";
import { localeAlternates, canonicalFor, ogLocale } from "@/i18n/alternates";
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
    <section className="mx-auto max-w-3xl px-6 pb-24 pt-32 text-center">
      <h1 className="mb-3 font-display text-4xl font-light leading-tight tracking-[-0.02em] text-ink lg:text-5xl">
        {t("chooseYourPlan")}
      </h1>
      <p className="mx-auto max-w-lg text-base text-ink-soft">
        {t("noPerSeatFees")}
      </p>

      {/*
        The plans, server-rendered. An <h1> alone would not have fixed this:
        "Crawled - currently not indexed" is Google's verdict on a page too
        thin to be worth a slot, and Navbar + heading + subhead is still thin.
        Reading PRICING_TIERS rather than hardcoding also means this stays
        true through the repricing without anyone remembering to edit it.
      */}
      <ul className="mx-auto mt-10 grid max-w-2xl gap-4 text-left sm:grid-cols-3">
        {PRICING_TIERS.map((tier) => (
          <li
            key={tier.name}
            className="card-stone rounded-2xl border border-ink/10 p-5"
          >
            <p className="font-heading text-sm font-semibold text-ink">
              {tier.name}
            </p>
            <p className="mt-1 font-display text-2xl font-light tabular-nums text-ink">
              {tier.monthlyPrice === 0 ? "$0" : `$${tier.monthlyPrice}`}
              <span className="ml-1 text-sm text-ink-muted">
                {t("perMonthShort")}
              </span>
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
              {tier.description}
            </p>
          </li>
        ))}
      </ul>
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
