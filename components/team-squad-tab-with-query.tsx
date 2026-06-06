"use client";

import { SquadPanelWithQuery } from "@/components/squad-panel-with-query";
import { useTeamInsightManager } from "@/components/team-insight-panel-with-query";
import type { TeamSquad } from "@/lib/tournament/types";

const EMPTY_SQUAD: TeamSquad = { status: "pending", players: [] };

export function TeamSquadTabWithQuery({
  slug,
  teamName,
}: {
  slug: string;
  teamName: string;
}) {
  const managerAnalytics = useTeamInsightManager(slug);

  return (
    <SquadPanelWithQuery
      slug={slug}
      initialSquad={EMPTY_SQUAD}
      managerAnalytics={managerAnalytics}
      teamName={teamName}
    />
  );
}
