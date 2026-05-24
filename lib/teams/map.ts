import type { Doc } from "@/convex/_generated/dataModel";
import type { Team } from "@/lib/openfootball/types";

export function toTeam(country: Doc<"countries">): Team {
  return {
    name: country.name,
    name_normalised: country.nameNormalised,
    continent: country.continent,
    flag_icon: country.flagIcon,
    fifa_code: country.fifaCode,
    group: country.groupLetter,
    confed: country.confederation,
    displayName: country.displayName,
    slug: country.slug,
    groupLabel: `Group ${country.groupLetter}`,
  };
}

export function buildByNameMap(teams: Team[]): Map<string, Team> {
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

  return byName;
}
