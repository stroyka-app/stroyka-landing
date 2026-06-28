import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoForm from "@/components/DemoForm";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";
import { localeAlternates, canonicalFor, ogLocale } from "@/i18n/alternates";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const canonical = canonicalFor(locale, "/demo");
  return {
    title: { absolute: t("demoTitle") },
    description: t("demoDescription"),
    alternates: { canonical, languages: localeAlternates("/demo") },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "Stroyka",
      title: t("demoTitle"),
      description: t("demoDescription"),
      locale: ogLocale[locale],
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Stroyka — Construction Management App" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("demoTitle"),
      description: t("demoDescription"),
      images: ["/og-image.png"],
    },
  };
}

export default async function DemoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("demo");
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4] overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-0 w-[60vw] h-[60vw] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 80% 20%, rgba(184,212,189,0.32), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div className="relative max-w-2xl mx-auto px-6">
          <FadeIn>
            <SectionLabel>{t("eyebrow")}</SectionLabel>
          </FadeIn>
          <FadeIn delay={0.05}>
            <TextReveal as="h1" className="font-display font-light text-4xl lg:text-6xl leading-[0.98] tracking-[-0.02em] text-ink mb-5">
              {t("title")}
            </TextReveal>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className="text-[15px] lg:text-base text-ink-soft leading-relaxed mb-10 max-w-lg">
              {t("subtitle")}
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <DemoForm />
          </FadeIn>
        </div>
      </main>
      <Footer />
    </>
  );
}
