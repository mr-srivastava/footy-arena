import { NextResponse } from "next/server";
import { BsdApiError } from "@/lib/bsd/client";
import { getCachedTeamAnalytics } from "@/lib/bsd/cache";
import { getWorldCupTeams } from "@/lib/openfootball/teams";

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

    const payload = await getCachedTeamAnalytics(team);
    return NextResponse.json({ payload });
  } catch (error) {
    if (error instanceof BsdApiError) {
      return NextResponse.json(
        { detail: error.message },
        { status: error.status },
      );
    }

    const detail =
      error instanceof Error ? error.message : "Failed to load team insight";
    return NextResponse.json({ detail }, { status: 500 });
  }
}
