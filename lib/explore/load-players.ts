import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { hasBsdToken } from "@/lib/bsd/client";
import { loadPlayerPerformance } from "@/lib/bsd/insights";
import { toConvexCountrySnapshot } from "@/lib/bsd/convex-snapshots";
import { formatMarketValueEur, playerImageUrl } from "@/lib/bsd/format";
import { enrichPlayers, normalizePlayer } from "@/lib/bsd/normalize-player";
import type { NormalizedPlayer } from "@/lib/bsd/enrichment-types";
import { PLAYERS } from "@/lib/discovery/content/players";
import type { PlayerProfile } from "@/lib/discovery/types";
import { playerSlugFromName } from "@/lib/explore/player-slug";
import type { ExplorePlayerCard } from "@/lib/explore/types";

type CountryDoc = Doc<"countries">;
type PlayerDoc = Doc<"players">;

function buildPlayerLookup(players: PlayerDoc[]) {
  const bySlug = new Map<string, PlayerDoc>();

  for (const player of players) {
    const slug = player.profileSlug ?? playerSlugFromName(player.name);
    if (!bySlug.has(slug)) {
      bySlug.set(slug, player);
    }
  }

  return bySlug;
}

function editorialBySlug() {
  return new Map(PLAYERS.map((player) => [player.slug, player]));
}

function exploreCardSubtitle(player: ExplorePlayerCard) {
  const marketValue = formatMarketValueEur(player.marketValueEur);

  return [
    player.detailedPosition,
    player.club,
    player.age ? `Age ${player.age}` : null,
    player.heightCm ? `${player.heightCm} cm` : null,
    player.preferredFoot ? `${player.preferredFoot} foot` : null,
    marketValue,
  ]
    .filter(Boolean)
    .join(" · ");
}

function toExplorePlayerCard(input: {
  slug: string;
  player: NormalizedPlayer;
  country: CountryDoc;
  editorial?: PlayerProfile;
  enriched: boolean;
}): ExplorePlayerCard {
  const { slug, player, country, editorial, enriched } = input;
  const bsdPlayerId = player.bzzoiro?.playerId;

  return {
    id: player.id,
    slug,
    name: player.name,
    shortName: player.shortName ?? undefined,
    nation: country.displayName,
    countrySlug: country.slug,
    fifaCode: country.fifaCode,
    position: player.position,
    detailedPosition: player.detailedPosition,
    club: player.club.name,
    league: player.club.league,
    clubCountry: player.club.country,
    age: player.age,
    jerseyNumber: player.jerseyNumber,
    preferredFoot: player.preferredFoot || undefined,
    heightCm: player.bzzoiro?.heightCm ?? null,
    weightKg: player.bzzoiro?.weightKg ?? null,
    marketValueEur: player.bzzoiro?.marketValueEur ?? null,
    contractUntil: player.bzzoiro?.contractUntil ?? null,
    availability: player.bzzoiro?.availability,
    dateOfBirth: player.bzzoiro?.dateOfBirth ?? null,
    isCaptain: player.isCaptain,
    previousWorldCupsCount: player.previousWorldCupsCount,
    bsdPlayerId,
    imageUrl: bsdPlayerId ? playerImageUrl(bsdPlayerId) : undefined,
    enriched,
    editorial: editorial
      ? {
          archetype: editorial.archetype,
          whyExcited: editorial.whyExcited,
          watchFor: editorial.watchFor,
          similarEnergy: editorial.similarEnergy,
        }
      : undefined,
    playerHref: `/players/${slug}`,
    teamHref: `/teams/${country.slug}`,
  };
}

