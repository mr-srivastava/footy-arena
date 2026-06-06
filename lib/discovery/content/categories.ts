import type {
  DiscoveryCategory,
  LostGloryEntry,
  RisingUnderdogEntry,
} from "../types";

export const DISCOVERY_CATEGORIES: DiscoveryCategory[] = [
  {
    slug: "lost-glories",
    title: "Lost Glories",
    tagline: "Nations that once ruled the world",
    description:
      "Former giants navigating decline, transition, and the hope of a comeback.",
  },
  {
    slug: "rising-underdogs",
    title: "Rising Underdogs",
    tagline: "Smaller nations rewriting expectations",
    description:
      "Teams punching above their weight with tactical discipline and fearless football.",
  },
  {
    slug: "next-generation",
    title: "Next Generation",
    tagline: "The stars of tomorrow, today",
    description:
      "Young players redefining what's possible at the highest level.",
  },
  {
    slug: "legends-legacy",
    title: "Legends & Legacy",
    tagline: "Icons in their final chapters",
    description:
      "Veteran superstars carrying decades of history into one last dance.",
  },
  {
    slug: "players-to-watch",
    title: "Players To Watch",
    tagline: "Names you'll be talking about all summer",
    description:
      "The personalities and performers who could define this tournament.",
  },
  {
    slug: "tactical-identities",
    title: "Football Cultures",
    tagline: "How nations play the beautiful game",
    description:
      "Distinct tactical identities and playing philosophies that make each team unique.",
  },
];

export const LOST_GLORIES: LostGloryEntry[] = [
  {
    nation: "Germany",
    fifaCode: "GER",
    then: "Dominant tournament powerhouse and 2014 world champions.",
    whatChanged:
      "Aging squad core, tactical transition issues, inconsistent development.",
    currentStatus: "Rebuilding around elite young creators.",
    hopeForTheFuture: "Musiala and Wirtz could define the next era.",
  },
  {
    nation: "Uruguay",
    fifaCode: "URU",
    then: "Two-time world champions and perennial South American heavyweights.",
    whatChanged:
      "Aging core and increased competition across CONMEBOL have narrowed their margin for error.",
    currentStatus: "Still tactically sharp, fighting to reclaim elite status.",
    hopeForTheFuture:
      "A blend of European-based experience and emerging South American talent.",
  },
  {
    nation: "Brazil",
    fifaCode: "BRA",
    then: "The spiritual home of beautiful football.",
    whatChanged: "Pressure of expectations and evolving tactical football.",
    currentStatus:
      "Transitioning from Neymar era toward a younger attacking generation.",
    hopeForTheFuture: "Vinícius Júnior becoming global superstar centerpiece.",
  },
];

export const RISING_UNDERDOGS: RisingUnderdogEntry[] = [
  {
    nation: "Morocco",
    fifaCode: "MAR",
    whyTheyMatter:
      "Historic semifinal run changed perceptions of African football.",
    keyIdentity: "Defensive organization and emotional resilience.",
    breakoutPlayerSlugs: ["achraf-hakimi", "brahim-diaz"],
    whyCasualFansShouldWatch:
      "Emotionally intense football with huge crowd energy.",
  },
  {
    nation: "Japan",
    fifaCode: "JPN",
    whyTheyMatter: "One of the smartest tactical teams outside Europe's elite.",
    keyIdentity: "Discipline and relentless work rate.",
    breakoutPlayerSlugs: ["kaoru-mitoma", "takefusa-kubo"],
    whyCasualFansShouldWatch: "Capable of upsetting major football powers.",
  },
  {
    nation: "Canada",
    fifaCode: "CAN",
    whyTheyMatter:
      "A co-host nation with a rapidly improving generation pushing beyond regional expectations.",
    keyIdentity: "Pace, physicality, and growing tactical confidence.",
    breakoutPlayerSlugs: ["alphonso-davies", "jonathan-david"],
    whyCasualFansShouldWatch:
      "Home support and a fearless style make every Canada match an event.",
  },
];

export const LEGENDS_PLAYER_SLUGS = [
  "lionel-messi",
  "luka-modric",
  "cristiano-ronaldo",
];

export const PLAYERS_TO_WATCH_SLUGS = [
  "jude-bellingham",
  "kylian-mbappe",
  "vinicius-junior",
  "lamine-yamal",
  "jamal-musiala",
  "kaoru-mitoma",
  "achraf-hakimi",
  "pedri",
];

export const NEXT_GENERATION_SLUGS = [
  "jude-bellingham",
  "jamal-musiala",
  "lamine-yamal",
  "florian-wirtz",
  "endrick",
];
