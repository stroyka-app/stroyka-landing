import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CursorDot from "@/components/CursorDot";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollProgress from "@/components/ScrollProgress";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://getstroyka.com"),
  title: {
    default: "Stroyka — Construction Crew & Job Cost Management",
    template: "%s | Stroyka",
  },
  description:
    "Stroyka helps small construction crews track daily hours, job costs, and worker pay — all in one app. Built for US contractors with 5–25 workers.",
  keywords: [
    "construction management app",
    "crew management",
    "job costing",
    "construction payroll",
    "contractor app",
  ],
  authors: [{ name: "Stroyka" }],
  creator: "Stroyka",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://getstroyka.com",
    siteName: "Stroyka",
    title: "Stroyka — Construction Crew & Job Cost Management",
    description:
      "Track hours, job costs, and worker pay for your construction crew. Simple. Fast. Built for the field.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Stroyka — Construction Management App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stroyka — Construction Crew & Job Cost Management",
    description:
      "Track hours, job costs, and worker pay for your construction crew.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-brand-midnight text-white antialiased font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Stroyka",
              applicationCategory: "BusinessApplication",
              operatingSystem: "iOS, Android",
              description:
                "Construction crew and job cost management app for small US contractors.",
              url: "https://getstroyka.com",
              offers: {
                "@type": "AggregateOffer",
                lowPrice: "149",
                highPrice: "299",
                priceCurrency: "USD",
                offerCount: "2",
              },
            }),
          }}
        />
        <ScrollProgress />
        <SmoothScroll>
          <CursorDot />
          {children}
          <ScrollToTop />
        </SmoothScroll>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
