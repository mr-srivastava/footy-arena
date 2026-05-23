export type DiscoveryCategorySlug =
  | "lost-glories"
  | "rising-underdogs"
  | "next-generation"
  | "legends-legacy"
  | "players-to-watch"
  | "tactical-identities";

export type DiscoveryCategory = {
  slug: DiscoveryCategorySlug;
  title: string;
  tagline: string;
  description: string;
};

export type TeamNarrative = {
  fifaCode: string;
  narrative: string;
  identityTags: string[];
  currentThemes: string[];
  keyPlayerSlugs: string[];
  whyCasualFansShouldCare: string;
  vibe: string;
};

export type PlayerProfile = {
  slug: string;
  name: string;
  nation: string;
  fifaCode?: string;
  position: string;
  archetype: string;
  whyExcited: string;
  watchFor: string;
  similarEnergy: string;
  featured?: boolean;
};

export type LostGloryEntry = {
  nation: string;
  fifaCode?: string;
  then: string;
  whatChanged: string;
  currentStatus: string;
  hopeForTheFuture: string;
};

export type RisingUnderdogEntry = {
  nation: string;
  fifaCode?: string;
  whyTheyMatter: string;
  keyIdentity: string;
  breakoutPlayerSlugs: string[];
  whyCasualFansShouldWatch: string;
};

export type DiscoveryCollection = {
  slug: string;
  title: string;
  description: string;
  playerSlugs: string[];
};

export type MatchStoryTemplate = {
  slug: string;
  title: string;
  narrative: string;
  watchFor: string[];
};

export type MetricTranslation = {
  metric: string;
  slug: string;
  friendlyLabel: string;
  explanation: string;
  casualTranslation: string;
};

export type HomepageCard = {
  title: string;
  description: string;
  href: string;
};

export type HomepageModule = {
  slug: string;
  title: string;
  cards: HomepageCard[];
};

export type CatchUpTopic = {
  slug: string;
  title: string;
  summary: string;
  bullets: string[];
};

export type HistoryLegend = {
  name: string;
  country: string;
  flag: string;
  role: string;
  achievement: string;
};

export type HistoryEra = {
  year: string;
  title: string;
  headline: string;
  narrative: string;
  image: string;
  overlay: string;
  accent: string;
  players: HistoryLegend[];
};
