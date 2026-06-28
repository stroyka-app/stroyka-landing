import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import PrivacyContent from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for the Stroyka construction management platform.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrivacyContent />;
}
