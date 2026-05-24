import type { PlayerPosition, TeamSquad } from "./types";

const POSITION_LABELS: Record<PlayerPosition, string> = {
  GK: "Goalkeepers",
  DF: "Defenders",
  MF: "Midfielders",
  FW: "Forwards",
};

const POSITION_ORDER: PlayerPosition[] = ["GK", "DF", "MF", "FW"];

export function groupPlayersByPosition(squad: TeamSquad) {
  return POSITION_ORDER.map((position) => ({
    position,
    label: POSITION_LABELS[position],
    players: squad.players.filter((player) => player.position === position),
  }));
}
