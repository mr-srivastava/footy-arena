import type {
  DiscoveryCategory,
  DiscoveryCategorySlug,
  DiscoveryCollection,
  PlayerProfile,
  TeamNarrative,
} from "./types";
import {
  DISCOVERY_CATEGORIES,
  LEGENDS_PLAYER_SLUGS,
  LOST_GLORIES,
  NEXT_GENERATION_SLUGS,
  PLAYERS_TO_WATCH_SLUGS,
  RISING_UNDERDOGS,
} from "./seed/categories";
import { DISCOVERY_COLLECTIONS } from "./seed/collections";
import { CATCH_UP_TOPICS, HOMEPAGE_MODULES } from "./seed/homepage";
import { MATCH_STORY_TEMPLATES } from "./seed/match-templates";
import { METRIC_TRANSLATIONS } from "./seed/metrics";
import { PLAYERS } from "./seed/players";
import { TEAM_NARRATIVES } from "./seed/teams";

const playersBySlug = new Map(PLAYERS.map((player) => [player.slug, player]));
const narrativesByCode = new Map(
  TEAM_NARRATIVES.map((narrative) => [narrative.fifaCode, narrative]),
);
const categoriesBySlug = new Map(
  DISCOVERY_CATEGORIES.map((category) => [category.slug, category]),
);
const collectionsBySlug = new Map(
  DISCOVERY_COLLECTIONS.map((collection) => [collection.slug, collection]),
);

export const RISING_UNDERDOG_ENTRIES = RISING_UNDERDOGS.map((entry) => ({
  ...entry,
  breakoutPlayers: entry.breakoutPlayerSlugs
    .map((slug) => playersBySlug.get(slug))
    .filter((player): player is PlayerProfile => player !== undefined),
}));

export const TEAM_NARRATIVE_ENTRIES = TEAM_NARRATIVES.map((narrative) => ({
  narrative,
  keyPlayers: narrative.keyPlayerSlugs
    .map((slug) => playersBySlug.get(slug))
    .filter((player): player is PlayerProfile => player !== undefined),
}));

export {
  CATCH_UP_TOPICS,
  DISCOVERY_COLLECTIONS,
  HOMEPAGE_MODULES,
  LOST_GLORIES,
  MATCH_STORY_TEMPLATES,
  METRIC_TRANSLATIONS,
};

export function getAllPlayers(): PlayerProfile[] {
  return PLAYERS;
}

export function getFeaturedPlayers(): PlayerProfile[] {
  return PLAYERS.filter((player) => player.featured);
}

export function getPlayerBySlug(slug: string): PlayerProfile | undefined {
  return playersBySlug.get(slug);
}

export function getPlayersBySlugs(slugs: string[]): PlayerProfile[] {
  return slugs
    .map((slug) => playersBySlug.get(slug))
    .filter((player): player is PlayerProfile => player !== undefined);
}

export function getTeamNarrative(
  fifaCode: string,
): TeamNarrative | undefined {
  return narrativesByCode.get(fifaCode.toUpperCase());
}

export function getDiscoveryCategory(
  slug: string,
): DiscoveryCategory | undefined {
  return categoriesBySlug.get(slug as DiscoveryCategorySlug);
}

export function getDiscoveryCategorySlugs(): DiscoveryCategorySlug[] {
  return DISCOVERY_CATEGORIES.map((category) => category.slug);
}

export function getDiscoveryCollection(
  slug: string,
): DiscoveryCollection | undefined {
  return collectionsBySlug.get(slug);
}

export function getCategoryPlayerSlugs(
  slug: DiscoveryCategorySlug,
): string[] {
  switch (slug) {
    case "next-generation":
      return NEXT_GENERATION_SLUGS;
    case "legends-legacy":
      return LEGENDS_PLAYER_SLUGS;
    case "players-to-watch":
      return PLAYERS_TO_WATCH_SLUGS;
    default:
      return [];
  }
}

export function getCatchUpTopic(slug: string) {
  return CATCH_UP_TOPICS.find((topic) => topic.slug === slug);
}
