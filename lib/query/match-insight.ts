import { queryOptions } from "@tanstack/react-query";
import type { MatchInsight } from "@/lib/bsd/enrichment-types";
import { fetchJson } from "@/lib/query/fetch-json";
import { queryKeys } from "@/lib/query/keys";

type MatchInsightResponse = {
  insight: MatchInsight | null;
};

async function fetchMatchInsight(fixtureId: string) {
  const data = await fetchJson<MatchInsightResponse>(`/api/fixtures/${encodeURIComponent(fixtureId)}`);
  return data.insight;
}

export function matchInsightQueryOptions(fixtureId: string, initialData?: MatchInsight | null) {
  return queryOptions({
    queryKey: queryKeys.matchInsight(fixtureId),
    queryFn: () => fetchMatchInsight(fixtureId),
    enabled: fixtureId.length > 0,
    initialData,
    initialDataUpdatedAt: initialData ? 0 : undefined,
  });
}
