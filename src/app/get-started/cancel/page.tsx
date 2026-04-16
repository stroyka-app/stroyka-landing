import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Checkout Cancelled",
  description: "Your plan hasn't changed. You can subscribe anytime.",
  robots: { index: false, follow: false },
};

export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-10">
          <Link href="/">
            <Logo variant="dark" size={40} showWordmark />
          </Link>
        </div>

        <h1 className="text-3xl lg:text-4xl font-heading font-bold leading-tight mb-4">
          No worries.
        </h1>
        <p className="text-base text-brand-sage-mist/75 mb-8">
          Your plan hasn&apos;t changed. You can subscribe anytime from{" "}
          <span className="text-brand-sage-mist/90">getstroyka.com/get-started</span>
        </p>
        <Button variant="secondary" href="/#pricing">
          &larr; Back to Pricing
        </Button>
      </div>
    </div>
  );
}
