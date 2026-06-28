import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import TermsContent from "./TermsContent";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for the Stroyka construction management platform.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TermsContent />;
}
