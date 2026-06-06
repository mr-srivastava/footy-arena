import { unstable_cache } from "next/cache";
import type { Fixture, Team } from "@/lib/openfootball/types";
import { resolveFixtureMapping } from "@/lib/bsd/insights";
import { fetchBsdPlayerDetail } from "@/lib/bsd/player-detail";
import { loadTeamAnalytics } from "@/lib/bsd/team-analytics";
import { getAllWorldCupCallups } from "@/lib/bsd/worldcup";

export const BSD_CACHE_REVALIDATE = 1800;

export async function getCachedAllWorldCupCallups() {
  return unstable_cache(() => getAllWorldCupCallups(), ["worldcup-callups"], {
    revalidate: BSD_CACHE_REVALIDATE,
  })();
}

export async function getCachedPlayerDetail(playerId: number) {
  return unstable_cache(
    () => fetchBsdPlayerDetail(playerId),
    ["bsd-player-detail", String(playerId)],
    { revalidate: 3600 },
  )();
}

export async function getCachedTeamAnalytics(team: Team) {
  if (!team.bsdTeamId) {
    return null;
  }

  const teamId = team.bsdTeamId;
  return unstable_cache(
    () => loadTeamAnalytics(team),
    ["team-analytics", String(teamId)],
    { revalidate: BSD_CACHE_REVALIDATE, tags: [`team-analytics-${teamId}`] },
  )();
}

export async function getCachedFixtureMapping(
  fixture: Fixture,
  byName: Map<string, Team>,
) {
  return unstable_cache(
    () => resolveFixtureMapping(fixture, byName),
    ["fixture-mapping", fixture.id],
    { revalidate: 3600, tags: [`fixture-mapping-${fixture.id}`] },
  )();
}
