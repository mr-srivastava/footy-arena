import { Calendar, CalendarDays, Trophy } from "lucide-react";
import type { Metadata } from "next";
import { ContentContainer } from "@/components/content-container";
import { FixtureList } from "@/components/fixture-list";
import { FixtureFilters } from "@/components/fixtures/fixture-filters";
import { OpenFootballLink } from "@/components/openfootball-link";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StatCard } from "@/components/stat-card";
import {
  getFixtureStageCounts,
  getWorldCupFixtures,
} from "@/lib/openfootball/fixtures";
import { getWorldCupTeams } from "@/lib/openfootball/teams";

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

type PageProps = {
  searchParams: Promise<{ date?: string; stage?: string }>;
};

export default async function FixturesPage({ searchParams }: PageProps) {
  const filters = await searchParams;
  const [{ tournament, fixtures, byDate }, { byName }] = await Promise.all([
    getWorldCupFixtures(),
    getWorldCupTeams(),
  ]);
  const { groupMatches, knockoutMatches } = getFixtureStageCounts(fixtures);
  const visibleDays = byDate
    .filter((day) => !filters.date || day.date === filters.date)
    .map((day) => ({
      ...day,
      matches: day.matches.filter((fixture) => {
        if (!filters.stage) return true;
        if (filters.stage === "knockout") return fixture.stage !== "group";
        return fixture.stage === filters.stage;
      }),
    }))
    .filter((day) => day.matches.length > 0);

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

        <FixtureFilters
          dates={byDate.map((day) => ({
            value: day.date,
            label: day.dateLabel,
          }))}
        />

        <div className="flex flex-col gap-14">
          {visibleDays.map((day, dayIndex) => (
            <section key={day.date} id={day.date}>
              <div className="sticky top-17 z-20 -mx-6 border-b border-pitch/15 bg-background/92 px-6 py-4 backdrop-blur-xl md:top-18">
                <div className="flex items-center gap-4">
                  <span
                    className="hidden font-display text-4xl leading-none text-watermark sm:block"
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
              <FixtureList
                fixtures={day.matches}
                byName={byName}
                className="mt-4 sm:grid-cols-2 lg:grid-cols-3"
              />
            </section>
          ))}
          {visibleDays.length === 0 ? (
            <div className="rounded-2xl border border-line-strong bg-artifact-muted px-6 py-14 text-center">
              <p className="editorial-title type-panel-title">
                No fixtures in this view
              </p>
              <p className="mt-3 text-sm text-muted">
                Clear the filters to return to the full tournament schedule.
              </p>
            </div>
          ) : null}
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
