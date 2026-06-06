"use client";

import { useQuery } from "@tanstack/react-query";
import { EnrichedPlayerCard } from "@/components/explore/enriched-player-card";
import { PlayerSpotlightCardSkeleton } from "@/components/player-spotlight-card";
import { MESSAGES } from "@/lib/copy/messages";
import { explorePlayersQueryOptions } from "@/lib/query/explore-players";

function ExplorePlayersSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <PlayerSpotlightCardSkeleton key={index} />
      ))}
    </>
  );
}

type ExplorePlayersGridProps = {
  slugs: string[];
  emptyMessage?: string;
  errorMessage?: string;
  className?: string;
};

export function ExplorePlayersGrid({
  slugs,
  emptyMessage = MESSAGES.playersCollectionPending,
  errorMessage = MESSAGES.playersLoadError,
  className = "lazy-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
}: ExplorePlayersGridProps) {
  const {
    data: players = [],
    isPending,
    isError,
  } = useQuery(explorePlayersQueryOptions(slugs));

  if (slugs.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  if (isPending) {
    return (
      <div className={className} aria-busy="true">
        <span className="sr-only">{MESSAGES.loading}</span>
        <ExplorePlayersSkeleton count={Math.min(slugs.length, 6)} />
      </div>
    );
  }

  if (isError) {
    return <p className="text-sm text-muted-foreground">{errorMessage}</p>;
  }

  if (players.length === 0) {
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
