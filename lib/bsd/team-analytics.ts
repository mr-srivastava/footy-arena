import { bsdFetch, hasBsdToken } from "@/lib/bsd/client";
export type { FormResult } from "@/lib/bsd/enrichment-types";
import type { FormResult } from "@/lib/bsd/enrichment-types";
import type { Team } from "@/lib/openfootball/types";

export type TeamAnalyticsFixture = {
  id: number;
  league_id: number;
  home_team_id: number;
  home_team: string;
  away_team_id: number;
  away_team: string;
  event_date: string;
  status: string;
  round_number?: number | null;
  round_name?: string;
  group_name?: string | null;
  home_score: number | null;
  away_score: number | null;
};

type League = {
  id: number;
  name: string;
  country: string;
};

type TeamManager = {
  id: number;
  name: string;
  short_name: string;
  country: string;
  tactical_profile: string;
  preferred_formation: string;
  current_team_id: number;
  matches_total: number;
  wins: number;
  draws: number;
  losses: number;
  win_pct: number;
  avg_goals_scored: number;
  avg_goals_conceded: number;
  avg_possession: number;
  clean_sheet_pct: number;
  btts_pct: number;
  over_25_pct: number;
  stats_updated_at: string;
};

export type TeamManagerSummary = TeamManager;

type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type TeamFixturesData = {
  fixtures: TeamAnalyticsFixture[];
  leagueNames: Record<number, string>;
};

export type TeamAnalytics = {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  recentForm: FormResult[];
  unbeatenStreak: number;
  byCompetition: Array<{
    leagueId: number;
    leagueName: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    fixtures: TeamAnalyticsFixture[];
  }>;
};

export type TeamAnalyticsPayload = {
  manager: TeamManager | null;
  analytics: TeamAnalytics | null;
};

const FIXTURE_DATE_FROM = "2023-01-01T00:00:00Z";
const FIXTURE_DATE_TO = "2026-12-31T23:59:59Z";

async function getTeamManager(teamId: number) {
  const response = await bsdFetch<PaginatedResponse<TeamManager>>(
    `managers?team_id=${teamId}`,
  );
  return response.results[0] ?? null;
}

async function getLeague(leagueId: number) {
  return bsdFetch<League>(`leagues/${leagueId}`);
}

