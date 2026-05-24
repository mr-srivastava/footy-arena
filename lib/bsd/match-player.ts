import type { BsdPlayerListItem } from "@/lib/bsd/enrichment-types";

function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value: string) {
  return normalizeName(value).split(" ").filter(Boolean);
}

export function playerSearchTerm(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return name.trim();
  return parts[parts.length - 1]!;
}

export function scorePlayerMatch(convexName: string, candidate: BsdPlayerListItem) {
  const target = normalizeName(convexName);
  const names = [candidate.short_name, candidate.name].map(normalizeName);
  let best = 0;

  for (const name of names) {
    if (name === target) best = Math.max(best, 100);
    else if (name.includes(target) || target.includes(name)) best = Math.max(best, 85);

    const targetTokens = tokens(convexName);
    const nameTokens = tokens(candidate.short_name || candidate.name);
    const overlap = targetTokens.filter((token) => nameTokens.includes(token)).length;
    const ratio = overlap / Math.max(targetTokens.length, nameTokens.length, 1);
    best = Math.max(best, Math.round(ratio * 90));
  }

  if (
    candidate.jersey_number != null &&
    convexName.includes(String(candidate.jersey_number))
  ) {
    best += 5;
  }

  return Math.min(best, 100);
}

export function pickBestPlayerMatch(
  convexName: string,
  candidates: BsdPlayerListItem[],
  minScore = 55,
) {
  let best: { player: BsdPlayerListItem; score: number } | null = null;

  for (const candidate of candidates) {
    const score = scorePlayerMatch(convexName, candidate);
    if (score < minScore) continue;
    if (!best || score > best.score) {
      best = { player: candidate, score };
    }
  }

  return best;
}
