import { CloudSun, Goal, Sparkles, Users } from "lucide-react";
import type { MatchInsight, MatchLineupSide } from "@/lib/bsd/enrichment-types";
import { MatchLineupPitch } from "@/components/match-lineup-pitch";
import { FormStrip } from "@/components/form-strip";
import { TeamCrest } from "@/components/team-crest";
import { SubsectionTitle } from "@/components/subsection-title";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function probabilityLabel(value: number | null) {
  return value == null ? "—" : `${Math.round(value * 100)}%`;
}

function LineupSideMeta({
  side,
  form,
}: {
  side: MatchLineupSide | null;
  form: Array<"W" | "D" | "L">;
}) {
  if (!side) {
    return (
      <p className="text-sm text-muted-foreground">
        Lineup pending for this side.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="inline-icon-row gap-2.5 editorial-title type-card-title text-foreground">
            <TeamCrest
              teamId={side.teamId}
              name={side.teamName}
              size="sm"
              className="mt-1 shrink-0"
            />
            <span className="min-w-0 text-balance">{side.teamName}</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {side.formation
              ? `Formation ${side.formation}`
              : "Formation pending"}
          </p>
        </div>
        <div className="shrink-0">
          <FormStrip results={form} compact />
        </div>
      </div>

      {side.substitutes.length ? (
        <div>
          <p className="broadcast-label text-gold">Bench</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {side.substitutes.map((player) => (
              <Badge
                key={`${player.name}-${player.playerId ?? "sub"}`}
                variant="meta"
                className="h-auto rounded-sm px-3 py-1"
              >
                {player.name}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {side.unavailable.length ? (
        <div>
          <p className="broadcast-label text-red">Unavailable</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {side.unavailable.map((player) => (
              <Badge
                key={`${player.name}-${player.playerId ?? "out"}`}
                variant="code"
                className="bg-red/10 text-red"
              >
                {player.name}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function MatchInsightPanel({
  insight,
  venueFallback,
}: {
  insight: MatchInsight | null;
  venueFallback: string;
}) {
  if (!insight) {
    return (
      <Card variant="artifact" shape="artifact">
        <CardContent className="p-6">
          <SubsectionTitle level="panel" icon={Sparkles}>
            MATCH INTEL
          </SubsectionTitle>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            BSD enrichment is not available for this fixture yet. The match
            shell still uses the confirmed World Cup schedule.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <Card variant="artifact" shape="artifact" className="surface-sage-glow">
        <CardContent className="p-6 md:p-7">
          <SubsectionTitle level="panel" icon={Sparkles}>
            MATCH INTEL
          </SubsectionTitle>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-line-strong bg-black/15 p-5">
              <p className="broadcast-label text-gold">Prediction</p>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                <p>
                  Home:{" "}
                  <span className="font-semibold text-foreground">
                    {probabilityLabel(
                      insight.prediction?.homeWinProbability ?? null,
                    )}
                  </span>
                </p>
                <p>
                  Draw:{" "}
                  <span className="font-semibold text-foreground">
                    {probabilityLabel(
                      insight.prediction?.drawProbability ?? null,
                    )}
                  </span>
                </p>
                <p>
                  Away:{" "}
                  <span className="font-semibold text-foreground">
                    {probabilityLabel(
                      insight.prediction?.awayWinProbability ?? null,
                    )}
                  </span>
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-line-strong bg-black/15 p-5">
              <p className="broadcast-label text-gold">Venue</p>
              <p className="mt-3 text-lg text-foreground">
                {insight.venueName ?? venueFallback}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {insight.weatherDescription ?? "Weather pending"}
              </p>
            </div>
            <div className="rounded-2xl border border-line-strong bg-black/15 p-5">
              <p className="broadcast-label text-gold">Travel context</p>
              <p className="mt-3 text-lg text-foreground">
                {insight.travelDistanceKm != null
                  ? `${Math.round(insight.travelDistanceKm)} km`
                  : "Not published"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {insight.temperatureC != null
                  ? `${insight.temperatureC}°C expected`
                  : "Temperature pending"}
              </p>
            </div>
          </div>

          {insight.aiPreview ? (
            <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/6 p-5">
              <p className="broadcast-label text-gold">Pre-match framing</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                {insight.aiPreview}
              </p>
            </div>
          ) : null}

          {insight.funFacts.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {insight.funFacts.slice(0, 4).map((fact) => (
                <Badge
                  key={fact}
                  variant="meta"
                  className="h-auto rounded-sm px-3 py-2 text-left leading-relaxed"
                >
                  {fact}
                </Badge>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card variant="artifact" shape="artifact">
        <CardContent className="p-5 md:p-6">
          <SubsectionTitle level="label" icon={Users}>
            Projected lineups
          </SubsectionTitle>
          <div className="mt-5">
            <MatchLineupPitch
              home={insight.lineups.home}
              away={insight.lineups.away}
            />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <LineupSideMeta
              side={insight.lineups.home}
              form={insight.teamInsights.home?.recentForm ?? []}
            />
            <LineupSideMeta
              side={insight.lineups.away}
              form={insight.teamInsights.away?.recentForm ?? []}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card variant="artifact" shape="artifact">
          <CardContent className="p-5">
            <SubsectionTitle level="label" icon={Goal}>
              Recent scoring
            </SubsectionTitle>
            <div className="mt-4 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <TeamCrest
                  teamId={insight.homeTeamId}
                  name={insight.homeTeam}
                  size="xs"
                />
                <span>
                  {insight.homeTeam}:{" "}
                  <span className="font-semibold text-foreground">
                    {insight.teamInsights.home?.goalsForRecent ?? "—"}
                  </span>
                </span>
              </p>
              <p className="mt-2 flex items-center gap-2">
                <TeamCrest
                  teamId={insight.awayTeamId}
                  name={insight.awayTeam}
                  size="xs"
                />
                <span>
                  {insight.awayTeam}:{" "}
                  <span className="font-semibold text-foreground">
                    {insight.teamInsights.away?.goalsForRecent ?? "—"}
                  </span>
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
        <Card variant="artifact" shape="artifact">
          <CardContent className="p-5">
            <SubsectionTitle level="label" icon={Users}>
              Streaks
            </SubsectionTitle>
            <div className="mt-4 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <TeamCrest
                  teamId={insight.homeTeamId}
                  name={insight.homeTeam}
                  size="xs"
                />
                <span>
                  {insight.homeTeam}:{" "}
                  <span className="font-semibold text-foreground">
                    {insight.teamInsights.home?.unbeatenStreak ?? 0} unbeaten
                  </span>
                </span>
              </p>
              <p className="mt-2 flex items-center gap-2">
                <TeamCrest
                  teamId={insight.awayTeamId}
                  name={insight.awayTeam}
                  size="xs"
                />
                <span>
                  {insight.awayTeam}:{" "}
                  <span className="font-semibold text-foreground">
                    {insight.teamInsights.away?.unbeatenStreak ?? 0} unbeaten
                  </span>
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
        <Card variant="artifact" shape="artifact">
          <CardContent className="p-5">
            <SubsectionTitle level="label" icon={CloudSun}>
              Lineup status
            </SubsectionTitle>
            <p className="mt-4 text-sm text-muted-foreground">
              {insight.lineupStatus ?? "Pending"}
            </p>
            {insight.prediction?.predictedResult ? (
              <p className="mt-3 text-sm text-foreground">
                Likeliest result:{" "}
                <span className="font-semibold">
                  {insight.prediction.predictedResult}
                </span>
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
