import { hasBsdToken } from "@/lib/bsd/client";
import { getCachedPlayerDetail } from "@/lib/bsd/cache";
import { enrichPlayers } from "@/lib/bsd/normalize-player";
import { toTeamIdentity, toTeamPlayerSeed } from "@/lib/bsd/team-seeds";
import { loadTeamManager } from "@/lib/bsd/team-analytics";
import {
  getWorldCupTeamSquad,
  type BsdWorldCupSquadRow,
} from "@/lib/bsd/worldcup";
import type { Team } from "@/lib/openfootball/types";
import type { SquadManager, TeamSquadPayload } from "@/lib/tournament/types";

function inferSquadStatus(players: BsdWorldCupSquadRow[]) {
  return players.some((player) => player.status === "official")
    ? "announced"
    : "pending";
}

async function loadManager(teamId: number): Promise<SquadManager | undefined> {
  const manager = await loadTeamManager(teamId).catch(() => null);
  if (!manager) return undefined;

  return {
    name: manager.name,
    nationality: manager.country,
    preferredFormation: manager.preferred_formation,
    tacticalProfile: manager.tactical_profile,
    careerRecord: `${manager.wins}-${manager.draws}-${manager.losses}`,
    winPct: manager.win_pct,
  };
}

function fallbackPayload(
  team: Team,
  squad: Awaited<ReturnType<typeof getWorldCupTeamSquad>>,
  manager?: SquadManager,
): TeamSquadPayload {
  const players = squad.results.map((player) => ({
    player: {
      id: String(player.player_id ?? `${player.team_id}-${player.name}`),
      name: player.name,
      shortName: null,
      jerseyNumber: player.jersey_number ?? null,
      age: player.age,
      position: player.position,
      positionGroup: player.position,
      detailedPosition: player.position,
      preferredFoot: "",
      club: {
        name: player.club,
        country: player.club_country,
        league: "",
        bzzoiroTeamId: null,
        venueId: null,
      },
      countryId: team.slug,
      isCaptain: false,
      previousWorldCupsCount: 0,
      previousWorldCupsList: [],
      bzzoiro: null,
    },
    match: null,
  }));

  return {
    country: toTeamIdentity(team),
    status: inferSquadStatus(squad.results),
    manager,
    source: "fallback",
    players,
    summary: {
      total: players.length,
      matched: 0,
    },
  };
}

export async function loadEnrichedTeamSquad(
  team: Team,
): Promise<TeamSquadPayload | null> {
  if (!team.bsdTeamId || !hasBsdToken()) {
    return null;
  }

  const [squad, manager] = await Promise.all([
    getWorldCupTeamSquad(team.bsdTeamId),
    loadManager(team.bsdTeamId),
  ]);

  if (squad.count === 0) {
    return {
      country: toTeamIdentity(team),
      status: "pending",
      manager,
      source: "fallback",
      players: [],
      summary: {
        total: 0,
        matched: 0,
      },
    };
  }

  const linkedPlayers = squad.results.filter(
    (player) => player.player_id != null,
  );
  const detailsById = new Map<
    number,
    Awaited<ReturnType<typeof getCachedPlayerDetail>>
  >();

  await Promise.all(
    linkedPlayers.map(async (player) => {
      const detail = await getCachedPlayerDetail(player.player_id!);
      detailsById.set(player.player_id!, detail);
    }),
  );

  const seeds = squad.results.map((player) =>
    toTeamPlayerSeed(
      player,
      player.player_id != null
        ? (detailsById.get(player.player_id) ?? null)
        : null,
    ),
  );

  try {
    const enriched = await enrichPlayers(seeds, toTeamIdentity(team));

    return {
      country: toTeamIdentity(team),
      status: inferSquadStatus(squad.results),
      manager,
      source: "bsd",
      players: enriched.map(({ player, match }) => ({ player, match })),
      summary: {
        total: enriched.length,
        matched: enriched.filter((entry) => entry.match.bsdPlayerId != null)
          .length,
      },
    };
  } catch {
    return fallbackPayload(team, squad, manager);
  }
}
