"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { BsdPlayerDetailCard } from "@/components/lab/bsd/player-detail-card";
import {
  BsdPlayerStatsTable,
  BsdStatsSummary,
} from "@/components/lab/bsd/player-stats-table";
import type { BsdPlayerEnrichment, TeamEnrichmentPayload } from "@/lib/bsd/enrichment-types";
import { artifactSurface, cn } from "@/lib/utils";

export function PlayerComparisonTable({ enrichment }: { enrichment: TeamEnrichmentPayload }) {
  if (enrichment.players.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No players in Convex for this team yet.
      </p>
    );
  }

  return (
    <div className={artifactSurface("overflow-hidden")}>
      <div className="hidden border-b border-white/8 px-4 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground md:grid md:grid-cols-[minmax(0,1.4fr)_3rem_minmax(0,0.9fr)_5.5rem_minmax(0,1fr)_4rem_2rem] md:gap-3">
        <span>Convex player</span>
        <span>#</span>
        <span>Position</span>
        <span>Match</span>
        <span>BSD player</span>
        <span>Apps</span>
        <span className="sr-only">Expand</span>
      </div>

      <div className="divide-y divide-white/6">
        {enrichment.players.map((row) => (
          <PlayerComparisonRow key={row.convexPlayerId} row={row} />
        ))}
      </div>
    </div>
  );
}

function PlayerComparisonRow({ row }: { row: BsdPlayerEnrichment }) {
  const [open, setOpen] = useState(false);
  const matched = row.bsd != null;

  return (
    <article>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="grid w-full grid-cols-1 gap-3 px-4 py-4 text-left transition-colors hover:bg-white/3 md:grid-cols-[minmax(0,1.4fr)_3rem_minmax(0,0.9fr)_5.5rem_minmax(0,1fr)_4rem_2rem] md:items-center"
      >
        <div className="min-w-0">
          <p className="font-medium text-foreground">{row.convex.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground md:hidden">
            {row.convex.detailedPosition} · {row.convex.club}
          </p>
        </div>

        <span className="font-mono text-sm text-muted-foreground">
          {row.convex.jerseyNumber ?? "—"}
        </span>

        <span className="text-sm text-muted-foreground">{row.convex.detailedPosition}</span>

        <MatchBadge matched={matched} score={row.matchScore} />

        <span className="truncate text-sm text-foreground">
          {row.bsd?.short_name ?? "—"}
        </span>

        <span className="text-sm text-muted-foreground">
          {row.statsSummary.appearances > 0 ? row.statsSummary.appearances : "—"}
        </span>

        <ChevronDown
          className={cn(
            "hidden h-4 w-4 text-muted-foreground transition-transform md:block",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="space-y-4 border-t border-white/8 bg-background/20 px-4 py-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <ConvexSnapshot row={row} />
            {row.bsd ? (
              <BsdPlayerDetailCard player={row.bsd} />
            ) : (
              <div className="rounded-sm border border-dashed border-white/12 bg-background/20 p-4 text-sm text-muted-foreground">
                No BSD match found for this Convex player. Review the name or national-team
                mapping.
              </div>
            )}
          </div>

          {row.bsd ? (
            <section className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                Recent match stats
              </p>
              <BsdStatsSummary {...row.statsSummary} />
              <BsdPlayerStatsTable stats={row.stats} />
            </section>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function MatchBadge({
  matched,
  score,
}: {
  matched: boolean;
  score: number | null;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit rounded-sm px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em]",
        matched ? "bg-pitch/15 text-pitch-bright" : "bg-red/10 text-red",
      )}
    >
      {matched ? `${score}%` : "None"}
    </span>
  );
}

function ConvexSnapshot({ row }: { row: BsdPlayerEnrichment }) {
  const fields = [
    ["Age", String(row.convex.age)],
    ["Position", row.convex.position],
    ["Detailed", row.convex.detailedPosition],
    ["Foot", row.convex.preferredFoot],
    ["Club", row.convex.club],
    ["League", row.convex.league],
    ["Club country", row.convex.clubCountry],
  ] as const;

  return (
    <div className="rounded-sm border border-white/8 bg-background/25 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Convex record
      </p>
      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-0.5 text-sm font-medium text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
