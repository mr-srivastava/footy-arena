import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SurfaceLinkProps = {
  href?: string;
  children: ReactNode;
  className?: string;
};

export function SurfaceLink({ href, children, className }: SurfaceLinkProps) {
  const content = (
    <>
      {children}
      <ArrowRight
        className="size-4 transition-transform group-hover/surface-link:translate-x-1"
        aria-hidden
      />
    </>
  );

  const classes = cn(
    "group/surface-link inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-foreground",
    className,
  );

  if (!href) {
    return <span className={classes}>{content}</span>;
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
