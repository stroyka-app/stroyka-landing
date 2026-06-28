import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GetStartedFlow from "@/components/GetStartedFlow";
import { localeAlternates, canonicalFor, ogLocale } from "@/i18n/alternates";

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

export default async function GetStartedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Navbar />
      <Suspense>
        <GetStartedFlow />
      </Suspense>
      <Footer />
    </>
  );
}
