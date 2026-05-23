import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { PlayerProfile } from "@/lib/discovery/types";
import { artifactSurface } from "@/lib/utils";

export function PlayerCard({ player }: { player: PlayerProfile }) {
  return (
    <Link href={`/players/${player.slug}`} className="group block h-full">
      <article
        className={artifactSurface(
          "relative flex h-full min-h-64 flex-col overflow-hidden transition-colors group-hover:border-gold/35",
        )}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-pitch-bright/14 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-2 top-7 font-display text-7xl leading-none text-white/[0.025] group-hover:text-gold/[0.05]"
          aria-hidden
        >
          {player.nation.slice(0, 3).toUpperCase()}
        </div>
        <div className="relative flex items-center justify-between border-b border-white/8 px-5 py-3">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold">
            {player.nation}
          </span>
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {player.position}
          </span>
        </div>
        <div className="relative flex flex-1 flex-col p-5">
          <h3 className="font-display text-3xl leading-none tracking-wide text-foreground transition-colors group-hover:text-gold">
            {player.name.toUpperCase()}
          </h3>
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
