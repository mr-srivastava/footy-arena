"use client";

import SoccerLineUp from "react-soccer-lineup";
import type { MatchLineupSide } from "@/lib/bsd/enrichment-types";
import { PITCH_COLOR } from "@/lib/lineup/constants";
import {
  hasRenderableLineup,
  mapLineupSideToTeam,
} from "@/lib/lineup/map-to-soccer-lineup";

export function MatchLineupPitch({
  home,
  away,
}: {
  home: MatchLineupSide | null;
  away: MatchLineupSide | null;
}) {
  if (!hasRenderableLineup(home) && !hasRenderableLineup(away)) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-2xl border border-line-strong bg-black/15 px-6 py-10 text-center text-sm text-muted-foreground">
        Lineup visualization will appear once projected XIs are published.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line-strong bg-black/15 [&_.rsl-pitch]:mx-auto [&_.rsl-pitch]:max-w-full">
      <SoccerLineUp
        size="responsive"
        color={PITCH_COLOR}
        pattern="lines"
        orientation="horizontal"
        homeTeam={home ? mapLineupSideToTeam(home, false) : undefined}
        awayTeam={away ? mapLineupSideToTeam(away, true) : undefined}
      />
    </div>
  );
}
