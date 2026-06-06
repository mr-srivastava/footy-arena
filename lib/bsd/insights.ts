import type {
  BsdMatchConfidence,
  FixtureBsdMapping,
  FormResult,
  MatchInsight,
  MatchLineupPlayer,
  MatchLineupSide,
  MatchPrediction,
  PlayerAppearanceSummary,
  PlayerNationalTeamRecord,
  PlayerPerformance,
  TeamInsight,
} from "@/lib/bsd/enrichment-types";
import { bsdFetch, hasBsdToken } from "@/lib/bsd/client";
import {
  getCachedFixtureMapping,
  getCachedTeamAnalytics,
} from "@/lib/bsd/cache";
import { BSD_WORLD_CUP_2026_LEAGUE_ID } from "@/lib/bsd/constants";
import {
  formatRecord,
  goalsAgainstTeam,
  goalsForTeam,
  loadTeamAnalytics,
  streakLength,
  type TeamAnalyticsPayload,
} from "@/lib/bsd/team-analytics";
import { worldCupEditorialForFifaCode } from "@/lib/teams/world-cup-history";
import { normalizeTeamName } from "@/lib/teams/normalize-name";
import { fixtureKickoffToIso } from "@/lib/openfootball/fixtures";
import type { Fixture, Team } from "@/lib/openfootball/types";

type BsdPaginated<T> = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: T[];
};

type BsdEventListItem = {
  id: number;
  home_team_id?: number | null;
  away_team_id?: number | null;
  home_team?: string | { name?: string };
  away_team?: string | { name?: string };
  event_date?: string;
  status?: string | null;
  round_number?: number | null;
  home_score?: number | null;
  away_score?: number | null;
  venue_id?: number | null;
  venue_name?: string | null;
};

type BsdEventDetail = BsdEventListItem & {
  weather?: {
    description?: string | null;
    temperature_c?: number | null;
  } | null;
  travel_distance_km?: number | null;
};

type BsdPlayerStatsRow = {
  event_id?: number | null;
  team_id?: number | null;
  minutes_played?: number | null;
  rating?: number | null;
  goals?: number | null;
  goal_assist?: number | null;
};

type BsdCareerResponse = {
  player_id: number;
  seasons: Array<{
    season_id: number;
    league_id: number;
    team_id: number;
    matches: number;
    minutes: number;
    goals: number;
    assists: number;
    avg_rating: number | null;
  }>;
};

type BsdNationalTeamResponse = {
  player_id: number;
  national_team_id: number | null;
  caps: number;
  goals: number;
  last_appearance: string | null;
};

type BsdMetadataResponse = {
  ai_preview?: { text?: string | null } | null;
  funfacts?: Array<{ sentence?: string | null }>;
};

type BsdPredictionResponse = {
  home_win_prob?: number | null;
  draw_prob?: number | null;
  away_win_prob?: number | null;
  predicted_result?: "H" | "D" | "A" | null;
  confidence?: number | null;
};

type BsdLineupsResponse = {
  lineup_status?: string | null;
  beta?: boolean;
  lineups?: {
    home?: {
      team_id?: number | null;
      team_name?: string;
      formation?: string | null;
      players?: unknown[];
      substitutes?: unknown[];
      unavailable_players?: unknown[];
    } | null;
    away?: {
      team_id?: number | null;
      team_name?: string;
      formation?: string | null;
      players?: unknown[];
      substitutes?: unknown[];
      unavailable_players?: unknown[];
    } | null;
  } | null;
};

function safeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeProbability(value: number | null | undefined) {
  if (value == null) return null;
  return value > 1
    ? Number((value / 100).toFixed(4))
    : Number(value.toFixed(4));
}

function resultForScores(
  goalsFor: number | null,
  goalsAgainst: number | null,
): FormResult | null {
  if (goalsFor == null || goalsAgainst == null) return null;
  if (goalsFor > goalsAgainst) return "W";
  if (goalsFor < goalsAgainst) return "L";
  return "D";
}

function eventTeamLabel(
  team: string | { name?: string } | null | undefined,
): string | null {
  if (typeof team === "string") return team;
  if (team && typeof team === "object" && typeof team.name === "string") {
    return team.name;
  }
  return null;
}

async function loadEventsByIds(
  eventIds: number[],
): Promise<Map<number, BsdEventListItem>> {
  const uniqueIds = [...new Set(eventIds)];
  const entries = await Promise.all(
    uniqueIds.map(async (id) => {
      try {
        const event = await bsdFetch<BsdEventListItem>(`events/${id}`);
        return [id, event] as const;
      } catch {
        return null;
      }
    }),
  );

  return new Map(
    entries.filter(
      (entry): entry is readonly [number, BsdEventListItem] => entry != null,
    ),
  );
}

