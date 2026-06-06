import type { Player, Squad, Team } from "react-soccer-lineup";
import type {
  MatchLineupPlayer,
  MatchLineupSide,
} from "@/lib/bsd/enrichment-types";
import { BSD_PLAYER_PORTRAIT_OPTIONS, playerImageUrl } from "@/lib/bsd/format";
import { MIN_RENDERABLE_STARTERS } from "@/lib/lineup/constants";
import { parseFormationSlots } from "@/lib/lineup/formation";
import {
  explicitRow,
  positionGroup,
  type FieldRow,
} from "@/lib/lineup/positions";

const HOME_TEAM_STYLE: Team["style"] = {
  borderColor: "#d2bc8b",
  numberColor: "#090c0b",
  nameColor: "#f2eee4",
};

const AWAY_TEAM_STYLE: Team["style"] = {
  borderColor: "#78a68e",
  numberColor: "#090c0b",
  nameColor: "#f2eee4",
};

export type PitchLineupPlayer = {
  playerId: number | null;
  name: string;
  number: number | null;
  imageUrl: string | null;
};

export type PitchLineupSquad = {
  gk?: PitchLineupPlayer | null;
  df: PitchLineupPlayer[];
  cdm: PitchLineupPlayer[];
  cm: PitchLineupPlayer[];
  cam: PitchLineupPlayer[];
  fw: PitchLineupPlayer[];
};

function shortenPlayerName(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return name;
  const last = parts[parts.length - 1] ?? name;
  return last.length > 14 ? `${last.slice(0, 12)}…` : last;
}

function toPitchPlayer(
  player: MatchLineupPlayer,
  index: number,
): PitchLineupPlayer {
  return {
    playerId: player.playerId,
    name: shortenPlayerName(player.name),
    number: player.number ?? index + 1,
    imageUrl: player.playerId
      ? playerImageUrl(player.playerId, BSD_PLAYER_PORTRAIT_OPTIONS)
      : null,
  };
}

function toLibraryPlayer(player: PitchLineupPlayer): Player {
  return {
    name: player.name,
    number: player.number ?? undefined,
  };
}

function toLibrarySquad(squad: PitchLineupSquad): Squad {
  return {
    gk: squad.gk ? toLibraryPlayer(squad.gk) : undefined,
    df: squad.df.map(toLibraryPlayer),
    cdm: squad.cdm.map(toLibraryPlayer),
    cm: squad.cm.map(toLibraryPlayer),
    cam: squad.cam.map(toLibraryPlayer),
    fw: squad.fw.map(toLibraryPlayer),
  };
}

function assignMidfieldRow(
  player: MatchLineupPlayer,
  mfIndex: number,
  formation: string | null,
): FieldRow {
  const row = explicitRow(player.position);
  if (row === "cdm" || row === "cm" || row === "cam") return row;

  const parsed = parseFormationSlots(formation);
  if (parsed.cdm > 0 && mfIndex < parsed.cdm) return "cdm";
  if (parsed.cam > 0 && mfIndex < parsed.cdm + parsed.cam) return "cam";
  if (parsed.cm > 0) return "cm";
  return "cm";
}

function splitOutfieldByFormation(
  outfield: MatchLineupPlayer[],
  dfCount: number,
  fwCount: number,
) {
  const byGroup: Record<"DF" | "MF" | "FW", MatchLineupPlayer[]> = {
    DF: [],
    MF: [],
    FW: [],
  };

  const dfEnd = Math.min(dfCount, outfield.length);
  const fwStart = Math.max(dfEnd, outfield.length - fwCount);

  byGroup.DF.push(...outfield.slice(0, dfEnd));
  byGroup.FW.push(...outfield.slice(fwStart));
  byGroup.MF.push(...outfield.slice(dfEnd, fwStart));

  return byGroup;
}

function buildSquad(side: MatchLineupSide): PitchLineupSquad {
  const starters = side.players.slice(0, 11);
  const squad: PitchLineupSquad = {
    df: [],
    cdm: [],
    cm: [],
    cam: [],
    fw: [],
  };

  const byGroup: Record<"DF" | "MF" | "FW", MatchLineupPlayer[]> = {
    DF: [],
    MF: [],
    FW: [],
  };

  let keeperPlayer: MatchLineupPlayer | null = null;

  for (const player of starters) {
    const group = positionGroup(player.position);
    if (group === "GK") {
      keeperPlayer = player;
      squad.gk = toPitchPlayer(player, 0);
      continue;
    }
    if (group === "DF") byGroup.DF.push(player);
    else if (group === "FW") byGroup.FW.push(player);
    else if (group === "MF") byGroup.MF.push(player);
  }

  const parsed = parseFormationSlots(side.formation);
  const dfCount = parsed.df || byGroup.DF.length || 4;
  const fwCount = parsed.fw || byGroup.FW.length || 3;

  if (!keeperPlayer) {
    const explicitKeeper = starters.find(
      (player) => positionGroup(player.position) === "GK",
    );
    keeperPlayer = explicitKeeper ?? starters[0] ?? null;
    if (keeperPlayer) {
      squad.gk = toPitchPlayer(keeperPlayer, 0);
    }
  }

  const isKeeper = (player: MatchLineupPlayer) => player === keeperPlayer;

  const unassigned = starters.filter((player) => {
    if (isKeeper(player)) return false;
    const group = positionGroup(player.position);
    return group !== "GK" && group == null;
  });

  const outfield = starters.filter((player) => !isKeeper(player));

  if (
    byGroup.DF.length === 0 &&
    byGroup.MF.length === 0 &&
    byGroup.FW.length === 0
  ) {
    const split = splitOutfieldByFormation(outfield, dfCount, fwCount);
    byGroup.DF.push(...split.DF);
    byGroup.FW.push(...split.FW);
    byGroup.MF.push(...split.MF);
  } else if (unassigned.length) {
    for (const player of unassigned) {
      if (byGroup.DF.length < dfCount) byGroup.DF.push(player);
      else if (byGroup.FW.length < fwCount) byGroup.FW.unshift(player);
      else byGroup.MF.push(player);
    }
  }

  squad.df = byGroup.DF.map((player, index) => toPitchPlayer(player, index));
  squad.fw = byGroup.FW.map((player, index) => toPitchPlayer(player, index));
  squad.cdm = [];
  squad.cm = [];
  squad.cam = [];

  byGroup.MF.forEach((player, index) => {
    const row = assignMidfieldRow(player, index, side.formation);
    squad[row].push(toPitchPlayer(player, index));
  });

  return squad;
}

export function mapLineupSideToRows(side: MatchLineupSide): PitchLineupSquad {
  return buildSquad(side);
}

export function mapLineupSideToTeam(
  side: MatchLineupSide,
  isAway = false,
): Team {
  return {
    squad: toLibrarySquad(buildSquad(side)),
    style: isAway ? AWAY_TEAM_STYLE : HOME_TEAM_STYLE,
  };
}

export function hasRenderableLineup(side: MatchLineupSide | null) {
  return (side?.players.length ?? 0) >= MIN_RENDERABLE_STARTERS;
}
