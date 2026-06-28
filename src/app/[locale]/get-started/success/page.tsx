import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import SuccessContent from "./SuccessContent";

export const metadata: Metadata = {
  title: "Welcome to Stroyka",
  description: "Your Stroyka plan is active. Download the app or sign in to get started.",
  robots: { index: false, follow: false },
};

export default async function SuccessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