function mapAppearance(
  row: BsdPlayerStatsRow,
  event?: BsdEventListItem | null,
): PlayerAppearanceSummary {
  const minutes = row.minutes_played ?? null;
  const rating = safeNumber(row.rating);
  const goals = row.goals ?? 0;
  const assists = row.goal_assist ?? 0;

  let opponentName: string | null = null;
  let opponentTeamId: number | null = null;
  let teamName: string | null = null;
  let isHome: boolean | null = null;
  let result: FormResult | null = null;
  let eventDate = "";

  if (event) {
    eventDate = event.event_date ?? "";
    const teamId = row.team_id ?? null;
    const homeTeamId = event.home_team_id ?? null;
    const awayTeamId = event.away_team_id ?? null;
    const homeTeam = eventTeamLabel(event.home_team);
    const awayTeam = eventTeamLabel(event.away_team);

    if (teamId != null && homeTeamId != null && teamId === homeTeamId) {
      isHome = true;
      teamName = homeTeam;
      opponentName = awayTeam;
      opponentTeamId = awayTeamId;
      result = resultForScores(
        event.home_score ?? null,
        event.away_score ?? null,
      );
    } else if (teamId != null && awayTeamId != null && teamId === awayTeamId) {
      isHome = false;
      teamName = awayTeam;
      opponentName = homeTeam;
      opponentTeamId = homeTeamId;
      result = resultForScores(
        event.away_score ?? null,
        event.home_score ?? null,
      );
    }
  }

  return {
    eventId: row.event_id ?? null,
    eventDate,
    teamName,
    opponentName,
    opponentTeamId,
    isHome,
    result,
    minutes,
    rating,
    goals,
    assists,
  };
}

function mapLineupPlayer(input: unknown): MatchLineupPlayer | null {
  if (!input || typeof input !== "object") return null;
  const value = input as Record<string, unknown>;
  const name = typeof value.name === "string" ? value.name : null;
  if (!name) return null;

  return {
    playerId: safeNumber(value.player_id),
    name,
    number:
      safeNumber(value.shirt_number) ??
      safeNumber(value.jersey_number) ??
      safeNumber(value.number),
    position: typeof value.position === "string" ? value.position : null,
    rating: safeNumber(value.ai_score) ?? safeNumber(value.rating),
  };
}

function mapLineupSide(
  input: BsdLineupsResponse["lineups"] extends infer T
    ? T extends { home?: infer U }
      ? U
      : never
    : never,
  fallbackName: string,
): MatchLineupSide | null {
  if (!input) return null;
  const players = (input.players ?? [])
    .map(mapLineupPlayer)
    .filter(Boolean) as MatchLineupPlayer[];
  const substitutes = (input.substitutes ?? [])
    .map(mapLineupPlayer)
    .filter(Boolean) as MatchLineupPlayer[];
  const unavailable = (input.unavailable_players ?? [])
    .map(mapLineupPlayer)
    .filter(Boolean) as MatchLineupPlayer[];

  return {
    teamId: input.team_id ?? null,
    teamName: input.team_name ?? fallbackName,
    formation: input.formation ?? null,
    players,
    substitutes,
    unavailable,
  };
}

export async function loadPlayerPerformance(
  bsdPlayerId: number,
  options?: {
    availability?: string | null;
    strengths?: string[];
    weaknesses?: string[];
  },
): Promise<PlayerPerformance | null> {
  if (!hasBsdToken()) return null;

  try {
    const [stats, career, nationalTeam] = await Promise.all([
      bsdFetch<BsdPaginated<BsdPlayerStatsRow>>(
        `players/${bsdPlayerId}/stats?limit=5`,
      ),
      bsdFetch<BsdCareerResponse>(`players/${bsdPlayerId}/career`),
      bsdFetch<BsdNationalTeamResponse>(`players/${bsdPlayerId}/national-team`),
    ]);

    const eventIds = stats.results
      .map((row) => row.event_id)
      .filter((id): id is number => id != null);
    const eventsById = await loadEventsByIds(eventIds);
    const recentAppearances = stats.results.map((row) =>
      mapAppearance(
        row,
        row.event_id != null ? eventsById.get(row.event_id) : null,
      ),
    );
    const ratings = recentAppearances
      .map((appearance) => appearance.rating)
      .filter((rating): rating is number => rating != null);
    const formRating = ratings.length
      ? Number(
          (
            ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          ).toFixed(2),
        )
      : null;
    const seasonAverageRating =
      career.seasons.find((season) => season.avg_rating != null)?.avg_rating ??
      null;
    const nationalTeamRecord: PlayerNationalTeamRecord = {
      nationalTeamId: nationalTeam.national_team_id,
      caps: nationalTeam.caps,
      goals: nationalTeam.goals,
      lastAppearance: nationalTeam.last_appearance,
    };

    return {
      playerId: bsdPlayerId,
      availability: options?.availability ?? null,
      formRating,
      seasonAverageRating,
      recentAppearances,
      nationalTeamRecord,
      strengths: options?.strengths ?? [],
      weaknesses: options?.weaknesses ?? [],
    };
  } catch {
    return null;
  }
}

