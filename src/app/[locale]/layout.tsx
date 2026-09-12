import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SiteChrome from "@/components/SiteChrome";
import StructuredData from "@/components/seo/StructuredData";
import MetaPixel from "@/components/MetaPixel";
import PostHogAnalytics from "@/components/PostHogAnalytics";
import SafariBottomTint from "@/components/SafariBottomTint";
import { routing } from "@/i18n/routing";
import { ANDROID_APP_URL, IOS_APP_URL } from "@/lib/appLinks";

// Font budget: FOUR preloaded woff2 files on /en, down from ten (2026-09-12).
// Every face here is a Google VARIABLE font, so the `weight` list never
// changes which file ships: one woff2 per preloaded subset per style, shared
// by every declared weight (verified in .next/static/css). What the weight
// list does control is which `font-weight` descriptors exist, so it must
// still cover what the design actually uses: Fraunces 300 is `font-light` on
// 41 display headings, Inter/JetBrains 700 is `font-bold` on 16 labels.
// Dropping those would re-weight the locked design for zero bytes saved.
// The savings come from `subsets`: only latin is PRELOADED. Cyrillic stays
// declared in the CSS with its own unicode-range, so /ru still loads it, on
// demand, and /en never pays for it.
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter" });
// Italic is a second file (true italics are separate on Google Fonts), kept
// because the hero's third line, the founder note and the CTA banner set
// Fraunces italic; a synthesized slant of Fraunces looks like a different face.
const fraunces = Fraunces({ subsets: ["latin"], weight: ["300", "400", "500", "600"], style: ["normal", "italic"], variable: "--font-fraunces" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-jetbrains-mono" });
// Playfair is the Cyrillic stand-in for Fraunces and is referenced ONLY via
// the --font-fraunces override on the `ru` <html> (below). preload:false keeps
// its four files out of every <head>; on /en no element ever resolves to the
// family, so the browser never requests them at all.
const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-playfair", preload: false });

export const metadata: Metadata = {
  title: {
    default: "Stroyka — Construction Crew & Job Cost Management",
    template: "%s | Stroyka",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  // Safari Smart App Banner (<meta name="apple-itunes-app">): an installed
  // user tapping an ad or a shared link gets a one-tap "Open" strip instead
  // of a second signup. The id is the App Store id from IOS_APP_URL.
  itunes: { appId: "6783179191" },
  // Facebook App Links: the in-app browser (where most paid traffic lands)
  // reads these to offer the native app when installed and to attribute the
  // install when it is not. web.should_fallback keeps the page itself as the
  // fallback for everyone else.
  appLinks: {
    ios: { url: IOS_APP_URL, app_store_id: "6783179191", app_name: "Stroyka" },
    android: { package: "com.getstroyka.app", app_name: "Stroyka", url: ANDROID_APP_URL },
    web: { url: "https://www.getstroyka.com", should_fallback: true },
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} ${playfair.variable}`}
      style={locale === "ru" ? ({ ["--font-fraunces"]: "var(--font-playfair)" } as React.CSSProperties) : undefined}
    >
      {/* body = bone (globals.css): iOS frosts the body color into the
          bottom bar zone, so it must stay light — the proven-stable config.
          .page-surface carries the in-document surface. */}
      <body className="text-ink antialiased font-body">
        {/* iOS status-zone tint source. Static + server-rendered on purpose:
            Safari 26 hit-tests fixed elements at the screen edges ONCE at
            initial render and adopts their background-color as the bar tint
            (JS toggles are never re-sampled — the June static sliver is the
            only variant ever proven on device). Exactly env(safe-area-inset-
            top) tall → invisible on desktop/Android. Color = hero top tone,
            continued by the hero scrim and the navbar glass blend. */}
        <div id="chrome-cap" aria-hidden />
        {/* Month-proven bottom-bar system, restored (see globals.css note:
            its display toggles are also what force Safari to re-sample the
            toolbar tint — removing it caused the stale sage plate). */}
        <SafariBottomTint />
        <div className="page-surface min-h-svh">
        <NextIntlClientProvider>
          <StructuredData />
          {/* lenis, cursor dot, progress bar and scroll-to-top are loaded
              per route inside SiteChrome so the paid /start landing ships
              none of that JS. */}
          <SiteChrome>{children}</SiteChrome>
          <Analytics />
          <SpeedInsights />
          <MetaPixel />
          <PostHogAnalytics />
        </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
