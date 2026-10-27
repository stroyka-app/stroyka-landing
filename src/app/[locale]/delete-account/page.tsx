import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import DeleteAccountContent from "./DeleteAccountContent";
import { localeAlternates, canonicalFor, ogLocale, ogAlternateLocales } from "@/i18n/alternates";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const canonical = canonicalFor(locale, "/delete-account");
  return {
    title: { absolute: t("deleteAccountTitle") },
    description: t("deleteAccountDescription"),
    alternates: { canonical, languages: localeAlternates("/delete-account") },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "Stroyka",
      title: t("deleteAccountTitle"),
      description: t("deleteAccountDescription"),
      locale: ogLocale[locale],
      alternateLocale: ogAlternateLocales(locale),
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Stroyka — Construction Management App" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("deleteAccountTitle"),
      description: t("deleteAccountDescription"),
      images: ["/og-image.png"],
    },
  };
}

export default async function DeleteAccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DeleteAccountContent locale={locale} />;
}
