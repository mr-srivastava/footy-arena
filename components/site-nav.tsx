"use client";

import { Building2, CalendarDays, Compass, LayoutGrid, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/groups", label: "Groups", icon: LayoutGrid },
  { href: "/fixtures", label: "Fixtures", icon: CalendarDays },
  { href: "/cities", label: "Cities", icon: Building2 },
];

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClass(active: boolean, mobile: boolean) {
  if (mobile) {
    return active
      ? "flex items-center gap-2 rounded-xl border border-gold/25 bg-gold/8 px-4 py-3 text-sm text-gold"
      : "flex items-center gap-2 rounded-xl border border-transparent px-4 py-3 text-sm text-muted transition-colors hover:border-line-strong hover:bg-surface-glass hover:text-foreground";
  }
  return active
    ? "flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-2 text-gold"
    : "flex items-center gap-1.5 rounded-full px-3 py-2 transition-colors hover:bg-surface-glass hover:text-foreground";
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
