import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const countryInput = v.object({
  fifaCode: v.string(),
  slug: v.string(),
  name: v.string(),
  nameNormalised: v.optional(v.string()),
  displayName: v.string(),
  continent: v.string(),
  confederation: v.string(),
  flagIcon: v.string(),
  groupLetter: v.string(),
});

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

export const upsertBatch = mutation({
  args: { countries: v.array(countryInput) },
  handler: async (ctx, { countries }) => {
    let inserted = 0;
    let updated = 0;

    for (const country of countries) {
      const existing = await ctx.db
        .query("countries")
        .withIndex("by_fifa_code", (q) =>
          q.eq("fifaCode", country.fifaCode.toUpperCase()),
        )
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, country);
        updated++;
      } else {
        await ctx.db.insert("countries", {
          ...country,
          fifaCode: country.fifaCode.toUpperCase(),
          slug: country.slug.toLowerCase(),
          groupLetter: country.groupLetter.toUpperCase(),
        });
        inserted++;
      }
    }

    return { inserted, updated };
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("countries").collect();
    for (const doc of all) {
      await ctx.db.delete(doc._id);
    }
    return { deleted: all.length };
  },
});
