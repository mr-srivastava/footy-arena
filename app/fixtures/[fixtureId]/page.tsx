import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentContainer } from "@/components/content-container";
import { FixtureMatchupTitle } from "@/components/fixture-matchup-title";
import { MatchInsightPanel } from "@/components/match-insight-panel";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { loadMatchInsight } from "@/lib/bsd/insights";
import {
  formatKickoff,
  getFixtureById,
  getWorldCupFixtures,
} from "@/lib/openfootball/fixtures";
import { getWorldCupTeams, resolveTeamByName } from "@/lib/openfootball/teams";
import { resolveTeamDisplayName } from "@/lib/teams/metadata";

type PageProps = {
  params: Promise<{ fixtureId: string }>;
};

export async function generateStaticParams() {
  const { fixtures } = await getWorldCupFixtures();
  return fixtures.map((fixture) => ({ fixtureId: fixture.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { fixtureId } = await params;
  const { fixtures } = await getWorldCupFixtures();
  const fixture = getFixtureById(fixtures, fixtureId);

  if (!fixture) {
    return { title: "Match - Footy Arena" };
  }

  const home = resolveTeamDisplayName(fixture.team1);
  const away = resolveTeamDisplayName(fixture.team2);

  return {
    title: `${home} vs ${away} - Footy Arena`,
    description: `${fixture.stageLabel} match briefing for ${home} vs ${away}.`,
  };
}

export default async function FixtureDetailPage({ params }: PageProps) {
  const { fixtureId } = await params;
  const [{ fixtures }, { byName }] = await Promise.all([
    getWorldCupFixtures(),
    getWorldCupTeams(),
  ]);
  const fixture = getFixtureById(fixtures, fixtureId);

  if (!fixture) {
    notFound();
  }

  const insight = await loadMatchInsight(fixture, byName);
  const homeTeam = resolveTeamByName(fixture.team1, byName);
  const awayTeam = resolveTeamByName(fixture.team2, byName);
  const homeLabel =
    homeTeam?.displayName ?? resolveTeamDisplayName(fixture.team1);
  const awayLabel =
    awayTeam?.displayName ?? resolveTeamDisplayName(fixture.team2);

  return (
    <PageShell>
      <SiteHeader />

      <ContentContainer>
        <PageHero
          variant="detail"
          backHref="/fixtures"
          backLabel="All fixtures"
          eyebrow={fixture.stageLabel}
          title={
            <FixtureMatchupTitle
              team1={homeLabel}
              team2={awayLabel}
              team1Id={insight?.homeTeamId ?? homeTeam?.bsdTeamId}
              team2Id={insight?.awayTeamId ?? awayTeam?.bsdTeamId}
            />
          }
          meta={
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <Badge variant={fixture.stage === "group" ? "group" : "knockout"}>
                {fixture.stageLabel}
              </Badge>
              <span>{formatKickoff(fixture.time)}</span>
              <span aria-hidden>·</span>
              <span>{fixture.ground}</span>
            </div>
          }
        />

        <div className="pb-16">
          <MatchInsightPanel insight={insight} venueFallback={fixture.ground} />
        </div>
      </ContentContainer>

      <SiteFooter />
    </PageShell>
  );
}
