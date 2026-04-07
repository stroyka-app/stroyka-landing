import type { Metadata } from "next";
import TermsContent from "./TermsContent";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for the Stroyka construction management platform.",
};

export default function TermsPage() {
  return <TermsContent />;
}
