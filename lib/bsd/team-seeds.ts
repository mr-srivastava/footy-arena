import { BSD_POSITION_LABELS } from "@/lib/bsd/constants";
import type {
  NormalizedPlayer,
  TeamIdentity,
  TeamPlayerSeed,
} from "@/lib/bsd/enrichment-types";
import {
  normalizePlayer,
  normalizePreferredFoot,
} from "@/lib/bsd/normalize-player";
import {
  bsdPlayerDetailToListItem,
  type BsdPlayerDetail,
} from "@/lib/bsd/player-detail";
import type { BsdWorldCupSquadRow } from "@/lib/bsd/worldcup";
import type { Team } from "@/lib/openfootball/types";

export function toTeamIdentity(team: Team): TeamIdentity {
  return {
    slug: team.slug,
    displayName: team.displayName,
    fifaCode: team.fifa_code,
    groupLetter: team.group,
  };
}

export function toTeamPlayerSeed(
  player: BsdWorldCupSquadRow,
  detail?: BsdPlayerDetail | null,
): TeamPlayerSeed {
  return {
    id: String(
      detail?.id ?? player.player_id ?? `${player.team_id}-${player.name}`,
    ),
    name: detail?.name ?? player.name,
    jerseyNumber: detail?.jersey_number ?? player.jersey_number ?? null,
    age: player.age,
    position: BSD_POSITION_LABELS[player.position] ?? player.position,
    detailedPosition:
      detail?.specific_position ??
      BSD_POSITION_LABELS[player.position] ??
      player.position,
    preferredFoot: normalizePreferredFoot(detail?.preferred_foot) ?? "",
    club: player.club,
    league: "",
    clubCountry: player.club_country,
    positionGroup: player.position,
    isCaptain: false,
  };
}

export function normalizedPlayerFromCallup(
  player: BsdWorldCupSquadRow,
  detail: BsdPlayerDetail | null,
  countrySlug: string,
): NormalizedPlayer {
  const seed: TeamPlayerSeed = {
    ...toTeamPlayerSeed(player, detail),
    countryId: countrySlug,
  };
  const normalized = normalizePlayer(
    seed,
    null,
    detail ? bsdPlayerDetailToListItem(detail) : null,
  );

  if (normalized.bzzoiro || player.player_id == null) {
    return normalized;
  }

  return {
    ...normalized,
    bzzoiro: {
      playerId: player.player_id,
      dateOfBirth: player.date_of_birth,
      heightCm: null,
      weightKg: null,
      nationality: "",
      marketValueEur: null,
      contractUntil: null,
      availability: "available",
      attributes: null,
      strengths: [],
      weaknesses: [],
    },
  };
}
