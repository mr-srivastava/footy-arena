"use client";

import { useQuery } from "@tanstack/react-query";
import { SquadPanel } from "@/components/squad-panel";
import { teamSquadQueryOptions } from "@/lib/query/team-squad";
import type { TeamSquad } from "@/lib/tournament/types";
import { artifactSurface } from "@/lib/utils";

function SquadPanelSkeleton() {
  return (
    <section className="flex flex-col gap-6">
      <div className={artifactSurface("min-h-32 animate-pulse bg-artifact-muted/80 p-5")} />
      <div className={artifactSurface("min-h-96 animate-pulse bg-artifact-muted/80 p-5")} />
    </section>
  );
}

export function SquadPanelWithQuery({
  slug,
  initialSquad,
}: {
  slug: string;
  initialSquad: TeamSquad;
}) {
  const { data: squad = initialSquad, isPending, isFetching } = useQuery(
    teamSquadQueryOptions(slug, initialSquad),
  );

  if (isPending && squad.players.length === 0) {
    return <SquadPanelSkeleton />;
  }

  return (
    <div className={isFetching ? "opacity-80 transition-opacity" : undefined}>
      <SquadPanel squad={squad} />
    </div>
  );
}