async function enrichPlayersByCountry(
  entries: Array<{ slug: string; player: PlayerDoc; editorial?: PlayerProfile }>,
  countryById: Map<string, CountryDoc>,
  options?: { includePerformance?: boolean },
) {
  const grouped = new Map<
    string,
    Array<{ slug: string; player: PlayerDoc; editorial?: PlayerProfile }>
  >();

  for (const entry of entries) {
    const countryId = entry.player.countryId;
    const bucket = grouped.get(countryId) ?? [];
    bucket.push(entry);
    grouped.set(countryId, bucket);
  }

  const cards: ExplorePlayerCard[] = [];

  for (const [countryId, bucket] of grouped) {
    const country = countryById.get(countryId);
    if (!country) {
      continue;
    }

    const countrySnapshot = toConvexCountrySnapshot(country);
    const players = bucket.map((entry) => entry.player);

    if (hasBsdToken()) {
      try {
        const enriched = await enrichPlayers(players, countrySnapshot);
        for (const [index, result] of enriched.entries()) {
          const performance =
            options?.includePerformance && result.player.bzzoiro?.playerId
              ? await loadPlayerPerformance(result.player.bzzoiro.playerId, {
                  availability: result.player.bzzoiro.availability,
                  strengths: result.player.bzzoiro.strengths,
                  weaknesses: result.player.bzzoiro.weaknesses,
                })
              : null;
          cards.push(
            {
              ...toExplorePlayerCard({
                slug: bucket[index]!.slug,
                player: result.player,
                country,
                editorial: bucket[index]!.editorial,
                enriched: result.match.bsdPlayerId != null,
              }),
              formRating: performance?.formRating ?? null,
              seasonAverageRating: performance?.seasonAverageRating ?? null,
              recentAppearances: performance?.recentAppearances ?? [],
              nationalTeamRecord: performance?.nationalTeamRecord ?? null,
              strengths: performance?.strengths ?? result.player.bzzoiro?.strengths ?? [],
              weaknesses: performance?.weaknesses ?? result.player.bzzoiro?.weaknesses ?? [],
            },
          );
        }
        continue;
      } catch {
        // Fall through to Convex-only normalization.
      }
    }

    for (const entry of bucket) {
      cards.push(
        toExplorePlayerCard({
          slug: entry.slug,
          player: normalizePlayer(entry.player, null, null),
          country,
          editorial: entry.editorial,
          enriched: false,
        }),
      );
    }
  }

  return cards;
}

async function loadExplorePlayerEntries(slugs: string[]) {
  if (slugs.length === 0) {
    return {
      matched: [] as Array<{ slug: string; player: PlayerDoc; editorial?: PlayerProfile }>,
      countryById: new Map<string, CountryDoc>(),
    };
  }

  const [allPlayers, countries] = await Promise.all([
    fetchQuery(api.players.listAll, {}),
    fetchQuery(api.countries.list, {}),
  ]);

  const playersBySlug = buildPlayerLookup(allPlayers);
  const editorial = editorialBySlug();
  const countryById = new Map(countries.map((country) => [country._id, country]));

  const matched = slugs.flatMap((slug) => {
    const player = playersBySlug.get(slug);
    if (!player) {
      return [];
    }

    return [{ slug, player, editorial: editorial.get(slug) }];
  });

  return { matched, countryById };
}

function buildShellExploreCards(
  entries: Array<{ slug: string; player: PlayerDoc; editorial?: PlayerProfile }>,
  countryById: Map<string, CountryDoc>,
) {
  return entries.flatMap((entry) => {
    const country = countryById.get(entry.player.countryId);
    if (!country) {
      return [];
    }

    return [
      toExplorePlayerCard({
        slug: entry.slug,
        player: normalizePlayer(entry.player, null, null),
        country,
        editorial: entry.editorial,
        enriched: false,
      }),
    ];
  });
}

async function loadExplorePlayerShellsBySlugs(
  slugs: string[],
): Promise<ExplorePlayerCard[]> {
  const { matched, countryById } = await loadExplorePlayerEntries(slugs);
  if (matched.length === 0) {
    return [];
  }

  const cards = buildShellExploreCards(matched, countryById);
  const cardsBySlug = new Map(cards.map((card) => [card.slug, card]));

  return slugs
    .map((slug) => cardsBySlug.get(slug))
    .filter((card): card is ExplorePlayerCard => card != null);
}

export async function loadExplorePlayerShellBySlug(
  slug: string,
): Promise<ExplorePlayerCard | null> {
  const [player] = await loadExplorePlayerShellsBySlugs([slug]);
  return player ?? null;
}

export async function loadExplorePlayersBySlugs(
  slugs: string[],
  options?: { includePerformance?: boolean },
): Promise<ExplorePlayerCard[]> {
  if (slugs.length === 0) {
    return [];
  }

  const { matched, countryById } = await loadExplorePlayerEntries(slugs);

  if (matched.length === 0) {
    return [];
  }

  const cards = await enrichPlayersByCountry(matched, countryById, options);
  const cardsBySlug = new Map(cards.map((card) => [card.slug, card]));

  return slugs
    .map((slug) => cardsBySlug.get(slug))
    .filter((card): card is ExplorePlayerCard => card != null);
}

export { exploreCardSubtitle };
