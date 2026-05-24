import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  players: defineTable({
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
    .index("by_fifa_code", ["fifaCode"])
    .index("by_country", ["country"]),
});
