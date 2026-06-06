import { queryOptions } from "@tanstack/react-query";
import { squadFromEnrichedPlayers } from "@/lib/tournament/map-squad";
import type { TeamSquad, TeamSquadPayload } from "@/lib/tournament/types";
import { fetchJson } from "@/lib/query/fetch-json";
import { QUERY_STALE_TIME_MS } from "@/lib/query/constants";
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

function isEnrichedSquad(squad?: TeamSquad) {
  return (
    squad != null &&
    squad.players.length > 0 &&
    squad.players.some((player) => player.bsdPlayerId != null)
  );
}

export function teamSquadQueryOptions(slug: string, initialSquad?: TeamSquad) {
  const hasEnrichedInitial = isEnrichedSquad(initialSquad);

  return queryOptions({
    queryKey: queryKeys.teamSquad(slug),
    queryFn: () => fetchTeamSquad(slug),
    enabled: slug.length > 0,
    initialData: hasEnrichedInitial ? initialSquad : undefined,
    placeholderData:
      !hasEnrichedInitial && initialSquad ? initialSquad : undefined,
    staleTime: QUERY_STALE_TIME_MS,
  });
}
