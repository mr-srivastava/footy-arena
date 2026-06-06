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
      <SheetContent side="right" className="w-80 border-line-strong bg-artifact/95 backdrop-blur-2xl">
        <SheetHeader>
          <SheetTitle className="editorial-title text-3xl">
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
