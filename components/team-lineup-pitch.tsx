"use client";

import { LayoutGrid, UserRound } from "lucide-react";
import { PlayerPortrait } from "@/components/player-portrait";
import { SubsectionTitle } from "@/components/subsection-title";
import { Card, CardContent } from "@/components/ui/card";
import type { TeamManagerSummary } from "@/lib/bsd/team-analytics";
import { PITCH_COLOR } from "@/lib/lineup/constants";
import {
  hasRenderableLineup,
  mapLineupSideToRows,
  type PitchLineupPlayer,
  type PitchLineupSquad,
} from "@/lib/lineup/map-to-soccer-lineup";
import {
  resolveFormation,
  squadToPotentialLineup,
} from "@/lib/lineup/squad-to-potential-lineup";
import type { TeamSquad } from "@/lib/tournament/types";

function pitchPlayerKey(player: PitchLineupPlayer, index: number) {
  return player.playerId ?? `${player.name}-${player.number ?? index}`;
}

function PitchPlayerMarker({ player }: { player: PitchLineupPlayer }) {
  return (
    <div className="flex w-11 shrink-0 flex-col items-center gap-2 sm:w-14">
      <PlayerPortrait
        playerId={player.playerId}
        name={player.name}
        number={player.number}
        size="sm"
        variant="pitch"
      />
      <span className="type-micro line-clamp-2 max-w-full text-center font-semibold uppercase leading-snug tracking-[0.06em] text-foreground/90">
        {player.name}
      </span>
    </div>
  );
}

function LineupRow({ players }: { players: PitchLineupPlayer[] }) {
  if (players.length === 0) return null;

  return (
    <div className="flex min-h-[3.5rem] items-start justify-center gap-1 overflow-x-auto px-0.5 sm:min-h-[4rem] sm:gap-2 sm:px-1">
      {players.map((player, index) => (
        <PitchPlayerMarker
          key={pitchPlayerKey(player, index)}
          player={player}
        />
      ))}
    </div>
  );
}

function CompactLineupPitch({ rows }: { rows: PitchLineupSquad }) {
  const midfieldRows = [
    { key: "cam", players: rows.cam },
    { key: "cm", players: rows.cm },
    { key: "cdm", players: rows.cdm },
  ].filter((row) => row.players.length > 0);

  return (
    <div className="mx-auto w-full max-w-[500px]">
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-line-strong shadow-artifact-inset"
        style={{ backgroundColor: PITCH_COLOR }}
      >
        <div
          className="pointer-events-none absolute inset-3 rounded-xl border border-line-soft"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-1/2 right-3 left-3 h-px -translate-y-1/2 bg-line-soft"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line-soft"
          aria-hidden
        />

        <div className="absolute inset-3 flex flex-col justify-between gap-1 py-4 sm:gap-2 sm:py-5">
          <LineupRow players={rows.fw} />
          {midfieldRows.map((row) => (
            <LineupRow key={row.key} players={row.players} />
          ))}
          <LineupRow players={rows.df} />
          <LineupRow players={rows.gk ? [rows.gk] : []} />
        </div>
      </div>
    </div>
  );
}

export function TeamPotentialLineupPitch({
  squad,
  teamName,
  managerAnalytics,
}: {
  squad: TeamSquad;
  teamName: string;
  managerAnalytics?: TeamManagerSummary | null;
}) {
  const lineup = squadToPotentialLineup(squad, teamName, managerAnalytics);
  const formation = resolveFormation(squad, managerAnalytics);

  if (!lineup || !hasRenderableLineup(lineup)) {
    return (
      <Card variant="artifact" shape="artifact" className="surface-sage-glow">
        <CardContent className="p-6 md:p-7">
          <SubsectionTitle level="panel" icon={LayoutGrid}>
            PROJECTED XI
          </SubsectionTitle>
          <p className="space-after-panel-title text-sm leading-relaxed text-muted-foreground">
            A potential lineup will appear once enough squad players are
            available to project a starting eleven.
          </p>
        </CardContent>
      </Card>
    );
  }

  const rows = mapLineupSideToRows(lineup);

  return (
    <Card variant="artifact" shape="artifact" className="surface-sage-glow">
      <CardContent className="p-6 md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SubsectionTitle level="panel" icon={LayoutGrid}>
            PROJECTED XI
          </SubsectionTitle>
          <p className="type-micro font-semibold uppercase leading-snug tracking-[var(--tracking-label)] text-muted-foreground">
            {formation} · projected
          </p>
        </div>
        <p className="mt-2 inline-icon-row items-center gap-1.5 text-sm text-muted-foreground">
          <UserRound className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span className="min-w-0 text-pretty">
            Built from the current squad list and manager formation preference.
          </span>
        </p>
        <div className="mt-5 rounded-2xl border border-line-strong bg-black/15 p-4 sm:p-5">
          <CompactLineupPitch rows={rows} />
        </div>
      </CardContent>
    </Card>
  );
}
