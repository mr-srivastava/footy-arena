"use client";

import {
  CalendarDays,
  Compass,
  Globe2,
  LayoutGrid,
  MapPin,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/groups", label: "Groups", icon: LayoutGrid },
  { href: "/fixtures", label: "Fixtures", icon: CalendarDays },
  { href: "/#hosts", label: "Host Nations", icon: Globe2 },
  { href: "/#cities", label: "Cities", icon: MapPin },
];

function isNavActive(pathname: string, href: string): boolean {
  if (href.startsWith("/#")) return false;
  if (href === "/") return pathname === "/";
  const base = href.split("#")[0] ?? href;
  return pathname === base || pathname.startsWith(`${base}/`);
}

function navLinkClass(active: boolean, mobile: boolean) {
  if (mobile) {
    return active
      ? "flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm text-gold"
      : "flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground";
  }
  return active
    ? "flex items-center gap-1.5 text-gold"
    : "flex items-center gap-1.5 transition-colors hover:text-gold";
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
