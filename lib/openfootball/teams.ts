import { cache } from "react";
import { getWorldCupNationalTeams } from "@/lib/bsd/worldcup";
import { getTeamMetadata, teamSlugFromName } from "@/lib/teams/metadata";
import { normalizeTeamName } from "@/lib/teams/normalize-name";
import {
  GROUP_LETTERS,
  WC2026_NATIONS,
  type GroupLetter,
} from "@/lib/teams/wc2026-nations";
import type { Fixture } from "./types";
import type { Team, TournamentGroup } from "./types";

export { GROUP_LETTERS, type GroupLetter };

function buildByNameMap(teams: Team[]) {
  const byName = new Map<string, Team>();

  for (const team of teams) {
    const keys = new Set([
      team.name,
      team.displayName,
      team.fifa_code,
      team.name_normalised,
      ...(team.displayName === "USA" ? ["United States"] : []),
    ]);

    for (const key of keys) {
      if (key) {
        byName.set(normalizeTeamName(key), team);
      }
    }
  }

  return byName;
}

export const getWorldCupTeams = cache(
  async (): Promise<{
    teams: Team[];
    groups: TournamentGroup[];
    byCode: Map<string, Team>;
    byName: Map<string, Team>;
  }> => {
    const bsdTeams = await getWorldCupNationalTeams();
    const bsdByName = new Map(
      bsdTeams.flatMap((team) => {
        const keys = [team.name, team.short_name, team.country]
          .filter(Boolean)
          .map((value) => [normalizeTeamName(value), team] as const);
        return keys;
      }),
    );

    const teams = WC2026_NATIONS.map((nation) => {
      const metadata = getTeamMetadata(nation.displayName);
      const bsdTeam = bsdByName.get(normalizeTeamName(nation.displayName));

      return {
        name: nation.displayName,
        name_normalised: nation.displayName,
        continent: metadata.continent,
        flag_icon: metadata.flag,
        fifa_code: metadata.fifaCode,
        group: nation.group,
        confed: metadata.confed,
        displayName: metadata.displayName,
        slug: teamSlugFromName(metadata.displayName),
        groupLabel: `Group ${nation.group}`,
        bsdTeamId: bsdTeam?.id,
      } satisfies Team;
    }).toSorted((a, b) => a.displayName.localeCompare(b.displayName));

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
  },
);

export function resolveTeamByName(
  name: string,
  byName: Map<string, Team>,
): Team | undefined {
  return byName.get(normalizeTeamName(name));
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

export function getTeamFixtures(fixtures: Fixture[], team: Team): Fixture[] {
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
