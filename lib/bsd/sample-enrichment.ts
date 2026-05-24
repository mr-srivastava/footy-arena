import type {
  BsdPlayerListItem,
  BsdPlayerStatRow,
  BsdPlayerEnrichment,
  ConvexCountrySnapshot,
  ConvexPlayerSnapshot,
  TeamEnrichmentPayload,
} from "@/lib/bsd/enrichment-types";

const sampleStats: BsdPlayerStatRow[] = [
  {
    id: 1,
    player_id: 1234,
    event_id: 1001,
    team_id: 463,
    minutes_played: 90,
    rating: 7.8,
    goals: 1,
    goal_assist: 1,
    expected_goals: 0.62,
    expected_assists: 0.41,
    total_shots: 4,
    shots_on_target: 2,
    total_pass: 38,
    accurate_pass: 32,
    key_pass: 3,
    total_tackle: 1,
    interception: 0,
    yellow_card: 0,
    red_card: 0,
    saves: null,
  },
  {
    id: 2,
    player_id: 1234,
    event_id: 1002,
    team_id: 463,
    minutes_played: 78,
    rating: 7.2,
    goals: 0,
    goal_assist: 0,
    expected_goals: 0.28,
    expected_assists: 0.12,
    total_shots: 2,
    shots_on_target: 1,
    total_pass: 41,
    accurate_pass: 35,
    key_pass: 1,
    total_tackle: 0,
    interception: 1,
    yellow_card: 0,
    red_card: 0,
    saves: null,
  },
];

const sampleDetails: Record<string, BsdPlayerListItem> = {
  "vinícius júnior": {
    id: 1234,
    name: "Vinícius José Paixão de Oliveira Júnior",
    short_name: "Vinícius Júnior",
    position: "F",
    specific_position: "LW",
    jersey_number: 7,
    date_of_birth: "2000-07-12",
    height_cm: 176,
    weight_kg: 73,
    preferred_foot: "right",
    nationality: "Brazil",
    current_team_id: 266,
    national_team_id: 463,
    market_value_eur: 170000000,
    contract_until: "2027-06-30",
    availability: "available",
  },
  "christian pulisic": {
    id: 2101,
    name: "Christian Pulisic",
    short_name: "Christian Pulisic",
    position: "F",
    specific_position: "LW",
    jersey_number: 10,
    date_of_birth: "1998-09-18",
    height_cm: 177,
    weight_kg: 73,
    preferred_foot: "right",
    nationality: "United States",
    current_team_id: 489,
    national_team_id: 512,
    market_value_eur: 55000000,
    contract_until: "2027-06-30",
    availability: "available",
  },
};

function normalize(value: string) {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

function buildSampleEnrichment(
  country: ConvexCountrySnapshot,
  players: ConvexPlayerSnapshot[],
): TeamEnrichmentPayload {
  const enriched: BsdPlayerEnrichment[] = players.map((player) => {
    const detail = sampleDetails[normalize(player.name)] ?? null;
    const stats = detail?.id === 1234 ? sampleStats : [];

    return {
      convexPlayerId: player.id,
      convex: player,
      bsd: detail,
      matchScore: detail ? 95 : null,
      stats,
      statsSummary: {
        appearances: stats.length,
        goals: stats.reduce((sum, row) => sum + row.goals, 0),
        assists: stats.reduce((sum, row) => sum + row.goal_assist, 0),
        avgRating:
          stats.length > 0
            ? Number(
                (
                  stats.reduce((sum, row) => sum + (row.rating ?? 0), 0) /
                  stats.length
                ).toFixed(2),
              )
            : null,
      },
    };
  });

  const matched = enriched.filter((row) => row.bsd).length;
  const withStats = enriched.filter((row) => row.stats.length > 0).length;

  return {
    country,
    bsdNationalTeamId: country.slug === "bra" ? 463 : country.slug === "usa" ? 512 : null,
    bsdNationalTeamName:
      country.slug === "bra" ? "Brazil" : country.slug === "usa" ? "United States" : null,
    players: enriched,
    summary: {
      total: enriched.length,
      matched,
      withStats,
    },
  };
}

export function sampleTeamEnrichment(
  country: ConvexCountrySnapshot,
  players: ConvexPlayerSnapshot[],
) {
  return buildSampleEnrichment(country, players);
}
