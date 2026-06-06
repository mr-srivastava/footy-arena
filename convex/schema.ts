import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  mappingConfidence,
  playerFields,
  positionGroup,
  squadStatus,
} from "./validators";

export default defineSchema({
  countries: defineTable({
    fifaCode: v.string(),
    slug: v.string(),
    name: v.string(),
    nameNormalised: v.optional(v.string()),
    displayName: v.string(),
    continent: v.string(),
    confederation: v.string(),
    flagIcon: v.string(),
    groupLetter: v.string(),
  })
    .index("by_fifa_code", ["fifaCode"])
    .index("by_slug", ["slug"])
    .index("by_group_letter", ["groupLetter"]),

  squads: defineTable({
    countryId: v.id("countries"),
    status: squadStatus,
    managerName: v.optional(v.string()),
    managerNationality: v.optional(v.string()),
  }).index("by_country", ["countryId"]),

  players: defineTable({
    countryId: v.id("countries"),
    positionGroup,
    ...playerFields,
  })
    .index("by_country", ["countryId"])
    .index("by_profile_slug", ["profileSlug"]),

  fixtureMappings: defineTable({
    fixtureId: v.string(),
    bsdEventId: v.number(),
    confidence: mappingConfidence,
    homeTeamId: v.optional(v.number()),
    awayTeamId: v.optional(v.number()),
    lastResolvedAt: v.string(),
  })
    .index("by_fixture_id", ["fixtureId"])
    .index("by_bsd_event_id", ["bsdEventId"]),
});
