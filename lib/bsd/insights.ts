import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
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
  TeamHistoryEntry,
  TeamInsight,
} from "@/lib/bsd/enrichment-types";
import { bsdFetch, hasBsdToken } from "@/lib/bsd/client";
import { BSD_WORLD_CUP_LEAGUE_ID } from "@/lib/bsd/constants";
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
  home_team?: string;
  away_team?: string;
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
  event_date?: string;
  team_id?: number | null;
  team_name?: string | null;
  opponent_team_name?: string | null;
  is_home?: boolean | null;
  minutes?: number | null;
  minutes_played?: number | null;
  rating?: number | null;
  goals?: number | null;
  assists?: number | null;
  team_score?: number | null;
  opponent_score?: number | null;
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

function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function kickoffToIso(fixture: Fixture) {
  return `${fixture.date}T${fixture.time.replace(" UTC", "")}:00Z`;
}

function safeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeProbability(value: number | null | undefined) {
  if (value == null) return null;
  return value > 1 ? Number((value / 100).toFixed(4)) : Number(value.toFixed(4));
}

function resultForScores(goalsFor: number | null, goalsAgainst: number | null): FormResult | null {
  if (goalsFor == null || goalsAgainst == null) return null;
  if (goalsFor > goalsAgainst) return "W";
  if (goalsFor < goalsAgainst) return "L";
  return "D";
}

function inferStage(entry: TeamHistoryEntry) {
  if (entry.matches >= 7) return "Final";
  if (entry.matches === 6) return entry.losses === 0 ? "Final" : "Semi-final";
  if (entry.matches === 5) return "Quarter-final";
  if (entry.matches === 4) return "Round of 16";
  return "Group stage";
}

function formatRecord(results: FormResult[]) {
  const wins = results.filter((result) => result === "W").length;
  const draws = results.filter((result) => result === "D").length;
  const losses = results.filter((result) => result === "L").length;
  return `${wins}-${draws}-${losses}`;
}

function bestFinishFromHistory(history: TeamHistoryEntry[]) {
  const priority = ["Final", "Semi-final", "Quarter-final", "Round of 16", "Group stage"];
  return (
    history
      .map((entry) => entry.stage)
      .sort((a, b) => priority.indexOf(a) - priority.indexOf(b))[0] ?? "Group stage"
  );
}

function streakLength(results: FormResult[], mode: "unbeaten" | "winless") {
  let streak = 0;
  for (const result of results) {
    const qualifies = mode === "unbeaten" ? result !== "L" : result !== "W";
    if (!qualifies) break;
    streak += 1;
  }
  return streak;
}

