import Link from "next/link";
import { TeamNarrativePanel } from "@/components/team-narrative-panel";
import { TEAM_NARRATIVE_ENTRIES } from "@/lib/discovery";
import type { Team } from "@/lib/openfootball/types";

type TacticalIdentitiesGridProps = {
  byCode: Map<string, Team>;
};

export function TacticalIdentitiesGrid({ byCode }: TacticalIdentitiesGridProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {TEAM_NARRATIVE_ENTRIES.map(({ narrative, keyPlayers }) => {
        const team = byCode.get(narrative.fifaCode);

        return (
          <div key={narrative.fifaCode} className="flex flex-col gap-4">
            <TeamNarrativePanel
              narrative={narrative}
              keyPlayers={keyPlayers}
            />
            {team ? (
              <Link
                href={`/teams/${team.slug}`}
                className="inline-flex text-sm font-semibold text-gold hover:text-foreground"
              >
                Full {team.displayName} profile →
              </Link>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
