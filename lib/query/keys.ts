export const queryKeys = {
  explorePlayers: (slugs: string[]) => ["explore", "players", slugs] as const,
  teamSquad: (slug: string) => ["teams", slug, "squad"] as const,
};
