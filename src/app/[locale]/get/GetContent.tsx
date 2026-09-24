"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MotionConfig } from "framer-motion";
import { track } from "@vercel/analytics";
import { ANDROID_APP_URL, IOS_APP_URL } from "@/lib/appLinks";
import { isMobileVisitor } from "@/lib/isMobileVisitor";
import Navbar from "@/components/Navbar";
import AmbientBackdrop from "@/components/ui/AmbientBackdrop";
import FadeIn from "@/components/ui/FadeIn";
import FlapText from "@/components/site/ui/FlapText";
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
      <main className="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden bg-site-night px-5 pt-24 text-center text-site-paper">
        <AmbientBackdrop />
        <div className="relative z-10 flex flex-col items-center gap-7">
          <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-site-paper/55">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-site-vis opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-site-vis" />
            </span>
            {t("redirecting")}
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            <StoreBadge
              href={IOS_APP_URL}
              label={t("appStore")}
              icon={<AppleGlyph className="h-[15px] w-[15px]" />}
              onClick={() =>
                trackCta("store_badge_clicked", { store: "app_store" })
              }
            />
            <StoreBadge
              href={ANDROID_APP_URL}
              label={t("googlePlay")}
              icon={<GooglePlayGlyph className="h-[13px] w-[13px]" />}
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
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main className="relative overflow-hidden bg-site-night pb-10 pt-24 text-site-paper lg:pt-24">
        <AmbientBackdrop />
        {/* The hero is the page: one block, vertically centred in the
            viewport, so a tall window gets even air above and below instead
            of a void. Top: the claim + handoff on the left, the working phone
            on the right. Below: the proof strip. */}
        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-7rem)] max-w-[1240px] flex-col justify-center px-5 md:px-10 lg:min-h-[calc(100svh-8.5rem)]">
          <div className="flex flex-col gap-12 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-10">
            <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
              <FadeIn triggerOnMount className="flex flex-col items-center lg:items-start">
                <p className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-site-vis">
                  <span className="relative flex h-2 w-2" aria-hidden>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-site-vis opacity-60 motion-reduce:hidden" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-site-vis" />
                  </span>
                  {t("desktopKicker")}
                </p>
              </FadeIn>
              <FlapText
                as="h1"
                immediate
                delay={0.1}
                className="mb-5 max-w-[13ch] font-flex text-[clamp(2.5rem,4.6vw,4.3rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-site-paper [font-variation-settings:'wdth'_110]"
                lines={[t("desktopTitle")]}
              />
              <FadeIn triggerOnMount delay={0.12}>
                <p className="mx-auto mb-8 max-w-[30rem] text-[17px] leading-relaxed text-site-paper/70 lg:mx-0">
                  {t("desktopHint")}
                </p>
              </FadeIn>
              <FadeIn triggerOnMount delay={0.22} className="flex w-full justify-center lg:justify-start">
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

          <FadeIn triggerOnMount delay={0.3} className="mt-14 lg:mt-8">
            <ProofStrip items={proofs} />
          </FadeIn>
        </div>
      </main>
    </MotionConfig>
  );
}

/** Forest store pill for the phone fallback: glyph in a bone knob, then the name. */
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
      className="inline-flex h-12 items-center gap-2.5 rounded-full bg-site-vis pl-2 pr-5 text-[15px] font-medium tracking-[-0.005em] text-site-on-vis transition-[background-color,transform] duration-200 ease-out hover:bg-site-vis-hover active:scale-[0.97]"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-site-on-vis text-site-vis">
        {icon}
      </span>
      {label}
    </a>
  );
}