function mapAppearance(row: BsdPlayerStatsRow): PlayerAppearanceSummary {
  const minutes = row.minutes ?? row.minutes_played ?? null;
  const rating = safeNumber(row.rating);
  const goals = row.goals ?? 0;
  const assists = row.assists ?? 0;

  return {
    eventId: row.event_id ?? null,
    eventDate: row.event_date ?? "",
    teamName: row.team_name ?? null,
    opponentName: row.opponent_team_name ?? null,
    isHome: row.is_home ?? null,
    result: resultForScores(row.team_score ?? null, row.opponent_score ?? null),
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
  const players = (input.players ?? []).map(mapLineupPlayer).filter(Boolean) as MatchLineupPlayer[];
  const substitutes = (input.substitutes ?? []).map(mapLineupPlayer).filter(Boolean) as MatchLineupPlayer[];
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

async function fetchTeamFixtures(teamId: number) {
  return bsdFetch<BsdPaginated<BsdEventListItem>>(
    `teams/${teamId}/fixtures?league_id=${BSD_WORLD_CUP_LEAGUE_ID}&status=finished&date_from=1930-01-01T00:00:00Z&date_to=2030-12-31T23:59:59Z&limit=200`,
  );
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
      bsdFetch<BsdPaginated<BsdPlayerStatsRow>>(`players/${bsdPlayerId}/stats?limit=5`),
      bsdFetch<BsdCareerResponse>(`players/${bsdPlayerId}/career`),
      bsdFetch<BsdNationalTeamResponse>(`players/${bsdPlayerId}/national-team`),
    ]);

    const recentAppearances = stats.results.map(mapAppearance);
    const ratings = recentAppearances
      .map((appearance) => appearance.rating)
      .filter((rating): rating is number => rating != null);
    const formRating = ratings.length
      ? Number((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(2))
      : null;
    const seasonAverageRating =
      career.seasons.find((season) => season.avg_rating != null)?.avg_rating ?? null;
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

export async function loadTeamInsight(team: Team): Promise<TeamInsight | null> {
  if (!hasBsdToken()) return null;

  try {
    const nationalTeams = await bsdFetch<BsdPaginated<{ id: number; short_name: string; name: string }>>(
      `teams?in_competition=true&league_id=${BSD_WORLD_CUP_LEAGUE_ID}&limit=200`,
    );
    const bsdTeam = nationalTeams.results.find((entry) => {
      const candidates = [entry.short_name, entry.name]
        .filter(Boolean)
        .map((value) => normalizeName(value));
      return candidates.includes(normalizeName(team.displayName)) || candidates.includes(normalizeName(team.fifa_code));
    });

    if (!bsdTeam) return null;

    const fixtures = (await fetchTeamFixtures(bsdTeam.id)).results
      .filter((event) => event.home_score != null && event.away_score != null)
      .sort((a, b) => (b.event_date ?? "").localeCompare(a.event_date ?? ""));

    const recent = fixtures.slice(0, 5);
    const recentForm = recent
      .map((event) => {
        const isHome = event.home_team_id === bsdTeam.id;
        const goalsFor = isHome ? event.home_score ?? null : event.away_score ?? null;
        const goalsAgainst = isHome ? event.away_score ?? null : event.home_score ?? null;
        return resultForScores(goalsFor, goalsAgainst);
      })
      .filter((value): value is FormResult => value != null);

    const recentGoalsFor = recent.reduce((sum, event) => {
      const isHome = event.home_team_id === bsdTeam.id;
      return sum + (isHome ? event.home_score ?? 0 : event.away_score ?? 0);
    }, 0);
    const recentGoalsAgainst = recent.reduce((sum, event) => {
      const isHome = event.home_team_id === bsdTeam.id;
      return sum + (isHome ? event.away_score ?? 0 : event.home_score ?? 0);
    }, 0);

    const historyByYear = new Map<string, TeamHistoryEntry>();
    for (const event of fixtures) {
      const year = (event.event_date ?? "").slice(0, 4);
      if (!year) continue;
      const isHome = event.home_team_id === bsdTeam.id;
      const goalsFor = isHome ? event.home_score ?? 0 : event.away_score ?? 0;
      const goalsAgainst = isHome ? event.away_score ?? 0 : event.home_score ?? 0;
      const result = resultForScores(goalsFor, goalsAgainst);
      const current = historyByYear.get(year) ?? {
        year,
        matches: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        stage: "Group stage",
      };
      current.matches += 1;
      current.goalsFor += goalsFor;
      current.goalsAgainst += goalsAgainst;
      current.goalDifference = current.goalsFor - current.goalsAgainst;
      if (result === "W") current.wins += 1;
      if (result === "D") current.draws += 1;
      if (result === "L") current.losses += 1;
      historyByYear.set(year, current);
    }

    const history = [...historyByYear.values()]
      .map((entry) => ({ ...entry, stage: inferStage(entry) }))
      .sort((a, b) => Number(b.year) - Number(a.year));

    return {
      teamId: bsdTeam.id,
      teamName: team.displayName,
      recentForm,
      recentRecord: formatRecord(recentForm),
      unbeatenStreak: streakLength(recentForm, "unbeaten"),
      winlessStreak: streakLength(recentForm, "winless"),
      goalsForRecent: recentGoalsFor,
      goalsAgainstRecent: recentGoalsAgainst,
      worldCupAppearances: history.length,
      bestFinish: bestFinishFromHistory(history),
      history,
    };
  } catch {
    return null;
  }
}

export async function resolveFixtureMapping(
  fixture: Fixture,
  byName: Map<string, Team>,
): Promise<FixtureBsdMapping | null> {
  if (!hasBsdToken()) return null;

  const cached = await fetchQuery(api.fixtureMappings.getByFixtureId, {
    fixtureId: fixture.id,
  });
  if (cached) {
    return {
      fixtureId: cached.fixtureId,
      bsdEventId: cached.bsdEventId,
      confidence: cached.confidence as BsdMatchConfidence,
      homeTeamId: cached.homeTeamId ?? null,
      awayTeamId: cached.awayTeamId ?? null,
      lastResolvedAt: cached.lastResolvedAt,
    };
  }

  const home = byName.get(fixture.team1.toLowerCase());
  const away = byName.get(fixture.team2.toLowerCase());
  if (!home || !away) return null;

  const start = new Date(kickoffToIso(fixture)).getTime();
  const dateFrom = new Date(start - 12 * 60 * 60 * 1000).toISOString();
  const dateTo = new Date(start + 12 * 60 * 60 * 1000).toISOString();
  const candidates = await bsdFetch<BsdPaginated<BsdEventListItem>>(
    `events?league_id=${BSD_WORLD_CUP_LEAGUE_ID}&date_from=${encodeURIComponent(dateFrom)}&date_to=${encodeURIComponent(dateTo)}&limit=50`,
  );

  const scored = candidates.results
    .map((event) => {
      const names = [
        normalizeName(event.home_team ?? ""),
        normalizeName(event.away_team ?? ""),
      ];
      const targetNames = [normalizeName(home.displayName), normalizeName(away.displayName)];
      const matchingNames = targetNames.filter((name) => names.includes(name)).length;
      const dateDelta = Math.abs(new Date(event.event_date ?? "").getTime() - start);
      const timeScore = dateDelta <= 30 * 60 * 1000 ? 20 : dateDelta <= 2 * 60 * 60 * 1000 ? 10 : 0;
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

  await fetchMutation(api.fixtureMappings.upsert, {
    ...mapping,
    homeTeamId: mapping.homeTeamId ?? undefined,
    awayTeamId: mapping.awayTeamId ?? undefined,
  });
  return mapping;
}

async function fetchPrediction(eventId: number): Promise<MatchPrediction | null> {
  try {
    const prediction = await bsdFetch<BsdPredictionResponse>(`events/${eventId}/prediction`);
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

  const mapping = await resolveFixtureMapping(fixture, byName);
  if (!mapping) return null;

  const [event, metadata, lineups, prediction] = await Promise.all([
    bsdFetch<BsdEventDetail>(`events/${mapping.bsdEventId}`),
    bsdFetch<BsdMetadataResponse>(`events/${mapping.bsdEventId}/metadata`).catch(() => null),
    bsdFetch<BsdLineupsResponse>(`events/${mapping.bsdEventId}/lineups`).catch(() => null),
    fetchPrediction(mapping.bsdEventId),
  ]);

  const homeTeam = byName.get(fixture.team1.toLowerCase()) ?? null;
  const awayTeam = byName.get(fixture.team2.toLowerCase()) ?? null;
  const [homeInsight, awayInsight] = await Promise.all([
    homeTeam ? loadTeamInsight(homeTeam) : Promise.resolve(null),
    awayTeam ? loadTeamInsight(awayTeam) : Promise.resolve(null),
  ]);

  return {
    eventId: mapping.bsdEventId,
    fixtureId: fixture.id,
    homeTeam: event.home_team ?? fixture.team1,
    awayTeam: event.away_team ?? fixture.team2,
    eventDate: event.event_date ?? kickoffToIso(fixture),
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
