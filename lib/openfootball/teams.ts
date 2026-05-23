import { cache } from "react";
import type { Fixture } from "./types";
import type { OpenFootballTeam, Team, TournamentGroup } from "./types";

const WC2026_TEAMS_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.teams.json";

export const GROUP_LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
] as const;

export type GroupLetter = (typeof GROUP_LETTERS)[number];

function toTeam(raw: OpenFootballTeam): Team {
  const displayName = raw.name_normalised ?? raw.name;
  return {
    ...raw,
    displayName,
    slug: raw.fifa_code.toLowerCase(),
    groupLabel: `Group ${raw.group}`,
  };
}

function parseTeams(data: unknown): OpenFootballTeam[] {
  if (!Array.isArray(data)) {
    throw new Error("Invalid teams data: expected an array");
  }

  return data as OpenFootballTeam[];
}

export const getWorldCupTeams = cache(async (): Promise<{
  teams: Team[];
  groups: TournamentGroup[];
  byCode: Map<string, Team>;
  byName: Map<string, Team>;
}> => {
  const response = await fetch(WC2026_TEAMS_URL, {
    next: { revalidate: 86_400 },
  });

  if (!response.ok) {
    throw new Error(`Failed to load teams (${response.status})`);
  }

  const teams = parseTeams(await response.json())
    .map(toTeam)
    .toSorted((a, b) => a.displayName.localeCompare(b.displayName));

  const byCode = new Map(teams.map((team) => [team.fifa_code, team]));
  const byName = new Map<string, Team>();

  for (const team of teams) {
    const keys = new Set([
      team.name,
      team.displayName,
      team.fifa_code,
      team.name_normalised,
    ]);

    for (const key of keys) {
      if (key) byName.set(key.toLowerCase(), team);
    }
  }

  const groups: TournamentGroup[] = GROUP_LETTERS.map((letter) => ({
    letter,
    label: `Group ${letter}`,
    teams: teams
      .filter((team) => team.group === letter)
      .toSorted((a, b) => a.displayName.localeCompare(b.displayName)),
  }));

  return { teams, groups, byCode, byName };
});

export function resolveTeamByName(
  name: string,
  byName: Map<string, Team>,
): Team | undefined {
  return byName.get(name.toLowerCase());
}

export function teamPageHref(
  name: string,
  byName: Map<string, Team>,
): string | undefined {
  const team = resolveTeamByName(name, byName);
  return team ? `/teams/${team.slug}` : undefined;
}

export function parseGroupLetter(groupLabel?: string): GroupLetter | null {
  if (!groupLabel) return null;
  const match = groupLabel.match(/^Group\s+([A-L])$/i);
  if (!match) return null;
  const letter = match[1].toUpperCase();
  return GROUP_LETTERS.includes(letter as GroupLetter)
    ? (letter as GroupLetter)
    : null;
}

export function getGroupFixtures(
  fixtures: Fixture[],
  letter: GroupLetter,
): Fixture[] {
  const label = `Group ${letter}`;
  return fixtures
    .filter((fixture) => fixture.group?.toLowerCase() === label.toLowerCase())
    .toSorted((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
}

export function getTeamFixtures(
  fixtures: Fixture[],
  team: Team,
): Fixture[] {
  const names = new Set(
    [team.name, team.displayName, team.name_normalised]
      .filter(Boolean)
      .map((value) => value!.toLowerCase()),
  );

  return fixtures
    .filter(
      (fixture) =>
        names.has(fixture.team1.toLowerCase()) ||
        names.has(fixture.team2.toLowerCase()),
    )
    .toSorted((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
}
