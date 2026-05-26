import { bsdFetch } from '@/lib/bsd/client';
import { mapInBatches } from '@/lib/bsd/batch';
import type {
  BsdPlayerCareerStatsResponse,
  BsdPlayerEnrichment,
  BsdPlayerListItem,
  ConvexCountrySnapshot,
  ConvexPlayerSnapshot,
  TeamEnrichmentPayload,
} from '@/lib/bsd/enrichment-types';
import {
  resolveBsdPlayers,
  resolveNationalTeam,
} from '@/lib/bsd/resolve-player';

export { resolveNationalTeam } from '@/lib/bsd/resolve-player';

export async function fetchPlayerDetail(playerId: number) {
  return bsdFetch<BsdPlayerListItem>(`players/${playerId}`);
}

export async function fetchPlayerCareerStats(playerId: number, limit = 12) {
  try {
    const data = await bsdFetch<BsdPlayerCareerStatsResponse>(
      `players/${playerId}/stats?limit=${limit}`,
    );
    return data.player_stats ?? [];
  } catch {
    return [];
  }
}

function summarizeStats(stats: BsdPlayerCareerStatsResponse['player_stats']) {
  if (stats.length === 0) {
    return { appearances: 0, goals: 0, assists: 0, avgRating: null };
  }

  const goals = stats.reduce((sum, row) => sum + row.goals, 0);
  const assists = stats.reduce((sum, row) => sum + row.goal_assist, 0);
  const ratings = stats.map((row) => row.rating).filter((value): value is number => value != null);
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length
      : null;

  return {
    appearances: stats.length,
    goals,
    assists,
    avgRating: avgRating != null ? Number(avgRating.toFixed(2)) : null,
  };
}

async function enrichOnePlayer(
  player: ConvexPlayerSnapshot,
  country: ConvexCountrySnapshot,
  nationalTeamId: number | null,
  includeStats: boolean,
  resolution: Awaited<ReturnType<typeof resolveBsdPlayers>>[number],
): Promise<BsdPlayerEnrichment> {
  if (!resolution.bsdPlayer) {
    return {
      convexPlayerId: player.id,
      convex: player,
      bsd: null,
      matchScore: null,
      matchConfidence: null,
      matchStrategy: null,
      stats: [],
      statsSummary: summarizeStats([]),
    };
  }

  const detail = await fetchPlayerDetail(resolution.bsdPlayer.id);
  const stats = includeStats
    ? await fetchPlayerCareerStats(resolution.bsdPlayer.id)
    : [];

  return {
    convexPlayerId: player.id,
    convex: player,
    bsd: detail,
    matchScore: resolution.match.score,
    matchConfidence: resolution.match.confidence,
    matchStrategy: resolution.match.strategy,
    stats,
    statsSummary: summarizeStats(stats),
  };
}

export async function enrichTeamPlayers(input: {
  country: ConvexCountrySnapshot;
  players: ConvexPlayerSnapshot[];
  includeStats?: boolean;
}): Promise<TeamEnrichmentPayload> {
  const nationalTeam = await resolveNationalTeam(input.country);
  const nationalTeamId = nationalTeam?.id ?? null;
  const resolutions = await resolveBsdPlayers({
    players: input.players,
    country: input.country,
    nationalTeamId,
  });

  const enriched = await mapInBatches(
    input.players.map((player, index) => ({
      player,
      resolution: resolutions[index]!,
    })),
    ({ player, resolution }) =>
      enrichOnePlayer(
        player,
        input.country,
        nationalTeamId,
        input.includeStats ?? true,
        resolution,
      ),
  );

  const matched = enriched.filter((row) => row.bsd != null).length;
  const withStats = enriched.filter((row) => row.stats.length > 0).length;

  return {
    country: input.country,
    bsdNationalTeamId: nationalTeamId,
    bsdNationalTeamName: nationalTeam?.name ?? null,
    players: enriched,
    summary: {
      total: enriched.length,
      matched,
      withStats,
    },
  };
}
