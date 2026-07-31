"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { track } from "@vercel/analytics";
import { ANDROID_APP_URL, IOS_APP_URL } from "@/lib/appLinks";
import { AppleGlyph, GooglePlayGlyph } from "@/components/ui/StoreGlyphs";

/**
 * UA-detects and forwards to the right store: Android → Google Play,
 * everything else → App Store (iOS is the platform whose users MUST come
 * through the web, and QR scans come from phones). The analytics beacon
 * needs a beat to leave before navigation, hence the short delay; the
 * visible store buttons double as the no-JS / slow-network / misdetection
 * fallback (e.g. a desktop browser opening the link out of curiosity).
 */
export default function GetContent() {
  const t = useTranslations("getStarted");

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const isAndroid = /android/i.test(ua);
    const url = isAndroid ? ANDROID_APP_URL : IOS_APP_URL;
    const src =
      new URLSearchParams(window.location.search).get("src") ?? "direct";
    track("get_redirect", {
      store: isAndroid ? "google_play" : "app_store",
      src,
    });
    const timer = setTimeout(() => window.location.replace(url), 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="page-surface flex min-h-screen flex-col items-center justify-center gap-8 px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
        {t("redirecting")}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <StoreBadge
          href={IOS_APP_URL}
          label={t("appStore")}
          icon={<AppleGlyph className="h-3 w-3" />}
        />
        <StoreBadge
          href={ANDROID_APP_URL}
          label={t("googlePlay")}
          icon={<GooglePlayGlyph className="h-3 w-3" />}
        />
      </div>
    </main>
  );
}

/** Pill store badge — same register as the get-started success page. */
function StoreBadge({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-bone transition-colors hover:bg-brand-deep"
    >
      {icon}
      {label}
    </a>
  );
}
