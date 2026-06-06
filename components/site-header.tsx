"use client";

import { CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { MobileNav } from "@/components/mobile-nav";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";

export function SiteHeader({ className = "" }: { className?: string }) {
  const { scrollY } = useScroll();
  const width = useTransform(
    scrollY,
    [0, 120],
    ["100%", "min(72rem, calc(100% - 2rem))"],
  );
  const top = useTransform(scrollY, [0, 120], [0, 12]);
  const radius = useTransform(scrollY, [0, 120], [0, 999]);

  return (
    <motion.header
      style={{ width, top, borderRadius: radius }}
      className={`sticky z-50 mx-auto border border-line-soft bg-background/88 shadow-card backdrop-blur-2xl ${className}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <Image
            src="/logo.png"
            alt=""
            width={36}
            height={36}
            className="size-9"
            priority
            aria-hidden
          />
          <span className="font-display text-xl tracking-[0.18em] text-foreground">
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
    </motion.header>
  );
}
