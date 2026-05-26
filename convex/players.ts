import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { playerFields, positionGroup } from "./validators";

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

const playerSeedInput = v.object({
  countryId: v.id("countries"),
  positionGroup,
  ...playerFields,
});

export const seed = mutation({
  args: {
    players: v.array(playerSeedInput),
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
