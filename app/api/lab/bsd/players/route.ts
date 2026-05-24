import { NextResponse } from "next/server";
import { hasBsdToken } from "@/lib/bsd/client";
import type {
  ConvexCountrySnapshot,
  ConvexPlayerSnapshot,
} from "@/lib/bsd/enrichment-types";
import { enrichTeamPlayers } from "@/lib/bsd/players";

type EnrichRequestBody = {
  country: ConvexCountrySnapshot;
  players: ConvexPlayerSnapshot[];
  includeStats?: boolean;
};

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ detail: "Not found" }, { status: 404 });
  }

  if (!hasBsdToken()) {
    return NextResponse.json(
      { detail: "BSD_API_TOKEN is required for enrichment" },
      { status: 503 },
    );
  }

  let body: EnrichRequestBody;
  try {
    body = (await request.json()) as EnrichRequestBody;
  } catch {
    return NextResponse.json({ detail: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.country?.slug || !Array.isArray(body.players)) {
    return NextResponse.json({ detail: "country and players are required" }, { status: 400 });
  }

  try {
    const payload = await enrichTeamPlayers({
      country: body.country,
      players: body.players,
      includeStats: body.includeStats ?? true,
    });

    return NextResponse.json(payload);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Enrichment failed";
    return NextResponse.json({ detail }, { status: 500 });
  }
}
