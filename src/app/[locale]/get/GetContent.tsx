"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { track } from "@vercel/analytics";
import { ANDROID_APP_URL, IOS_APP_URL } from "@/lib/appLinks";
import { isMobileVisitor } from "@/lib/isMobileVisitor";
import Navbar from "@/components/Navbar";
import AmbientBackdrop from "@/components/ui/AmbientBackdrop";
import { AppleGlyph, GooglePlayGlyph } from "@/components/ui/StoreGlyphs";
import { useCtaTracker } from "@/lib/hooks/useCtaTracker";

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
 * (see `useSignupHref`), so the page says so and shows the two badges plus
 * the short link to open on the phone.
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

  return (
    <>
      {/* A phone is forwarded within 350 ms and never needs chrome; a desktop
          stays on this page, so it gets the site's navbar like every other
          page (Maks, 2026-09-13: "no way back to the landing"). */}
      {desktop && <Navbar />}
      <main className="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden bg-gradient-to-b from-[#E3DCC9] to-[#D4CBB4] px-6 pt-24 text-center">
        <AmbientBackdrop />
        <div className="relative z-10 flex flex-col items-center gap-8">
          {desktop ? (
            <div className="max-w-md">
              <h1 className="font-display font-light text-3xl leading-tight tracking-[-0.02em] text-ink mb-3">
                {t("desktopTitle")}
              </h1>
              <p className="text-[15px] text-ink-soft leading-relaxed">
                {t("desktopHint")}{" "}
                <span className="font-mono text-ink">getstroyka.com/get</span>
              </p>
            </div>
          ) : (
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              {t("redirecting")}
            </p>
          )}
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
