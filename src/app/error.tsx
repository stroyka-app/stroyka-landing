"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-brand-midnight flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-5xl">⚠️</div>
        <h1 className="font-heading text-2xl font-bold text-brand-sage-mist">
          Something went wrong
        </h1>
        <p className="text-brand-sage">
          An unexpected error occurred. Our team has been notified.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-brand-forest text-white rounded-lg hover:bg-brand-deep transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-2 border border-brand-sage/30 text-brand-sage rounded-lg hover:bg-brand-deep/30 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
