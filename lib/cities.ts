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
  dallas: {
    slug: "dallas",
    countryName: "United States",
    image: DISCOVERY_STOCK.modernArena,
    dek: "Everything is bigger in Texas — including the stadium, the heat, and the match-day spectacle.",
    atmosphere:
      "Big-screen energy, tailgate culture, and a crowd that treats every match like a championship.",
    arrival:
      "Plan for suburban stadium access; rideshare and early arrival beat match-day traffic.",
  },
  miami: {
    slug: "miami",
    countryName: "United States",
    image: DISCOVERY_STOCK.nightGame,
    dek: "Tropical nights, global accents, and a hard-rock stadium built for spectacle on the edge of the Atlantic.",
    atmosphere:
      "Latin rhythms, late kickoffs, and a party atmosphere that starts hours before kickoff.",
    arrival:
      "Heat and humidity are real — hydrate early and build extra time into your stadium approach.",
  },
  atlanta: {
    slug: "atlanta",
    countryName: "United States",
    image: DISCOVERY_STOCK.stadiumCrowd,
    dek: "A southern football city where the stadium's retractable roof and fan energy create a unique indoor-outdoor rhythm.",
    atmosphere:
      "Passionate local support blended with a diverse, travelling crowd from across the Americas.",
    arrival:
      "MARTA reaches the stadium district — transit beats driving on major match days.",
  },
  houston: {
    slug: "houston",
    countryName: "United States",
    image: DISCOVERY_STOCK.stadiumLights,
    dek: "A sprawling Gulf Coast metro where NRG Stadium turns into a cavern of noise under the Texas sun.",
    atmosphere:
      "Diverse, loud, and unapologetically big — Houston match days feel like major events.",
    arrival:
      "Allow buffer time for parking and security; the stadium complex rewards early arrival.",
  },
  philadelphia: {
    slug: "philadelphia",
    countryName: "United States",
    image: DISCOVERY_STOCK.matchAction,
    dek: "Grit, history, and a passionate sports city hosting World Cup football in one of America's great stadium districts.",
    atmosphere:
      "Direct, vocal, and deeply local — Philadelphia crowds do not need warming up.",
    arrival:
      "South Philadelphia transit and regional rail make match-day access straightforward with planning.",
  },
  seattle: {
    slug: "seattle",
    countryName: "United States",
    image: DISCOVERY_STOCK.pitchLines,
    dek: "Pacific Northwest rain or shine, Lumen Field's steep stands and vocal supporters create one of the loudest atmospheres in the tournament.",
    atmosphere:
      "Emerald-green passion, coordinated chants, and a crowd that makes the ground feel smaller than it is.",
    arrival:
      "Light rail to the stadium is the easiest rhythm — the city rewards walkers and transit users.",
  },
  "san-francisco": {
    slug: "san-francisco",
    countryName: "United States",
    image: DISCOVERY_STOCK.modernArena,
    dek: "Silicon Valley meets World Cup football — Levi's Stadium brings Bay Area innovation and California sunshine to the tournament.",
    atmosphere:
      "Tech-polished event production with a diverse, globally minded crowd in the South Bay.",
    arrival:
      "Santa Clara is south of the city proper — plan transit or driving time from your base carefully.",
  },
  boston: {
    slug: "boston",
    countryName: "United States",
    image: DISCOVERY_STOCK.stadiumCrowd,
    dek: "A city of champions hosts the world's game — Gillette Stadium anchors a match-day rhythm rooted in New England sports culture.",
    atmosphere:
      "Knowledgeable, intense, and weather-ready — Boston crowds bring playoff energy to group-stage nights.",
    arrival:
      "Foxborough is outside central Boston; commuter rail and early departures are the smart play.",
  },
  "kansas-city": {
    slug: "kansas-city",
    countryName: "United States",
    image: DISCOVERY_STOCK.nightGame,
    dek: "Arrowhead's roar meets the world's game — a heartland host where barbecue culture and football passion share the same weekend.",
    atmosphere:
      "Midwestern warmth, legendary stadium acoustics, and a crowd that treats every match as a civic event.",
    arrival:
      "Parking and rideshare fill quickly — arrive early and embrace the tailgate energy.",
  },
  guadalajara: {
    slug: "guadalajara",
    countryName: "Mexico",
    image: DISCOVERY_STOCK.celebration,
    dek: "Mexico's second city brings chiva culture, altitude, and one of the most football-obsessed regions on the continent.",
    atmosphere:
      "Passionate, local, and loud — Guadalajara match days feel deeply Mexican in the best way.",
    arrival:
      "Altitude and afternoon heat matter; arrive early and acclimate before kickoff.",
  },
  monterrey: {
    slug: "monterrey",
    countryName: "Mexico",
    image: DISCOVERY_STOCK.stadiumLights,
    dek: "Industrial northern Mexico meets modern stadium design — Monterrey hosts with intensity, pride, and a fierce local football identity.",
    atmosphere:
      "Direct, passionate support with a northern edge — crowds here do not sit quietly.",
    arrival:
      "BBVA's compact bowl rewards close seats; build time for security and the approach from the city.",
  },
  toronto: {
    slug: "toronto",
    countryName: "Canada",
    image: DISCOVERY_STOCK.modernArena,
    dek: "Canada's largest city brings multicultural energy to a downtown stadium on the lakefront.",
    atmosphere:
      "Global, polite outside the ground, fiercely united once the anthems finish.",
    arrival:
      "Exhibition Place is transit-friendly — streetcar and GO train options beat driving downtown.",
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
