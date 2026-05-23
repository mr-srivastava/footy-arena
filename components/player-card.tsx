import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { PlayerPortrait } from "@/components/player-portrait";
import { getPlayerImage } from "@/lib/discovery";
import type { PlayerProfile } from "@/lib/discovery/types";
import { artifactSurface } from "@/lib/utils";

function PlayerCardBadges({
  nation,
  position,
}: {
  nation: string;
  position: string;
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      <span className="rounded-sm border border-white/10 bg-navy/85 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold backdrop-blur-sm">
        {nation}
      </span>
      <span className="rounded-sm border border-white/10 bg-navy/85 px-2.5 py-1 text-[0.58rem] font-semibold uppercase leading-snug tracking-[0.12em] text-muted-foreground backdrop-blur-sm">
        {position}
      </span>
    </div>
  );
}

function PlayerCardFallbackHeader({ player }: { player: PlayerProfile }) {
  return (
    <div className="relative shrink-0 overflow-hidden border-b border-white/8 bg-gradient-to-br from-pitch/15 via-navy to-navy-light/40 px-5 py-5">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold">
        {player.nation}
      </p>
      <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {player.position}
      </p>
      <p className="mt-4 font-display text-4xl leading-none tracking-wide text-foreground/90">
        {player.name.toUpperCase()}
      </p>
    </div>
  );
}

export function PlayerCard({ player }: { player: PlayerProfile }) {
  const image = getPlayerImage(player.slug);

  return (
    <Link href={`/players/${player.slug}`} className="group block h-full">
      <article
        className={artifactSurface(
          "relative flex h-full min-h-64 flex-col overflow-hidden transition-colors group-hover:border-gold/35",
        )}
      >
        <div
          className="pointer-events-none absolute -right-1 top-16 z-0 font-display text-6xl leading-none text-white/[0.025] group-hover:text-gold/[0.05] sm:top-20 sm:text-7xl"
          aria-hidden
        >
          {player.nation.slice(0, 3).toUpperCase()}
        </div>

        {image ? (
          <div className="relative shrink-0 overflow-hidden border-b border-white/8">
            <PlayerPortrait
              player={{ name: player.name }}
              src={image}
              variant="card"
            />
          </div>
        ) : (
          <PlayerCardFallbackHeader player={player} />
        )}

        <div className="relative flex flex-1 flex-col p-5">
          <h3 className="font-display text-3xl leading-none tracking-wide text-foreground transition-colors group-hover:text-gold">
            {player.name.toUpperCase()}
          </h3>
          <PlayerCardBadges
            nation={player.nation}
            position={player.position}
          />
          <p className="mt-3 text-sm font-medium text-pitch-bright">
            {player.archetype}
          </p>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {player.whyExcited}
          </p>
        </div>

        <div className="relative grid grid-cols-[1fr_auto] items-center gap-3 border-t border-white/8 px-5 py-3">
          <span className="truncate text-xs font-semibold text-pitch-bright">
            Watch for: {player.watchFor}
          </span>
          <ChevronRight
            className="h-4 w-4 text-gold transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </div>
      </article>
    </Link>
  );
}
