import { Layers } from "lucide-react";
import Link from "next/link";
import { MediaImage } from "@/components/media-image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
    <Link href={`/explore/collections/${collection.slug}`} className="group block h-full">
      <article
        className="h-full"
      >
        <Card
          variant="elevated"
          shape="artifact"
          padding="none"
          interactive
          className="h-full group-hover:border-gold/35"
        >
          <MediaImage
            src={getCollectionImage(collection.slug)}
            alt=""
            className="h-32"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <CardContent className="relative p-5">
            <div className="flex flex-row items-start justify-between gap-3">
              <Layers className="size-5 shrink-0 text-pitch-bright" aria-hidden />
              <Badge variant="muted">{playerCount} players</Badge>
            </div>
            <div className="mt-6">
              <h3 className="font-display text-3xl leading-none tracking-wide text-foreground transition-colors group-hover:text-gold">
                {collection.title.toUpperCase()}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {collection.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </article>
    </Link>
  );
}
