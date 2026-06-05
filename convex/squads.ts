import { query } from "./_generated/server";
import { v } from "convex/values";

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
