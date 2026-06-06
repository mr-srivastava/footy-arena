import type { NormalizedPlayer } from "@/lib/bsd/enrichment-types";
import { playerSlugFromName } from "@/lib/explore/player-slug";
import type {
  PlayerPosition,
  SquadManager,
  SquadPlayer,
  TeamSquad,
} from "./types";
import { toPositionGroup } from "./positions";

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
    clubTeamId: player.club.bzzoiroTeamId ?? null,
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

function squadPlayerKey(player: SquadPlayer): string {
  if (player.bsdPlayerId != null) {
    return `id:${player.bsdPlayerId}`;
  }

  return `${player.profileSlug}:${player.number ?? "na"}:${player.club ?? "na"}`;
}

function dedupeSquadPlayers(players: SquadPlayer[]): SquadPlayer[] {
  const seen = new Set<string>();
  const unique: SquadPlayer[] = [];

  for (const player of players) {
    const key = squadPlayerKey(player);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(player);
  }

  return unique;
}

export function squadPlayerListKey(player: SquadPlayer, index: number): string {
  return player.bsdPlayerId != null
    ? `player-${player.bsdPlayerId}`
    : `${squadPlayerKey(player)}-${index}`;
}

export function squadFromEnrichedPlayers(
  status: TeamSquad["status"],
  manager: SquadManager | undefined,
  players: NormalizedPlayer[],
): TeamSquad {
  return {
    status,
    manager,
    players: dedupeSquadPlayers(players.map(normalizedPlayerToSquadPlayer)),
  };
}
