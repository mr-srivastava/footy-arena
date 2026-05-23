import { Layers } from "lucide-react";
import Link from "next/link";
import type { DiscoveryCollection } from "@/lib/discovery/types";

export function CollectionCard({
  collection,
  playerCount,
}: {
  collection: DiscoveryCollection;
  playerCount: number;
}) {
  return (
    <Link
      href={`/explore/collections/${collection.slug}`}
      className="glass-panel glass-panel-interactive group flex h-full flex-col rounded-2xl p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <Layers className="h-5 w-5 shrink-0 text-pitch-bright" aria-hidden />
        <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium text-muted">
          {playerCount} players
        </span>
      </div>
      <h3 className="mt-4 font-display text-2xl tracking-wide text-foreground transition-colors group-hover:text-gold">
        {collection.title.toUpperCase()}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {collection.description}
      </p>
    </Link>
  );
}
