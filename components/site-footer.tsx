import Link from "next/link";
import type { ReactNode } from "react";

export function SiteFooter({ center }: { center?: ReactNode }) {
  return (
    <footer className="relative z-10 border-t border-line-soft bg-background/70 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 text-sm text-muted md:flex-row">
        <Link
          href="/"
          className="border-l border-gold/35 pl-4 font-display text-2xl tracking-[0.2em] text-foreground/60 transition-colors hover:text-gold"
        >
          FOOTY ARENA
        </Link>
        {center ?? (
          <p className="text-center">
            FIFA World Cup 2026 · USA · Canada · Mexico
          </p>
        )}
        <p className="text-center md:text-right">
          © 2026 Footy Arena. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
