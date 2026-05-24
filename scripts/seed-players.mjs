import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Map country names from JSON → FIFA codes used in the project
const COUNTRY_TO_FIFA = {
  "Norway": "NOR",
  "England": "ENG",
  "France": "FRA",
  "Brazil": "BRA",
  "Portugal": "POR",
  "Croatia": "CRO",
  "Egypt": "EGY",
  "Germany": "GER",
  "Senegal": "SEN",
  "Belgium": "BEL",
  "Bosnia and Herzegovina": "BIH",
  "South Korea": "KOR",
  "Austria": "AUT",
  "Japan": "JPN",
  "Czechia": "CZE",
  "Scotland": "SCO",
  "Curaçao": "CUW",
  "Haiti": "HAI",
  "Qatar": "QAT",
  "Turkey": "TUR",
  "Sweden": "SWE",
  "Switzerland": "SUI",
  "Tunisia": "TUN",
  "Saudi Arabia": "KSA",
  "New Zealand": "NZL",
  "Cabo Verde": "CPV",
  "Congo DR": "COD",
  "Côte d'Ivoire": "CIV",
};

function loadJsonWithComments(filePath) {
  const content = readFileSync(filePath, "utf-8");
  // Strip single-line comments (// ...) — files use JSON5-style comments
  const cleaned = content.replace(/\/\/[^\n]*/g, "");
  return JSON.parse(cleaned);
}

const FILES = [
  "../../Downloads/player_country_nor_eng_france.json",
  "../../Downloads/player_country_brazil_portugal_croatia.json",
  "../../Downloads/player_country_egypt_germany_senegal.json",
  "../../Downloads/player_country_belgium.json",
  "../../Downloads/player_country_bosnia_skorea.json",
  "../../Downloads/player_country_austria_japan_czechia.json",
  "../../Downloads/player_country_scotland_curaçao_haiti_qatar_ turkey.json",
  "../../Downloads/fifa_world_cup_2026_squads.json",
];

const allPlayers = [];
const unmapped = new Set();

for (const file of FILES) {
  const fullPath = join(__dirname, file);
  const data = loadJsonWithComments(fullPath);
  for (const p of data) {
    const fifaCode = COUNTRY_TO_FIFA[p.country];
    if (!fifaCode) {
      unmapped.add(p.country);
      continue;
    }
    allPlayers.push({
      fifaCode,
      country: p.country,
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
  console.warn("⚠️  Unmapped countries (skipped):", [...unmapped]);
}

const url = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!url) {
  console.error("❌  NEXT_PUBLIC_CONVEX_URL not set. Make sure .env.local exists.");
  process.exit(1);
}

const client = new ConvexHttpClient(url);

console.log(`🗑️  Clearing existing players...`);
const cleared = await client.mutation(api.players.clear, {});
console.log(`   Deleted ${cleared.deleted} existing records.`);

const result = await client.mutation(api.players.seed, { players: allPlayers });
const inserted = result.inserted;
console.log(`   ✓ Inserted ${inserted}/${allPlayers.length}`);

console.log(`\n✅  Done! ${inserted} players seeded across ${Object.keys(COUNTRY_TO_FIFA).length} countries.`);
