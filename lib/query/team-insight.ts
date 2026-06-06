import { queryOptions } from "@tanstack/react-query";
import type { TeamInsight } from "@/lib/bsd/enrichment-types";
import { fetchJson } from "@/lib/query/fetch-json";
import { queryKeys } from "@/lib/query/keys";

type TeamInsightResponse = {
  insight: TeamInsight | null;
};

async function fetchTeamInsight(slug: string) {
  const data = await fetchJson<TeamInsightResponse>(`/api/teams/${encodeURIComponent(slug)}/insight`);
  return data.insight;
}

export function teamInsightQueryOptions(slug: string, initialData?: TeamInsight | null) {
  return queryOptions({
    queryKey: queryKeys.teamInsight(slug),
    queryFn: () => fetchTeamInsight(slug),
    enabled: slug.length > 0,
    initialData,
    initialDataUpdatedAt: initialData ? 0 : undefined,
  });
}
