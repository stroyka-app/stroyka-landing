import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { localeAlternates, canonicalFor, ogLocale } from "@/i18n/alternates";
import { routing } from "@/i18n/routing";
import StartHero from "./StartHero";

/**
 * /start: the paid landing for Facebook and Instagram traffic.
 *
 * Rebuilt 2026-09-16 into the register the /get desktop rebuild set. The
 * brief that created this route has not changed and still governs it:
 * content on screen fast enough that a cold tap inside an in-app browser
 * does not give up first. What changed is that "fast" and "plain" turned
 * out not to be the same requirement — see StartHero for how the polish is
 * paid for without spending the paint budget.
 *
 * Still true, and deliberately so: no video, no three.js, no lenis, no
 * smooth scroll, no cursor dot, and SiteChrome still skips this route's
 * motion chrome. The page is a server component; the only client code is
 * the hero island and the two components it shares with /get.
 *
 * noindex: it repeats the home page's intent for a different entry channel,
 * and the home page is the one that should rank.
 */

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "start" });
  const canonical = canonicalFor(locale, "/start");
  return {
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
    alternates: { canonical, languages: localeAlternates("/start") },
    robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "Stroyka",
      title: t("metaTitle"),
      description: t("metaDescription"),
      locale: ogLocale[locale],
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Stroyka" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
      images: ["/og-image.png"],
    },
  };
}

export default async function StartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <StartHero locale={locale} />;
}
