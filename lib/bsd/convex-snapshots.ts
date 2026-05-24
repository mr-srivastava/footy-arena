import type { Doc } from "@/convex/_generated/dataModel";
import type {
  ConvexCountrySnapshot,
  ConvexPlayerSnapshot,
} from "@/lib/bsd/enrichment-types";

export type LabTeamSnapshot = {
  country: ConvexCountrySnapshot;
  managerName?: string;
  squadStatus: "announced" | "pending";
  players: ConvexPlayerSnapshot[];
};

export function toConvexCountrySnapshot(
  country: Doc<"countries">,
): ConvexCountrySnapshot {
  return {
    slug: country.slug,
    displayName: country.displayName,
    fifaCode: country.fifaCode,
    groupLetter: country.groupLetter,
  };
}

export function toConvexPlayerSnapshot(
  player: Doc<"players">,
): ConvexPlayerSnapshot {
  return {
    id: player._id,
    name: player.name,
    jerseyNumber: player.jerseyNumber,
    age: player.age,
    position: player.position,
    detailedPosition: player.detailedPosition,
    preferredFoot: player.preferredFoot,
    club: player.club,
    league: player.league,
    clubCountry: player.clubCountry,
    positionGroup: player.positionGroup,
    isCaptain: player.isCaptain,
  };
}

export function toLabTeamSnapshot(data: {
  country: Doc<"countries">;
  squad: Doc<"squads"> | null;
  players: Doc<"players">[];
}): LabTeamSnapshot {
  return {
    country: toConvexCountrySnapshot(data.country),
    managerName: data.squad?.managerName,
    squadStatus: data.squad?.status ?? "pending",
    players: data.players.map(toConvexPlayerSnapshot),
  };
}
