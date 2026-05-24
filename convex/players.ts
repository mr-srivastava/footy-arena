import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getByFifaCode = query({
  args: { fifaCode: v.string() },
  handler: async (ctx, { fifaCode }) => {
    return ctx.db
      .query("players")
      .withIndex("by_fifa_code", (q) => q.eq("fifaCode", fifaCode))
      .collect();
  },
});

export const seed = mutation({
  args: {
    players: v.array(
      v.object({
        fifaCode: v.string(),
        country: v.string(),
        name: v.string(),
        jerseyNumber: v.union(v.number(), v.null()),
        age: v.number(),
        position: v.string(),
        detailedPosition: v.string(),
        preferredFoot: v.string(),
        club: v.string(),
        league: v.string(),
        clubCountry: v.string(),
        isCaptain: v.boolean(),
        previousWorldCupsCount: v.number(),
        previousWorldCupsList: v.array(v.string()),
      })
    ),
  },
  handler: async (ctx, { players }) => {
    for (const player of players) {
      await ctx.db.insert("players", player);
    }
    return { inserted: players.length };
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("players").collect();
    for (const p of all) {
      await ctx.db.delete(p._id);
    }
    return { deleted: all.length };
  },
});
