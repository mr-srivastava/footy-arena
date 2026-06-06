import { ArrowUpRight, Layers } from "lucide-react";
import Link from "next/link";
import { MediaImage } from "@/components/media-image";
import { Badge } from "@/components/ui/badge";
import { getCollectionImage } from "@/lib/discovery";
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
      className="surface-panel-elevated group relative block min-h-96 overflow-hidden rounded-2xl border border-line-strong bg-artifact shadow-card"
    >
      <MediaImage
        src={getCollectionImage(collection.slug)}
        alt=""
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.035]"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-7">
        <div className="flex items-center justify-between">
          <span className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-black/25 text-gold backdrop-blur-md">
            <Layers className="size-4" aria-hidden />
          </span>
          <div className="flex items-center gap-3">
            <Badge
              variant="muted"
              className="border-white/15 bg-black/25 text-white/75 backdrop-blur-md"
            >
              {playerCount} players
            </Badge>
            <ArrowUpRight className="size-5 text-white transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </div>
        </div>
        <div>
          <p className="broadcast-label text-gold">Discovery collection</p>
          <h3 className="editorial-title type-card-title mt-3 text-white transition-colors group-hover:text-gold">
            {collection.title}
          </h3>
          <p className="type-copy mt-4 max-w-lg text-white/70">
            {collection.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
