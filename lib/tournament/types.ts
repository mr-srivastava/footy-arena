export type PlayerPosition = 'GK' | 'DF' | 'MF' | 'FW';

export type SquadPlayer = {
  name: string;
  position: PlayerPosition;
  club?: string;
  number?: number;
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
