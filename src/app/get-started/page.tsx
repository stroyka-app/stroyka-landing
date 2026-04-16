import type { Metadata } from "next";
import { Suspense } from "react";
import GetStartedFlow from "@/components/GetStartedFlow";

export const metadata: Metadata = {
  title: "Get Started",
  description:
    "Choose a Stroyka plan and start managing your construction crew today. No per-seat fees — your entire team is included.",
};

export default function GetStartedPage() {
  return (
    <Suspense>
      <GetStartedFlow />
    </Suspense>
  );
}
