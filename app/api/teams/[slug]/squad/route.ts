import { fetchQuery } from "convex/nextjs";
import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { BsdApiError } from "@/lib/bsd/client";
import { loadEnrichedTeamSquad } from "@/lib/tournament/load-squad";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const teamPageData = await fetchQuery(api.teams.getTeamPageData, {
      slug: slug.toLowerCase(),
    });

    if (!teamPageData) {
      return NextResponse.json({ detail: "Team not found" }, { status: 404 });
    }

    const payload = await loadEnrichedTeamSquad(teamPageData);
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
