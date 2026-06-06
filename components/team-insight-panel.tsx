import { Activity, Goal, Shield, Trophy } from "lucide-react";
import type { TeamInsight } from "@/lib/bsd/enrichment-types";
import { FormStrip } from "@/components/form-strip";
import { StatCard } from "@/components/stat-card";
import { SubsectionTitle } from "@/components/subsection-title";
import { Card, CardContent } from "@/components/ui/card";
import { DetailList, DetailListItem } from "@/components/detail-list";

export function TeamInsightPanel({ insight }: { insight: TeamInsight | null }) {
  if (!insight) {
    return null;
  }

  return (
    <section className="mb-10 flex flex-col gap-6">
      <Card variant="artifact" shape="artifact" className="surface-sage-glow">
        <CardContent className="p-6 md:p-7">
          <SubsectionTitle level="panel" icon={Activity}>
            TOURNAMENT BRIEF
          </SubsectionTitle>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-2xl border border-line-strong bg-black/15 p-5">
              <p className="broadcast-label text-gold">Recent form</p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <FormStrip results={insight.recentForm} />
                <p className="text-sm text-muted-foreground">
                  Last five: <span className="font-semibold text-foreground">{insight.recentRecord}</span>
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <StatCard
                value={insight.bestFinish}
                label="Best finish"
                icon={Trophy}
                layout="stacked"
              />
              <StatCard
                value={insight.worldCupAppearances}
                label="Appearances"
                icon={Shield}
                layout="stacked"
              />
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <StatCard value={insight.unbeatenStreak} label="Unbeaten streak" icon={Shield} />
            <StatCard value={insight.goalsForRecent} label="Goals scored" icon={Goal} />
            <StatCard value={insight.goalsAgainstRecent} label="Goals conceded" icon={Goal} accent="text-red" />
          </div>
        </CardContent>
      </Card>

      <Card variant="artifact" shape="artifact">
        <CardContent className="p-6 md:p-7">
          <SubsectionTitle level="panel" icon={Trophy}>
            TOURNAMENT HISTORY
          </SubsectionTitle>
          <DetailList className="mt-5">
            {insight.history.map((entry) => (
              <DetailListItem key={entry.year} className="grid gap-3 py-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                <div>
                  <p className="font-display text-3xl text-gold">{entry.year}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{entry.stage}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {entry.matches} matches · {entry.wins}W {entry.draws}D {entry.losses}L · {entry.goalsFor}:{entry.goalsAgainst} goals
                </p>
                <p className="text-sm font-semibold text-foreground">GD {entry.goalDifference >= 0 ? "+" : ""}{entry.goalDifference}</p>
              </DetailListItem>
            ))}
          </DetailList>
        </CardContent>
      </Card>
    </section>
  );
}
