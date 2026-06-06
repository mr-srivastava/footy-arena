import { NextResponse } from "next/server";
import { BsdApiError } from "@/lib/bsd/client";
import { loadMatchInsight } from "@/lib/bsd/insights";
import { getWorldCupFixtures } from "@/lib/openfootball/fixtures";
import { getWorldCupTeams } from "@/lib/openfootball/teams";

type RouteContext = {
  params: Promise<{ fixtureId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { fixtureId } = await context.params;

  try {
    const [{ fixtures }, { byName }] = await Promise.all([
      getWorldCupFixtures(),
      getWorldCupTeams(),
    ]);
    const fixture = fixtures.find((entry) => entry.id === fixtureId);

    if (!fixture) {
      return NextResponse.json(
        { detail: "Fixture not found" },
        { status: 404 },
      );
    }

    const insight = await loadMatchInsight(fixture, byName);
    return NextResponse.json({ insight });
  } catch (error) {
    if (error instanceof BsdApiError) {
      return NextResponse.json(
        { detail: error.message },
        { status: error.status },
      );
    }

    const detail =
      error instanceof Error ? error.message : "Failed to load match insight";
    return NextResponse.json({ detail }, { status: 500 });
  }
}
