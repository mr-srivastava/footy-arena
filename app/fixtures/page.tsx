import { Calendar, CalendarDays, Trophy } from "lucide-react";
import type { Metadata } from "next";
import { ContentContainer } from "@/components/content-container";
import { FixtureCard } from "@/components/fixture-card";
import { OpenFootballLink } from "@/components/openfootball-link";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StatCard } from "@/components/stat-card";
import { getWorldCupFixtures } from "@/lib/openfootball/fixtures";
import { getWorldCupTeams, teamPageHref } from "@/lib/openfootball/teams";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { fixtures } = await getWorldCupFixtures();
    return {
      title: "Fixtures - Footy Arena",
      description: `Full FIFA World Cup 2026 match schedule - all ${fixtures.length} fixtures across group stage and knockout rounds.`,
    };
  } catch {
    return {
      title: "Fixtures - Footy Arena",
      description:
        "Full FIFA World Cup 2026 match schedule across group stage and knockout rounds.",
    };
  }
}

export default async function FixturesPage() {
  const [{ tournament, fixtures, byDate }, { byName }] = await Promise.all([
    getWorldCupFixtures(),
    getWorldCupTeams(),
  ]);
  const groupMatches = fixtures.filter((f) => f.stage === "group").length;
  const knockoutMatches = fixtures.length - groupMatches;

  return (
    <PageShell>
      <SiteHeader />

      <ContentContainer>
        <PageHero
          variant="list"
          eyebrow={tournament}
          title={
            <>
              MATCH <span className="text-pitch-bright">SCHEDULE</span>
            </>
          }
          icon={CalendarDays}
          titleClassName="md:text-7xl"
          subtitle={
            <>
              All {fixtures.length} fixtures from the opening match in Mexico
              City to the Final in New York/New Jersey. Data from{" "}
              <OpenFootballLink />.
            </>
          }
          stats={
            <>
              <StatCard
                value={fixtures.length}
                label="Total matches"
                icon={Calendar}
              />
              <StatCard
                value={groupMatches}
                label="Group stage"
                icon={CalendarDays}
              />
              <StatCard
                value={knockoutMatches}
                label="Knockout"
                icon={Trophy}
                accent="text-gold"
              />
            </>
          }
        />

        <div className="space-y-14">
          {byDate.map((day, dayIndex) => (
            <section key={day.date} id={day.date}>
              <div className="sticky top-17 z-20 -mx-6 border-b border-pitch/15 bg-background/92 px-6 py-4 backdrop-blur-xl md:top-18">
                <div className="flex items-center gap-4">
                  <span
                    className="hidden font-display text-4xl leading-none text-white/8 sm:block"
                    aria-hidden
                  >
                    {String(dayIndex + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="flex items-center gap-2 font-display text-2xl tracking-wide text-gold md:text-3xl">
                      <Calendar
                        className="h-6 w-6 shrink-0 md:h-7 md:w-7"
                        aria-hidden
                      />
                      {day.dateLabel.toUpperCase()}
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      {day.matches.length}{" "}
                      {day.matches.length === 1 ? "match" : "matches"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="reveal-grid mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {day.matches.map((fixture) => (
                  <FixtureCard
                    key={fixture.id}
                    fixture={fixture}
                    team1Href={teamPageHref(fixture.team1, byName)}
                    team2Href={teamPageHref(fixture.team2, byName)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </ContentContainer>

      <SiteFooter
        center={
          <p className="text-center">
            Fixture data via <OpenFootballLink showIcon={false} /> · CC0
          </p>
        }
      />
    </PageShell>
  );
}
