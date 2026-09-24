import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Roboto_Flex } from "next/font/google";
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

// Font budget (Morning Bone, 2026-09-24): Inter (body), JetBrains Mono
// (micro-labels, data) and Roboto Flex (display — weight AND width axes,
// Cyrillic in the family). Fraunces and its Cyrillic stand-in Playfair are
// gone with the serif. Every face is a Google VARIABLE font: one woff2 per
// preloaded subset. Only latin is PRELOADED; Cyrillic stays declared with
// its own unicode-range, so /ru loads it on demand and /en never pays.
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-jetbrains-mono" });
// Roboto Flex: the display face of the dusk-site home. One variable file
// carries weight AND width, so headlines can run wide and the hero can
// thicken letters under the cursor. Cyrillic is in the family, so /ru keeps
// the same voice without a stand-in.
const flex = Roboto_Flex({ subsets: ["latin"], axes: ["wdth"], variable: "--font-flex" });

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
      className={`${inter.variable} ${jetbrainsMono.variable} ${flex.variable}`}
    >
      {/* body colour = --page-top (globals.css): the tone directly under the
          iOS status zone — the morning sky on the home, bone elsewhere. */}
      <body className="text-ink antialiased font-body">
        {/* iOS status-zone cap. Static + server-rendered on purpose: Safari 26
            hit-tests fixed elements at the screen edges once at initial
            render. Exactly env(safe-area-inset-top) tall (+4px on iPhones) →
            invisible on desktop/Android. Colour = --page-top, the same as
            body and the nav glass's safe-area start. */}
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
