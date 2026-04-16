import type { Metadata } from "next";
import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export const metadata: Metadata = {
  title: "Welcome to Stroyka",
  description: "Your Stroyka plan is active. Download the app or sign in to get started.",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
