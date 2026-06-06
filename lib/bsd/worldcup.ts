import { cache } from "react";
import { BSD_WORLD_CUP_2026_LEAGUE_ID } from "@/lib/bsd/constants";
import { bsdFetch } from "@/lib/bsd/client";
import type {
  BsdTeamListItem,
  BsdTeamsListResponse,
} from "@/lib/bsd/enrichment-types";

type BsdWorldCupSquadRow = {
  id: number;
  team_id: number;
  name: string;
  jersey_number: number | null;
  position: string;
  status: string;
  call_up_date: string;
  club: string;
  club_country: string;
  caps: number;
  goals: number;
  date_of_birth: string;
  age: number;
  player_id: number | null;
};

type BsdWorldCupSquadsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: BsdWorldCupSquadRow[];
};

type BsdTeamSquadResponse = {
  team_id: number;
  team_name: string;
  group: string;
  count: number;
  results: BsdWorldCupSquadRow[];
};

export type { BsdWorldCupSquadRow, BsdTeamSquadResponse };

export const getWorldCupNationalTeams = cache(
  async (): Promise<BsdTeamListItem[]> => {
    const data = await bsdFetch<BsdTeamsListResponse>(
      `teams?in_competition=true&league_id=${BSD_WORLD_CUP_2026_LEAGUE_ID}&limit=200`,
    );
    return data.results;
  },
);

export const getAllWorldCupCallups = cache(
  async (): Promise<BsdWorldCupSquadRow[]> => {
    const rows: BsdWorldCupSquadRow[] = [];
    let offset = 0;

    while (true) {
      const page = await bsdFetch<BsdWorldCupSquadsResponse>(
        `worldcup/squads?limit=200&offset=${offset}`,
      );
      rows.push(...page.results);
      offset += page.results.length;
      if (!page.next || page.results.length === 0) {
        break;
      }
    }

    return rows;
  },
);

export async function getWorldCupTeamSquad(teamId: number) {
  return bsdFetch<BsdTeamSquadResponse>(`worldcup/squads/${teamId}`);
}
