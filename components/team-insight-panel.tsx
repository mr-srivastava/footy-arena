import {
  Activity,
  CalendarDays,
  ChevronDown,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FormStrip } from "@/components/form-strip";
import { SubsectionTitle } from "@/components/subsection-title";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DetailList, DetailListItem } from "@/components/detail-list";
import { TeamCrest } from "@/components/team-crest";
import { StatCard } from "@/components/stat-card";
import type { TeamEditorialInsight } from "@/lib/bsd/insights";
import type { TeamHistoryEntry } from "@/lib/bsd/enrichment-types";
import type {
  TeamAnalyticsPayload,
  FormResult,
} from "@/lib/bsd/team-analytics";
import {
  formatFixtureDate,
  resultForTeam,
  resultLabel,
  sortFixturesByMostRecent,
} from "@/lib/bsd/team-analytics";

function formBadgeClass(result: FormResult) {
  if (result === "W")
    return "border-pitch-bright/30 bg-pitch-bright/12 text-pitch-bright";
  if (result === "D") return "border-gold/30 bg-gold/10 text-gold";
  return "border-red/30 bg-red/10 text-red";
}

function abbreviateStage(stage: string) {
  const labels: Record<string, string> = {
    Winners: "Winners",
    "Runners-up": "Runners-up",
    "Third place": "3rd",
    "Fourth place": "4th",
    "Semi-finals": "SF",
    "Quarter-finals": "QF",
    "Round of 16": "R16",
    "Group stage": "Groups",
    "Second group stage": "2nd grp",
  };
  return labels[stage] ?? stage;
}

function stageTone(stage: string) {
  if (stage === "Winners") {
    return {
      tile: "border-gold/45 bg-gold/10 shadow-gold-glow",
      year: "text-gold",
      label: "text-gold",
    };
  }
  if (stage === "Runners-up" || stage === "Third place") {
    return {
      tile: "border-gold/25 bg-gold/6",
      year: "text-gold",
      label: "text-foreground/85",
    };
  }
  if (
    stage === "Semi-finals" ||
    stage === "Quarter-finals" ||
    stage === "Round of 16"
  ) {
    return {
      tile: "border-pitch-bright/28 bg-pitch-bright/8",
      year: "text-pitch-bright",
      label: "text-foreground/80",
    };
  }
  return {
    tile: "border-line-strong bg-black/15",
    year: "text-foreground",
    label: "text-muted-foreground",
  };
}

