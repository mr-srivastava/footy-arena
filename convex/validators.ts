import { v } from 'convex/values';

export const positionGroup = v.union(
  v.literal('GK'),
  v.literal('DF'),
  v.literal('MF'),
  v.literal('FW'),
);

export const squadStatus = v.union(
  v.literal('announced'),
  v.literal('pending'),
);

export const playerFields = {
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
  profileSlug: v.optional(v.string()),
};

export const mappingConfidence = v.union(
  v.literal("high"),
  v.literal("medium"),
  v.literal("low"),
);
