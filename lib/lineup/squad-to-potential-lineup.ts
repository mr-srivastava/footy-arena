import type {
  MatchLineupPlayer,
  MatchLineupSide,
} from "@/lib/bsd/enrichment-types";
import type { TeamManagerSummary } from "@/lib/bsd/team-analytics";
import {
  normalizeFormation,
  parseFormationSlots,
  type FormationSlots,
} from "@/lib/lineup/formation";
import { squadPlayerPositionCode } from "@/lib/lineup/positions";
import { groupPlayersByPosition } from "@/lib/tournament/squads";
import type {
  PlayerPosition,
  SquadPlayer,
  TeamSquad,
} from "@/lib/tournament/types";

function isAvailable(player: SquadPlayer) {
  const availability = player.availability?.toLowerCase();
  return !availability || availability === "available";
}

function sortSquadPlayers(players: SquadPlayer[]) {
  return [...players].sort((a, b) => {
    if (a.isCaptain !== b.isCaptain) return a.isCaptain ? -1 : 1;
    return (a.number ?? 99) - (b.number ?? 99);
  });
}

function toLineupPlayer(player: SquadPlayer): MatchLineupPlayer {
  return {
    playerId: player.bsdPlayerId ?? null,
    name: player.shortName ?? player.name,
    number: player.number ?? null,
    position: squadPlayerPositionCode(player),
    rating: null,
  };
}

function takePlayers(
  pool: SquadPlayer[],
  count: number,
  used: Set<SquadPlayer>,
) {
  const picked: SquadPlayer[] = [];

  for (const player of sortSquadPlayers(pool)) {
    if (picked.length >= count) break;
    if (used.has(player)) continue;
    picked.push(player);
    used.add(player);
  }

  return picked;
}

function pickMidfielders(
  players: SquadPlayer[],
  slots: FormationSlots,
  used: Set<SquadPlayer>,
) {
  const total = slots.cdm + slots.cm + slots.cam;
  if (total === 0) return [];

  const sorted = sortSquadPlayers(players);
  const cdmPool = sorted.filter(
    (player) => squadPlayerPositionCode(player) === "CDM",
  );
  const camPool = sorted.filter(
    (player) => squadPlayerPositionCode(player) === "CAM",
  );
  const cmPool = sorted.filter((player) => {
    const code = squadPlayerPositionCode(player);
    return code !== "CDM" && code !== "CAM";
  });

  const picked: SquadPlayer[] = [];

  picked.push(...takePlayers(cdmPool, slots.cdm, used));
  if (picked.length < slots.cdm) {
    picked.push(...takePlayers(cmPool, slots.cdm - picked.length, used));
  }

  picked.push(...takePlayers(camPool, slots.cam, used));
  if (picked.length < slots.cdm + slots.cam) {
    picked.push(
      ...takePlayers(cmPool, slots.cdm + slots.cam - picked.length, used),
    );
  }

  picked.push(
    ...takePlayers(
      cmPool,
      slots.cdm + slots.cm + slots.cam - picked.length,
      used,
    ),
  );

  return picked.slice(0, total);
}

function positionTargets(slots: FormationSlots) {
  return {
    GK: 1,
    DF: slots.df,
    MF: slots.cdm + slots.cm + slots.cam,
    FW: slots.fw,
  } satisfies Record<PlayerPosition, number>;
}

function countByPosition(players: SquadPlayer[]) {
  return players.reduce(
    (counts, player) => {
      counts[player.position] += 1;
      return counts;
    },
    { GK: 0, DF: 0, MF: 0, FW: 0 } satisfies Record<PlayerPosition, number>,
  );
}

function canAddPlayer(
  player: SquadPlayer,
  xi: SquadPlayer[],
  targets: Record<PlayerPosition, number>,
) {
  const counts = countByPosition(xi);
  return counts[player.position] < targets[player.position];
}

function fillRemainingPlayers(
  xi: SquadPlayer[],
  available: SquadPlayer[],
  used: Set<SquadPlayer>,
  slots: FormationSlots,
) {
  const targets = positionTargets(slots);
  const remaining = sortSquadPlayers(
    available.filter((player) => !used.has(player)),
  );

  for (const player of remaining) {
    if (xi.length >= 11) break;
    if (!canAddPlayer(player, xi, targets)) continue;
    xi.push(player);
    used.add(player);
  }

  for (const player of remaining) {
    if (xi.length >= 11) break;
    if (used.has(player)) continue;
    const counts = countByPosition(xi);
    if (player.position === "GK" && counts.GK >= targets.GK) continue;
    xi.push(player);
    used.add(player);
  }
}

export function resolveFormation(
  squad: TeamSquad,
  managerAnalytics?: TeamManagerSummary | null,
) {
  return normalizeFormation(
    managerAnalytics?.preferred_formation ?? squad.manager?.preferredFormation,
  );
}

export function squadToPotentialLineup(
  squad: TeamSquad,
  teamName: string,
  managerAnalytics?: TeamManagerSummary | null,
): MatchLineupSide | null {
  const available = squad.players.filter(isAvailable);
  if (available.length < 11) return null;

  const formation = resolveFormation(squad, managerAnalytics);
  const slots = parseFormationSlots(formation);
  const used = new Set<SquadPlayer>();
  const groups = groupPlayersByPosition({ ...squad, players: available });

  const gk = groups.find((group) => group.position === "GK")?.players ?? [];
  const df = groups.find((group) => group.position === "DF")?.players ?? [];
  const mf = groups.find((group) => group.position === "MF")?.players ?? [];
  const fw = groups.find((group) => group.position === "FW")?.players ?? [];

  const xi = [
    ...takePlayers(gk, 1, used),
    ...takePlayers(df, slots.df, used),
    ...pickMidfielders(mf, slots, used),
    ...takePlayers(fw, slots.fw, used),
  ];

  fillRemainingPlayers(xi, available, used, slots);

  if (xi.length < 11) return null;

  return {
    teamId: null,
    teamName,
    formation: slots.label,
    players: xi.slice(0, 11).map(toLineupPlayer),
    substitutes: [],
    unavailable: [],
  };
}
