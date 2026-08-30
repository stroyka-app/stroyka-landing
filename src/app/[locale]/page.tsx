// src/app/[locale]/page.tsx
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import HomeClient from "@/components/HomeClient";
import StructuredData from "@/components/seo/StructuredData";
import { localeAlternates, canonicalFor, ogLocale } from "@/i18n/alternates";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const canonical = canonicalFor(locale, "/");
  return {
    title: { absolute: t("homeTitle") },
    description: t("homeDescription"),
    alternates: { canonical, languages: localeAlternates("/") },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "Stroyka",
      title: t("homeTitle"),
      description: t("homeDescription"),
      locale: ogLocale[locale],
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Stroyka — Construction Management App" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("homeTitle"),
      description: t("homeDescription"),
      images: ["/og-image.png"],
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      {/* SoftwareApplication + FAQPage belong to THIS page, not the layout —
          the FAQ they describe is only visible here. See StructuredData. */}
      <StructuredData pageSpecific />
      <HomeClient />
    </>
  );
}
