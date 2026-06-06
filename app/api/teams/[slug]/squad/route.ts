import { NextResponse } from "next/server";
import { BsdApiError } from "@/lib/bsd/client";
import { getWorldCupTeams } from "@/lib/openfootball/teams";
import { loadEnrichedTeamSquad } from "@/lib/tournament/load-squad";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const { teams } = await getWorldCupTeams();
    const team = teams.find((entry) => entry.slug === slug.toLowerCase());
    if (!team) {
      return NextResponse.json({ detail: "Team not found" }, { status: 404 });
    }

    const payload = await loadEnrichedTeamSquad(team);
    return NextResponse.json(payload);
  } catch (error) {
    if (error instanceof BsdApiError) {
      return NextResponse.json(
        { detail: error.message },
        { status: error.status },
      );
    }

    const detail =
      error instanceof Error ? error.message : "Failed to load team squad";
    return NextResponse.json({ detail }, { status: 500 });
  }
}
