import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { artifactSurface } from "@/lib/utils";

export function DiscoveryCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="group block h-full">
      <article
        className={artifactSurface(
          "relative flex h-full flex-col overflow-hidden bg-artifact-muted p-5 transition-colors group-hover:border-gold/35",
        )}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-gold/70 via-pitch-bright/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
          aria-hidden
        />
        <h3 className="font-display text-3xl leading-none tracking-wide text-foreground transition-colors group-hover:text-gold">
          {title.toUpperCase()}
        </h3>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
          Explore
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </span>
      </article>
    </Link>
  );
}
