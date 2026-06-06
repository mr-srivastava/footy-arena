import { DISCOVERY_STOCK } from "@/lib/discovery/images";
import { HOST_CITY_VENUES } from "@/lib/openfootball/host-venues";

export type HostCity = {
  slug: string;
  city: string;
  country: string;
  countryName: string;
  venue: string;
  image: string;
  dek: string;
  atmosphere: string;
  arrival: string;
};

const cityDetails: Record<
  string,
  Omit<HostCity, "city" | "country" | "venue">
> = {
  "new-york-new-jersey": {
    slug: "new-york-new-jersey",
    countryName: "United States",
    image: DISCOVERY_STOCK.stadiumLights,
    dek: "The final stage, framed by the scale and restless confidence of the world’s most international city.",
    atmosphere:
      "A global crowd, late-night energy, and the tournament’s most ceremonial closing chapter.",
    arrival:
      "Build the day around regional rail and allow time for the stadium district.",
  },
  "los-angeles": {
    slug: "los-angeles",
    countryName: "United States",
    image: DISCOVERY_STOCK.modernArena,
    dek: "A cinematic football weekend where the Pacific, design culture, and a new-generation stadium meet.",
    atmosphere:
      "Big-event polish with supporter cultures drawn from across the Americas.",
    arrival:
      "Stay flexible: the city rewards neighborhood planning more than a single central base.",
  },
  "mexico-city": {
    slug: "mexico-city",
    countryName: "Mexico",
    image: DISCOVERY_STOCK.stadiumCrowd,
    dek: "The tournament begins in football’s cathedral, high above sea level and deep inside its history.",
    atmosphere:
      "Ceremonial, loud, and inseparable from the mythology of the Azteca.",
    arrival:
      "Plan for altitude, arrive early, and make the stadium journey part of the occasion.",
  },
  vancouver: {
    slug: "vancouver",
    countryName: "Canada",
    image: DISCOVERY_STOCK.pitchLines,
    dek: "Mountain light, compact urban life, and a roofed downtown venue make for an unusually elegant host.",
    atmosphere:
      "Relaxed outside the ground, intensely international once the turnstiles open.",
    arrival:
      "The central stadium makes walking and transit the natural match-day rhythm.",
  },
};

const fallbackImages = [
  DISCOVERY_STOCK.modernArena,
  DISCOVERY_STOCK.nightGame,
  DISCOVERY_STOCK.pitchLines,
  DISCOVERY_STOCK.stadiumCrowd,
];

function slugify(city: string) {
  return city
    .toLowerCase()
    .replace(/\s*\/\s*/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function countryName(code: string) {
  if (code === "MEX") return "Mexico";
  if (code === "CAN") return "Canada";
  return "United States";
}

export const HOST_CITIES: HostCity[] = HOST_CITY_VENUES.map((entry, index) => {
  const slug = slugify(entry.city);
  const custom = cityDetails[slug];
  return {
    slug,
    city: entry.city,
    country: entry.country,
    countryName: custom?.countryName ?? countryName(entry.country),
    venue: entry.venue,
    image: custom?.image ?? fallbackImages[index % fallbackImages.length],
    dek:
      custom?.dek ??
      `${entry.city} brings its own local rhythm to the world’s largest football tournament.`,
    atmosphere:
      custom?.atmosphere ??
      "A meeting point for travelling supporters, local football culture, and the tournament’s global scale.",
    arrival:
      custom?.arrival ??
      "Use official tournament transport guidance and leave generous time around match-day security.",
  };
});

export function getHostCity(slug: string) {
  return HOST_CITIES.find((city) => city.slug === slug);
}
