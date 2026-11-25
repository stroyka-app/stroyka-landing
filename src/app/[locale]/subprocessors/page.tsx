import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import SubprocessorsContent from "./SubprocessorsContent";
import { ogLocale, ogAlternateLocales } from "@/i18n/alternates";

// Legal pages are English-authoritative: all locales point canonical + hreflang to the EN URL.
const EN_URL = "https://www.getstroyka.com/subprocessors";
const legalLanguages = { en: EN_URL, es: EN_URL, ru: EN_URL, "x-default": EN_URL };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: { absolute: t("subprocessorsTitle") },
    description: t("subprocessorsDescription"),
    alternates: { canonical: EN_URL, languages: legalLanguages },
    openGraph: {
      type: "website",
      url: EN_URL,
      siteName: "Stroyka",
      title: t("subprocessorsTitle"),
      description: t("subprocessorsDescription"),
      locale: ogLocale[locale],
      alternateLocale: ogAlternateLocales(locale),
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Stroyka — Construction Management App" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("subprocessorsTitle"),
      description: t("subprocessorsDescription"),
      images: ["/og-image.png"],
    },
  };
}

export default async function SubprocessorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SubprocessorsContent locale={locale} />;
}
