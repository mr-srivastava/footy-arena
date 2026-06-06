import { FixtureCard } from "@/components/fixture-card";
import type { Fixture, Team } from "@/lib/openfootball/types";
import { resolveTeamByName } from "@/lib/openfootball/teams";
import { cn } from "@/lib/utils";

type FixtureListProps = {
  fixtures: Fixture[];
  byName: Map<string, Team>;
  className?: string;
};

export function FixtureList({ fixtures, byName, className }: FixtureListProps) {
  return (
    <div className={cn("reveal-grid grid gap-3", className)}>
      {fixtures.map((fixture) => {
        const team1 = resolveTeamByName(fixture.team1, byName);
        const team2 = resolveTeamByName(fixture.team2, byName);

        return (
          <FixtureCard
            key={fixture.id}
            fixture={fixture}
            team1Name={team1?.displayName ?? fixture.team1}
            team2Name={team2?.displayName ?? fixture.team2}
            team1Href={team1 ? `/teams/${team1.slug}` : undefined}
            team2Href={team2 ? `/teams/${team2.slug}` : undefined}
            team1Id={team1?.bsdTeamId}
            team2Id={team2?.bsdTeamId}
          />
        );
      })}
    </div>
  );
}
