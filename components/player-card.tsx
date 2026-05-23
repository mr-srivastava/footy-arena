import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { PlayerProfile } from "@/lib/discovery/types";

export function PlayerCard({ player }: { player: PlayerProfile }) {
  return (
    <Link
      href={`/players/${player.slug}`}
      className="glass-panel glass-panel-interactive group relative flex flex-col overflow-hidden rounded-2xl p-5"
    >
      <div
        className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-pitch-bright/15 to-transparent"
        aria-hidden
      />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold">
          {player.nation}
        </p>
        <h3 className="mt-1 font-display text-2xl tracking-wide text-foreground transition-colors group-hover:text-gold">
          {player.name.toUpperCase()}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {player.position} · {player.archetype}
        </p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
          {player.whyExcited}
        </p>
      </div>
      <span className="relative mt-4 inline-flex items-center gap-1 text-xs font-semibold text-pitch-bright">
        Watch for: {player.watchFor}
        <ChevronRight
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}
