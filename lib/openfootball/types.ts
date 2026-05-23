export type OpenFootballMatch = {
  round: string;
  date: string;
  time: string;
  team1: string;
  team2: string;
  ground: string;
  group?: string;
  num?: number;
};

export type OpenFootballWorldCup = {
  name: string;
  matches: OpenFootballMatch[];
};

export type FixtureStage =
  | "group"
  | "round-of-32"
  | "round-of-16"
  | "quarter-final"
  | "semi-final"
  | "third-place"
  | "final";

export type Fixture = OpenFootballMatch & {
  id: string;
  stage: FixtureStage;
  stageLabel: string;
};

export type FixturesByDate = {
  date: string;
  dateLabel: string;
  matches: Fixture[];
};

export type OpenFootballTeam = {
  name: string;
  name_normalised?: string;
  continent: string;
  flag_icon: string;
  fifa_code: string;
  group: string;
  confed: string;
};

export type Team = OpenFootballTeam & {
  displayName: string;
  slug: string;
  groupLabel: string;
};

export type TournamentGroup = {
  letter: string;
  label: string;
  teams: Team[];
};
