import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import DpaContent from "./DpaContent";
import { ogLocale, ogAlternateLocales } from "@/i18n/alternates";

// Legal pages are English-authoritative: all locales point canonical + hreflang to the EN URL.
const EN_URL = "https://www.getstroyka.com/dpa";
const legalLanguages = { en: EN_URL, es: EN_URL, ru: EN_URL, "x-default": EN_URL };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: { absolute: t("dpaTitle") },
    description: t("dpaDescription"),
    alternates: { canonical: EN_URL, languages: legalLanguages },
    openGraph: {
      type: "website",
      url: EN_URL,
      siteName: "Stroyka",
      title: t("dpaTitle"),
      description: t("dpaDescription"),
      locale: ogLocale[locale],
      alternateLocale: ogAlternateLocales(locale),
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Stroyka — Construction Management App" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("dpaTitle"),
      description: t("dpaDescription"),
      images: ["/og-image.png"],
    },
  };
}

export default async function DpaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DpaContent locale={locale} />;
}