function TeamTournamentHistory({ history }: { history: TeamHistoryEntry[] }) {
  return (
    <Card variant="artifact" shape="artifact" className="surface-gold-glow">
      <CardContent className="p-6 md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SubsectionTitle level="panel" icon={Trophy}>
            TOURNAMENT HISTORY
          </SubsectionTitle>
          <p className="type-micro font-semibold uppercase tracking-[var(--tracking-label)] text-muted-foreground">
            {history.length} {history.length === 1 ? "campaign" : "campaigns"}
          </p>
        </div>

        <div className="relative mt-6 min-w-0">
          <div
            className="pointer-events-none absolute inset-x-0 top-[2.125rem] z-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-artifact via-artifact/80 to-transparent"
            aria-hidden
          />
          <ol
            className="history-carousel-track relative z-[1] flex min-w-0 gap-2.5 overflow-x-auto overscroll-x-contain pb-1 pr-6 sm:gap-3"
            aria-label="World Cup appearances by year"
          >
            {history.map((entry) => {
              const tone = stageTone(entry.stage);
              const campaignSummary =
                entry.matches > 0
                  ? `${entry.stage}, ${entry.matches} matches, ${entry.wins} wins, ${entry.draws} draws, ${entry.losses} losses, ${entry.goalsFor} goals for, ${entry.goalsAgainst} goals against, goal difference ${entry.goalDifference >= 0 ? "+" : ""}${entry.goalDifference}`
                  : entry.stage;

              return (
                <li
                  key={entry.year}
                  className="history-carousel-slide-item shrink-0 snap-start"
                >
                  <div
                    aria-label={`${entry.year}: ${campaignSummary}`}
                    title={campaignSummary}
                    className={cn(
                      "flex h-[5.5rem] w-[4.75rem] flex-col items-center justify-center gap-1 rounded-xl border px-1.5 py-2 text-center sm:h-[5.75rem] sm:w-[5.25rem]",
                      tone.tile,
                    )}
                  >
                    <p
                      className={cn(
                        "type-broadcast text-[1.5rem] leading-none sm:text-[1.65rem]",
                        tone.year,
                      )}
                    >
                      {entry.year}
                    </p>
                    <p
                      className={cn(
                        "type-micro line-clamp-2 font-semibold uppercase leading-snug tracking-[0.08em]",
                        tone.label,
                      )}
                    >
                      {abbreviateStage(entry.stage)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

function latestResultsFromAnalytics(
  analytics: NonNullable<TeamAnalyticsPayload["analytics"]>,
) {
  return sortFixturesByMostRecent(
    analytics.byCompetition.flatMap((competition) =>
      competition.fixtures.map((fixture) => ({
        fixture,
        leagueName: competition.leagueName,
      })),
    ),
  );
}

export function TeamFormBrief({
  editorial,
  analytics,
}: {
  editorial: TeamEditorialInsight | null;
  analytics: TeamAnalyticsPayload | null;
}) {
  const stats = analytics?.analytics;
  const hasEditorial = editorial != null;
  const hasForm = stats != null && stats.recentForm.length > 0;

  if (!hasEditorial && !hasForm && !stats) {
    return null;
  }

  return (
    <section className="mb-10 flex flex-col gap-6">
      <Card variant="artifact" shape="artifact" className="surface-sage-glow">
        <CardContent className="p-6 md:p-7">
          <SubsectionTitle level="panel" icon={Activity}>
            TOURNAMENT BRIEF
          </SubsectionTitle>

          <div className="space-after-panel-title grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            {hasForm ? (
              <div className="rounded-2xl border border-line-strong bg-black/15 p-5">
                <p className="broadcast-label text-gold">Recent form</p>
                <div className="space-after-label flex flex-wrap items-center gap-x-4 gap-y-3">
                  <FormStrip results={stats.recentForm} />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {resultLabel(stats.recentForm)}
                    </span>{" "}
                    · {stats.unbeatenStreak} unbeaten
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-line-strong bg-black/15 p-5">
                <p className="broadcast-label text-gold">Recent form</p>
                <p className="space-after-label text-sm text-muted-foreground">
                  Form data will appear once recent match results are available.
                </p>
              </div>
            )}

            {hasEditorial ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-line-strong bg-black/15 p-5">
                  <p className="broadcast-label text-gold">Best finish</p>
                  <p className="space-after-label font-display text-4xl leading-none text-pitch-bright md:text-5xl">
                    {editorial.bestFinish}
                  </p>
                </div>
                <div className="rounded-2xl border border-line-strong bg-black/15 p-5">
                  <p className="broadcast-label text-gold">Appearances</p>
                  <p className="space-after-label font-display text-4xl leading-none text-pitch-bright md:text-5xl">
                    {editorial.worldCupAppearances}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {stats ? (
            <div className="mt-5">
              <div className="flex flex-wrap gap-x-6 gap-y-4">
                <StatCard
                  value={stats.played}
                  label="Played"
                  icon={CalendarDays}
                />
                <StatCard
                  value={`${stats.wins}-${stats.draws}-${stats.losses}`}
                  label="Record (2023–26)"
                  icon={TrendingUp}
                />
                <StatCard
                  value={stats.goalsFor}
                  label="Goals for"
                  icon={TrendingUp}
                />
                <StatCard
                  value={stats.goalsAgainst}
                  label="Goals against"
                  icon={TrendingUp}
                  accent="text-red"
                />
                <StatCard
                  value={`${stats.goalDifference >= 0 ? "+" : ""}${stats.goalDifference}`}
                  label="Goal diff"
                  icon={TrendingUp}
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Based on finished matches since Jan 2023.
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {hasEditorial && editorial.history.length > 0 ? (
        <TeamTournamentHistory history={editorial.history} />
      ) : null}
    </section>
  );
}

export function TeamRecentResults({
  analytics,
  teamId,
  limit = 8,
  className,
}: {
  analytics: TeamAnalyticsPayload | null;
  teamId: number;
  limit?: number;
  className?: string;
}) {
  if (!analytics?.analytics || teamId === 0) {
    return null;
  }

  const latestResults = latestResultsFromAnalytics(analytics.analytics).slice(
    0,
    limit,
  );
  if (latestResults.length === 0) {
    return null;
  }

  return (
    <section className={cn("mt-10", className)}>
      <div className="mb-6">
        <SubsectionTitle level="panel" icon={CalendarDays}>
          RECENT RESULTS
        </SubsectionTitle>
        <p className="mt-1 text-sm text-muted">
          All competitions · finished matches
        </p>
      </div>
      <DetailList>
        {latestResults.map(({ fixture, leagueName }) => {
          const result = resultForTeam(fixture, teamId);
          const isHome = fixture.home_team_id === teamId;
          const opponent = isHome ? fixture.away_team : fixture.home_team;
          const opponentTeamId = isHome
            ? fixture.away_team_id
            : fixture.home_team_id;
          const goalsFor = isHome ? fixture.home_score : fixture.away_score;
          const goalsAgainst = isHome ? fixture.away_score : fixture.home_score;

          return (
            <DetailListItem
              key={fixture.id}
              className="grid gap-3 py-4 md:grid-cols-[auto_auto_1fr_auto] md:items-center"
            >
              <p className="text-sm text-muted-foreground">
                {formatFixtureDate(fixture.event_date)}
              </p>
              {result ? (
                <Badge variant="outline" className={formBadgeClass(result)}>
                  {result}
                </Badge>
              ) : (
                <span />
              )}
              <div>
                <p className="flex items-center gap-2 font-medium text-foreground">
                  <TeamCrest
                    teamId={opponentTeamId}
                    name={opponent}
                    size="sm"
                  />
                  <span>
                    {isHome ? "vs" : "@"} {opponent}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">{leagueName}</p>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {goalsFor}–{goalsAgainst}
              </p>
            </DetailListItem>
          );
        })}
      </DetailList>
    </section>
  );
}

export function TeamCompetitionBreakdown({
  analytics,
}: {
  analytics: TeamAnalyticsPayload | null;
}) {
  const competitions = analytics?.analytics?.byCompetition ?? [];
  if (competitions.length === 0) {
    return null;
  }

  return (
    <details className="group mt-8 rounded-2xl border border-line-strong bg-black/10">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 marker:content-none [&::-webkit-details-marker]:hidden">
        <div>
          <SubsectionTitle level="label" icon={TrendingUp}>
            Competition breakdown
          </SubsectionTitle>
          <p className="mt-1 text-sm text-muted">
            {competitions.length} competitions since 2023
          </p>
        </div>
        <ChevronDown
          className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="border-t border-line-soft px-5 pb-5">
        <DetailList>
          {competitions.map((competition) => (
            <DetailListItem
              key={competition.leagueId}
              className="space-y-2 py-4"
            >
              <p className="font-medium text-foreground">
                {competition.leagueName}
              </p>
              <p className="text-sm text-muted-foreground">
                {competition.played} played · {competition.wins}-
                {competition.draws}-{competition.losses} ·{" "}
                {competition.goalsFor}-{competition.goalsAgainst}
              </p>
            </DetailListItem>
          ))}
        </DetailList>
      </div>
    </details>
  );
}
