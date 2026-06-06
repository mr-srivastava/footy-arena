import { NextResponse } from "next/server";
import { loadExplorePlayersBySlugs } from "@/lib/explore/load-players";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slugsParam = url.searchParams.get("slugs");
  const includePerformance = url.searchParams.get("includePerformance") === "true";

  if (!slugsParam) {
    return NextResponse.json({ detail: "Missing slugs query parameter" }, { status: 400 });
  }

  const slugs = slugsParam
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);

  if (slugs.length === 0) {
    return NextResponse.json({ players: [] });
  }

  try {
    const players = await loadExplorePlayersBySlugs(slugs, { includePerformance });
    return NextResponse.json({ players });
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Failed to load explore players";
    return NextResponse.json({ detail }, { status: 500 });
  }
}
