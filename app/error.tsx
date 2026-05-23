"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 pitch-grid">
      <div className="pointer-events-none absolute inset-0 hero-glow" aria-hidden />
      <div className="relative z-10 max-w-md text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gold" aria-hidden />
        <h1 className="mt-6 font-display text-4xl tracking-wide">
          MATCH DATA UNAVAILABLE
        </h1>
        <p className="mt-4 text-muted">
          We couldn&apos;t load fixture data right now. The schedule may be
          temporarily offline - please try again in a moment.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="btn-shine flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
