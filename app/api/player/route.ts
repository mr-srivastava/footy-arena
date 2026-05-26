import { fetchQuery } from 'convex/nextjs';
import { NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api';
import type { Doc, Id } from '@/convex/_generated/dataModel';
import { BsdApiError, hasBsdToken } from '@/lib/bsd/client';
import { toConvexCountrySnapshot } from '@/lib/bsd/convex-snapshots';
import { enrichPlayer } from '@/lib/bsd/normalize-player';

type PlayerRequestBody = {
  playerId?: string;
  player?: Doc<'players'>;
};

function playerInputError() {
  return NextResponse.json(
    { detail: 'Provide either playerId or player' },
    { status: 400 },
  );
}

async function loadCountryForPlayer(player: Doc<'players'>) {
  const country = await fetchQuery(api.countries.getById, {
    countryId: player.countryId,
  });

  return country ? toConvexCountrySnapshot(country) : null;
}

async function enrichPlayerResponse(player: Doc<'players'>) {
  const country = await loadCountryForPlayer(player);
  const result = await enrichPlayer(player, country);
  return NextResponse.json(result);
}

async function handleEnrichmentRequest(getPlayer: () => Promise<Doc<'players'> | null | undefined>) {
  if (!hasBsdToken()) {
    return NextResponse.json(
      { detail: 'BSD_API_TOKEN is required for player enrichment' },
      { status: 503 },
    );
  }

  try {
    const player = await getPlayer();

    if (!player) {
      return NextResponse.json({ detail: 'Player not found' }, { status: 404 });
    }

    return await enrichPlayerResponse(player);
  } catch (error) {
    if (error instanceof BsdApiError) {
      return NextResponse.json(
        { detail: error.message },
        { status: error.status },
      );
    }

    const detail =
      error instanceof Error ? error.message : 'Failed to load player';
    return NextResponse.json({ detail }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const playerId = new URL(request.url).searchParams.get('playerId');

  if (!playerId) {
    return playerInputError();
  }

  return handleEnrichmentRequest(async () =>
    fetchQuery(api.players.getById, {
      playerId: playerId as Id<'players'>,
    }),
  );
}

export async function POST(request: Request) {
  let body: PlayerRequestBody;
  try {
    body = (await request.json()) as PlayerRequestBody;
  } catch {
    return NextResponse.json({ detail: 'Invalid JSON body' }, { status: 400 });
  }

  if (body.player) {
    return handleEnrichmentRequest(async () => body.player);
  }

  if (body.playerId) {
    return handleEnrichmentRequest(async () =>
      fetchQuery(api.players.getById, {
        playerId: body.playerId as Id<'players'>,
      }),
    );
  }

  return playerInputError();
}
