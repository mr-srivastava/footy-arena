import { queryOptions } from "@tanstack/react-query";
import type { MatchInsight } from "@/lib/bsd/enrichment-types";
import { fetchJson } from "@/lib/query/fetch-json";
import { QUERY_STALE_TIME_MS } from "@/lib/query/constants";
import { queryKeys } from "@/lib/query/keys";

type MatchInsightResponse = {
  insight: MatchInsight | null;
};

async function fetchMatchInsight(fixtureId: string) {
  const data = await fetchJson<MatchInsightResponse>(
    `/api/fixtures/${encodeURIComponent(fixtureId)}`,
  );
  return data.insight;
}

function isEnrichedInsight(
  insight?: MatchInsight | null,
): insight is MatchInsight {
  return insight != null && insight.eventId != null;
}

export function matchInsightQueryOptions(
  fixtureId: string,
  initialData?: MatchInsight | null,
) {
  const hasEnrichedInitial = isEnrichedInsight(initialData);

  return queryOptions({
    queryKey: queryKeys.matchInsight(fixtureId),
    queryFn: () => fetchMatchInsight(fixtureId),
    enabled: fixtureId.length > 0,
    initialData: hasEnrichedInitial ? initialData : undefined,
    placeholderData:
      initialData != null && !hasEnrichedInitial ? initialData : undefined,
    staleTime: QUERY_STALE_TIME_MS,
  });
}
