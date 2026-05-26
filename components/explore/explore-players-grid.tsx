"use client";

import { useQuery } from "@tanstack/react-query";
import { EnrichedPlayerCard } from "@/components/explore/enriched-player-card";
import { explorePlayersQueryOptions } from "@/lib/query/explore-players";
import { artifactSurface } from "@/lib/utils";

function ExplorePlayersSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={artifactSurface("min-h-64 animate-pulse bg-artifact-muted/80")}
        />
      ))}
    </>
  );
}

type ExplorePlayersGridProps = {
  slugs: string[];
  emptyMessage?: string;
  className?: string;
};

export function ExplorePlayersGrid({
  slugs,
  emptyMessage = "Players will appear here once matching squad records are available in Convex.",
  className = "lazy-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
}: ExplorePlayersGridProps) {
  const { data: players = [], isPending, isError } = useQuery(explorePlayersQueryOptions(slugs));

  if (slugs.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  if (isPending) {
    return (
      <div className={className}>
        <ExplorePlayersSkeleton count={Math.min(slugs.length, 6)} />
      </div>
    );
  }

  if (isError || players.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className={className}>
      {players.map((player) => (
        <EnrichedPlayerCard key={player.id} player={player} />
      ))}
    </div>
  );
}
