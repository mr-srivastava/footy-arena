import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function SiteFooter({ center }: { center?: ReactNode }) {
  return (
    <footer className="relative z-10 border-t border-line-soft bg-artifact-deep py-14">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 text-sm text-muted md:grid-cols-[1fr_1.4fr_1fr] md:items-end">
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <Image
            src="/logo.png"
            alt=""
            width={40}
            height={40}
            className="size-10"
            aria-hidden
          />
          <span className="font-display text-3xl tracking-[0.2em] text-foreground transition-colors group-hover:text-gold">
            FOOTY ARENA
          </span>
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
