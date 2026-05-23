import { Layers } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <Card interactive className="h-full">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <Layers className="h-5 w-5 shrink-0 text-pitch-bright" aria-hidden />
          <Badge variant="muted">{playerCount} players</Badge>
        </CardHeader>
        <CardContent>
          <CardTitle className="font-display text-2xl tracking-wide text-foreground transition-colors group-hover:text-gold">
            {collection.title.toUpperCase()}
          </CardTitle>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {collection.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
