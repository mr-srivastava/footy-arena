import { bsdFetch } from "@/lib/bsd/client";
import {
  BSD_TEAM_NAME_ALIASES,
  iso2ForFifa,
} from "@/lib/bsd/fifa-nation";
import { mapInBatches } from "@/lib/bsd/batch";
import type {
  BsdPlayerCareerStatsResponse,
  BsdPlayerEnrichment,
  BsdPlayerListItem,
  BsdPlayersListResponse,
  ConvexCountrySnapshot,
  ConvexPlayerSnapshot,
  TeamEnrichmentPayload,
} from "@/lib/bsd/enrichment-types";
import {
  pickBestPlayerMatch,
  playerSearchTerm,
  scorePlayerMatch,
} from "@/lib/bsd/match-player";
import { getWorldCupNationalTeams } from "@/lib/bsd/national-teams";

function normalizeTeamName(value: string) {
  return value.trim().toLowerCase();
}

export async function resolveNationalTeam(country: ConvexCountrySnapshot) {
  const teams = await getWorldCupNationalTeams();
  const names = new Set(
    [
      country.displayName,
      country.fifaCode,
      ...(BSD_TEAM_NAME_ALIASES[country.fifaCode] ?? []),
    ]
      .filter(Boolean)
      .map(normalizeTeamName),
  );

  const match = teams.find((team) => {
    const teamNames = [team.name, team.short_name, team.country].map(normalizeTeamName);
    return teamNames.some((name) => names.has(name));
  });

  return match ?? null;
}

async function searchBsdPlayers(params: {
  name: string;
  nationalTeamId?: number | null;
  nationalityCode?: string | null;
  limit?: number;
}) {
  const query = new URLSearchParams();
  query.set("name", playerSearchTerm(params.name));
  query.set("limit", String(params.limit ?? 10));
  if (params.nationalTeamId) {
    query.set("national_team_id", String(params.nationalTeamId));
  }
  if (params.nationalityCode) {
    query.set("nationality_code", params.nationalityCode);
  }

  const data = await bsdFetch<BsdPlayersListResponse>(`players?${query.toString()}`);
  return data.results;
}

export async function matchConvexPlayer(
  player: ConvexPlayerSnapshot,
  country: ConvexCountrySnapshot,
  nationalTeamId: number | null,
) {
  const nationalityCode = iso2ForFifa(country.fifaCode);
  const searchParams = {
    name: player.name,
    nationalTeamId,
    nationalityCode,
    limit: 15,
  };

  let candidates = await searchBsdPlayers(searchParams);

  if (candidates.length === 0 && nationalTeamId) {
    candidates = await searchBsdPlayers({
      name: player.name,
      nationalityCode,
      limit: 15,
    });
  }

  if (candidates.length === 0) {
    candidates = await searchBsdPlayers({
      name: player.name,
      limit: 15,
    });
  }

  if (player.jerseyNumber != null) {
    const byNumber = candidates.find(
      (candidate) => candidate.jersey_number === player.jerseyNumber,
    );
    if (byNumber) {
      const score = scorePlayerMatch(player.name, byNumber);
      if (score >= 55) {
        return { player: byNumber, score: Math.max(score, 90) };
      }
    }
  }

  return pickBestPlayerMatch(player.name, candidates);
}

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

function summarizeStats(stats: BsdPlayerCareerStatsResponse["player_stats"]) {
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
): Promise<BsdPlayerEnrichment> {
  const match = await matchConvexPlayer(player, country, nationalTeamId);

  if (!match) {
    return {
      convexPlayerId: player.id,
      convex: player,
      bsd: null,
      matchScore: null,
      stats: [],
      statsSummary: summarizeStats([]),
    };
  }

  const detail = await fetchPlayerDetail(match.player.id);
  const stats = includeStats ? await fetchPlayerCareerStats(match.player.id) : [];

  return {
    convexPlayerId: player.id,
    convex: player,
    bsd: detail,
    matchScore: match.score,
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

  const enriched = await mapInBatches(input.players, (player) =>
    enrichOnePlayer(
      player,
      input.country,
      nationalTeamId,
      input.includeStats ?? true,
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
