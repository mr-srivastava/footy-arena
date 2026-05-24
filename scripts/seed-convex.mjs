import { ConvexHttpClient } from "convex/browser";
import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { api } from "../convex/_generated/api.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const WC2026_TEAMS_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.teams.json";

const COUNTRY_NAME_TO_FIFA = {
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

const POSITION_TO_GROUP = {
  Goalkeeper: "GK",
  Defender: "DF",
  Midfielder: "MF",
  Attacker: "FW",
};

const JSON_FILES = [
  "../../Downloads/player_country_nor_eng_france.json",
  "../../Downloads/player_country_brazil_portugal_croatia.json",
  "../../Downloads/player_country_egypt_germany_senegal.json",
  "../../Downloads/player_country_belgium.json",
  "../../Downloads/player_country_bosnia_skorea.json",
  "../../Downloads/player_country_austria_japan_czechia.json",
  "../../Downloads/player_country_scotland_curaçao_haiti_qatar_ turkey.json",
  "../../Downloads/fifa_world_cup_2026_squads.json",
];

function loadJsonWithComments(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const cleaned = content.replace(/\/\/[^\n]*/g, "");
  return JSON.parse(cleaned);
}

function mapOpenFootballCountry(raw) {
  const displayName = raw.name_normalised ?? raw.name;
  return {
    fifaCode: raw.fifa_code.toUpperCase(),
    slug: raw.fifa_code.toLowerCase(),
    name: raw.name,
    nameNormalised: raw.name_normalised,
    displayName,
    continent: raw.continent,
    confederation: raw.confed,
    flagIcon: raw.flag_icon,
    groupLetter: raw.group.toUpperCase(),
  };
}

async function fetchCountries() {
  const response = await fetch(WC2026_TEAMS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch teams (${response.status})`);
  }
  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Invalid teams data: expected an array");
  }
  return data.map(mapOpenFootballCountry);
}

async function seedCountries(client) {
  const countries = await fetchCountries();
  const result = await client.mutation(api.countries.upsertBatch, { countries });
  console.log(
    `Countries: ${result.inserted} inserted, ${result.updated} updated (${countries.length} total)`,
  );
  return countries.length;
}

async function seedSquads(client) {
  const result = await client.mutation(api.squads.upsertFromSeedData, {});
  console.log(
    `Squads: ${result.inserted} inserted, ${result.updated} updated, ${result.skipped} skipped (no country)`,
  );
}

async function migratePlayers(client) {
  const before = await client.query(api.migrations.getMigrationStatus, {});
  console.log(`Players before migration: ${before.total} total, ${before.withoutCountryId} without countryId`);

  const result = await client.mutation(api.migrations.migrateLegacyPlayers, {});
  console.log(
    `Migration: ${result.migrated} migrated, ${result.skipped} already done, ${result.orphans.length} orphans`,
  );

  if (result.orphans.length > 0) {
    console.warn("Orphan players (could not resolve country):");
    for (const orphan of result.orphans) {
      console.warn(`  - ${orphan.name} (fifa: ${orphan.fifaCode ?? "?"}, country: ${orphan.country ?? "?"})`);
    }
  }

  const after = await client.query(api.migrations.getMigrationStatus, {});
  if (after.withoutCountryId > 0) {
    throw new Error(
      `${after.withoutCountryId} players still lack countryId. Fix orphans before finalizing.`,
    );
  }

  return result;
}

async function finalizeMigration(client) {
  const result = await client.mutation(api.migrations.finalizeMigration, {});
  console.log(`Finalize: stripped legacy fields from ${result.stripped} players`);
}

async function seedPlayersFromJson(client) {
  const countries = await client.query(api.countries.list, {});
  const byFifaCode = new Map(countries.map((c) => [c.fifaCode, c._id]));

  const allPlayers = [];
  const unmapped = new Set();

  for (const file of JSON_FILES) {
    const fullPath = join(__dirname, file);
    if (!existsSync(fullPath)) {
      console.warn(`Skipping missing file: ${fullPath}`);
      continue;
    }
    const data = loadJsonWithComments(fullPath);
    for (const p of data) {
      const fifaCode = COUNTRY_NAME_TO_FIFA[p.country];
      if (!fifaCode) {
        unmapped.add(p.country);
        continue;
      }
      const countryId = byFifaCode.get(fifaCode);
      if (!countryId) {
        unmapped.add(`${p.country} (${fifaCode})`);
        continue;
      }
      allPlayers.push({
        countryId,
        positionGroup: POSITION_TO_GROUP[p.position] ?? "MF",
        name: p.name,
        jerseyNumber: p.jerseyNumber ?? null,
        age: p.age,
        position: p.position,
        detailedPosition: p.detailedPosition,
        preferredFoot: p.preferredFoot,
        club: p.club,
        league: p.league,
        clubCountry: p.clubCountry,
        isCaptain: p.isCaptain,
        previousWorldCupsCount: p.previousWorldCupsCount,
        previousWorldCupsList: p.previousWorldCupsList,
      });
    }
  }

  if (unmapped.size > 0) {
    console.warn("Unmapped countries:", [...unmapped]);
  }

  const cleared = await client.mutation(api.players.clear, {});
  console.log(`Cleared ${cleared.deleted} existing players`);

  const result = await client.mutation(api.players.seed, { players: allPlayers });
  console.log(`Inserted ${result.inserted}/${allPlayers.length} players from JSON`);
}

async function main() {
  const fromJson = process.argv.includes("--from-json");
  const finalizeOnly = process.argv.includes("--finalize");

  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    console.error("NEXT_PUBLIC_CONVEX_URL not set. Ensure .env.local exists.");
    process.exit(1);
  }

  const client = new ConvexHttpClient(url);

  if (finalizeOnly) {
    await finalizeMigration(client);
    console.log("\nDone. Deploy Stage C schema (copy convex/schema.stage-c.ts → convex/schema.ts).");
    return;
  }

  console.log("Seeding countries...");
  await seedCountries(client);

  console.log("Seeding squads...");
  await seedSquads(client);

  if (fromJson) {
    console.log("Seeding players from JSON (--from-json)...");
    await seedPlayersFromJson(client);
  } else {
    console.log("Migrating existing players...");
    await migratePlayers(client);
    console.log("\nOptional: run `npm run seed -- --finalize` then deploy Stage C schema.");
  }

  console.log("\nDone.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
