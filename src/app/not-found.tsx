import Link from "next/link";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-brand-midnight flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-md">
          <Logo variant="dark" size={48} />
          <p className="text-[8rem] font-heading font-bold leading-none bg-gradient-to-b from-brand-sage-mist to-brand-deep bg-clip-text text-transparent">
            404
          </p>
          <h1 className="font-heading text-2xl font-bold text-brand-sage-mist">
            This page doesn&apos;t exist
          </h1>
          <p className="text-brand-sage">
            Looks like this page got buried under a pile of blueprints.
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Link
              href="/"
              className="px-6 py-3 bg-brand-forest text-white rounded-xl font-heading font-semibold hover:bg-brand-deep transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/demo"
              className="px-6 py-3 border border-brand-sage/30 text-brand-sage rounded-xl font-heading font-semibold hover:bg-brand-deep/30 transition-colors"
            >
              Request a Demo
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
