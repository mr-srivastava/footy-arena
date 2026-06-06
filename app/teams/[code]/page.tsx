import { CalendarDays, Globe2, LayoutGrid } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentContainer } from "@/components/content-container";
import { FixtureList } from "@/components/fixture-list";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { SquadPanelWithQuery } from "@/components/squad-panel-with-query";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SubsectionTitle } from "@/components/subsection-title";
import { TeamFlag } from "@/components/team-flag";
import { TeamNarrativePanel } from "@/components/team-narrative-panel";
import { Button } from "@/components/ui/button";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { TeamInsightPanel } from "@/components/team-insight-panel";
import { loadTeamInsight } from "@/lib/bsd/insights";
import { getPlayersBySlugs, getTeamNarrative } from "@/lib/discovery";
import { getWorldCupFixtures } from "@/lib/openfootball/fixtures";
import {
  getTeamFixtures,
  getWorldCupTeams,
} from "@/lib/openfootball/teams";
import { mapConvexSquad } from "@/lib/tournament/map-squad";

type PageProps = {
  params: Promise<{ code: string }>;
};

export async function generateStaticParams() {
  const { teams } = await getWorldCupTeams();
  return teams.map((team) => ({ code: team.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [{ code }, { byCode }] = await Promise.all([params, getWorldCupTeams()]);
  const team = [...byCode.values()].find((t) => t.slug === code.toLowerCase());

  if (!team) {
    return { title: "Team - Footy Arena" };
  }

  return {
    title: `${team.displayName} - Footy Arena`,
    description: `${team.displayName} at FIFA World Cup 2026 - ${team.groupLabel}, squad, manager, and fixtures.`,
  };
}

export default async function TeamPage({ params }: PageProps) {
  const [{ code }, { byCode, byName }, { fixtures }] = await Promise.all([
    params,
    getWorldCupTeams(),
    getWorldCupFixtures(),
  ]);

  const team = [...byCode.values()].find((t) => t.slug === code.toLowerCase());
  if (!team) notFound();

  const teamPageData = await fetchQuery(api.teams.getTeamPageData, {
    slug: code.toLowerCase(),
  });

  const initialSquad = mapConvexSquad(
    teamPageData?.squad ?? null,
    teamPageData?.players ?? [],
  );

  const narrative = getTeamNarrative(team.fifa_code);
  const keyPlayers = narrative
    ? getPlayersBySlugs(narrative.keyPlayerSlugs)
    : [];
  const teamFixtures = getTeamFixtures(fixtures, team);
  const teamInsight = await loadTeamInsight(team);

  return (
    <PageShell>
      <SiteHeader />

      <ContentContainer>
        <PageHero
          variant="detail"
          backHref="/teams"
          backLabel="All teams"
          eyebrow={team.groupLabel}
          leading={
            <TeamFlag
              flag={team.flag_icon}
              name={team.displayName}
              size="xl"
            />
          }
          title={team.displayName.toUpperCase()}
          meta={
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <span className="font-mono uppercase tracking-wider">
                {team.fifa_code}
              </span>
              <span aria-hidden>·</span>
              <span className="flex items-center gap-1">
                <Globe2 className="h-3.5 w-3.5" aria-hidden />
                {team.continent}
              </span>
              <span aria-hidden>·</span>
              <span>{team.confed}</span>
            </p>
          }
          actions={
            <Button
              render={<Link href={`/groups/${team.group.toLowerCase()}`} />}
              nativeButton={false}
              variant="outline"
              size="pill"
              className="text-gold"
            >
              <LayoutGrid data-icon="inline-start" aria-hidden />
              View {team.groupLabel}
            </Button>
          }
        />

        {narrative ? (
          <div className="mb-10">
            <TeamNarrativePanel narrative={narrative} keyPlayers={keyPlayers} />
          </div>
        ) : null}

        <TeamInsightPanel insight={teamInsight} />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
          <SquadPanelWithQuery slug={code.toLowerCase()} initialSquad={initialSquad} />

          <section>
            <div className="mb-6 flex items-center justify-between gap-4">
              <SubsectionTitle level="panel" icon={CalendarDays}>
                FIXTURES
              </SubsectionTitle>
              <span className="text-sm text-muted">
                {teamFixtures.length}{" "}
                {teamFixtures.length === 1 ? "match" : "matches"}
              </span>
            </div>

            {teamFixtures.length > 0 ? (
              <FixtureList fixtures={teamFixtures} byName={byName} />
            ) : (
              <p className="text-sm text-muted">
                No fixtures found for this team yet.
              </p>
            )}
          </section>
        </div>
      </ContentContainer>

      <SiteFooter />
    </PageShell>
  );
}
