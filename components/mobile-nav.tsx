"use client";

import { CalendarDays, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SiteNav } from "@/components/site-nav";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
          />
        }
      >
        <Menu aria-hidden />
      </SheetTrigger>
      <SheetContent side="right" className="w-72 border-border bg-card">
        <SheetHeader>
          <SheetTitle className="font-display text-xl tracking-[0.15em]">
            FOOTY ARENA
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4" aria-label="Main mobile">
          <SiteNav variant="mobile" />
        </nav>
        <SheetFooter>
          <Button
            render={<Link href="/fixtures" />}
            nativeButton={false}
            size="pill"
            className="w-full"
          >
            <CalendarDays data-icon="inline-start" aria-hidden />
            View Fixtures
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
