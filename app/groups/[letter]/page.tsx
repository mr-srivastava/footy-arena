import { CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentContainer } from "@/components/content-container";
import { FixtureCard } from "@/components/fixture-card";
import { PageHero } from "@/components/page-hero";
import { PageSection } from "@/components/page-section";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SubsectionTitle } from "@/components/subsection-title";
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
  const confeds = group.teams
    .map((t) => t.confed)
    .filter((v, i, a) => a.indexOf(v) === i)
    .join(", ");

  return (
    <PageShell>
      <SiteHeader />

      <ContentContainer>
        <PageHero
          variant="detail"
          backHref="/groups"
          backLabel="All groups"
          eyebrow="Group stage"
          title={
            <>
              GROUP{" "}
              <span className="text-pitch-bright">{group.letter}</span>
            </>
          }
          titleClassName="md:text-7xl"
          meta={
            <p className="max-w-2xl text-muted">
              Four nations from {confeds}. Explore each team&apos;s squad and
              full fixture list.
            </p>
          }
        />

        <PageSection variant="compact">
          <SubsectionTitle level="panel" className="mb-6">
            TEAMS
          </SubsectionTitle>
          <div className="reveal-grid grid gap-3 sm:grid-cols-2">
            {group.teams.map((team) => (
              <TeamCard key={team.fifa_code} team={team} />
            ))}
          </div>
        </PageSection>

        <section>
          <div className="mb-6 flex items-center justify-between gap-4">
            <SubsectionTitle level="panel" icon={CalendarDays}>
              GROUP FIXTURES
            </SubsectionTitle>
            <span className="text-sm text-muted">
              {groupFixtures.length}{" "}
              {groupFixtures.length === 1 ? "match" : "matches"}
            </span>
          </div>

          {groupFixtures.length > 0 ? (
            <div className="reveal-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
      </ContentContainer>

      <SiteFooter />
    </PageShell>
  );
}