async function fetchAllFinishedFixtures(teamId: number) {
  const fixtures: TeamAnalyticsFixture[] = [];
  let nextPath: string | null =
    `teams/${teamId}/fixtures?status=finished&date_from=${FIXTURE_DATE_FROM}&date_to=${FIXTURE_DATE_TO}&limit=100`;

  while (nextPath) {
    const page: PaginatedResponse<TeamAnalyticsFixture> =
      await bsdFetch<PaginatedResponse<TeamAnalyticsFixture>>(nextPath);
    fixtures.push(
      ...page.results.filter(
        (fixture: TeamAnalyticsFixture) =>
          fixture.home_score != null && fixture.away_score != null,
      ),
    );
    nextPath = page.next
      ? page.next.replace(/^https:\/\/sports\.bzzoiro\.com\/api\/v2\//, "")
      : null;
  }

  fixtures.sort((a, b) => b.event_date.localeCompare(a.event_date));
  return fixtures;
}

async function getTeamFixtures(teamId: number): Promise<TeamFixturesData> {
  const fixtures = await fetchAllFinishedFixtures(teamId);
  const leagueIds = [...new Set(fixtures.map((fixture) => fixture.league_id))];
  const leagues = await Promise.all(
    leagueIds.map((leagueId) => getLeague(leagueId)),
  );
  const leagueNames = Object.fromEntries(
    leagues.map((league) => [league.id, league.name]),
  );

  return { fixtures, leagueNames };
}

export function resultForTeam(
  fixture: TeamAnalyticsFixture,
  teamId: number,
): FormResult | null {
  const isHome = fixture.home_team_id === teamId;
  const goalsFor = isHome ? fixture.home_score : fixture.away_score;
  const goalsAgainst = isHome ? fixture.away_score : fixture.home_score;
  if (goalsFor == null || goalsAgainst == null) return null;
  if (goalsFor > goalsAgainst) return "W";
  if (goalsFor < goalsAgainst) return "L";
  return "D";
}

export function goalsForTeam(fixture: TeamAnalyticsFixture, teamId: number) {
  const isHome = fixture.home_team_id === teamId;
  return isHome ? (fixture.home_score ?? 0) : (fixture.away_score ?? 0);
}

export function goalsAgainstTeam(
  fixture: TeamAnalyticsFixture,
  teamId: number,
) {
  const isHome = fixture.home_team_id === teamId;
  return isHome ? (fixture.away_score ?? 0) : (fixture.home_score ?? 0);
}

export function streakLength(
  form: FormResult[],
  mode: "unbeaten" | "winless" = "unbeaten",
) {
  let length = 0;
  for (const result of form) {
    const continues =
      mode === "unbeaten" ? result === "W" || result === "D" : result !== "W";
    if (!continues) break;
    length += 1;
  }
  return length;
}

function buildTeamAnalytics(
  fixtures: TeamAnalyticsFixture[],
  teamId: number,
  leagueNames: Record<number, string>,
): TeamAnalytics {
  const recentForm = fixtures
    .slice(0, 5)
    .map((fixture) => resultForTeam(fixture, teamId))
    .filter((result): result is FormResult => result != null);

  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;

  const competitionMap = new Map<number, TeamAnalyticsFixture[]>();
  for (const fixture of fixtures) {
    const result = resultForTeam(fixture, teamId);
    goalsFor += goalsForTeam(fixture, teamId);
    goalsAgainst += goalsAgainstTeam(fixture, teamId);
    if (result === "W") wins += 1;
    if (result === "D") draws += 1;
    if (result === "L") losses += 1;

    const bucket = competitionMap.get(fixture.league_id) ?? [];
    bucket.push(fixture);
    competitionMap.set(fixture.league_id, bucket);
  }

  const byCompetition = [...competitionMap.entries()]
    .map(([leagueId, competitionFixtures]) => {
      let compWins = 0;
      let compDraws = 0;
      let compLosses = 0;
      let compGoalsFor = 0;
      let compGoalsAgainst = 0;

      for (const fixture of competitionFixtures) {
        const result = resultForTeam(fixture, teamId);
        compGoalsFor += goalsForTeam(fixture, teamId);
        compGoalsAgainst += goalsAgainstTeam(fixture, teamId);
        if (result === "W") compWins += 1;
        if (result === "D") compDraws += 1;
        if (result === "L") compLosses += 1;
      }

      return {
        leagueId,
        leagueName: leagueNames[leagueId] ?? `Competition ${leagueId}`,
        played: competitionFixtures.length,
        wins: compWins,
        draws: compDraws,
        losses: compLosses,
        goalsFor: compGoalsFor,
        goalsAgainst: compGoalsAgainst,
        fixtures: competitionFixtures,
      };
    })
    .sort((a, b) => b.played - a.played);

  return {
    played: fixtures.length,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst,
    recentForm,
    unbeatenStreak: streakLength(recentForm),
    byCompetition,
  };
}

export function sortFixturesByMostRecent<
  T extends { fixture: TeamAnalyticsFixture },
>(rows: T[]) {
  return rows.toSorted((a, b) =>
    b.fixture.event_date.localeCompare(a.fixture.event_date),
  );
}

export async function loadTeamAnalytics(
  team: Team,
): Promise<TeamAnalyticsPayload | null> {
  if (!hasBsdToken() || !team.bsdTeamId) {
    return null;
  }

  try {
    const [manager, fixturesData] = await Promise.all([
      getTeamManager(team.bsdTeamId),
      getTeamFixtures(team.bsdTeamId),
    ]);

    return {
      manager,
      analytics: buildTeamAnalytics(
        fixturesData.fixtures,
        team.bsdTeamId,
        fixturesData.leagueNames,
      ),
    };
  } catch {
    return null;
  }
}

export function formatFixtureDate(eventDate: string) {
  return new Date(eventDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRecord(results: FormResult[]) {
  const wins = results.filter((result) => result === "W").length;
  const draws = results.filter((result) => result === "D").length;
  const losses = results.filter((result) => result === "L").length;
  return `${wins}-${draws}-${losses}`;
}

export function resultLabel(result: FormResult[]) {
  const wins = result.filter((entry) => entry === "W").length;
  const draws = result.filter((entry) => entry === "D").length;
  const losses = result.filter((entry) => entry === "L").length;
  return `${wins}W-${draws}D-${losses}L`;
}

export async function loadTeamManager(teamId: number) {
  return getTeamManager(teamId);
}
