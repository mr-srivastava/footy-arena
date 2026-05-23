import {
  CalendarDays,
  Globe2,
  MapPin,
  Menu,
  Trophy,
  X,
} from "lucide-react";
import Link from "next/link";

const navLinks = [
  { href: "/fixtures", label: "Fixtures", icon: CalendarDays },
  { href: "/#hosts", label: "Host Nations", icon: Globe2 },
  { href: "/#cities", label: "Cities", icon: MapPin },
] as const;

export function SiteHeader({ className = "" }: { className?: string }) {
  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/5 bg-background/75 backdrop-blur-xl ${className}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pitch/15 ring-1 ring-pitch/50 transition-shadow group-hover:shadow-[0_0_20px_rgba(61,220,132,0.25)]">
            <Trophy className="h-5 w-5 text-gold" aria-hidden />
          </div>
          <span className="font-display text-2xl tracking-[0.15em] text-foreground">
            FOOTY ARENA
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 text-sm text-muted md:flex"
          aria-label="Main"
        >
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 transition-colors hover:text-gold"
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/fixtures"
            className="hidden items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy transition-[transform,box-shadow] hover:scale-[1.03] hover:shadow-[0_4px_24px_rgba(240,192,32,0.35)] sm:flex"
          >
            <CalendarDays className="h-4 w-4" aria-hidden />
            View Fixtures
          </Link>

          <details className="nav-details group relative md:hidden">
            <summary
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-navy-light/60 text-foreground"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 group-open:hidden" aria-hidden />
              <X className="hidden h-5 w-5 group-open:block" aria-hidden />
            </summary>
            <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-navy-light/95 p-2 shadow-2xl backdrop-blur-xl">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </Link>
              ))}
              <Link
                href="/fixtures"
                className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-sm font-semibold text-navy"
              >
                <CalendarDays className="h-4 w-4" aria-hidden />
                View Fixtures
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
