import type {
  BsdPlayerMatchMeta,
  TeamIdentity,
  NormalizedPlayer,
} from "@/lib/bsd/enrichment-types";

export type PlayerPosition = "GK" | "DF" | "MF" | "FW";

export type SquadPlayer = {
  name: string;
  shortName?: string;
  profileSlug: string;
  position: PlayerPosition;
  club?: string;
  clubTeamId?: number | null;
  number?: number;
  age?: number;
  detailedPosition?: string;
  preferredFoot?: string;
  heightCm?: number | null;
  marketValueEur?: number | null;
  isCaptain?: boolean;
  league?: string;
  bsdPlayerId?: number;
  availability?: string | null;
};

export type SquadManager = {
  name: string;
  nationality?: string;
  preferredFormation?: string;
  tacticalProfile?: string;
  careerRecord?: string;
  winPct?: number;
};

export type TeamSquad = {
  manager?: SquadManager;
  players: SquadPlayer[];
  status: "announced" | "pending";
};

type EnrichedSquadPlayer = {
  player: NormalizedPlayer;
  match: BsdPlayerMatchMeta | null;
};

export type TeamSquadPayload = {
  country: TeamIdentity;
  status: TeamSquad["status"];
  manager?: SquadManager;
  source: "bsd" | "fallback";
  players: EnrichedSquadPlayer[];
  summary: {
    total: number;
    matched: number;
  };
};
