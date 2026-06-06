import { Compass, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { MESSAGES } from "@/lib/copy/messages";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div
        className="pointer-events-none absolute inset-0 hero-glow"
        aria-hidden
      />
      <section className="relative z-10 max-w-xl rounded-2xl border border-line-strong bg-artifact-muted p-8 text-center shadow-board md:p-12">
        <p className="font-display text-6xl tracking-wide text-gold">404</p>
        <h1 className="editorial-title type-section-title mt-6">
          {MESSAGES.notFound.title}
        </h1>
        <p className="mt-4 text-muted">{MESSAGES.notFound.body}</p>
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/fixtures"
            className="btn-shine inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
          >
            <MapPin className="size-4" aria-hidden />
            {MESSAGES.notFound.fixtures}
          </Link>
          <Link
            href="/explore"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            <Compass className="size-4" aria-hidden />
            {MESSAGES.notFound.explore}
          </Link>
          <Link
            href="/teams"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            <Users className="size-4" aria-hidden />
            {MESSAGES.notFound.teams}
          </Link>
        </div>
      </section>
    </div>
  );
}
