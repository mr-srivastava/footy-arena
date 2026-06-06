import type { TeamHistoryEntry } from "@/lib/bsd/enrichment-types";
import { WC2026_NATIONS } from "@/lib/teams/wc2026-nations";

export type WorldCupStage =
  | "Winners"
  | "Runners-up"
  | "Third place"
  | "Fourth place"
  | "Semi-finals"
  | "Quarter-finals"
  | "Round of 16"
  | "Group stage"
  | "Second group stage";

type WorldCupNationRecord = {
  appearances: number;
  bestFinish: string;
  participations: Array<{ year: number; stage: WorldCupStage }>;
};

/** Curated FIFA World Cup records for the 48 nations at WC 2026. BSD has no historical WC league. */
const WORLD_CUP_RECORDS: Record<string, WorldCupNationRecord> = {
  ALG: {
    appearances: 5,
    bestFinish: "Round of 16",
    participations: [
      { year: 1982, stage: "Group stage" },
      { year: 1986, stage: "Group stage" },
      { year: 2010, stage: "Group stage" },
      { year: 2014, stage: "Round of 16" },
    ],
  },
  ARG: {
    appearances: 19,
    bestFinish: "Winners",
    participations: [
      { year: 1930, stage: "Runners-up" },
      { year: 1934, stage: "Round of 16" },
      { year: 1938, stage: "Quarter-finals" },
      { year: 1958, stage: "Group stage" },
      { year: 1962, stage: "Quarter-finals" },
      { year: 1966, stage: "Quarter-finals" },
      { year: 1974, stage: "Second group stage" },
      { year: 1978, stage: "Winners" },
      { year: 1982, stage: "Second group stage" },
      { year: 1986, stage: "Winners" },
      { year: 1990, stage: "Runners-up" },
      { year: 1994, stage: "Quarter-finals" },
      { year: 1998, stage: "Quarter-finals" },
      { year: 2002, stage: "Group stage" },
      { year: 2006, stage: "Quarter-finals" },
      { year: 2010, stage: "Quarter-finals" },
      { year: 2014, stage: "Runners-up" },
      { year: 2018, stage: "Round of 16" },
      { year: 2022, stage: "Winners" },
    ],
  },
  AUS: {
    appearances: 7,
    bestFinish: "Round of 16",
    participations: [
      { year: 1974, stage: "Group stage" },
      { year: 2006, stage: "Round of 16" },
      { year: 2010, stage: "Group stage" },
      { year: 2014, stage: "Group stage" },
      { year: 2018, stage: "Group stage" },
      { year: 2022, stage: "Round of 16" },
    ],
  },
  AUT: {
    appearances: 8,
    bestFinish: "Third place",
    participations: [
      { year: 1934, stage: "Fourth place" },
      { year: 1954, stage: "Third place" },
      { year: 1958, stage: "Group stage" },
      { year: 1978, stage: "Group stage" },
      { year: 1982, stage: "Second group stage" },
      { year: 1990, stage: "Group stage" },
      { year: 1998, stage: "Group stage" },
    ],
  },
  BEL: {
    appearances: 15,
    bestFinish: "Third place",
    participations: [
      { year: 1930, stage: "Group stage" },
      { year: 1934, stage: "Round of 16" },
      { year: 1938, stage: "Round of 16" },
      { year: 1954, stage: "Group stage" },
      { year: 1970, stage: "Group stage" },
      { year: 1982, stage: "Group stage" },
      { year: 1986, stage: "Fourth place" },
      { year: 1990, stage: "Round of 16" },
      { year: 1994, stage: "Round of 16" },
      { year: 1998, stage: "Group stage" },
      { year: 2002, stage: "Round of 16" },
      { year: 2014, stage: "Quarter-finals" },
      { year: 2018, stage: "Third place" },
      { year: 2022, stage: "Group stage" },
    ],
  },
  BIH: {
    appearances: 1,
    bestFinish: "Group stage",
    participations: [{ year: 2014, stage: "Group stage" }],
  },
  BRA: {
    appearances: 23,
    bestFinish: "Winners",
    participations: [
      { year: 1930, stage: "Group stage" },
      { year: 1934, stage: "Round of 16" },
      { year: 1938, stage: "Third place" },
      { year: 1950, stage: "Runners-up" },
      { year: 1954, stage: "Quarter-finals" },
      { year: 1958, stage: "Winners" },
      { year: 1962, stage: "Winners" },
      { year: 1966, stage: "Group stage" },
      { year: 1970, stage: "Winners" },
      { year: 1974, stage: "Fourth place" },
      { year: 1978, stage: "Third place" },
      { year: 1982, stage: "Second group stage" },
      { year: 1986, stage: "Quarter-finals" },
      { year: 1990, stage: "Round of 16" },
      { year: 1994, stage: "Winners" },
      { year: 1998, stage: "Runners-up" },
      { year: 2002, stage: "Winners" },
      { year: 2006, stage: "Quarter-finals" },
      { year: 2010, stage: "Quarter-finals" },
      { year: 2014, stage: "Fourth place" },
      { year: 2018, stage: "Quarter-finals" },
      { year: 2022, stage: "Quarter-finals" },
    ],
  },
  CAN: {
    appearances: 3,
    bestFinish: "Group stage",
    participations: [
      { year: 1986, stage: "Group stage" },
      { year: 2022, stage: "Group stage" },
    ],
  },
  COL: {
    appearances: 7,
    bestFinish: "Quarter-finals",
    participations: [
      { year: 1962, stage: "Group stage" },
      { year: 1990, stage: "Round of 16" },
      { year: 1994, stage: "Round of 16" },
      { year: 1998, stage: "Round of 16" },
      { year: 2014, stage: "Quarter-finals" },
      { year: 2018, stage: "Round of 16" },
    ],
  },
  CPV: {
    appearances: 1,
    bestFinish: "Debut",
    participations: [],
  },
  CRO: {
    appearances: 7,
    bestFinish: "Runners-up",
    participations: [
      { year: 1998, stage: "Third place" },
      { year: 2002, stage: "Group stage" },
      { year: 2006, stage: "Group stage" },
      { year: 2014, stage: "Group stage" },
      { year: 2018, stage: "Runners-up" },
      { year: 2022, stage: "Third place" },
    ],
  },
  CIV: {
    appearances: 4,
    bestFinish: "Group stage",
    participations: [
      { year: 2006, stage: "Group stage" },
      { year: 2010, stage: "Group stage" },
      { year: 2014, stage: "Group stage" },
    ],
  },
  CUW: {
    appearances: 1,
    bestFinish: "Debut",
    participations: [],
  },
  CZE: {
    appearances: 2,
    bestFinish: "Group stage",
    participations: [{ year: 2006, stage: "Group stage" }],
  },
  COD: {
    appearances: 1,
    bestFinish: "Group stage",
    participations: [{ year: 1974, stage: "Group stage" }],
  },
  ECU: {
    appearances: 5,
    bestFinish: "Round of 16",
    participations: [
      { year: 2002, stage: "Round of 16" },
      { year: 2006, stage: "Round of 16" },
      { year: 2014, stage: "Group stage" },
      { year: 2022, stage: "Group stage" },
    ],
  },
  EGY: {
    appearances: 4,
    bestFinish: "Group stage",
    participations: [
      { year: 1934, stage: "Round of 16" },
      { year: 1990, stage: "Group stage" },
      { year: 2018, stage: "Group stage" },
    ],
  },
  ENG: {
    appearances: 17,
    bestFinish: "Winners",
    participations: [
      { year: 1950, stage: "Group stage" },
      { year: 1954, stage: "Quarter-finals" },
      { year: 1958, stage: "Group stage" },
      { year: 1962, stage: "Quarter-finals" },
      { year: 1966, stage: "Winners" },
      { year: 1970, stage: "Quarter-finals" },
      { year: 1982, stage: "Second group stage" },
      { year: 1986, stage: "Quarter-finals" },
      { year: 1990, stage: "Semi-finals" },
      { year: 1998, stage: "Round of 16" },
      { year: 2002, stage: "Quarter-finals" },
      { year: 2006, stage: "Quarter-finals" },
      { year: 2010, stage: "Round of 16" },
      { year: 2014, stage: "Group stage" },
      { year: 2018, stage: "Semi-finals" },
      { year: 2022, stage: "Quarter-finals" },
    ],
  },
  FRA: {
    appearances: 17,
    bestFinish: "Winners",
    participations: [
      { year: 1930, stage: "Group stage" },
      { year: 1934, stage: "Quarter-finals" },
      { year: 1938, stage: "Quarter-finals" },
      { year: 1954, stage: "Group stage" },
      { year: 1958, stage: "Third place" },
      { year: 1966, stage: "Group stage" },
      { year: 1978, stage: "Group stage" },
      { year: 1982, stage: "Fourth place" },
      { year: 1986, stage: "Third place" },
      { year: 1998, stage: "Winners" },
      { year: 2002, stage: "Group stage" },
      { year: 2006, stage: "Runners-up" },
      { year: 2010, stage: "Group stage" },
      { year: 2014, stage: "Quarter-finals" },
      { year: 2018, stage: "Winners" },
      { year: 2022, stage: "Runners-up" },
    ],
  },
  GER: {
    appearances: 21,
    bestFinish: "Winners",
    participations: [
      { year: 1934, stage: "Third place" },
      { year: 1938, stage: "Round of 16" },
      { year: 1954, stage: "Winners" },
      { year: 1958, stage: "Fourth place" },
      { year: 1962, stage: "Quarter-finals" },
      { year: 1966, stage: "Runners-up" },
      { year: 1970, stage: "Third place" },
      { year: 1974, stage: "Winners" },
      { year: 1978, stage: "Second group stage" },
      { year: 1982, stage: "Runners-up" },
      { year: 1986, stage: "Runners-up" },
      { year: 1990, stage: "Winners" },
      { year: 1994, stage: "Quarter-finals" },
      { year: 1998, stage: "Quarter-finals" },
      { year: 2002, stage: "Runners-up" },
      { year: 2006, stage: "Third place" },
      { year: 2010, stage: "Third place" },
      { year: 2014, stage: "Winners" },
      { year: 2018, stage: "Group stage" },
      { year: 2022, stage: "Group stage" },
    ],
  },
  GHA: {
    appearances: 5,
    bestFinish: "Quarter-finals",
    participations: [
      { year: 2006, stage: "Round of 16" },
      { year: 2010, stage: "Quarter-finals" },
      { year: 2014, stage: "Group stage" },
      { year: 2022, stage: "Group stage" },
    ],
  },
  HAI: {
    appearances: 1,
    bestFinish: "Group stage",
    participations: [{ year: 1974, stage: "Group stage" }],
  },
  IRQ: {
    appearances: 1,
    bestFinish: "Group stage",
    participations: [{ year: 1986, stage: "Group stage" }],
  },
  IRN: {
    appearances: 7,
    bestFinish: "Group stage",
    participations: [
      { year: 1978, stage: "Group stage" },
      { year: 1998, stage: "Group stage" },
      { year: 2006, stage: "Group stage" },
      { year: 2014, stage: "Group stage" },
      { year: 2018, stage: "Group stage" },
      { year: 2022, stage: "Group stage" },
    ],
  },
  JOR: {
    appearances: 1,
    bestFinish: "Debut",
    participations: [],
  },
  JPN: {
    appearances: 8,
    bestFinish: "Round of 16",
    participations: [
      { year: 1998, stage: "Round of 16" },
      { year: 2002, stage: "Round of 16" },
      { year: 2006, stage: "Round of 16" },
      { year: 2010, stage: "Round of 16" },
      { year: 2014, stage: "Group stage" },
      { year: 2018, stage: "Round of 16" },
      { year: 2022, stage: "Round of 16" },
    ],
  },
  KOR: {
    appearances: 12,
    bestFinish: "Semi-finals",
    participations: [
      { year: 1954, stage: "Group stage" },
      { year: 1986, stage: "Group stage" },
      { year: 1990, stage: "Group stage" },
      { year: 1994, stage: "Group stage" },
      { year: 1998, stage: "Group stage" },
      { year: 2002, stage: "Semi-finals" },
      { year: 2006, stage: "Group stage" },
      { year: 2010, stage: "Round of 16" },
      { year: 2014, stage: "Group stage" },
      { year: 2018, stage: "Group stage" },
      { year: 2022, stage: "Round of 16" },
    ],
  },
  KSA: {
    appearances: 7,
    bestFinish: "Round of 16",
    participations: [
      { year: 1994, stage: "Round of 16" },
      { year: 1998, stage: "Group stage" },
      { year: 2002, stage: "Group stage" },
      { year: 2006, stage: "Group stage" },
      { year: 2018, stage: "Group stage" },
      { year: 2022, stage: "Group stage" },
    ],
  },
  MAR: {
    appearances: 7,
    bestFinish: "Semi-finals",
    participations: [
      { year: 1970, stage: "Group stage" },
      { year: 1986, stage: "Round of 16" },
      { year: 1994, stage: "Group stage" },
      { year: 1998, stage: "Group stage" },
      { year: 2018, stage: "Group stage" },
      { year: 2022, stage: "Semi-finals" },
    ],
  },
  MEX: {
    appearances: 18,
    bestFinish: "Quarter-finals",
    participations: [
      { year: 1930, stage: "Group stage" },
      { year: 1950, stage: "Group stage" },
      { year: 1954, stage: "Group stage" },
      { year: 1958, stage: "Group stage" },
      { year: 1962, stage: "Group stage" },
      { year: 1966, stage: "Group stage" },
      { year: 1970, stage: "Quarter-finals" },
      { year: 1978, stage: "Group stage" },
      { year: 1986, stage: "Quarter-finals" },
      { year: 1994, stage: "Round of 16" },
      { year: 1998, stage: "Round of 16" },
      { year: 2002, stage: "Round of 16" },
      { year: 2006, stage: "Round of 16" },
      { year: 2010, stage: "Round of 16" },
      { year: 2014, stage: "Round of 16" },
      { year: 2018, stage: "Round of 16" },
      { year: 2022, stage: "Group stage" },
    ],
  },
  NED: {
    appearances: 12,
    bestFinish: "Runners-up",
    participations: [
      { year: 1934, stage: "Round of 16" },
      { year: 1938, stage: "Quarter-finals" },
      { year: 1974, stage: "Runners-up" },
      { year: 1978, stage: "Runners-up" },
      { year: 1990, stage: "Round of 16" },
      { year: 1994, stage: "Quarter-finals" },
      { year: 1998, stage: "Semi-finals" },
      { year: 2006, stage: "Round of 16" },
      { year: 2010, stage: "Runners-up" },
      { year: 2014, stage: "Third place" },
      { year: 2022, stage: "Quarter-finals" },
    ],
  },
  NOR: {
    appearances: 4,
    bestFinish: "Round of 16",
    participations: [
      { year: 1938, stage: "Quarter-finals" },
      { year: 1994, stage: "Group stage" },
      { year: 1998, stage: "Round of 16" },
    ],
  },
  NZL: {
    appearances: 3,
    bestFinish: "Group stage",
    participations: [
      { year: 1982, stage: "Group stage" },
      { year: 2010, stage: "Group stage" },
    ],
  },
  PAN: {
    appearances: 2,
    bestFinish: "Group stage",
    participations: [{ year: 2018, stage: "Group stage" }],
  },
  PAR: {
    appearances: 9,
    bestFinish: "Quarter-finals",
    participations: [
      { year: 1930, stage: "Group stage" },
      { year: 1950, stage: "Group stage" },
      { year: 1986, stage: "Round of 16" },
      { year: 1998, stage: "Round of 16" },
      { year: 2002, stage: "Round of 16" },
      { year: 2006, stage: "Group stage" },
      { year: 2010, stage: "Quarter-finals" },
      { year: 2018, stage: "Group stage" },
    ],
  },
  POR: {
    appearances: 9,
    bestFinish: "Third place",
    participations: [
      { year: 1966, stage: "Third place" },
      { year: 1986, stage: "Group stage" },
      { year: 2002, stage: "Group stage" },
      { year: 2006, stage: "Fourth place" },
      { year: 2010, stage: "Round of 16" },
      { year: 2014, stage: "Group stage" },
      { year: 2018, stage: "Round of 16" },
      { year: 2022, stage: "Quarter-finals" },
    ],
  },
  QAT: {
    appearances: 2,
    bestFinish: "Group stage",
    participations: [{ year: 2022, stage: "Group stage" }],
  },
  RSA: {
    appearances: 4,
    bestFinish: "Group stage",
    participations: [
      { year: 1998, stage: "Group stage" },
      { year: 2002, stage: "Group stage" },
      { year: 2010, stage: "Group stage" },
    ],
  },
  SCO: {
    appearances: 9,
    bestFinish: "Group stage",
    participations: [
      { year: 1954, stage: "Group stage" },
      { year: 1958, stage: "Group stage" },
      { year: 1974, stage: "Group stage" },
      { year: 1978, stage: "Group stage" },
      { year: 1982, stage: "Group stage" },
      { year: 1986, stage: "Group stage" },
      { year: 1990, stage: "Group stage" },
      { year: 1998, stage: "Group stage" },
    ],
  },
  SEN: {
    appearances: 4,
    bestFinish: "Quarter-finals",
    participations: [
      { year: 2002, stage: "Quarter-finals" },
      { year: 2018, stage: "Group stage" },
      { year: 2022, stage: "Group stage" },
    ],
  },
  ESP: {
    appearances: 17,
    bestFinish: "Winners",
    participations: [
      { year: 1934, stage: "Quarter-finals" },
      { year: 1950, stage: "Fourth place" },
      { year: 1962, stage: "Group stage" },
      { year: 1966, stage: "Quarter-finals" },
      { year: 1978, stage: "Group stage" },
      { year: 1982, stage: "Second group stage" },
      { year: 1986, stage: "Quarter-finals" },
      { year: 1990, stage: "Round of 16" },
      { year: 1994, stage: "Quarter-finals" },
      { year: 1998, stage: "Group stage" },
      { year: 2002, stage: "Quarter-finals" },
      { year: 2006, stage: "Round of 16" },
      { year: 2010, stage: "Winners" },
      { year: 2014, stage: "Group stage" },
      { year: 2018, stage: "Round of 16" },
      { year: 2022, stage: "Round of 16" },
    ],
  },
  SUI: {
    appearances: 13,
    bestFinish: "Quarter-finals",
    participations: [
      { year: 1934, stage: "Quarter-finals" },
      { year: 1938, stage: "Quarter-finals" },
      { year: 1950, stage: "Group stage" },
      { year: 1954, stage: "Quarter-finals" },
      { year: 1962, stage: "Group stage" },
      { year: 1966, stage: "Group stage" },
      { year: 1994, stage: "Round of 16" },
      { year: 2006, stage: "Round of 16" },
      { year: 2010, stage: "Group stage" },
      { year: 2014, stage: "Round of 16" },
      { year: 2018, stage: "Round of 16" },
      { year: 2022, stage: "Group stage" },
    ],
  },
  SWE: {
    appearances: 13,
    bestFinish: "Runners-up",
    participations: [
      { year: 1934, stage: "Group stage" },
      { year: 1938, stage: "Fourth place" },
      { year: 1950, stage: "Third place" },
      { year: 1958, stage: "Runners-up" },
      { year: 1970, stage: "Quarter-finals" },
      { year: 1974, stage: "Group stage" },
      { year: 1978, stage: "Group stage" },
      { year: 1990, stage: "Group stage" },
      { year: 1994, stage: "Third place" },
      { year: 2002, stage: "Round of 16" },
      { year: 2006, stage: "Round of 16" },
      { year: 2018, stage: "Quarter-finals" },
    ],
  },
  TUN: {
    appearances: 7,
    bestFinish: "Group stage",
    participations: [
      { year: 1978, stage: "Group stage" },
      { year: 1998, stage: "Group stage" },
      { year: 2002, stage: "Group stage" },
      { year: 2006, stage: "Group stage" },
      { year: 2018, stage: "Group stage" },
      { year: 2022, stage: "Group stage" },
    ],
  },
  TUR: {
    appearances: 3,
    bestFinish: "Third place",
    participations: [
      { year: 1954, stage: "Group stage" },
      { year: 2002, stage: "Third place" },
    ],
  },
  URU: {
    appearances: 15,
    bestFinish: "Winners",
    participations: [
      { year: 1930, stage: "Winners" },
      { year: 1950, stage: "Fourth place" },
      { year: 1954, stage: "Fourth place" },
      { year: 1962, stage: "Group stage" },
      { year: 1966, stage: "Quarter-finals" },
      { year: 1970, stage: "Fourth place" },
      { year: 1974, stage: "Group stage" },
      { year: 1986, stage: "Round of 16" },
      { year: 1990, stage: "Round of 16" },
      { year: 2002, stage: "Group stage" },
      { year: 2010, stage: "Fourth place" },
      { year: 2014, stage: "Quarter-finals" },
      { year: 2018, stage: "Quarter-finals" },
      { year: 2022, stage: "Group stage" },
    ],
  },
  USA: {
    appearances: 12,
    bestFinish: "Semi-finals",
    participations: [
      { year: 1930, stage: "Semi-finals" },
      { year: 1934, stage: "Round of 16" },
      { year: 1950, stage: "Group stage" },
      { year: 1990, stage: "Group stage" },
      { year: 1994, stage: "Round of 16" },
      { year: 1998, stage: "Group stage" },
      { year: 2002, stage: "Quarter-finals" },
      { year: 2006, stage: "Group stage" },
      { year: 2010, stage: "Round of 16" },
      { year: 2014, stage: "Round of 16" },
      { year: 2022, stage: "Round of 16" },
    ],
  },
  UZB: {
    appearances: 1,
    bestFinish: "Debut",
    participations: [],
  },
};

