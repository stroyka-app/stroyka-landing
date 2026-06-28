// src/app/[locale]/account/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import AccountPage from "@/components/AccountPage";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your Stroyka subscription and billing.",
  robots: { index: false, follow: false },
  other: {
    "referrer": "no-referrer",
  },
};

export default async function AccountRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense>
      <AccountPage />
    </Suspense>
  );
}
