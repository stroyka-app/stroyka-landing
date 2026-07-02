import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DemoForm from "@/components/DemoForm";
import AmbientBackdrop from "@/components/ui/AmbientBackdrop";
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
        <AmbientBackdrop />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <FadeIn>
            <div className="flex items-baseline justify-between gap-4">
              <SectionLabel>{t("eyebrow")}</SectionLabel>
              {/* Field-journal folio — continuity with the homepage device */}
              <span aria-hidden className="hidden sm:block font-mono text-[9.5px] tracking-[0.24em] uppercase text-ink/35">
                Field journal · Appendix B
              </span>
            </div>
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
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_250px] lg:gap-14 lg:items-start">
            <FadeIn delay={0.2}>
              <DemoForm />
            </FadeIn>
            {/* What happens next — reassurance rail fills the desktop margin */}
            <FadeIn delay={0.3}>
              <aside className="hidden lg:block lg:sticky lg:top-32 border-l border-ink/15 pl-7">
                <h2 className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink/60 mb-6">
                  {t("nextTitle")}
                </h2>
                <ol className="space-y-6">
                  {(["next1", "next2", "next3"] as const).map((key, i) => (
                    <li key={key} className="flex gap-4">
                      <span className="font-mono text-[11px] text-brand-forest pt-0.5">
                        0{i + 1}
                      </span>
                      <span className="text-[13.5px] leading-relaxed text-ink-soft">
                        {t(key)}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="mt-8 pt-6 border-t border-ink/10 font-mono text-[10.5px] tracking-[0.06em] leading-relaxed text-ink/45">
                  {t("nextNote")}
                </p>
              </aside>
            </FadeIn>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
