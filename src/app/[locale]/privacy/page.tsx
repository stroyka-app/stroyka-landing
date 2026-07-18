import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import PrivacyContent from "./PrivacyContent";
import { ogLocale } from "@/i18n/alternates";

// Legal pages are English-authoritative: all locales point canonical + hreflang to the EN URL.
const EN_PRIVACY = "https://www.getstroyka.com/privacy";
const legalLanguages = { en: EN_PRIVACY, es: EN_PRIVACY, ru: EN_PRIVACY, "x-default": EN_PRIVACY };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: { absolute: t("privacyTitle") },
    description: t("privacyDescription"),
    alternates: { canonical: EN_PRIVACY, languages: legalLanguages },
    openGraph: {
      type: "website",
      url: EN_PRIVACY,
      siteName: "Stroyka",
      title: t("privacyTitle"),
      description: t("privacyDescription"),
      locale: ogLocale[locale],
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Stroyka — Construction Management App" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("privacyTitle"),
      description: t("privacyDescription"),
      images: ["/og-image.png"],
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrivacyContent />;
}
