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

export function teamSquadQueryOptions(slug: string, initialSquad?: TeamSquad) {
  const hasInitialPlayers =
    initialSquad != null && initialSquad.players.length > 0;

  return queryOptions({
    queryKey: queryKeys.teamSquad(slug),
    queryFn: () => fetchTeamSquad(slug),
    enabled: slug.length > 0,
    initialData: hasInitialPlayers ? initialSquad : undefined,
    staleTime: QUERY_STALE_TIME_MS,
  });
}
