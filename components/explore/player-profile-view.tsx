"use client";

import { ArrowLeft, ArrowUpRight, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ContentContainer } from "@/components/content-container";
import {
  PlayerHeroBadges,
  PlayerProfilePanel,
} from "@/components/explore/player-profile-panel";
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
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={displayName}
            fill
            priority
            className="portrait-shadow-hero object-contain object-bottom px-4 pt-20 md:px-10"
            sizes="(max-width: 768px) 92vw, 46vw"
          />
        </div>
      );
    }

    return (
      <div className="absolute inset-0">
        <Image
        src={imageSrc}
        alt={displayName}
        fill
        priority
        className="portrait-shadow-hero object-contain object-bottom px-4 pt-20 md:px-10"
        sizes="(max-width: 768px) 92vw, 46vw"
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <UserRound className="size-32 text-white/15" aria-hidden />
    </div>
  );
}

export function PlayerProfileView({ initialPlayer }: { initialPlayer: ExplorePlayerCard }) {
  const { data: players = [initialPlayer], isFetching } = useQuery(
    explorePlayersQueryOptions([initialPlayer.slug], [initialPlayer], {
      includePerformance: true,
    }),
  );
  const player = players[0] ?? initialPlayer;

  const displayName = player.shortName ?? player.name;
  const imageSrc = player.imageUrl ?? getPlayerImage(player.slug);
  const headline = player.editorial?.archetype
    ? player.editorial.archetype
    : exploreCardSubtitle(player);

  return (
    <div className={isFetching ? "opacity-90 transition-opacity" : undefined}>
      <section className="surface-player-hero relative isolate min-h-[76vh] overflow-hidden border-b border-line-soft">
        <div className="absolute inset-0 editorial-grid opacity-45" />
        <div className="absolute inset-y-0 right-0 w-full md:w-1/2">
          <PlayerHeroPortrait player={player} imageSrc={imageSrc} />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:bg-gradient-to-r md:from-background md:via-background/10 md:to-transparent" />
        </div>
        <ContentContainer as="div" className="flex min-h-[76vh] flex-col justify-between pb-10 pt-12 md:pb-16 md:pt-16">
          <Link
            href="/explore"
            className="relative z-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-2 text-sm text-white/75 backdrop-blur-md transition-colors hover:border-gold/40 hover:text-gold"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Explore players
          </Link>

          <div className="relative z-10 max-w-3xl">
            <p className="section-eyebrow">{player.nation}</p>
            <h1 className="editorial-title type-hero mt-4 text-white">
              {displayName}
            </h1>
            <PlayerHeroBadges player={player} />
            <p className="type-lead mt-7 max-w-xl text-white/70">
              {headline}
            </p>
            <Link href={player.teamHref} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold">
              View {player.nation}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </ContentContainer>
      </section>

      <ContentContainer className="py-14 md:py-20">
        <PlayerProfilePanel player={player} />
      </ContentContainer>
    </div>
  );
}
