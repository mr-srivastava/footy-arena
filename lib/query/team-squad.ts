import { queryOptions } from "@tanstack/react-query";
import { squadFromEnrichedPlayers } from "@/lib/tournament/map-squad";
import type { TeamSquad, TeamSquadPayload } from "@/lib/tournament/types";
import { fetchJson } from "@/lib/query/fetch-json";
import { queryKeys } from "@/lib/query/keys";

async function fetchTeamSquad(slug: string): Promise<TeamSquad> {
  const payload = await fetchJson<TeamSquadPayload>(
    `/api/teams/${encodeURIComponent(slug)}/squad`,
  );

  return squadFromEnrichedPlayers(
    payload.status,
    payload.manager,
    payload.players.map((entry) => entry.player),
  );
}

export function teamSquadQueryOptions(slug: string, initialSquad?: TeamSquad) {
  return queryOptions({
    queryKey: queryKeys.teamSquad(slug),
    queryFn: () => fetchTeamSquad(slug),
    enabled: slug.length > 0,
    initialData: initialSquad,
    initialDataUpdatedAt: initialSquad ? 0 : undefined,
  });
}
