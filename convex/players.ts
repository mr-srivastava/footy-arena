import { query } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const players = await ctx.db.query("players").collect();
    players.sort((a, b) => a.name.localeCompare(b.name));
    return players;
  },
});

export const getById = query({
  args: { playerId: v.id("players") },
  handler: async (ctx, { playerId }) => {
    return await ctx.db.get(playerId);
  },
});

/** @deprecated Prefer api.teams.getTeamPageData — kept for callers not yet updated. */
export const getByFifaCode = query({
  args: { fifaCode: v.string() },
  handler: async (ctx, { fifaCode }) => {
    const country = await ctx.db
      .query("countries")
      .withIndex("by_fifa_code", (q) => q.eq("fifaCode", fifaCode.toUpperCase()))
      .unique();

    if (!country) return [];

    return ctx.db
      .query("players")
      .withIndex("by_country", (q) => q.eq("countryId", country._id))
      .collect();
  },
});
