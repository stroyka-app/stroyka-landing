import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import TermsContent from "./TermsContent";
import { ogLocale } from "@/i18n/alternates";

// Legal pages are English-authoritative: all locales point canonical + hreflang to the EN URL.
const EN_TERMS = "https://www.getstroyka.com/terms";
const legalLanguages = { en: EN_TERMS, es: EN_TERMS, ru: EN_TERMS, "x-default": EN_TERMS };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: { absolute: t("termsTitle") },
    description: t("termsDescription"),
    alternates: { canonical: EN_TERMS, languages: legalLanguages },
    openGraph: {
      type: "website",
      url: EN_TERMS,
      siteName: "Stroyka",
      title: t("termsTitle"),
      description: t("termsDescription"),
      locale: ogLocale[locale],
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Stroyka — Construction Management App" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("termsTitle"),
      description: t("termsDescription"),
      images: ["/og-image.png"],
    },
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TermsContent />;
}
