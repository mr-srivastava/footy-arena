import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { SQUAD_SEED_DATA } from "./squadSeedData";

export const getByCountryId = query({
  args: { countryId: v.id("countries") },
  handler: async (ctx, { countryId }) => {
    return ctx.db
      .query("squads")
      .withIndex("by_country", (q) => q.eq("countryId", countryId))
      .unique();
  },
});

export const countAnnounced = query({
  args: {},
  handler: async (ctx) => {
    const squads = await ctx.db.query("squads").collect();
    return squads.filter(
      (squad) => squad.status === "announced" && squad.managerName,
    ).length;
  },
});

export const upsertFromSeedData = mutation({
  args: {},
  handler: async (ctx) => {
    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const [fifaCode, entry] of Object.entries(SQUAD_SEED_DATA)) {
      const country = await ctx.db
        .query("countries")
        .withIndex("by_fifa_code", (q) => q.eq("fifaCode", fifaCode))
        .unique();

      if (!country) {
        skipped++;
        continue;
      }

      const existing = await ctx.db
        .query("squads")
        .withIndex("by_country", (q) => q.eq("countryId", country._id))
        .unique();

      const squadDoc = {
        countryId: country._id,
        status: entry.status as "announced" | "pending",
        managerName: entry.managerName,
        managerNationality: entry.managerNationality,
      };

      if (existing) {
        await ctx.db.patch(existing._id, squadDoc);
        updated++;
      } else {
        await ctx.db.insert("squads", squadDoc);
        inserted++;
      }
    }

    return { inserted, updated, skipped };
  },
});

export const clear = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("squads").collect();
    for (const doc of all) {
      await ctx.db.delete(doc._id);
    }
    return { deleted: all.length };
  },
});