for (const nation of WC2026_NATIONS) {
  if (!(nation.fifaCode in WORLD_CUP_RECORDS)) {
    throw new Error(`Missing world cup history for ${nation.fifaCode}`);
  }
}

function participationToHistoryEntry(participation: {
  year: number;
  stage: WorldCupStage | string;
}): TeamHistoryEntry {
  return {
    year: String(participation.year),
    matches: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    stage: participation.stage,
  };
}

export function getWorldCupRecord(fifaCode: string) {
  return WORLD_CUP_RECORDS[fifaCode] ?? null;
}

export function worldCupHistoryForFifaCode(
  fifaCode: string,
): TeamHistoryEntry[] {
  const record = getWorldCupRecord(fifaCode);
  if (!record) return [];

  return record.participations
    .map(participationToHistoryEntry)
    .toSorted((a, b) => Number(b.year) - Number(a.year));
}

export function worldCupEditorialForFifaCode(fifaCode: string): {
  worldCupAppearances: number;
  bestFinish: string;
  history: TeamHistoryEntry[];
} | null {
  const record = getWorldCupRecord(fifaCode);
  if (!record) return null;

  return {
    worldCupAppearances: record.appearances,
    bestFinish: record.bestFinish,
    history: worldCupHistoryForFifaCode(fifaCode),
  };
}
