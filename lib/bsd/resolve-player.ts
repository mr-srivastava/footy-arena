import { bsdFetch } from '@/lib/bsd/client';
import {
  createClubLookupCaches,
  resolveClubPlayerDetails,
  type ClubLookupCaches,
} from '@/lib/bsd/club-lookup';
import {
  BSD_TEAM_NAME_ALIASES,
  iso2ForFifa,
} from '@/lib/bsd/fifa-nation';
import type {
  BsdMatchConfidence,
  BsdMatchStrategy,
  BsdPlayerListItem,
  BsdPlayersListResponse,
  BsdTeamListItem,
  ConvexCountrySnapshot,
  ConvexPlayerSnapshot,
  BsdPlayerResolution,
} from '@/lib/bsd/enrichment-types';
import {
  pickBestPlayerMatch,
  playerSearchTerm,
  scorePlayerCandidate,
} from '@/lib/bsd/match-player';
import { getWorldCupNationalTeams } from '@/lib/bsd/national-teams';

const MIN_MATCH_SCORE = 55;
const CONSENSUS_BONUS = 15;

type StrategyMatch = {
  strategy: Exclude<BsdMatchStrategy, 'consensus'>;
  bsdPlayer: BsdPlayerListItem;
  team: BsdTeamListItem | null;
  score: number;
};

function normalizeTeamName(value: string) {
  return value.trim().toLowerCase();
}

async function resolveNationalTeam(country: ConvexCountrySnapshot) {
  const teams = await getWorldCupNationalTeams();
  const names = new Set(
    [
      country.displayName,
      country.fifaCode,
      ...(BSD_TEAM_NAME_ALIASES[country.fifaCode] ?? []),
    ]
      .filter(Boolean)
      .map(normalizeTeamName),
  );

  const match = teams.find((team) => {
    const teamNames = [team.name, team.short_name, team.country].map(normalizeTeamName);
    return teamNames.some((name) => names.has(name));
  });

  return match ?? null;
}

async function searchBsdPlayers(params: {
  name: string;
  nationalTeamId?: number | null;
  nationalityCode?: string | null;
  limit?: number;
}) {
  const query = new URLSearchParams();
  query.set('name', playerSearchTerm(params.name));
  query.set('limit', String(params.limit ?? 15));
  if (params.nationalTeamId) {
    query.set('national_team_id', String(params.nationalTeamId));
  }
  if (params.nationalityCode) {
    query.set('nationality_code', params.nationalityCode);
  }

  const data = await bsdFetch<BsdPlayersListResponse>(`players?${query.toString()}`);
  return data.results;
}

async function matchViaNationalTeam(
  player: ConvexPlayerSnapshot,
  country: ConvexCountrySnapshot,
  nationalTeamId: number | null,
  clubTeamId: number | null,
): Promise<StrategyMatch | null> {
  const nationalityCode = iso2ForFifa(country.fifaCode);
  const context = {
    clubTeamId,
    nationalTeamId,
  };

  let candidates = await searchBsdPlayers({
    name: player.name,
    nationalTeamId,
    nationalityCode,
  });

  if (candidates.length === 0 && nationalTeamId) {
    candidates = await searchBsdPlayers({
      name: player.name,
      nationalityCode,
    });
  }

  if (candidates.length === 0) {
    candidates = await searchBsdPlayers({
      name: player.name,
    });
  }

  if (player.jerseyNumber != null) {
    const byNumber = candidates.find(
      (candidate) => candidate.jersey_number === player.jerseyNumber,
    );
    if (byNumber) {
      const score = scorePlayerCandidate(player, byNumber, context);
      if (score >= MIN_MATCH_SCORE) {
        return {
          strategy: 'national',
          bsdPlayer: byNumber,
          team: null,
          score: Math.max(score, 90),
        };
      }
    }
  }

  const match = pickBestPlayerMatch(player, candidates, MIN_MATCH_SCORE, context);
  if (!match) {
    return null;
  }

  return {
    strategy: 'national',
    bsdPlayer: match.player,
    team: null,
    score: match.score,
  };
}

function confidenceFromScore(
  score: number,
  strategy: BsdMatchStrategy,
): BsdMatchConfidence {
  if (strategy === 'consensus' || score >= 90) {
    return 'high';
  }
  if (score >= 75) {
    return 'medium';
  }
  return 'low';
}

function reconcileMatches(
  clubMatch: StrategyMatch | null,
  nationalMatch: StrategyMatch | null,
): BsdPlayerResolution {
  if (clubMatch && nationalMatch) {
    if (clubMatch.bsdPlayer.id === nationalMatch.bsdPlayer.id) {
      const score = Math.min(
        Math.max(clubMatch.score, nationalMatch.score) + CONSENSUS_BONUS,
        100,
      );
      return {
        team: clubMatch.team,
        bsdPlayer: clubMatch.bsdPlayer,
        match: {
          bsdPlayerId: clubMatch.bsdPlayer.id,
          score,
          confidence: 'high',
          strategy: 'consensus',
        },
      };
    }

    const winner = clubMatch.score >= nationalMatch.score ? clubMatch : nationalMatch;
    return {
      team: winner.team,
      bsdPlayer: winner.bsdPlayer,
      match: {
        bsdPlayerId: winner.bsdPlayer.id,
        score: winner.score,
        confidence: 'medium',
        strategy: winner.strategy,
      },
    };
  }

  const winner = clubMatch ?? nationalMatch;
  if (!winner) {
    return {
      team: null,
      bsdPlayer: null,
      match: {
        bsdPlayerId: null,
        score: null,
        confidence: null,
        strategy: null,
      },
    };
  }

  return {
    team: winner.team,
    bsdPlayer: winner.bsdPlayer,
    match: {
      bsdPlayerId: winner.bsdPlayer.id,
      score: winner.score,
      confidence: confidenceFromScore(winner.score, winner.strategy),
      strategy: winner.strategy,
    },
  };
}

export async function resolveBsdPlayer(input: {
  player: ConvexPlayerSnapshot;
  country?: ConvexCountrySnapshot | null;
  nationalTeamId?: number | null;
  caches?: ClubLookupCaches;
}): Promise<BsdPlayerResolution> {
  const caches = input.caches ?? createClubLookupCaches();
  const clubResult = await resolveClubPlayerDetails(input.player, caches);

  const clubMatch =
    clubResult.bsdPlayer && clubResult.score != null
      ? {
          strategy: 'club' as const,
          bsdPlayer: clubResult.bsdPlayer,
          team: clubResult.team,
          score: clubResult.score,
        }
      : null;

  let nationalMatch: StrategyMatch | null = null;
  if (input.country) {
    const nationalTeamId =
      input.nationalTeamId ??
      (await resolveNationalTeam(input.country))?.id ??
      null;

    nationalMatch = await matchViaNationalTeam(
      input.player,
      input.country,
      nationalTeamId,
      clubResult.team?.id ?? null,
    );
  }

  return reconcileMatches(clubMatch, nationalMatch);
}
