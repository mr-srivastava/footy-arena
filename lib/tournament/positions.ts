import type { PlayerPosition } from "./types";

export const POSITION_TO_GROUP: Record<string, PlayerPosition> = {
  Goalkeeper: "GK",
  Defender: "DF",
  Midfielder: "MF",
  Attacker: "FW",
};

export function toPositionGroup(position: string): PlayerPosition {
  return POSITION_TO_GROUP[position] ?? "MF";
}
