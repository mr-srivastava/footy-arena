import { queryOptions } from "@tanstack/react-query";
import type { TeamAnalyticsPayload } from "@/lib/bsd/team-analytics";
import { fetchJson } from "@/lib/query/fetch-json";
import { QUERY_STALE_TIME_MS } from "@/lib/query/constants";
import { queryKeys } from "@/lib/query/keys";

type TeamInsightResponse = {
  payload: TeamAnalyticsPayload | null;
};

async function fetchTeamInsight(slug: string) {
  const data = await fetchJson<TeamInsightResponse>(
    `/api/teams/${encodeURIComponent(slug)}/insight`,
  );
  return data.payload;
}

export function teamInsightQueryOptions(slug: string) {
  return queryOptions({
    queryKey: queryKeys.teamInsight(slug),
    queryFn: () => fetchTeamInsight(slug),
    enabled: slug.length > 0,
    staleTime: QUERY_STALE_TIME_MS,
  });
}
