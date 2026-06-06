import { queryOptions } from "@tanstack/react-query";
import type { ExplorePlayerCard } from "@/lib/explore/types";
import { fetchJson } from "@/lib/query/fetch-json";
import { queryKeys } from "@/lib/query/keys";

type ExplorePlayersResponse = {
  players: ExplorePlayerCard[];
};

async function fetchExplorePlayersWithSignal(
  slugs: string[],
  includePerformance = false,
  signal?: AbortSignal,
) {
  if (slugs.length === 0) {
    return [];
  }

  const params = new URLSearchParams({ slugs: slugs.join(",") });
  if (includePerformance) {
    params.set("includePerformance", "true");
  }
  const data = await fetchJson<ExplorePlayersResponse>(
    `/api/explore/players?${params.toString()}`,
    { signal },
  );

  return data.players;
}

export function explorePlayersQueryOptions(
  slugs: string[],
  initialPlayers?: ExplorePlayerCard[],
  options?: { includePerformance?: boolean },
) {
  const initialData = initialPlayers?.length ? initialPlayers : undefined;
  const includePerformance = options?.includePerformance ?? false;

  return queryOptions({
    queryKey: queryKeys.explorePlayers(slugs, includePerformance),
    queryFn: ({ signal }) => fetchExplorePlayersWithSignal(slugs, includePerformance, signal),
    enabled: slugs.length > 0,
    initialData,
    initialDataUpdatedAt: initialData ? 0 : undefined,
  });
}
