import { bsdFetch } from '@/lib/bsd/client';
import type {
  BsdLeaguesListResponse,
  BsdPlayerListItem,
  BsdPlayersListResponse,
  BsdTeamListItem,
  BsdTeamsListResponse,
  ConvexPlayerSnapshot,
} from '@/lib/bsd/enrichment-types';
import { pickBestPlayerMatch, scoreTextMatch } from '@/lib/bsd/match-player';

function getOrSet<K, V>(
  cache: Map<K, Promise<V>>,
  key: K,
  factory: () => Promise<V>,
): Promise<V> {
  if (!cache.has(key)) {
    cache.set(key, factory());
  }

  return cache.get(key)!;
}

export type ClubLookupCaches = {
  leaguesByCountry: Map<string, Promise<BsdLeaguesListResponse>>;
  teamsByLeagueAndClub: Map<string, Promise<BsdTeamsListResponse>>;
  playersByTeamAndName: Map<string, Promise<BsdPlayersListResponse>>;
};

export function createClubLookupCaches(): ClubLookupCaches {
  return {
    leaguesByCountry: new Map(),
    teamsByLeagueAndClub: new Map(),
    playersByTeamAndName: new Map(),
  };
}

export async function fetchLeaguesByCountry(country: string) {
  const query = new URLSearchParams();
  query.set('country', country.toLowerCase());

  return bsdFetch<BsdLeaguesListResponse>(`leagues?${query.toString()}`);
}

export async function fetchTeamsByLeagueAndName(
  leagueId: number,
  name: string,
) {
  const query = new URLSearchParams();
  query.set('league_id', String(leagueId));
  query.set('name', name);

  return bsdFetch<BsdTeamsListResponse>(`teams?${query.toString()}`);
}

export async function fetchPlayersByNameAndTeam(name: string, teamId: number) {
  const query = new URLSearchParams();
  query.set('name', name);
  query.set('team_id', String(teamId));

  return bsdFetch<BsdPlayersListResponse>(`players?${query.toString()}`);
}

function pickBestLeague(leagues: BsdLeaguesListResponse['results'], clubLeague: string) {
  let best: { league: (typeof leagues)[number]; score: number } | null = null;

  for (const league of leagues) {
    const score = scoreTextMatch(clubLeague, league.name);
    if (score < 70) continue;
    if (!best || score > best.score) {
      best = { league, score };
    }
  }

  return best;
}

function pickBestTeam(teams: BsdTeamListItem[], club: string) {
  let best: { team: BsdTeamListItem; score: number } | null = null;

  for (const team of teams) {
    const score = Math.max(
      scoreTextMatch(club, team.name),
      scoreTextMatch(club, team.short_name),
    );
    if (score < 70) continue;
    if (!best || score > best.score) {
      best = { team, score };
    }
  }

  return best;
}

export type ClubPlayerLookupResult = {
  team: BsdTeamListItem | null;
  bsdPlayer: BsdPlayerListItem | null;
  score: number | null;
};

export async function resolveClubPlayerDetails(
  player: ConvexPlayerSnapshot,
  caches: ClubLookupCaches,
): Promise<ClubPlayerLookupResult> {
  const leagues = await getOrSet(caches.leaguesByCountry, player.clubCountry, () =>
    fetchLeaguesByCountry(player.clubCountry),
  );
  const leagueMatch = pickBestLeague(leagues.results, player.league);

  if (!leagueMatch) {
    return { team: null, bsdPlayer: null, score: null };
  }

  const teamKey = `${leagueMatch.league.id}:${player.club}`;
  const teams = await getOrSet(caches.teamsByLeagueAndClub, teamKey, () =>
    fetchTeamsByLeagueAndName(leagueMatch.league.id, player.club),
  );
  const teamMatch = pickBestTeam(teams.results, player.club);

  if (!teamMatch) {
    return { team: null, bsdPlayer: null, score: null };
  }

  const playerKey = `${teamMatch.team.id}:${player.name}`;
  const players = await getOrSet(caches.playersByTeamAndName, playerKey, () =>
    fetchPlayersByNameAndTeam(player.name, teamMatch.team.id),
  );
  const playerMatch = pickBestPlayerMatch(player, players.results, 55, {
    clubTeamId: teamMatch.team.id,
  });

  if (!playerMatch) {
    return { team: teamMatch.team, bsdPlayer: null, score: null };
  }

  return {
    team: teamMatch.team,
    bsdPlayer: playerMatch.player,
    score: playerMatch.score,
  };
}
