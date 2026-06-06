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

const PLACEHOLDER_TEAM =
  /^(?:[12][A-L]|[WL]\d+|L\d+|3[A-L](?:\/[A-L])+(?:\/[A-L])*)$/;

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

function slugPart(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function legacyUnsanitizedFixtureSlug(match: OpenFootballMatch) {
  return `${match.date}-${match.time}-${match.team1}-${match.team2}`
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function descriptiveFixtureSlug(match: OpenFootballMatch) {
  return [
    match.date,
    slugPart(match.time),
    slugPart(match.team1),
    slugPart(match.team2),
  ]
    .filter(Boolean)
    .join("-");
}

function fixtureId(match: OpenFootballMatch, index: number): string {
  if (match.num != null) {
    return `match-${match.num}`;
  }

  const slug = descriptiveFixtureSlug(match);
  return slug || `fixture-${index + 1}`;
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

/**
 * Converts an OpenFootball fixture date/time to a UTC ISO-8601 string.
 * Handles "HH:MM UTC", "HH:MM UTC±N", and bare "HH:MM" (treated as UTC).
 */
export function fixtureKickoffToIso(
  fixture: Pick<Fixture, "date" | "time">,
): string {
  const match = fixture.time.match(
    /^(\d{1,2}):(\d{2})(?:\s*UTC(?:([+-]\d+))?)?$/i,
  );
  if (!match) {
    const bare = fixture.time.match(/^(\d{1,2}):(\d{2})/);
    if (bare) {
      const hours = bare[1]!.padStart(2, "0");
      const minutes = bare[2]!;
      return `${fixture.date}T${hours}:${minutes}:00.000Z`;
    }
    throw new Error(`Invalid fixture time: ${fixture.time}`);
  }

  const hours = Number.parseInt(match[1]!, 10);
  const minutes = Number.parseInt(match[2]!, 10);
  const offsetHours = match[3] ? Number.parseInt(match[3], 10) : 0;
  const utcHours = hours - offsetHours;

  const kickoff = new Date(`${fixture.date}T00:00:00.000Z`);
  kickoff.setUTCHours(utcHours, minutes, 0, 0);
  return kickoff.toISOString();
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

export const getWorldCupFixtures = cache(
  async (): Promise<{
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
  },
);

export function getOpeningDayFixtures(
  fixtures: Fixture[],
  date: string,
): Fixture[] {
  return fixtures
    .filter((f) => f.date === date)
    .toSorted((a, b) => a.time.localeCompare(b.time));
}

export function getFixtureStageCounts(fixtures: Fixture[]) {
  const groupMatches = fixtures.filter(
    (fixture) => fixture.stage === "group",
  ).length;

  return {
    total: fixtures.length,
    groupMatches,
    knockoutMatches: fixtures.length - groupMatches,
  };
}

export function getFixtureById(fixtures: Fixture[], fixtureId: string) {
  const decodedFixtureId = decodeURIComponent(fixtureId);

  return (
    fixtures.find((fixture) => {
      if (fixture.id === decodedFixtureId) {
        return true;
      }

      const legacyId = fixture.num ? `match-${fixture.num}` : null;
      if (legacyId === decodedFixtureId) {
        return true;
      }

      if (legacyUnsanitizedFixtureSlug(fixture) === decodedFixtureId) {
        return true;
      }

      return descriptiveFixtureSlug(fixture) === decodedFixtureId;
    }) ?? null
  );
}

export { formatKickoff };
