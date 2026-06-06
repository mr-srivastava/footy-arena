import type { Doc } from "@/convex/_generated/dataModel";
import { hasBsdToken } from "@/lib/bsd/client";
import { toConvexCountrySnapshot } from "@/lib/bsd/convex-snapshots";
import { enrichPlayers, normalizePlayer } from "@/lib/bsd/normalize-player";
import { squadManagerFromDoc } from "@/lib/tournament/map-squad";
import type { TeamSquadPayload } from "@/lib/tournament/types";

export type TeamPageData = {
  country: Doc<"countries">;
  squad: Doc<"squads"> | null;
  players: Doc<"players">[];
};

function convexFallbackPayload(teamPageData: TeamPageData): TeamSquadPayload {
  const country = toConvexCountrySnapshot(teamPageData.country);

  return {
    country,
    status: teamPageData.squad?.status ?? "pending",
    manager: squadManagerFromDoc(teamPageData.squad),
    source: "convex",
    players: teamPageData.players.map((player) => ({
      player: normalizePlayer(player, null, null),
      match: null,
    })),
    summary: {
      total: teamPageData.players.length,
      matched: 0,
    },
  };
}

export async function loadEnrichedTeamSquad(
  teamPageData: TeamPageData | null,
): Promise<TeamSquadPayload | null> {
  if (!teamPageData) {
    return null;
  }

  if (!hasBsdToken() || teamPageData.players.length === 0) {
    return convexFallbackPayload(teamPageData);
  }

  try {
    const country = toConvexCountrySnapshot(teamPageData.country);
    const enriched = await enrichPlayers(teamPageData.players, country);

    return {
      country,
      status: teamPageData.squad?.status ?? "pending",
      manager: squadManagerFromDoc(teamPageData.squad),
      source: "bsd",
      players: enriched.map(({ player, match }) => ({ player, match })),
      summary: {
        total: enriched.length,
        matched: enriched.filter((result) => result.match.bsdPlayerId != null).length,
      },
    };
  } catch {
    return convexFallbackPayload(teamPageData);
  }
}
