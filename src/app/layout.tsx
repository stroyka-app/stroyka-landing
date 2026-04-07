import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

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
  title: "Stroyka — Construction Management for Real Crews",
  description:
    "Job costing, crew management, and supply tracking built for small construction teams. Offline-first. Simple pricing. No enterprise bloat.",
  metadataBase: new URL("https://getstroyka.com"),
  openGraph: {
    title: "Stroyka — Construction Management for Real Crews",
    description:
      "Job costing, crew management, and supply tracking built for small construction teams.",
    url: "https://getstroyka.com",
    siteName: "Stroyka",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stroyka — Construction Management for Real Crews",
    description:
      "Job costing, crew management, and supply tracking built for small construction teams.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
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
        {children}
      </body>
    </html>
  );
}
