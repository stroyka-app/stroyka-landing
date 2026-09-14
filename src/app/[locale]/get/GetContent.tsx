"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { track } from "@vercel/analytics";
import { ANDROID_APP_URL, IOS_APP_URL } from "@/lib/appLinks";
import { isMobileVisitor } from "@/lib/isMobileVisitor";
import Navbar from "@/components/Navbar";
import AmbientBackdrop from "@/components/ui/AmbientBackdrop";
import FadeIn from "@/components/ui/FadeIn";
import TextReveal from "@/components/ui/TextReveal";
import { AppleGlyph, GooglePlayGlyph } from "@/components/ui/StoreGlyphs";
import { useCtaTracker } from "@/lib/hooks/useCtaTracker";
import HandoffCard from "./HandoffCard";
import PhoneShowcase, { type Screen } from "./PhoneShowcase";
import ProofStrip, { type Proof } from "./ProofStrip";

/**
 * The smart store link. Every "Start free" on the site lands here.
 *
 * On a phone or tablet: UA-detects and forwards to the right store
 * (Android → Google Play, everything else → App Store). The analytics
 * beacon needs a beat to leave before navigation, hence the short delay;
 * the visible store buttons double as the no-JS / slow-network /
 * misdetection fallback.
 *
 * On a desktop: no forward. A desktop cannot install a phone app, and since
 * 2026-09-13 the site no longer offers the web signup as the alternative
 * (see `useSignupHref`). So the page is a working demo of the product with
 * the handoff built in (2026-09-14): the phone cycles through four real
 * screens with a field note each, the QR and the two stores are one card,
 * and three proof tiles close the hero. Nothing below the fold: the hero is
 * the page.
 */
export default function GetContent() {
  const t = useTranslations("getStarted");
  const trackCta = useCtaTracker("get_page");
  // Server render and first paint assume a phone (the paid-traffic case);
  // hydration corrects a desktop before the forward timer fires.
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const src =
      new URLSearchParams(window.location.search).get("src") ?? "direct";
    if (!isMobileVisitor()) {
      setDesktop(true);
      trackCta("store_page_desktop", { src });
      return;
    }
    const ua = navigator.userAgent || "";
    const isAndroid = /android/i.test(ua);
    const url = isAndroid ? ANDROID_APP_URL : IOS_APP_URL;
    const store = isAndroid ? "google_play" : "app_store";
    track("get_redirect", { store, src });
    // PostHog-only, deliberately: a phone visitor reaches this page from a
    // "Start free" click that already fired the pixel's Lead, so counting the
    // automatic forward as a second lead would double every mobile signup.
    trackCta("store_redirect", { store, src });
    const timer = setTimeout(() => window.location.replace(url), 350);
    return () => clearTimeout(timer);
  }, [trackCta]);

  if (!desktop) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4] px-6 pt-24 text-center">
        <AmbientBackdrop />
        <div className="relative z-10 flex flex-col items-center gap-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
            {t("redirecting")}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <StoreBadge
              href={IOS_APP_URL}
              label={t("appStore")}
              icon={<AppleGlyph className="h-3 w-3" />}
              onClick={() =>
                trackCta("store_badge_clicked", { store: "app_store" })
              }
            />
            <StoreBadge
              href={ANDROID_APP_URL}
              label={t("googlePlay")}
              icon={<GooglePlayGlyph className="h-3 w-3" />}
              onClick={() =>
                trackCta("store_badge_clicked", { store: "google_play" })
              }
            />
          </div>
        </div>
      </main>
    );
  }

  const screens: Screen[] = (
    ["projects", "tasks", "requests", "report"] as const
  ).map((key, i) => ({
    key,
    label: t(`desktopScreens.${key}.label`),
    note: t(`desktopScreens.${key}.note`),
    noteTop: [16, 30, 22, 38][i],
    src: `/get/screen-${key}.jpg`,
    alt: t(`desktopScreens.${key}.alt`),
  }));

  const proofs: Proof[] = [
    { icon: "clock", title: t("desktopProof1Title"), detail: t("desktopProof1Detail") },
    { icon: "scan", title: t("desktopProof2Title"), detail: t("desktopProof2Detail") },
    { icon: "offline", title: t("desktopProof3Title"), detail: t("desktopProof3Detail") },
  ];

  // A phone is forwarded within 350 ms and never needs chrome; a desktop
  // stays on this page, so it gets the site's navbar like every other page
  // (Maks, 2026-09-13: "no way back to the landing").
  return (
    <>
      <Navbar />
      <main className="relative overflow-hidden bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4] px-6 pb-10 pt-24 lg:pt-28">
        <AmbientBackdrop />
        {/* The hero is the page: one block, vertically centred in the
            viewport, so a tall window gets even air above and below instead
            of a void. Top: the claim + handoff on the left, the working phone
            on the right. Below: the proof strip. */}
        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-7rem)] max-w-6xl flex-col justify-center lg:min-h-[calc(100svh-8.5rem)]">
          <div className="flex flex-col gap-12 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-10">
            <div className="text-center lg:col-span-7 lg:text-left">
              <FadeIn triggerOnMount>
                <p className="mb-5 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-brand-deep">
                  {t("desktopKicker")}
                </p>
                <TextReveal
                  as="h1"
                  className="mx-auto mb-5 max-w-[12ch] font-display text-[clamp(2.4rem,4.6vw,3.9rem)] font-light leading-[1.02] tracking-[-0.025em] text-ink lg:mx-0"
                >
                  {t("desktopTitle")}
                </TextReveal>
                <p className="mx-auto mb-8 max-w-md text-[17px] leading-[1.55] text-ink-soft lg:mx-0">
                  {t("desktopHint")}
                </p>
              </FadeIn>
              <FadeIn triggerOnMount delay={0.18} className="flex justify-center lg:justify-start">
                <HandoffCard
                  qrAlt={t("desktopQrAlt")}
                  scanLabel={t("desktopScanLabel")}
                  scanHint={t("desktopScanHint")}
                  appStore={t("appStore")}
                  googlePlay={t("googlePlay")}
                  onStore={(store) => trackCta("store_badge_clicked", { store })}
                />
              </FadeIn>
            </div>

            <FadeIn triggerOnMount delay={0.1} className="lg:col-span-5">
              <PhoneShowcase
                screens={screens}
                onSelect={(screen, how) => {
                  if (how === "tap") trackCta("screen_selected", { screen });
                }}
              />
            </FadeIn>
          </div>

          <FadeIn triggerOnMount delay={0.3} className="mt-12 lg:mt-10">
            <ProofStrip items={proofs} />
          </FadeIn>
        </div>
      </main>
    </>
  );
}

/** Pill store badge — same register as the get-started success page. */
function StoreBadge({
  href,
  label,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-bone transition-colors hover:bg-brand-deep"
    >
      {icon}
      {label}
    </a>
  );
}
