// src/app/page.tsx
import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: "Stroyka — Construction Crew & Job Cost Management",
  description:
    "Stroyka helps small construction crews track daily hours, job costs, and worker pay — all in one app. Built for US contractors with 5–25 workers.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "https://getstroyka.com",
    title: "Stroyka — Construction Crew & Job Cost Management",
    description:
      "Track hours, job costs, and worker pay for your construction crew. Simple. Fast. Built for the field.",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
