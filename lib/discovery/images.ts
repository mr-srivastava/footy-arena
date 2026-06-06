import type { DiscoveryCategorySlug } from "./types";

const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const DISCOVERY_STOCK = {
  stadiumCrowd: unsplash("photo-1522778119026-d647f0596c20"),
  matchAction: unsplash("photo-1579952363873-27f3bade9f55"),
  pitchLines: unsplash("photo-1574629810360-7efbbe195018"),
  nightGame: unsplash("photo-1705593973313-75de7bf95b56"),
  sprint: unsplash("photo-1543351611-58f69d7c1781"),
  ballClose: unsplash("photo-1431324155629-1a6deb1dec8d"),
  celebration: unsplash("photo-1543351611-58f69d7c1781"),
  modernArena: unsplash("photo-1705593973313-75de7bf95b56"),
  stadiumLights: unsplash("photo-1522778119026-d647f0596c20"),
  dribble: unsplash("photo-1579952363873-27f3bade9f55"),
} as const;

const CATEGORY_IMAGES: Record<DiscoveryCategorySlug, string> = {
  "lost-glories": DISCOVERY_STOCK.stadiumLights,
  "rising-underdogs": DISCOVERY_STOCK.celebration,
  "next-generation": DISCOVERY_STOCK.sprint,
  "legends-legacy": DISCOVERY_STOCK.nightGame,
  "players-to-watch": DISCOVERY_STOCK.matchAction,
  "tactical-identities": DISCOVERY_STOCK.pitchLines,
};

const COLLECTION_IMAGES: Record<string, string> = {
  "future-ballon-dor": DISCOVERY_STOCK.sprint,
  "midfield-maestros": DISCOVERY_STOCK.pitchLines,
  "chaos-creators": DISCOVERY_STOCK.dribble,
  "veteran-legends": DISCOVERY_STOCK.stadiumLights,
};

const HOMEPAGE_CARD_IMAGES: Record<string, string> = {
  "/explore/lost-glories": DISCOVERY_STOCK.stadiumLights,
  "/explore/rising-underdogs": DISCOVERY_STOCK.celebration,
  "/explore/next-generation": DISCOVERY_STOCK.sprint,
  "/explore/legends-legacy": DISCOVERY_STOCK.nightGame,
  "/explore/tactical-identities": DISCOVERY_STOCK.pitchLines,
  "/explore/catch-up/messi-ronaldo-era": DISCOVERY_STOCK.stadiumCrowd,
  "/explore/catch-up/new-midfield-era": DISCOVERY_STOCK.pitchLines,
  "/explore/catch-up/smaller-nations-rising": DISCOVERY_STOCK.celebration,
  "/explore/catch-up/tactics-evolved": DISCOVERY_STOCK.matchAction,
  "/teams/fra": DISCOVERY_STOCK.modernArena,
  "/teams/arg": DISCOVERY_STOCK.celebration,
  "/teams/mar": DISCOVERY_STOCK.nightGame,
  "/teams/ger": DISCOVERY_STOCK.pitchLines,
  "/teams/jpn": DISCOVERY_STOCK.matchAction,
};

const NATION_IMAGES: Record<string, string> = {
  Germany: DISCOVERY_STOCK.pitchLines,
  Italy: DISCOVERY_STOCK.stadiumLights,
  Brazil: DISCOVERY_STOCK.celebration,
  Morocco: DISCOVERY_STOCK.nightGame,
  Japan: DISCOVERY_STOCK.matchAction,
  Georgia: DISCOVERY_STOCK.sprint,
};

const TEAM_NARRATIVE_IMAGES: Record<string, string> = {
  FRA: DISCOVERY_STOCK.modernArena,
  ARG: DISCOVERY_STOCK.celebration,
  BRA: DISCOVERY_STOCK.dribble,
  ESP: DISCOVERY_STOCK.pitchLines,
  ENG: DISCOVERY_STOCK.stadiumCrowd,
  NED: DISCOVERY_STOCK.matchAction,
};

const CATCH_UP_IMAGES: Record<string, string> = {
  "messi-ronaldo-era": DISCOVERY_STOCK.stadiumCrowd,
  "new-midfield-era": DISCOVERY_STOCK.pitchLines,
  "smaller-nations-rising": DISCOVERY_STOCK.celebration,
  "tactics-evolved": DISCOVERY_STOCK.matchAction,
};

export function getCategoryImage(slug: DiscoveryCategorySlug): string {
  return CATEGORY_IMAGES[slug];
}

export function getCollectionImage(slug: string): string {
  return COLLECTION_IMAGES[slug] ?? DISCOVERY_STOCK.matchAction;
}

export function getHomepageCardImage(href: string): string {
  return HOMEPAGE_CARD_IMAGES[href] ?? DISCOVERY_STOCK.matchAction;
}

export function getNationImage(nation: string): string {
  return NATION_IMAGES[nation] ?? DISCOVERY_STOCK.stadiumCrowd;
}

export function getTeamNarrativeImage(fifaCode: string): string {
  return (
    TEAM_NARRATIVE_IMAGES[fifaCode.toUpperCase()] ?? DISCOVERY_STOCK.pitchLines
  );
}

export function getCatchUpImage(slug: string): string {
  return CATCH_UP_IMAGES[slug] ?? DISCOVERY_STOCK.matchAction;
}

export const EXPLORE_HERO_IMAGE = DISCOVERY_STOCK.stadiumCrowd;
export const HOME_HERO_IMAGE = DISCOVERY_STOCK.modernArena;
