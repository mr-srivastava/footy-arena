import { CalendarDays, Trophy } from "lucide-react";
import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";

export function SiteHeader({ className = "" }: { className?: string }) {
  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/8 bg-background/92 backdrop-blur-xl ${className}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="flex size-10 items-center justify-center rounded-sm border border-pitch/40 bg-pitch/12 transition-colors group-hover:border-gold/45">
            <Trophy className="h-5 w-5 text-gold" aria-hidden />
          </div>
          <span className="font-display text-2xl tracking-[0.15em] text-foreground">
            FOOTY ARENA
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 text-sm text-muted-foreground md:flex"
          aria-label="Main"
        >
          <SiteNav variant="desktop" />
        </nav>

        <div className="flex items-center gap-3">
          <Button
            render={<Link href="/fixtures" />}
            nativeButton={false}
            size="pill"
            className="hidden sm:inline-flex"
          >
            <CalendarDays data-icon="inline-start" aria-hidden />
            View Fixtures
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
