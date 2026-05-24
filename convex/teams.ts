import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTeamPageData = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const country = await ctx.db
      .query("countries")
      .withIndex("by_slug", (q) => q.eq("slug", slug.toLowerCase()))
      .unique();

    if (!country) return null;

    const squad = await ctx.db
      .query("squads")
      .withIndex("by_country", (q) => q.eq("countryId", country._id))
      .unique();

    const players = await ctx.db
      .query("players")
      .withIndex("by_country", (q) => q.eq("countryId", country._id))
      .collect();

    players.sort((a, b) => {
      const numA = a.jerseyNumber ?? 999;
      const numB = b.jerseyNumber ?? 999;
      if (numA !== numB) return numA - numB;
      return a.name.localeCompare(b.name);
    });

    return { country, squad, players };
  },
});
