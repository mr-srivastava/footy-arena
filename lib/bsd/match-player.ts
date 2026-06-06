import { BSD_POSITION_GROUPS } from '@/lib/bsd/constants';
import type { BsdPlayerListItem, ConvexPlayerSnapshot } from '@/lib/bsd/enrichment-types';

function normalizeName(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(value: string) {
  return normalizeName(value).split(' ').filter(Boolean);
}

function scoreNameMatch(targetName: string, candidateNames: string[]) {
  const target = normalizeName(targetName);
  let best = 0;

  for (const candidateName of candidateNames) {
    const name = normalizeName(candidateName);
    if (!name) continue;

    if (name === target) best = Math.max(best, 100);
    else if (name.includes(target) || target.includes(name)) best = Math.max(best, 85);

    const targetTokens = tokens(targetName);
    const nameTokens = tokens(candidateName);
    const overlap = targetTokens.filter((token) => nameTokens.includes(token)).length;
    const ratio = overlap / Math.max(targetTokens.length, nameTokens.length, 1);
    best = Math.max(best, Math.round(ratio * 90));
  }

  return best;
}

export function playerSearchTerm(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return name.trim();
  return parts[parts.length - 1]!;
}

function scorePlayerMatch(convexName: string, candidate: BsdPlayerListItem) {
  const names = [candidate.short_name, candidate.name].filter(Boolean);
  let best = scoreNameMatch(convexName, names);

  if (
    candidate.jersey_number != null &&
    convexName.includes(String(candidate.jersey_number))
  ) {
    best += 5;
  }

  return Math.min(best, 100);
}

export function scoreTextMatch(target: string, candidate: string) {
  return scoreNameMatch(target, [candidate]);
}

type PlayerCandidateContext = {
  clubTeamId?: number | null;
  nationalTeamId?: number | null;
};

export function scorePlayerCandidate(
  player: ConvexPlayerSnapshot,
  candidate: BsdPlayerListItem,
  context: PlayerCandidateContext = {},
) {
  let score = scorePlayerMatch(player.name, candidate);

  if (
    player.jerseyNumber != null &&
    candidate.jersey_number === player.jerseyNumber
  ) {
    score += 10;
  }

  const candidateGroup = BSD_POSITION_GROUPS[candidate.position];
  if (candidateGroup && candidateGroup === player.positionGroup) {
    score += 5;
  }

  if (
    context.clubTeamId != null &&
    candidate.current_team_id === context.clubTeamId
  ) {
    score += 10;
  }

  if (
    context.nationalTeamId != null &&
    candidate.national_team_id === context.nationalTeamId
  ) {
    score += 5;
  }

  return Math.min(score, 100);
}

export function pickBestPlayerMatch(
  player: ConvexPlayerSnapshot | string,
  candidates: BsdPlayerListItem[],
  minScore = 55,
  context: PlayerCandidateContext = {},
) {
  const snapshot =
    typeof player === 'string'
      ? ({ name: player, jerseyNumber: null, positionGroup: 'MF' } as ConvexPlayerSnapshot)
      : player;

  let best: { player: BsdPlayerListItem; score: number } | null = null;

  for (const candidate of candidates) {
    const score = scorePlayerCandidate(snapshot, candidate, context);
    if (score < minScore) continue;
    if (!best || score > best.score) {
      best = { player: candidate, score };
    }
  }

  return best;
}
