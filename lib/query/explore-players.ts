import { queryOptions } from "@tanstack/react-query";
import type { ExplorePlayerCard } from "@/lib/explore/types";
import { fetchJson } from "@/lib/query/fetch-json";
import { queryKeys } from "@/lib/query/keys";

type ExplorePlayersResponse = {
  players: ExplorePlayerCard[];
};

async function fetchExplorePlayersWithSignal(slugs: string[], signal?: AbortSignal) {
  if (slugs.length === 0) {
    return [];
  }

  const params = new URLSearchParams({ slugs: slugs.join(",") });
  const data = await fetchJson<ExplorePlayersResponse>(
    `/api/explore/players?${params.toString()}`,
    { signal },
  );

  return data.players;
}

export function explorePlayersQueryOptions(
  slugs: string[],
  initialPlayers?: ExplorePlayerCard[],
) {
  const initialData = initialPlayers?.length ? initialPlayers : undefined;

  return queryOptions({
    queryKey: queryKeys.explorePlayers(slugs),
    queryFn: ({ signal }) => fetchExplorePlayersWithSignal(slugs, signal),
    enabled: slugs.length > 0,
    initialData,
    initialDataUpdatedAt: initialData ? 0 : undefined,
  });
}
