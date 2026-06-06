import { fetchQuery } from "convex/nextjs";
import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { BsdApiError } from "@/lib/bsd/client";
import { loadTeamInsight } from "@/lib/bsd/insights";
import { toTeam } from "@/lib/teams/map";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const country = await fetchQuery(api.countries.getBySlug, {
      slug: slug.toLowerCase(),
    });

    if (!country) {
      return NextResponse.json({ detail: "Team not found" }, { status: 404 });
    }

    const insight = await loadTeamInsight(toTeam(country));
    return NextResponse.json({ insight });
  } catch (error) {
    if (error instanceof BsdApiError) {
      return NextResponse.json({ detail: error.message }, { status: error.status });
    }

    const detail = error instanceof Error ? error.message : "Failed to load team insight";
    return NextResponse.json({ detail }, { status: 500 });
  }
}
