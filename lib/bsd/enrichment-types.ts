type BsdPlayerAttributes = {
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

type BsdLeagueListItem = {
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

export type BsdPlayersListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: BsdPlayerListItem[];
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

export type TeamPlayerSeed = {
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
  countryId?: string;
  previousWorldCupsCount?: number;
  previousWorldCupsList?: string[];
};

export type TeamIdentity = {
  slug: string;
  displayName: string;
  fifaCode: string;
  groupLetter: string;
};

export type BsdMatchStrategy = "club" | "national" | "consensus";
export type BsdMatchConfidence = "high" | "medium" | "low";

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

export type FormResult = "W" | "D" | "L";

export type PlayerAppearanceSummary = {
  eventId: number | null;
  eventDate: string;
  teamName: string | null;
  opponentName: string | null;
  opponentTeamId: number | null;
  isHome: boolean | null;
  result: FormResult | null;
  minutes: number | null;
  rating: number | null;
  goals: number;
  assists: number;
};

export type PlayerNationalTeamRecord = {
  nationalTeamId: number | null;
  caps: number;
  goals: number;
  lastAppearance: string | null;
};

export type PlayerPerformance = {
  playerId: number;
  availability: string | null;
  formRating: number | null;
  seasonAverageRating: number | null;
  recentAppearances: PlayerAppearanceSummary[];
  nationalTeamRecord: PlayerNationalTeamRecord | null;
  strengths: string[];
  weaknesses: string[];
};

export type TeamHistoryEntry = {
  year: string;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  stage: string;
};

export type TeamInsight = {
  teamId: number | null;
  teamName: string;
  recentForm: FormResult[];
  recentRecord: string;
  unbeatenStreak: number;
  winlessStreak: number;
  goalsForRecent: number;
  goalsAgainstRecent: number;
  worldCupAppearances: number;
  bestFinish: string;
  history: TeamHistoryEntry[];
};

export type FixtureBsdMapping = {
  fixtureId: string;
  bsdEventId: number;
  confidence: BsdMatchConfidence;
  homeTeamId: number | null;
  awayTeamId: number | null;
  lastResolvedAt: string;
};

export type MatchPrediction = {
  homeWinProbability: number | null;
  drawProbability: number | null;
  awayWinProbability: number | null;
  predictedResult: "H" | "D" | "A" | null;
  confidence: number | null;
};

export type MatchLineupPlayer = {
  playerId: number | null;
  name: string;
  position: string | null;
  rating: number | null;
};

export type MatchLineupSide = {
  teamId: number | null;
  teamName: string;
  formation: string | null;
  players: MatchLineupPlayer[];
  substitutes: MatchLineupPlayer[];
  unavailable: MatchLineupPlayer[];
};

export type MatchInsight = {
  eventId: number;
  fixtureId: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamId: number | null;
  awayTeamId: number | null;
  eventDate: string;
  status: string | null;
  venueId: number | null;
  venueName: string | null;
  weatherDescription: string | null;
  temperatureC: number | null;
  travelDistanceKm: number | null;
  aiPreview: string | null;
  funFacts: string[];
  lineupStatus: string | null;
  prediction: MatchPrediction | null;
  lineups: {
    home: MatchLineupSide | null;
    away: MatchLineupSide | null;
  };
  teamInsights: {
    home: TeamInsight | null;
    away: TeamInsight | null;
  };
};
