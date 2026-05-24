import { fetchQuery } from "convex/nextjs";
import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { toLabTeamSnapshot } from "@/lib/bsd/convex-snapshots";

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }

  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ detail: "Missing slug" }, { status: 400 });
  }

  const data = await fetchQuery(api.teams.getTeamPageData, {
    slug: slug.toLowerCase(),
  });

  if (!data) {
    return NextResponse.json({ detail: "Team not found" }, { status: 404 });
  }

  return NextResponse.json(toLabTeamSnapshot(data));
}
