import type { Doc } from '@/convex/_generated/dataModel';
import {
  BSD_POSITION_GROUPS,
  BSD_POSITION_LABELS,
  BSD_PREFERRED_FOOT_LABELS,
} from '@/lib/bsd/constants';
import { toConvexPlayerSnapshot } from '@/lib/bsd/convex-snapshots';
import type {
  BsdPlayerListItem,
  BsdPlayerMatchMeta,
  BsdTeamListItem,
  ConvexCountrySnapshot,
  NormalizedPlayer,
} from '@/lib/bsd/enrichment-types';
import {
  createClubLookupCaches,
  type ClubLookupCaches,
} from '@/lib/bsd/club-lookup';
import { resolveBsdPlayer } from '@/lib/bsd/resolve-player';

function normalizePreferredFoot(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return BSD_PREFERRED_FOOT_LABELS[value] ?? value;
}

export function normalizePlayer(
  player: Doc<'players'>,
  team: BsdTeamListItem | null,
  bsdPlayer: BsdPlayerListItem | null,
): NormalizedPlayer {
  const positionGroup =
    (bsdPlayer && BSD_POSITION_GROUPS[bsdPlayer.position]) || player.positionGroup;
  const position =
    (bsdPlayer && BSD_POSITION_LABELS[bsdPlayer.position]) || player.position;

  return {
    id: player._id,
    name: bsdPlayer?.name ?? player.name,
    shortName: bsdPlayer?.short_name ?? null,
    jerseyNumber: bsdPlayer?.jersey_number ?? player.jerseyNumber ?? null,
    age: player.age,
    position,
    positionGroup,
    detailedPosition: bsdPlayer?.specific_position ?? player.detailedPosition,
    preferredFoot:
      normalizePreferredFoot(bsdPlayer?.preferred_foot) ?? player.preferredFoot,
    club: {
      name: team?.name ?? player.club,
      country: team?.country ?? player.clubCountry,
      league: player.league,
      bzzoiroTeamId: team?.id ?? bsdPlayer?.current_team_id ?? null,
      venueId: team?.venue_id ?? null,
    },
    countryId: player.countryId,
    isCaptain: player.isCaptain,
    previousWorldCupsCount: player.previousWorldCupsCount,
    previousWorldCupsList: player.previousWorldCupsList,
    bzzoiro: bsdPlayer
      ? {
          playerId: bsdPlayer.id,
          dateOfBirth: bsdPlayer.date_of_birth,
          heightCm: bsdPlayer.height_cm,
          weightKg: bsdPlayer.weight_kg,
          nationality: bsdPlayer.nationality,
          marketValueEur: bsdPlayer.market_value_eur,
          contractUntil: bsdPlayer.contract_until,
          availability: bsdPlayer.availability,
          attributes: bsdPlayer.attributes ?? null,
          strengths: bsdPlayer.strengths ?? [],
          weaknesses: bsdPlayer.weaknesses ?? [],
        }
      : null,
  };
}

export type EnrichedPlayerResult = {
  player: NormalizedPlayer;
  match: BsdPlayerMatchMeta;
};

export async function enrichPlayer(
  player: Doc<'players'>,
  country?: ConvexCountrySnapshot | null,
  options?: {
    caches?: ClubLookupCaches;
    nationalTeamId?: number | null;
  },
): Promise<EnrichedPlayerResult> {
  const resolution = await resolveBsdPlayer({
    player: toConvexPlayerSnapshot(player),
    country,
    nationalTeamId: options?.nationalTeamId,
    caches: options?.caches,
  });

  return {
    player: normalizePlayer(player, resolution.team, resolution.bsdPlayer),
    match: resolution.match,
  };
}

export async function enrichPlayers(
  players: Doc<'players'>[],
  country: ConvexCountrySnapshot,
): Promise<EnrichedPlayerResult[]> {
  const caches = createClubLookupCaches();

  return Promise.all(
    players.map((player) => enrichPlayer(player, country, { caches })),
  );
}
