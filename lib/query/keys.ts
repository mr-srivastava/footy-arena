export const queryKeys = {
  explorePlayers: (slugs: string[]) => ["explore", "players", slugs] as const,
  teamSquad: (slug: string) => ["teams", slug, "squad"] as const,
  labTeam: (slug: string) => ["lab", "team", slug] as const,
  labEnrichment: (slug: string) => ["lab", "enrichment", slug] as const,
};
