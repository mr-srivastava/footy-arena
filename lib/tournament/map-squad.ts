import type { Doc } from "@/convex/_generated/dataModel";
import type { NormalizedPlayer } from "@/lib/bsd/enrichment-types";
import { playerSlugFromName } from "@/lib/explore/player-slug";
import type { PlayerPosition, SquadManager, SquadPlayer, TeamSquad } from "./types";
import { toPositionGroup } from "./positions";

type SquadDoc = Doc<"squads"> | null;
type PlayerDoc = Doc<"players">;

export function squadManagerFromDoc(squadDoc: SquadDoc): SquadManager | undefined {
  if (!squadDoc?.managerName) {
    return undefined;
  }

  return {
    name: squadDoc.managerName,
    nationality: squadDoc.managerNationality,
  };
}

function toSquadPlayerPosition(
  positionGroup: string | undefined,
  position: string,
): PlayerPosition {
  if (
    positionGroup === "GK" ||
    positionGroup === "DF" ||
    positionGroup === "MF" ||
    positionGroup === "FW"
  ) {
    return positionGroup;
  }

  return toPositionGroup(position);
}

function normalizedPlayerToSquadPlayer(player: NormalizedPlayer): SquadPlayer {
  return {
    name: player.name,
    shortName: player.shortName ?? undefined,
    profileSlug: playerSlugFromName(player.name),
    position: toSquadPlayerPosition(player.positionGroup, player.position),
    club: player.club.name,
    number: player.jerseyNumber ?? undefined,
    age: player.age,
    detailedPosition: player.detailedPosition,
    preferredFoot: player.preferredFoot || undefined,
    heightCm: player.bzzoiro?.heightCm ?? null,
    marketValueEur: player.bzzoiro?.marketValueEur ?? null,
    isCaptain: player.isCaptain,
    league: player.club.league,
    bsdPlayerId: player.bzzoiro?.playerId,
    availability: player.bzzoiro?.availability ?? null,
  };
}

export function mapConvexSquad(
  squadDoc: SquadDoc,
  players: PlayerDoc[],
): TeamSquad {
  return {
    status: squadDoc?.status ?? "pending",
    manager: squadManagerFromDoc(squadDoc),
    players: players.map((p) => ({
      name: p.name,
      profileSlug: p.profileSlug ?? playerSlugFromName(p.name),
      position: toSquadPlayerPosition(p.positionGroup, p.position),
      club: p.club,
      number: p.jerseyNumber ?? undefined,
      age: p.age,
      detailedPosition: p.detailedPosition,
      preferredFoot: p.preferredFoot || undefined,
      isCaptain: p.isCaptain,
      league: p.league,
    })),
  };
}

export function squadFromEnrichedPlayers(
  status: TeamSquad["status"],
  manager: SquadManager | undefined,
  players: NormalizedPlayer[],
): TeamSquad {
  return {
    status,
    manager,
    players: players.map(normalizedPlayerToSquadPlayer),
  };
}
