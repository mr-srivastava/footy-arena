"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { MESSAGES } from "@/lib/copy/messages";

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
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div
        className="pointer-events-none absolute inset-0 hero-glow"
        aria-hidden
      />
      <section className="relative z-10 max-w-xl rounded-2xl border border-line-strong bg-artifact-muted p-8 text-center shadow-board md:p-12">
        <AlertCircle className="mx-auto size-12 text-gold" aria-hidden />
        <h1 className="editorial-title type-section-title mt-6">
          {MESSAGES.pageLoadError.title}
        </h1>
        <p className="mt-4 text-muted">{MESSAGES.pageLoadError.body}</p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="btn-shine flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
          >
            <RefreshCw className="size-4" aria-hidden />
            {MESSAGES.pageLoadError.retry}
          </button>
          <Link
            href="/"
            className="rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            {MESSAGES.pageLoadError.home}
          </Link>
        </div>
      </section>
    </div>
  );
}
