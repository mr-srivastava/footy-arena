import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentContainer } from "@/components/content-container";
import { MatchInsightPanel } from "@/components/match-insight-panel";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { loadMatchInsight } from "@/lib/bsd/insights";
import { formatKickoff, getFixtureById, getWorldCupFixtures } from "@/lib/openfootball/fixtures";
import { getWorldCupTeams } from "@/lib/openfootball/teams";

type PageProps = {
  params: Promise<{ fixtureId: string }>;
};

export async function generateStaticParams() {
  const { fixtures } = await getWorldCupFixtures();
  return fixtures.map((fixture) => ({ fixtureId: fixture.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { fixtureId } = await params;
  const { fixtures } = await getWorldCupFixtures();
  const fixture = getFixtureById(fixtures, fixtureId);

  if (!fixture) {
    return { title: "Match - Footy Arena" };
  }

  return {
    title: `${fixture.team1} vs ${fixture.team2} - Footy Arena`,
    description: `${fixture.stageLabel} match briefing for ${fixture.team1} vs ${fixture.team2}.`,
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
            <>
              {fixture.team1.toUpperCase()} <span className="text-pitch-bright">VS</span>{" "}
              {fixture.team2.toUpperCase()}
            </>
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
