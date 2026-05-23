import { Layers } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { DiscoveryCollection } from "@/lib/discovery/types";
import { artifactSurface } from "@/lib/utils";

export function CollectionCard({
  collection,
  playerCount,
}: {
  collection: DiscoveryCollection;
  playerCount: number;
}) {
  return (
    <Link href={`/explore/collections/${collection.slug}`} className="group block h-full">
      <article
        className={artifactSurface(
          "relative h-full overflow-hidden bg-artifact-muted p-5 transition-colors group-hover:border-gold/35",
        )}
      >
        <div className="flex flex-row items-start justify-between gap-3">
          <Layers className="h-5 w-5 shrink-0 text-pitch-bright" aria-hidden />
          <Badge variant="muted">{playerCount} players</Badge>
        </div>
        <div className="mt-8">
          <h3 className="font-display text-3xl leading-none tracking-wide text-foreground transition-colors group-hover:text-gold">
            {collection.title.toUpperCase()}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {collection.description}
          </p>
        </div>
      </article>
    </Link>
  );
}
