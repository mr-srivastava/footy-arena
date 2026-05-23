import { ArrowRight } from "lucide-react";
import Link from "next/link";

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
    <Link
      href={href}
      className="glass-panel glass-panel-interactive group flex h-full flex-col rounded-2xl p-5"
    >
      <h3 className="font-display text-2xl tracking-wide text-foreground transition-colors group-hover:text-gold">
        {title.toUpperCase()}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
        {description}
      </p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold">
        Explore
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}