export type TeamEditorialInsight = Pick<
  TeamInsight,
  "worldCupAppearances" | "bestFinish" | "history"
>;

export function loadTeamEditorialInsight(
  team: Team,
): TeamEditorialInsight | null {
  const editorial = worldCupEditorialForFifaCode(team.fifa_code);
  if (!editorial) return null;

  return {
    worldCupAppearances: editorial.worldCupAppearances,
    bestFinish: editorial.bestFinish,
    history: editorial.history,
  };
}

export function buildTeamFormInsight(
  team: Team,
  analytics: TeamAnalyticsPayload | null,
): Pick<
  TeamInsight,
  | "recentForm"
  | "recentRecord"
  | "unbeatenStreak"
  | "winlessStreak"
  | "goalsForRecent"
  | "goalsAgainstRecent"
> {
  if (!team.bsdTeamId || !analytics?.analytics) {
    return {
      recentForm: [],
      recentRecord: formatRecord([]),
      unbeatenStreak: 0,
      winlessStreak: 0,
      goalsForRecent: 0,
      goalsAgainstRecent: 0,
    };
  }

  const recentForm = analytics.analytics.recentForm;
  const recentFixtures = analytics.analytics.byCompetition
    .flatMap((competition) => competition.fixtures)
    .filter(
      (fixture) => fixture.home_score != null && fixture.away_score != null,
    )
    .toSorted((a, b) => b.event_date.localeCompare(a.event_date))
    .slice(0, 5);

  const goalsForRecent = recentFixtures.reduce(
    (sum, fixture) => sum + goalsForTeam(fixture, team.bsdTeamId!),
    0,
  );
  const goalsAgainstRecent = recentFixtures.reduce(
    (sum, fixture) => sum + goalsAgainstTeam(fixture, team.bsdTeamId!),
    0,
  );

  return {
    recentForm,
    recentRecord: formatRecord(recentForm),
    unbeatenStreak: streakLength(recentForm, "unbeaten"),
    winlessStreak: streakLength(recentForm, "winless"),
    goalsForRecent,
    goalsAgainstRecent,
  };
}

export function mergeTeamInsight(
  team: Team,
  editorial: TeamEditorialInsight,
  form: ReturnType<typeof buildTeamFormInsight>,
): TeamInsight {
  return {
    teamId: team.bsdTeamId ?? null,
    teamName: team.displayName,
    ...editorial,
    ...form,
  };
}

export async function loadTeamInsight(
  team: Team,
  analytics?: TeamAnalyticsPayload | null,
): Promise<TeamInsight | null> {
  const editorial = loadTeamEditorialInsight(team);
  if (!editorial) return null;

  let resolvedAnalytics = analytics;
  if (resolvedAnalytics === undefined && hasBsdToken() && team.bsdTeamId) {
    try {
      resolvedAnalytics = await loadTeamAnalytics(team);
    } catch {
      resolvedAnalytics = null;
    }
  }

  const form = buildTeamFormInsight(team, resolvedAnalytics ?? null);
  return mergeTeamInsight(team, editorial, form);
}

export async function resolveFixtureMapping(
  fixture: Fixture,
  byName: Map<string, Team>,
): Promise<FixtureBsdMapping | null> {
  if (!hasBsdToken()) return null;

  const home = byName.get(normalizeTeamName(fixture.team1));
  const away = byName.get(normalizeTeamName(fixture.team2));
  if (!home || !away) return null;

  const start = new Date(fixtureKickoffToIso(fixture)).getTime();
  const dateFrom = new Date(start - 12 * 60 * 60 * 1000).toISOString();
  const dateTo = new Date(start + 12 * 60 * 60 * 1000).toISOString();
  const candidates = await bsdFetch<BsdPaginated<BsdEventListItem>>(
    `events?league=${BSD_WORLD_CUP_2026_LEAGUE_ID}&date_from=${encodeURIComponent(dateFrom)}&date_to=${encodeURIComponent(dateTo)}&limit=50`,
  );

  const scored = candidates.results
    .map((event) => {
      const names = [
        normalizeTeamName(eventTeamLabel(event.home_team) ?? ""),
        normalizeTeamName(eventTeamLabel(event.away_team) ?? ""),
      ];
      const targetNames = [
        normalizeTeamName(home.displayName),
        normalizeTeamName(away.displayName),
      ];
      const matchingNames = targetNames.filter((name) =>
        names.includes(name),
      ).length;
      const dateDelta = Math.abs(
        new Date(event.event_date ?? "").getTime() - start,
      );
      const timeScore =
        dateDelta <= 30 * 60 * 1000
          ? 20
          : dateDelta <= 2 * 60 * 60 * 1000
            ? 10
            : 0;
      const score = matchingNames * 40 + timeScore;
      return { event, score };
    })
    .filter(({ score }) => score >= 80)
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best?.event.id) return null;

  const confidence: BsdMatchConfidence = best.score >= 100 ? "high" : "medium";
  const mapping: FixtureBsdMapping = {
    fixtureId: fixture.id,
    bsdEventId: best.event.id,
    confidence,
    homeTeamId: best.event.home_team_id ?? null,
    awayTeamId: best.event.away_team_id ?? null,
    lastResolvedAt: new Date().toISOString(),
  };
  return mapping;
}

