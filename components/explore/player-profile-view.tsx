"use client";

import { ArrowLeft, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  PlayerHeroBadges,
  PlayerProfilePanel,
} from "@/components/explore/player-profile-panel";
import { PlayerPortrait } from "@/components/player-portrait";
import { Card, CardContent } from "@/components/ui/card";
import { getPlayerImage } from "@/lib/discovery";
import { exploreCardSubtitle } from "@/lib/explore/load-players";
import type { ExplorePlayerCard } from "@/lib/explore/types";
import { explorePlayersQueryOptions } from "@/lib/query/explore-players";

function PlayerHeroPortrait({
  player,
  imageSrc,
}: {
  player: ExplorePlayerCard;
  imageSrc?: string;
}) {
  const displayName = player.shortName ?? player.name;

  if (imageSrc) {
    if (player.bsdPlayerId && player.imageUrl === imageSrc) {
      return (
        <div className="relative overflow-hidden border-b border-line-soft md:border-b-0 md:border-r">
          <div className="relative mx-auto aspect-square w-full max-w-xs bg-[radial-gradient(ellipse_at_50%_92%,rgba(107,158,135,0.28),transparent_68%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_36%)] sm:max-w-sm md:mx-0 md:max-w-none">
            <Image
              src={imageSrc}
              alt={displayName}
              fill
              priority
              className="object-contain object-bottom p-6"
              sizes="(max-width: 768px) 72vw, 260px"
            />
          </div>
        </div>
      );
    }

    return (
      <PlayerPortrait
        player={{ name: displayName }}
        src={imageSrc}
        variant="hero"
        priority
        className="border-b border-line-soft md:border-b-0 md:border-r"
      />
    );
  }

  return (
    <div className="flex aspect-square w-full max-w-xs items-center justify-center border-b border-line-soft bg-linear-to-br from-pitch/15 via-navy to-navy-light/40 md:max-w-none md:border-b-0 md:border-r">
      <UserRound className="h-16 w-16 text-muted-foreground/60" aria-hidden />
    </div>
  );
}

export function PlayerProfileView({ initialPlayer }: { initialPlayer: ExplorePlayerCard }) {
  const { data: players = [initialPlayer], isFetching } = useQuery(
    explorePlayersQueryOptions([initialPlayer.slug], [initialPlayer]),
  );
  const player = players[0] ?? initialPlayer;

  const displayName = player.shortName ?? player.name;
  const imageSrc = player.imageUrl ?? getPlayerImage(player.slug);
  const headline = player.editorial?.archetype
    ? player.editorial.archetype
    : exploreCardSubtitle(player);

  return (
    <div className={isFetching ? "opacity-90 transition-opacity" : undefined}>
      <div className="animate-fade-up py-10 md:py-14">
        <Link
          href="/explore"
          className="mb-8 inline-flex items-center gap-2 rounded-sm border border-line-strong bg-surface-glass px-3 py-2 text-sm text-muted transition-colors hover:border-gold/35 hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Explore
        </Link>

        <Card
          variant="artifact"
          shape="artifact"
          padding="none"
          className="md:grid md:grid-cols-[minmax(220px,260px)_1fr] md:items-stretch"
        >
          <PlayerHeroPortrait player={player} imageSrc={imageSrc} />

          <CardContent className="relative flex flex-col justify-center p-6 md:p-8">
            <div
              className="surface-watermark pointer-events-none absolute -right-2 top-4 font-display text-7xl leading-none"
              aria-hidden
            >
              {player.fifaCode}
            </div>
            <p className="section-eyebrow">{player.nation}</p>
            <h1 className="mt-2 font-display text-5xl tracking-wide text-foreground md:text-6xl">
              {displayName.toUpperCase()}
            </h1>
            <PlayerHeroBadges player={player} />
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              {headline}
            </p>
          </CardContent>
        </Card>
      </div>

      <PlayerProfilePanel player={player} />
    </div>
  );
}
