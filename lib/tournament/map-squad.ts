import type { Doc } from "@/convex/_generated/dataModel";
import type { PlayerPosition, TeamSquad } from "./types";
import { toPositionGroup } from "./positions";

type SquadDoc = Doc<"squads"> | null;
type PlayerDoc = Doc<"players">;

export function mapConvexSquad(
  squadDoc: SquadDoc,
  players: PlayerDoc[],
): TeamSquad {
  return {
    status: squadDoc?.status ?? "pending",
    manager: squadDoc?.managerName
      ? {
          name: squadDoc.managerName,
          nationality: squadDoc.managerNationality,
        }
      : undefined,
    players: players.map((p) => ({
      name: p.name,
      position: (p.positionGroup ?? toPositionGroup(p.position)) as PlayerPosition,
      club: p.club,
      number: p.jerseyNumber ?? undefined,
      age: p.age,
      detailedPosition: p.detailedPosition,
      isCaptain: p.isCaptain,
      league: p.league,
    })),
  };
}
