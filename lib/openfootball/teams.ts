import { fetchQuery } from "convex/nextjs";
import { cache } from "react";
import { api } from "@/convex/_generated/api";
import { buildByNameMap, toTeam } from "@/lib/teams/map";
import type { Fixture } from "./types";
import type { Team, TournamentGroup } from "./types";

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

export const getWorldCupTeams = cache(async (): Promise<{
  teams: Team[];
  groups: TournamentGroup[];
  byCode: Map<string, Team>;
  byName: Map<string, Team>;
}> => {
  const countries = await fetchQuery(api.countries.list, {});

  if (countries.length === 0) {
    throw new Error(
      "No countries found in Convex. Restore a data backup or import countries before building team pages.",
    );
  }

  const teams = countries.map(toTeam);
  const byCode = new Map(teams.map((team) => [team.fifa_code, team]));
  const byName = buildByNameMap(teams);

  const groups: TournamentGroup[] = GROUP_LETTERS.map((letter) => ({
    letter,
    label: `Group ${letter}`,
    teams: teams
      .filter((team) => team.group === letter)
      .toSorted((a, b) => a.displayName.localeCompare(b.displayName)),
  }));

  return { teams, groups, byCode, byName };
});

function resolveTeamByName(
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

export function resolveTeamByFifaCode(
  fifaCode: string | undefined,
  byCode: Map<string, Team>,
): { team?: Team; href?: string } {
  if (!fifaCode) return {};
  const team = byCode.get(fifaCode.toUpperCase());
  if (!team) return {};
  return { team, href: `/teams/${team.slug}` };
}

export function formatGroupConfederations(teams: Team[]): string {
  return [...new Set(teams.map((team) => team.confed))].join(", ");
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
