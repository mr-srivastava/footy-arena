import { queryOptions } from "@tanstack/react-query";
import type { LabTeamSnapshot } from "@/lib/bsd/convex-snapshots";
import type { TeamEnrichmentPayload } from "@/lib/bsd/enrichment-types";
import { fetchJson } from "@/lib/query/fetch-json";
import { queryKeys } from "@/lib/query/keys";

export async function fetchLabTeam(slug: string) {
  return fetchJson<LabTeamSnapshot>(
    `/api/lab/convex/team?slug=${encodeURIComponent(slug)}`,
  );
}

export async function fetchLabEnrichment(team: LabTeamSnapshot) {
  return fetchJson<TeamEnrichmentPayload>("/api/lab/bsd/players", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      country: team.country,
      players: team.players,
      includeStats: true,
    }),
  });
}

export function labTeamQueryOptions(slug: string | null) {
  return queryOptions({
    queryKey: queryKeys.labTeam(slug ?? ""),
    queryFn: () => fetchLabTeam(slug!),
    enabled: slug != null,
  });
}

export function labEnrichmentQueryOptions(
  slug: string | null,
  team: LabTeamSnapshot | undefined,
  enabled: boolean,
) {
  return queryOptions({
    queryKey: queryKeys.labEnrichment(slug ?? ""),
    queryFn: () => fetchLabEnrichment(team!),
    enabled: enabled && slug != null && team != null,
  });
}
