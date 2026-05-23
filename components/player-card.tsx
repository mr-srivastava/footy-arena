import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { PlayerProfile } from "@/lib/discovery/types";

export function PlayerCard({ player }: { player: PlayerProfile }) {
  return (
    <Link href={`/players/${player.slug}`} className="group block h-full">
      <Card accent="pitch" interactive padding="none" className="h-full">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-pitch-bright/15 to-transparent"
          aria-hidden
        />
        <CardContent className="relative p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            {player.nation}
          </p>
          <h3 className="mt-1 font-display text-2xl tracking-wide text-foreground transition-colors group-hover:text-gold">
            {player.name.toUpperCase()}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {player.position} · {player.archetype}
          </p>
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {player.whyExcited}
          </p>
        </CardContent>
        <CardFooter className="relative border-0 bg-transparent px-5 pb-5 pt-0">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-pitch-bright">
            Watch for: {player.watchFor}
            <ChevronRight
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
