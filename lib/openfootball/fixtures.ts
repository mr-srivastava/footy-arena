import { cache } from "react";
import type {
  Fixture,
  FixtureStage,
  FixturesByDate,
  OpenFootballMatch,
  OpenFootballWorldCup,
} from "./types";

const WC2026_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

const PLACEHOLDER_TEAM = /^(?:[12][A-L]|[WL]\d+|L\d+|3[A-L](?:\/[A-L])+(?:\/[A-L])*)$/;

function getStage(match: OpenFootballMatch): FixtureStage {
  if (match.group) return "group";
  if (match.round === "Final") return "final";
  if (match.round === "Match for third place") return "third-place";
  if (match.round === "Semi-final") return "semi-final";
  if (match.round === "Quarter-final") return "quarter-final";
  if (match.round === "Round of 16") return "round-of-16";
  return "round-of-32";
}

function getStageLabel(match: OpenFootballMatch): string {
  if (match.group) return match.group;
  if (match.num) return `${match.round} · #${match.num}`;
  return match.round;
}

function fixtureId(match: OpenFootballMatch, index: number): string {
  if (match.num) return `match-${match.num}`;
  const slug = `${match.date}-${match.time}-${match.team1}-${match.team2}`
    .toLowerCase()
    .replace(/\s+/g, "-");
  return slug || `match-${index}`;
}

function toFixture(match: OpenFootballMatch, index: number): Fixture {
  const stage = getStage(match);
  return {
    ...match,
    id: fixtureId(match, index),
    stage,
    stageLabel: getStageLabel(match),
  };
}

function formatDateLabel(date: string): string {
  const parsed = new Date(`${date}T12:00:00`);
  return parsed.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatKickoff(time: string): string {
  return time.replace("UTC", "UTC ");
}

function parseWorldCup(data: unknown): OpenFootballWorldCup {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid world cup data: expected an object");
  }

  const record = data as Record<string, unknown>;

  if (typeof record.name !== "string") {
    throw new Error("Invalid world cup data: missing tournament name");
  }

  if (!Array.isArray(record.matches)) {
    throw new Error("Invalid world cup data: missing matches array");
  }

  return data as OpenFootballWorldCup;
}

export function isPlaceholderTeam(team: string): boolean {
  return PLACEHOLDER_TEAM.test(team);
}

export function formatPlaceholderTeam(code: string): string {
  if (code.startsWith("W") || code.startsWith("L")) {
    return `Winner of ${code.slice(1)}`;
  }
  if (code.startsWith("1") || code.startsWith("2")) {
    return `${code.charAt(0) === "1" ? "1st" : "2nd"} in ${code.slice(1)}`;
  }
  if (code.startsWith("3")) {
    return `3rd place (${code.slice(1).replace(/\//g, ", ")})`;
  }
  return code;
}

export const getWorldCupFixtures = cache(async (): Promise<{
  tournament: string;
  fixtures: Fixture[];
  byDate: FixturesByDate[];
}> => {
  const response = await fetch(WC2026_URL, {
    next: { revalidate: 86_400 },
  });

  if (!response.ok) {
    throw new Error(`Failed to load fixtures (${response.status})`);
  }

  const data = parseWorldCup(await response.json());
  const fixtures = data.matches.map(toFixture);

  const dateMap = new Map<string, Fixture[]>();
  for (const fixture of fixtures) {
    const existing = dateMap.get(fixture.date) ?? [];
    existing.push(fixture);
    dateMap.set(fixture.date, existing);
  }

  const byDate: FixturesByDate[] = [...dateMap.entries()]
    .toSorted(([a], [b]) => a.localeCompare(b))
    .map(([date, matches]) => ({
      date,
      dateLabel: formatDateLabel(date),
      matches: matches.toSorted((a, b) => a.time.localeCompare(b.time)),
    }));

  return {
    tournament: data.name,
    fixtures,
    byDate,
  };
});

export function getOpeningDayFixtures(
  fixtures: Fixture[],
  date: string,
): Fixture[] {
  return fixtures
    .filter((f) => f.date === date)
    .toSorted((a, b) => a.time.localeCompare(b.time));
}

export { formatKickoff };
