import { OPENING_DAY } from "@/lib/openfootball/constants";
import {
  getOpeningDayFixtures,
  getWorldCupFixtures,
} from "@/lib/openfootball/fixtures";
import { getWorldCupTeams } from "@/lib/openfootball/teams";

export async function getHomeHeroData() {
  const { fixtures } = await getWorldCupFixtures();
  return { matchCount: fixtures.length };
}

export async function getHomeOpeningFixturesData() {
  const [{ fixtures }, { byName }] = await Promise.all([
    getWorldCupFixtures(),
    getWorldCupTeams(),
  ]);

  return {
    matchCount: fixtures.length,
    openingFixtures: getOpeningDayFixtures(fixtures, OPENING_DAY),
    byName,
  };
}
