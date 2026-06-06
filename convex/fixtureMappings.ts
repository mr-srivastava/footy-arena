import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { mappingConfidence } from "./validators";

export const getByFixtureId = query({
  args: { fixtureId: v.string() },
  handler: async (ctx, { fixtureId }) => {
    return ctx.db
      .query("fixtureMappings")
      .withIndex("by_fixture_id", (q) => q.eq("fixtureId", fixtureId))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    fixtureId: v.string(),
    bsdEventId: v.number(),
    confidence: mappingConfidence,
    homeTeamId: v.optional(v.number()),
    awayTeamId: v.optional(v.number()),
    lastResolvedAt: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("fixtureMappings")
      .withIndex("by_fixture_id", (q) => q.eq("fixtureId", args.fixtureId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        bsdEventId: args.bsdEventId,
        confidence: args.confidence,
        homeTeamId: args.homeTeamId,
        awayTeamId: args.awayTeamId,
        lastResolvedAt: args.lastResolvedAt,
      });
      return existing._id;
    }

    return ctx.db.insert("fixtureMappings", args);
  },
});