async function fetchPrediction(
  eventId: number,
): Promise<MatchPrediction | null> {
  try {
    const prediction = await bsdFetch<BsdPredictionResponse>(
      `events/${eventId}/prediction`,
    );
    return {
      homeWinProbability: normalizeProbability(prediction.home_win_prob),
      drawProbability: normalizeProbability(prediction.draw_prob),
      awayWinProbability: normalizeProbability(prediction.away_win_prob),
      predictedResult: prediction.predicted_result ?? null,
      confidence: normalizeProbability(prediction.confidence),
    };
  } catch {
    return null;
  }
}

export async function loadMatchInsight(
  fixture: Fixture,
  byName: Map<string, Team>,
): Promise<MatchInsight | null> {
  if (!hasBsdToken()) return null;

  const mapping = await getCachedFixtureMapping(fixture, byName);
  if (!mapping) return null;

  const [event, metadata, lineups, prediction] = await Promise.all([
    bsdFetch<BsdEventDetail>(`events/${mapping.bsdEventId}`),
    bsdFetch<BsdMetadataResponse>(
      `events/${mapping.bsdEventId}/metadata`,
    ).catch(() => null),
    bsdFetch<BsdLineupsResponse>(`events/${mapping.bsdEventId}/lineups`).catch(
      () => null,
    ),
    fetchPrediction(mapping.bsdEventId),
  ]);

  const homeTeam = byName.get(normalizeTeamName(fixture.team1)) ?? null;
  const awayTeam = byName.get(normalizeTeamName(fixture.team2)) ?? null;

  const [homeAnalytics, awayAnalytics] = await Promise.all([
    homeTeam ? getCachedTeamAnalytics(homeTeam) : Promise.resolve(null),
    awayTeam ? getCachedTeamAnalytics(awayTeam) : Promise.resolve(null),
  ]);

  const homeEditorial = homeTeam ? loadTeamEditorialInsight(homeTeam) : null;
  const awayEditorial = awayTeam ? loadTeamEditorialInsight(awayTeam) : null;

  const homeInsight =
    homeTeam && homeEditorial
      ? mergeTeamInsight(
          homeTeam,
          homeEditorial,
          buildTeamFormInsight(homeTeam, homeAnalytics),
        )
      : null;
  const awayInsight =
    awayTeam && awayEditorial
      ? mergeTeamInsight(
          awayTeam,
          awayEditorial,
          buildTeamFormInsight(awayTeam, awayAnalytics),
        )
      : null;

  return {
    eventId: mapping.bsdEventId,
    fixtureId: fixture.id,
    homeTeam: eventTeamLabel(event.home_team) ?? fixture.team1,
    awayTeam: eventTeamLabel(event.away_team) ?? fixture.team2,
    homeTeamId: mapping.homeTeamId ?? event.home_team_id ?? null,
    awayTeamId: mapping.awayTeamId ?? event.away_team_id ?? null,
    eventDate: event.event_date ?? fixtureKickoffToIso(fixture),
    status: event.status ?? null,
    venueId: event.venue_id ?? null,
    venueName: event.venue_name ?? fixture.ground,
    weatherDescription: event.weather?.description ?? null,
    temperatureC: event.weather?.temperature_c ?? null,
    travelDistanceKm: event.travel_distance_km ?? null,
    aiPreview: metadata?.ai_preview?.text ?? null,
    funFacts: (metadata?.funfacts ?? [])
      .map((fact) => fact.sentence)
      .filter((fact): fact is string => Boolean(fact)),
    lineupStatus: lineups?.lineup_status ?? null,
    prediction,
    lineups: {
      home: mapLineupSide(lineups?.lineups?.home ?? null, fixture.team1),
      away: mapLineupSide(lineups?.lineups?.away ?? null, fixture.team2),
    },
    teamInsights: {
      home: homeInsight,
      away: awayInsight,
    },
  };
}
