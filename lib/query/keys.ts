export const queryKeys = {
  explorePlayers: (slugs: string[], includePerformance = false) =>
    ["explore", "players", slugs, includePerformance] as const,
  teamSquad: (slug: string) => ["teams", slug, "squad"] as const,
  matchInsight: (fixtureId: string) =>
    ["fixtures", fixtureId, "insight"] as const,
};
