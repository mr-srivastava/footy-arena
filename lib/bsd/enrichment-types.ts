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
};

export type BsdTeamsListResponse = {
  count: number;
  results: BsdTeamListItem[];
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

export type BsdPlayerEnrichment = {
  convexPlayerId: string;
  convex: ConvexPlayerSnapshot;
  bsd: BsdPlayerListItem | null;
  matchScore: number | null;
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
