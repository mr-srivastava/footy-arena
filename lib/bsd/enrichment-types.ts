export type BsdPlayerAttributes = {
  position: string;
  tactical: number;
  attacking: number;
  defending: number;
  technical: number;
  creativity: number;
};

export type BsdPlayerListItem = {
  id: number;
  name: string;
  short_name: string;
  position: string;
  specific_position: string;
  jersey_number: number | null;
  date_of_birth: string;
  height_cm: number | null;
  weight_kg: number | null;
  preferred_foot: string | null;
  nationality: string;
  current_team_id: number | null;
  national_team_id: number | null;
  market_value_eur: number | null;
  contract_until: string | null;
  availability: string;
  attributes?: BsdPlayerAttributes;
  strengths?: string[];
  weaknesses?: string[];
};

export type BsdLeagueListItem = {
  id: number;
  name: string;
  country: string;
};

export type BsdLeaguesListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: BsdLeagueListItem[];
};

export type BsdPlayerStatRow = {
  id: number;
  player_id: number;
  event_id: number;
  team_id: number;
  minutes_played: number;
  rating: number | null;
  goals: number;
  goal_assist: number;
  expected_goals: number | null;
  expected_assists: number | null;
  total_shots: number;
  shots_on_target: number;
  total_pass: number;
  accurate_pass: number;
  key_pass: number;
  total_tackle: number;
  interception: number;
  yellow_card: number;
  red_card: number;
  saves: number | null;
};

export type BsdPlayersListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: BsdPlayerListItem[];
};

export type BsdPlayerCareerStatsResponse = {
  player_id: number;
  count: number;
  player_stats: BsdPlayerStatRow[];
};

export type BsdTeamListItem = {
  id: number;
  name: string;
  short_name: string;
  country: string;
  venue_id?: number;
};

export type BsdTeamsListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: BsdTeamListItem[];
};

export type NormalizedPlayer = {
  id: string;
  name: string;
  shortName: string | null;
  jerseyNumber: number | null;
  age: number;
  position: string;
  positionGroup: string;
  detailedPosition: string;
  preferredFoot: string;
  club: {
    name: string;
    country: string;
    league: string;
    bzzoiroTeamId: number | null;
    venueId: number | null;
  };
  countryId: string;
  isCaptain: boolean;
  previousWorldCupsCount: number;
  previousWorldCupsList: string[];
  bzzoiro: {
    playerId: number;
    dateOfBirth: string;
    heightCm: number | null;
    weightKg: number | null;
    nationality: string;
    marketValueEur: number | null;
    contractUntil: string | null;
    availability: string;
    attributes: BsdPlayerAttributes | null;
    strengths: string[];
    weaknesses: string[];
  } | null;
};

export type ConvexPlayerSnapshot = {
  id: string;
  name: string;
  jerseyNumber: number | null;
  age: number;
  position: string;
  detailedPosition: string;
  preferredFoot: string;
  club: string;
  league: string;
  clubCountry: string;
  positionGroup: string;
  isCaptain: boolean;
};

export type ConvexCountrySnapshot = {
  slug: string;
  displayName: string;
  fifaCode: string;
  groupLetter: string;
};

export type BsdMatchStrategy = 'club' | 'national' | 'consensus';
export type BsdMatchConfidence = 'high' | 'medium' | 'low';

export type BsdPlayerMatchMeta = {
  bsdPlayerId: number | null;
  score: number | null;
  confidence: BsdMatchConfidence | null;
  strategy: BsdMatchStrategy | null;
};

export type BsdPlayerResolution = {
  team: BsdTeamListItem | null;
  bsdPlayer: BsdPlayerListItem | null;
  match: BsdPlayerMatchMeta;
};

export type BsdPlayerEnrichment = {
  convexPlayerId: string;
  convex: ConvexPlayerSnapshot;
  bsd: BsdPlayerListItem | null;
  matchScore: number | null;
  matchConfidence: BsdMatchConfidence | null;
  matchStrategy: BsdMatchStrategy | null;
  stats: BsdPlayerStatRow[];
  statsSummary: {
    appearances: number;
    goals: number;
    assists: number;
    avgRating: number | null;
  };
};

export type TeamEnrichmentPayload = {
  country: ConvexCountrySnapshot;
  bsdNationalTeamId: number | null;
  bsdNationalTeamName: string | null;
  players: BsdPlayerEnrichment[];
  summary: {
    total: number;
    matched: number;
    withStats: number;
  };
};
