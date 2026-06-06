import {
  Activity,
  CalendarDays,
  ChevronDown,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { FormStrip } from "@/components/form-strip";
import { SubsectionTitle } from "@/components/subsection-title";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DetailList, DetailListItem } from "@/components/detail-list";
import { TeamCrest } from "@/components/team-crest";
import { StatCard } from "@/components/stat-card";
import type { TeamEditorialInsight } from "@/lib/bsd/insights";
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

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            {hasForm ? (
              <div className="rounded-2xl border border-line-strong bg-black/15 p-5">
                <p className="broadcast-label text-gold">Recent form</p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
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
                <p className="mt-3 text-sm text-muted-foreground">
                  Form data will appear once recent match results are available.
                </p>
              </div>
            )}

            {hasEditorial ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-line-strong bg-black/15 p-5">
                  <p className="broadcast-label text-gold">Best finish</p>
                  <p className="mt-3 font-display text-4xl leading-none text-pitch-bright md:text-5xl">
                    {editorial.bestFinish}
                  </p>
                </div>
                <div className="rounded-2xl border border-line-strong bg-black/15 p-5">
                  <p className="broadcast-label text-gold">Appearances</p>
                  <p className="mt-3 font-display text-4xl leading-none text-pitch-bright md:text-5xl">
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
        <Card variant="artifact" shape="artifact">
          <CardContent className="p-6 md:p-7">
            <SubsectionTitle level="panel" icon={Trophy}>
              TOURNAMENT HISTORY
            </SubsectionTitle>
            <DetailList className="mt-5">
              {editorial.history.map((entry) => (
                <DetailListItem
                  key={entry.year}
                  className="grid gap-3 py-4 md:grid-cols-[auto_1fr_auto] md:items-center"
                >
                  <div>
                    <p className="font-display text-3xl text-gold">
                      {entry.year}
                    </p>
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {entry.stage}
                    </p>
                  </div>
                  {entry.matches > 0 ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        {entry.matches} matches · {entry.wins}W {entry.draws}D{" "}
                        {entry.losses}L · {entry.goalsFor}:{entry.goalsAgainst}{" "}
                        goals
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        GD {entry.goalDifference >= 0 ? "+" : ""}
                        {entry.goalDifference}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground md:col-span-2">
                      {entry.stage}
                    </p>
                  )}
                </DetailListItem>
              ))}
            </DetailList>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}

export function TeamRecentResults({
  analytics,
  teamId,
  limit = 8,
}: {
  analytics: TeamAnalyticsPayload | null;
  teamId: number;
  limit?: number;
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
    <section className="mt-10">
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
