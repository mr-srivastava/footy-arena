import type {
  BsdPlayerMatchMeta,
  ConvexCountrySnapshot,
  NormalizedPlayer,
} from "@/lib/bsd/enrichment-types";

export type PlayerPosition = 'GK' | 'DF' | 'MF' | 'FW';

export type SquadPlayer = {
  name: string;
  shortName?: string;
  profileSlug: string;
  position: PlayerPosition;
  club?: string;
  number?: number;
  age?: number;
  detailedPosition?: string;
  preferredFoot?: string;
  heightCm?: number | null;
  marketValueEur?: number | null;
  isCaptain?: boolean;
  league?: string;
  bsdPlayerId?: number;
};

export type SquadManager = {
  name: string;
  nationality?: string;
};

export type TeamSquad = {
  manager?: SquadManager;
  players: SquadPlayer[];
  status: 'announced' | 'pending';
};

export type EnrichedSquadPlayer = {
  player: NormalizedPlayer;
  match: BsdPlayerMatchMeta | null;
};

export type TeamSquadPayload = {
  country: ConvexCountrySnapshot;
  status: TeamSquad['status'];
  manager?: SquadManager;
  source: 'bsd' | 'convex';
  players: EnrichedSquadPlayer[];
  summary: {
    total: number;
    matched: number;
  };
};
