export type PositionGroup = "GK" | "DF" | "MF" | "FW";

const POSITION_TO_GROUP: Record<string, PositionGroup> = {
  Goalkeeper: "GK",
  Defender: "DF",
  Midfielder: "MF",
  Attacker: "FW",
};

export function toPositionGroup(position: string): PositionGroup {
  return POSITION_TO_GROUP[position] ?? "MF";
}
