import {
  BSD_PLAYER_PORTRAIT_OPTIONS,
  formatPlayerMetaLine,
  playerImageUrl,
} from "@/lib/bsd/format";
import { loadPlayerPerformance } from "@/lib/bsd/insights";
import { normalizedPlayerFromCallup } from "@/lib/bsd/team-seeds";
import type { NormalizedPlayer } from "@/lib/bsd/enrichment-types";
import { teamPageHrefFromNation } from "@/lib/teams/metadata";
import {
  getCachedAllWorldCupCallups,
  getCachedPlayerDetail,
} from "@/lib/bsd/cache";
import { getAllWorldCupCallups } from "@/lib/bsd/worldcup";
import { getWorldCupTeams } from "@/lib/openfootball/teams";
import { PLAYERS } from "@/lib/discovery/content/players";
import type { PlayerProfile } from "@/lib/discovery/types";
import { playerSlugFromName } from "@/lib/explore/player-slug";
import type { ExplorePlayerCard } from "@/lib/explore/types";

type WorldCupCallupEntry = Awaited<
  ReturnType<typeof getAllWorldCupCallups>
>[number];

function editorialBySlug() {
  return new Map(PLAYERS.map((player) => [player.slug, player]));
}

export function explorePlayerCardFromProfile(
  profile: PlayerProfile,
): ExplorePlayerCard {
  const teamHref = teamPageHrefFromNation(profile.nation);

  return {
    id: profile.slug,
    slug: profile.slug,
    name: profile.name,
    nation: profile.nation,
    countrySlug: teamHref?.replace("/teams/", "") ?? "",
    nationBsdTeamId: null,
    clubTeamId: null,
    fifaCode: profile.fifaCode ?? "",
    position: profile.position,
    detailedPosition: profile.position,
    club: "",
    league: "",
    clubCountry: "",
    age: 0,
    enriched: false,
    editorial: {
      archetype: profile.archetype,
      whyExcited: profile.whyExcited,
      watchFor: profile.watchFor,
      similarEnergy: profile.similarEnergy,
    },
    playerHref: `/players/${profile.slug}`,
    teamHref,
  };
}

export function exploreCardSubtitle(player: ExplorePlayerCard) {
  return formatPlayerMetaLine({
    detailedPosition: player.detailedPosition,
    club: player.club,
    age: player.age,
    heightCm: player.heightCm,
    preferredFoot: player.preferredFoot,
    marketValueEur: player.marketValueEur,
  });
}

function toExplorePlayerCard(input: {
  slug: string;
  player: NormalizedPlayer;
  team: Awaited<ReturnType<typeof getWorldCupTeams>>["teams"][number];
  editorial?: PlayerProfile;
  enriched: boolean;
}): ExplorePlayerCard {
  const { slug, player, team, editorial, enriched } = input;
  const bsdPlayerId = player.bzzoiro?.playerId;

  return {
    id: player.id,
    slug,
    name: player.name,
    shortName: player.shortName ?? undefined,
    nation: team.displayName,
    countrySlug: team.slug,
    nationBsdTeamId: team.bsdTeamId ?? null,
    clubTeamId: player.club.bzzoiroTeamId ?? null,
    fifaCode: team.fifa_code,
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
    imageUrl: bsdPlayerId
      ? playerImageUrl(bsdPlayerId, BSD_PLAYER_PORTRAIT_OPTIONS)
      : undefined,
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
    teamHref: `/teams/${team.slug}`,
  };
}

async function loadPlayerDetail(playerId: number | null) {
  if (!playerId) {
    return null;
  }
  return getCachedPlayerDetail(playerId);
}

async function buildCallupBySlugMap() {
  const callups = await getCachedAllWorldCupCallups();
  const callupBySlug = new Map<string, WorldCupCallupEntry>();
  for (const callup of callups) {
    const slug = playerSlugFromName(callup.name);
    if (!callupBySlug.has(slug)) {
      callupBySlug.set(slug, callup);
    }
  }
  return callupBySlug;
}

async function loadExplorePlayerEntries(slugs: string[]) {
  if (slugs.length === 0) {
    return [] as Array<{
      slug: string;
      callup: WorldCupCallupEntry;
      team: Awaited<ReturnType<typeof getWorldCupTeams>>["teams"][number];
      editorial?: PlayerProfile;
    }>;
  }

  const [{ teams }, callupBySlug] = await Promise.all([
    getWorldCupTeams(),
    buildCallupBySlugMap(),
  ]);

  const teamById = new Map(
    teams
      .filter((team) => team.bsdTeamId != null)
      .map((team) => [team.bsdTeamId!, team]),
  );
  const editorial = editorialBySlug();

  return slugs.flatMap((slug) => {
    const callup = callupBySlug.get(slug);
    const team = callup ? teamById.get(callup.team_id) : undefined;
    if (!callup || !team) {
      return [];
    }

    return [{ slug, callup, team, editorial: editorial.get(slug) }];
  });
}

export async function loadExplorePlayerShellBySlug(
  slug: string,
): Promise<ExplorePlayerCard | null> {
  const [player] = await loadExplorePlayersBySlugs([slug]);
  return player ?? null;
}

export async function loadExplorePlayersBySlugs(
  slugs: string[],
  options?: { includePerformance?: boolean },
): Promise<ExplorePlayerCard[]> {
  if (slugs.length === 0) {
    return [];
  }

  const matched = await loadExplorePlayerEntries(slugs);
  if (matched.length === 0) {
    return [];
  }

  const details = await Promise.all(
    matched.map((entry) => loadPlayerDetail(entry.callup.player_id)),
  );

  const cards = await Promise.all(
    matched.map(async (entry, index) => {
      const normalized = normalizedPlayerFromCallup(
        entry.callup,
        details[index] ?? null,
        entry.team.slug,
      );
      const baseCard = toExplorePlayerCard({
        slug: entry.slug,
        player: normalized,
        team: entry.team,
        editorial: entry.editorial,
        enriched: Boolean(entry.callup.player_id),
      });

      if (!options?.includePerformance || !normalized.bzzoiro?.playerId) {
        return baseCard;
      }

      const performance = await loadPlayerPerformance(
        normalized.bzzoiro.playerId,
        {
          availability: normalized.bzzoiro.availability,
          strengths: normalized.bzzoiro.strengths,
          weaknesses: normalized.bzzoiro.weaknesses,
        },
      );

      return {
        ...baseCard,
        formRating: performance?.formRating ?? null,
        seasonAverageRating: performance?.seasonAverageRating ?? null,
        recentAppearances: performance?.recentAppearances ?? [],
        nationalTeamRecord: performance?.nationalTeamRecord ?? null,
        strengths:
          performance?.strengths ?? normalized.bzzoiro?.strengths ?? [],
        weaknesses:
          performance?.weaknesses ?? normalized.bzzoiro?.weaknesses ?? [],
      };
    }),
  );

  const cardBySlug = new Map(cards.map((card) => [card.slug, card]));
  return slugs
    .map((slug) => cardBySlug.get(slug))
    .filter((card): card is ExplorePlayerCard => card != null);
}
