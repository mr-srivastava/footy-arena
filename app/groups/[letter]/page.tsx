import { ArrowLeft, CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FixtureCard } from "@/components/fixture-card";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TeamCard } from "@/components/team-card";
import { getWorldCupFixtures } from "@/lib/openfootball/fixtures";
import {
  GROUP_LETTERS,
  type GroupLetter,
  getGroupFixtures,
  getWorldCupTeams,
  teamPageHref,
} from "@/lib/openfootball/teams";

type PageProps = {
  params: Promise<{ letter: string }>;
};

export async function generateStaticParams() {
  return GROUP_LETTERS.map((letter) => ({
    letter: letter.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { letter } = await params;
  const normalized = letter.toUpperCase();

  if (!GROUP_LETTERS.includes(normalized as GroupLetter)) {
    return { title: "Group — Footy Arena" };
  }

  return {
    title: `Group ${normalized} — Footy Arena`,
    description: `FIFA World Cup 2026 Group ${normalized} — teams, squads, and fixtures.`,
  };
}

export default async function GroupPage({ params }: PageProps) {
  const { letter } = await params;
  const normalized = letter.toUpperCase();

  if (!GROUP_LETTERS.includes(normalized as GroupLetter)) {
    notFound();
  }

  const groupLetter = normalized as GroupLetter;
  const [{ groups, byName }, { fixtures }] = await Promise.all([
    getWorldCupTeams(),
    getWorldCupFixtures(),
  ]);

  const group = groups.find((entry) => entry.letter === groupLetter);
  if (!group) notFound();

  const groupFixtures = getGroupFixtures(fixtures, groupLetter);

  return (
    <PageShell>
      <SiteHeader />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-8">
        <div className="animate-fade-up py-10 md:py-14">
          <Link
            href="/groups"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All groups
          </Link>

          <p className="section-eyebrow">Group stage</p>
          <h1 className="font-display text-5xl tracking-wide text-gold md:text-7xl">
            {group.label.toUpperCase()}
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Four nations from {group.teams.map((t) => t.confed).filter((v, i, a) => a.indexOf(v) === i).join(", ")}.
            Explore each team&apos;s squad and full fixture list.
          </p>
        </div>

        <section className="mb-14">
          <h2 className="mb-6 font-display text-2xl tracking-wide text-foreground">
            TEAMS
          </h2>
          <div className="fixture-grid grid gap-3 sm:grid-cols-2">
            {group.teams.map((team) => (
              <TeamCard key={team.fifa_code} team={team} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 font-display text-2xl tracking-wide text-foreground">
              <CalendarDays className="h-6 w-6 text-pitch-bright" aria-hidden />
              GROUP FIXTURES
            </h2>
            <span className="text-sm text-muted">
              {groupFixtures.length}{" "}
              {groupFixtures.length === 1 ? "match" : "matches"}
            </span>
          </div>

          {groupFixtures.length > 0 ? (
            <div className="fixture-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {groupFixtures.map((fixture) => (
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
              Group fixtures are not available yet.{" "}
              <Link href="/fixtures" className="text-gold hover:text-foreground">
                View full schedule
              </Link>
              .
            </p>
          )}
        </section>
      </main>

      <SiteFooter />
    </PageShell>
  );
}
