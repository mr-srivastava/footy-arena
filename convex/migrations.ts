import type { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { toPositionGroup } from "./positions";

/** Fields present on players before Stage C migration. */
type LegacyPlayer = Doc<"players"> & {
  fifaCode?: string;
  country?: string;
};

const COUNTRY_NAME_TO_FIFA: Record<string, string> = {
  Norway: "NOR",
  England: "ENG",
  France: "FRA",
  Brazil: "BRA",
  Portugal: "POR",
  Croatia: "CRO",
  Egypt: "EGY",
  Germany: "GER",
  Senegal: "SEN",
  Belgium: "BEL",
  "Bosnia and Herzegovina": "BIH",
  "South Korea": "KOR",
  Austria: "AUT",
  Japan: "JPN",
  Czechia: "CZE",
  Scotland: "SCO",
  Curaçao: "CUW",
  Haiti: "HAI",
  Qatar: "QAT",
  Turkey: "TUR",
  Sweden: "SWE",
  Switzerland: "SUI",
  Tunisia: "TUN",
  "Saudi Arabia": "KSA",
  "New Zealand": "NZL",
  "Cabo Verde": "CPV",
  "Congo DR": "COD",
  "Côte d'Ivoire": "CIV",
};

function normalizeKey(value: string): string {
  return value.trim().toLowerCase();
}

export const getMigrationStatus = query({
  args: {},
  handler: async (ctx) => {
    const players = await ctx.db.query("players").collect();
    const withCountryId = players.filter((p) => p.countryId).length;
    const withPositionGroup = players.filter((p) => p.positionGroup).length;
    return {
      total: players.length,
      withCountryId,
      withPositionGroup,
      withoutCountryId: players.length - withCountryId,
      withoutPositionGroup: players.length - withPositionGroup,
    };
  },
});

export const migrateLegacyPlayers = mutation({
  args: {},
  handler: async (ctx) => {
    const countries = await ctx.db.query("countries").collect();
    const byFifaCode = new Map(
      countries.map((c) => [c.fifaCode.toUpperCase(), c._id]),
    );
    const byName = new Map<string, Id<"countries">>();
    for (const country of countries) {
      for (const key of [
        country.name,
        country.displayName,
        country.nameNormalised,
      ]) {
        if (key) byName.set(normalizeKey(key), country._id);
      }
    }

    const players = (await ctx.db.query("players").collect()) as LegacyPlayer[];
    let migrated = 0;
    let skipped = 0;
    const orphans: Array<{
      name: string;
      fifaCode?: string;
      country?: string;
    }> = [];

    for (const player of players) {
      if (player.countryId && player.positionGroup) {
        skipped++;
        continue;
      }

      let countryId: Id<"countries"> | undefined = player.countryId;

      if (!countryId && player.fifaCode) {
        countryId = byFifaCode.get(player.fifaCode.toUpperCase());
      }

      if (!countryId && player.country) {
        const fromAlias = COUNTRY_NAME_TO_FIFA[player.country];
        if (fromAlias) {
          countryId = byFifaCode.get(fromAlias);
        }
        if (!countryId) {
          countryId = byName.get(normalizeKey(player.country));
        }
      }

      if (!countryId) {
        orphans.push({
          name: player.name,
          fifaCode: player.fifaCode,
          country: player.country,
        });
        continue;
      }

      const positionGroup =
        player.positionGroup ?? toPositionGroup(player.position);

      await ctx.db.patch(player._id, { countryId, positionGroup });
      migrated++;
    }

    return { migrated, skipped, orphans };
  },
});

export const finalizeMigration = mutation({
  args: {},
  handler: async (ctx) => {
    const players = (await ctx.db.query("players").collect()) as LegacyPlayer[];
    let stripped = 0;

    for (const player of players) {
      if (!player.countryId || !player.positionGroup) {
        continue;
      }

      if (!player.fifaCode && !player.country) {
        continue;
      }

      await ctx.db.replace(player._id, {
        countryId: player.countryId,
        positionGroup: player.positionGroup,
        name: player.name,
        jerseyNumber: player.jerseyNumber,
        age: player.age,
        position: player.position,
        detailedPosition: player.detailedPosition,
        preferredFoot: player.preferredFoot,
        club: player.club,
        league: player.league,
        clubCountry: player.clubCountry,
        isCaptain: player.isCaptain,
        previousWorldCupsCount: player.previousWorldCupsCount,
        previousWorldCupsList: player.previousWorldCupsList,
        profileSlug: player.profileSlug,
      });
      stripped++;
    }

    return { stripped };
  },
});
