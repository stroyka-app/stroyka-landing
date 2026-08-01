import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SmoothScroll from "@/components/SmoothScroll";
import CursorDot from "@/components/CursorDot";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollProgress from "@/components/ScrollProgress";
import StructuredData from "@/components/seo/StructuredData";
import MetaPixel from "@/components/MetaPixel";
import { routing } from "@/i18n/routing";

const inter = Inter({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-fraunces" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700"], variable: "--font-jetbrains-mono" });
const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700"], style: ["normal", "italic"], variable: "--font-playfair" });

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
        <div className="page-surface min-h-svh">
        <NextIntlClientProvider>
          <StructuredData />
          <ScrollProgress />
          <SmoothScroll>
            <CursorDot />
            {children}
            <ScrollToTop />
          </SmoothScroll>
          <Analytics />
          <SpeedInsights />
          <MetaPixel />
        </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
