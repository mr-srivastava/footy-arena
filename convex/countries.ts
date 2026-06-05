import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const countries = await ctx.db.query("countries").collect();
    return countries.toSorted((a, b) =>
      a.displayName.localeCompare(b.displayName),
    );
  },
});

export const listWithPlayers = query({
  args: {},
  handler: async (ctx) => {
    const players = await ctx.db.query("players").collect();
    const countryIds = new Set(players.map((player) => player.countryId));

    const countries = await ctx.db.query("countries").collect();
    return countries
      .filter((country) => countryIds.has(country._id))
      .toSorted((a, b) => a.displayName.localeCompare(b.displayName));
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return ctx.db
      .query("countries")
      .withIndex("by_slug", (q) => q.eq("slug", slug.toLowerCase()))
      .unique();
  },
});

export const getById = query({
  args: { countryId: v.id("countries") },
  handler: async (ctx, { countryId }) => {
    return await ctx.db.get(countryId);
  },
});

export const getByFifaCode = query({
  args: { fifaCode: v.string() },
  handler: async (ctx, { fifaCode }) => {
    return ctx.db
      .query("countries")
      .withIndex("by_fifa_code", (q) => q.eq("fifaCode", fifaCode.toUpperCase()))
      .unique();
  },
});

export const listByGroup = query({
  args: { groupLetter: v.string() },
  handler: async (ctx, { groupLetter }) => {
    const countries = await ctx.db
      .query("countries")
      .withIndex("by_group_letter", (q) =>
        q.eq("groupLetter", groupLetter.toUpperCase()),
      )
      .collect();
    return countries.toSorted((a, b) =>
      a.displayName.localeCompare(b.displayName),
    );
  },
});
