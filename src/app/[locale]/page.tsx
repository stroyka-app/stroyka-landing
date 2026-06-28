// src/app/[locale]/page.tsx
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: { absolute: "Stroyka — Construction Crew & Job Cost Management" },
  description:
    "Stroyka helps small construction crews track daily hours, job costs, and worker pay — all in one app. Built for US contractors with 5–25 workers.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "https://getstroyka.com",
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
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeClient />;
}
