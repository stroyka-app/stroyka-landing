// src/app/account/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import AccountPage from "@/components/AccountPage";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your Stroyka subscription and billing.",
  robots: { index: false, follow: false },
  other: {
    "referrer": "no-referrer",
  },
};

export default function AccountRoute() {
  return (
    <Suspense>
      <AccountPage />
    </Suspense>
  );
}
