import { bsdFetch } from "@/lib/bsd/client";
import { BSD_WORLD_CUP_LEAGUE_ID } from "@/lib/bsd/constants";
import type { BsdTeamListItem, BsdTeamsListResponse } from "@/lib/bsd/enrichment-types";

let cachedNationalTeams: BsdTeamListItem[] | null = null;

export async function getWorldCupNationalTeams() {
  if (cachedNationalTeams) return cachedNationalTeams;

  const data = await bsdFetch<BsdTeamsListResponse>(
    `teams?in_competition=true&league_id=${BSD_WORLD_CUP_LEAGUE_ID}&limit=200`,
  );
  cachedNationalTeams = data.results;
  return cachedNationalTeams;
}
