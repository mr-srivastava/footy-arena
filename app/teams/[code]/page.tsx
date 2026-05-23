import { ArrowLeft, CalendarDays, Globe2, LayoutGrid } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FixtureCard } from "@/components/fixture-card";
import { PageShell } from "@/components/page-shell";
import { SquadPanel } from "@/components/squad-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TeamFlag } from "@/components/team-flag";
import { getWorldCupFixtures } from "@/lib/openfootball/fixtures";
import {
  getTeamFixtures,
  getWorldCupTeams,
  teamPageHref,
} from "@/lib/openfootball/teams";
import { TeamNarrativePanel } from "@/components/team-narrative-panel";
import { getPlayersBySlugs, getTeamNarrative } from "@/lib/discovery";
import { getTeamSquad } from "@/lib/tournament/squads";

type PageProps = {
  params: Promise<{ code: string }>;
};

export async function generateStaticParams() {
  const { teams } = await getWorldCupTeams();
  return teams.map((team) => ({ code: team.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const { byCode } = await getWorldCupTeams();
  const team = byCode.get(code.toUpperCase());

  if (!team) {
    return { title: "Team — Footy Arena" };
  }

  return {
    title: `${team.displayName} — Footy Arena`,
    description: `${team.displayName} at FIFA World Cup 2026 — ${team.groupLabel}, squad, manager, and fixtures.`,
  };
}

export default async function TeamPage({ params }: PageProps) {
  const { code } = await params;
  const [{ byCode, byName }, { fixtures }] = await Promise.all([
    getWorldCupTeams(),
    getWorldCupFixtures(),
  ]);

  const team = byCode.get(code.toUpperCase());
  if (!team) notFound();

  const squad = getTeamSquad(team.fifa_code);
  const narrative = getTeamNarrative(team.fifa_code);
  const keyPlayers = narrative
    ? getPlayersBySlugs(narrative.keyPlayerSlugs)
    : [];
  const teamFixtures = getTeamFixtures(fixtures, team);

  return (
    <PageShell>
      <SiteHeader />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-8">
        <div className="animate-fade-up py-10 md:py-14">
          <Link
            href="/teams"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All teams
          </Link>

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-5">
              <TeamFlag
                flag={team.flag_icon}
                name={team.displayName}
                size="xl"
              />
              <div>
                <p className="section-eyebrow">{team.groupLabel}</p>
                <h1 className="font-display text-5xl tracking-wide text-foreground md:text-6xl">
                  {team.displayName.toUpperCase()}
                </h1>
                <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
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
              </div>
            </div>

            <Link
              href={`/groups/${team.group.toLowerCase()}`}
              className="glass-panel glass-panel-interactive inline-flex items-center gap-2 self-start rounded-full px-5 py-2.5 text-sm font-semibold text-gold"
            >
              <LayoutGrid className="h-4 w-4" aria-hidden />
              View {team.groupLabel}
            </Link>
          </div>
        </div>

        {narrative ? (
          <div className="mb-10">
            <TeamNarrativePanel narrative={narrative} keyPlayers={keyPlayers} />
          </div>
        ) : null}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
          <SquadPanel squad={squad} />

          <section>
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-2 font-display text-2xl tracking-wide text-foreground">
                <CalendarDays className="h-6 w-6 text-pitch-bright" aria-hidden />
                FIXTURES
              </h2>
              <span className="text-sm text-muted">
                {teamFixtures.length}{" "}
                {teamFixtures.length === 1 ? "match" : "matches"}
              </span>
            </div>

            {teamFixtures.length > 0 ? (
              <div className="fixture-grid grid gap-3">
                {teamFixtures.map((fixture) => (
                  <FixtureCard
                    key={fixture.id}
                    fixture={fixture}
                    team1Href={teamPageHref(fixture.team1, byName)}
                    team2Href={teamPageHref(fixture.team2, byName)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">
                No fixtures found for this team yet.
              </p>
            )}
          </section>
        </div>
      </main>

      <SiteFooter />
    </PageShell>
  );
}
