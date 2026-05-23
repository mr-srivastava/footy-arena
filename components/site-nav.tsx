"use client";

import { CalendarDays, Compass, LayoutGrid, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/groups", label: "Groups", icon: LayoutGrid },
  { href: "/fixtures", label: "Fixtures", icon: CalendarDays },
];

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClass(active: boolean, mobile: boolean) {
  if (mobile) {
    return active
      ? "flex items-center gap-2 rounded-sm border border-gold/25 bg-gold/8 px-4 py-3 text-sm text-gold"
      : "flex items-center gap-2 rounded-sm border border-transparent px-4 py-3 text-sm text-muted transition-colors hover:border-white/10 hover:bg-white/5 hover:text-foreground";
  }
  return active
    ? "flex items-center gap-1.5 border-b border-gold/60 pb-1 text-gold"
    : "flex items-center gap-1.5 border-b border-transparent pb-1 transition-colors hover:border-white/20 hover:text-gold";
}

export function SiteNav({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const pathname = usePathname();
  const mobile = variant === "mobile";

  return (
    <>
      {navLinks.map(({ href, label, icon: Icon }) => {
        const active = isNavActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={navLinkClass(active, mobile)}
            aria-current={active ? "page" : undefined}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </Link>
        );
      })}
    </>
  );
}
