"use client";

// Client component: not-found.tsx has no `params` prop in Next.js App Router,
// so setRequestLocale cannot be called. Using useTranslations (client) instead,
// which works because this file is wrapped by [locale]/layout.tsx and its
// NextIntlClientProvider.

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4] overflow-hidden flex items-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 right-0 w-[60vw] h-[60vw] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 80% 20%, rgba(184,212,189,0.32), transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div className="relative max-w-xl mx-auto px-6 text-center w-full">
          <FadeIn>
            <SectionLabel>{t("nfEyebrow")}</SectionLabel>
          </FadeIn>
          <FadeIn delay={0.05}>
            <p className="font-display font-light text-[7rem] lg:text-[10rem] leading-none text-ink/85 tracking-[-0.04em] mb-2">
              404
            </p>
          </FadeIn>
          <FadeIn delay={0.12}>
            <h1 className="font-display font-light text-3xl lg:text-4xl leading-tight text-ink mb-4">
              {t("nfTitle")}
            </h1>
          </FadeIn>
          <FadeIn delay={0.18}>
            <p className="text-[15px] text-ink-soft leading-relaxed mb-10 max-w-md mx-auto">
              {t("nfBody")}
            </p>
          </FadeIn>
          <FadeIn delay={0.25}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" href="/">
                {t("nfBackHome")}
              </Button>
              <Link
                href="/demo"
                className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-muted hover:text-brand-forest transition-colors self-center"
              >
                {t("nfBookDemo")}
              </Link>
            </div>
          </FadeIn>
        </div>
      </main>
      <Footer />
    </>
  );
}
