import { FixtureCard } from "@/components/fixture-card";
import type { Fixture, Team } from "@/lib/openfootball/types";
import { teamPageHref } from "@/lib/openfootball/teams";
import { cn } from "@/lib/utils";

type FixtureListProps = {
  fixtures: Fixture[];
  byName: Map<string, Team>;
  className?: string;
};

export function FixtureList({ fixtures, byName, className }: FixtureListProps) {
  return (
    <div className={cn("reveal-grid grid gap-3", className)}>
      {fixtures.map((fixture) => (
        <FixtureCard
          key={fixture.id}
          fixture={fixture}
          team1Href={teamPageHref(fixture.team1, byName)}
          team2Href={teamPageHref(fixture.team2, byName)}
        />
      ))}
    </div>
  );
}
