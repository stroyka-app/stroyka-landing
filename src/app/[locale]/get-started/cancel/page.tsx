import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import TextReveal from "@/components/ui/TextReveal";

export const metadata: Metadata = {
  title: "Checkout Cancelled",
  description: "Your plan hasn't changed. You can subscribe anytime.",
  robots: { index: false, follow: false },
};

export default async function CancelPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "getStarted" });
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4] overflow-hidden">
        {/* Soft sage vignette to match the rest of the bone-editorial pages */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-0 w-[60vw] h-[60vw] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 80% 20%, rgba(184,212,189,0.32), transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative max-w-xl mx-auto px-6 text-center">
          <FadeIn>
            <div className="flex justify-center mb-8">
              <Link href="/">
                <Logo variant="light" size={42} showWordmark />
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <SectionLabel>{t("noWorries")}</SectionLabel>
          </FadeIn>

          <FadeIn delay={0.1}>
            <TextReveal as="h1" className="font-display font-light text-4xl lg:text-5xl leading-[0.98] tracking-[-0.02em] text-ink mb-5">
              {t("planUnchanged")}
            </TextReveal>
          </FadeIn>

          <FadeIn delay={0.18}>
            <p className="text-[15px] lg:text-base text-ink-soft leading-relaxed mb-10 max-w-md mx-auto">
              {t("subscribeAnytime")}
            </p>
          </FadeIn>

          <FadeIn delay={0.25}>
            <Button variant="secondary" size="lg" href="/#pricing">
              {t("backToPricing")}
            </Button>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </>
  );
}
