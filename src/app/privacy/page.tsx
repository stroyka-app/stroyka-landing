import type { Metadata } from "next";
import PrivacyContent from "./PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for the Stroyka construction management platform.",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
