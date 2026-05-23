import type { PlayerPosition, TeamSquad } from "./types";
import { SQUAD_DATA } from "./seed/squads";

const POSITION_LABELS: Record<PlayerPosition, string> = {
  GK: "Goalkeepers",
  DF: "Defenders",
  MF: "Midfielders",
  FW: "Forwards",
};

const POSITION_ORDER: PlayerPosition[] = ["GK", "DF", "MF", "FW"];

const EMPTY_SQUAD: TeamSquad = {
  status: "pending",
  players: [],
};

export function getTeamSquad(fifaCode: string): TeamSquad {
  return SQUAD_DATA[fifaCode.toUpperCase()] ?? EMPTY_SQUAD;
}

export function countAnnouncedSquads(): number {
  return Object.values(SQUAD_DATA).filter((squad) => squad.manager).length;
}

export function groupPlayersByPosition(squad: TeamSquad) {
  return POSITION_ORDER.map((position) => ({
    position,
    label: POSITION_LABELS[position],
    players: squad.players.filter((player) => player.position === position),
  }));
}
