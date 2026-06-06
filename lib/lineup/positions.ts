import type { Squad } from "react-soccer-lineup";
import type { PlayerPosition, SquadPlayer } from "@/lib/tournament/types";

export type FieldRow = keyof Omit<Squad, "gk">;
export type PositionGroup = "GK" | "DF" | "MF" | "FW";

export function normalizePositionCode(position: string | null | undefined) {
  return position?.trim().toUpperCase() ?? "";
}

export function explicitRow(
  position: string | null | undefined,
): FieldRow | "gk" | null {
  const code = normalizePositionCode(position);

  if (/^(G|GK|GOALKEEPER)$/.test(code)) return "gk";
  if (/^(D|DF|DEFENDER|CB|LB|RB|LWB|RWB|SW)$/.test(code)) return "df";
  if (/^(CDM|DM|DMF|ANCHOR)$/.test(code)) return "cdm";
  if (/^(CAM|AM|OM|SS|NUMBER10|NO10)$/.test(code)) return "cam";
  if (/^(CM|LM|RM|M|MF|MIDFIELDER)$/.test(code)) return "cm";
  if (/^(F|FW|ST|CF|LW|RW|FORWARD|ATTACKER|WINGER)$/.test(code)) return "fw";

  return null;
}

export function positionGroup(
  position: string | null | undefined,
): PositionGroup | null {
  const row = explicitRow(position);
  if (!row) return null;
  if (row === "gk") return "GK";
  if (row === "df") return "DF";
  if (row === "fw") return "FW";
  return "MF";
}

export function squadPlayerPositionCode(player: SquadPlayer): string {
  const detailed = player.detailedPosition?.toLowerCase() ?? "";

  if (player.position === "GK") return "GK";
  if (detailed.includes("defensive") && detailed.includes("mid")) return "CDM";
  if (detailed.includes("attacking") && detailed.includes("mid")) return "CAM";
  if (detailed.includes("wing") || detailed.includes("wide")) {
    return player.position === "DF" ? "LB" : "LW";
  }
  if (detailed.includes("back")) return "CB";
  if (detailed.includes("striker") || detailed.includes("forward")) return "ST";

  const defaults: Record<PlayerPosition, string> = {
    GK: "GK",
    DF: "CB",
    MF: "CM",
    FW: "ST",
  };
  return defaults[player.position];
}
