import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { LOST_GLORIES } from "@/lib/discovery";
import type { Team } from "@/lib/openfootball/types";
import { resolveTeamByFifaCode } from "@/lib/openfootball/teams";

type LostGloriesGridProps = {
  byCode: Map<string, Team>;
};

export function LostGloriesGrid({ byCode }: LostGloriesGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {LOST_GLORIES.map((entry) => {
        const { team, href } = resolveTeamByFifaCode(entry.fifaCode, byCode);

        return (
          <Card key={entry.nation} padding="none" className="h-full">
            <CardContent className="flex h-full flex-col p-6">
              <CardTitle className="font-display text-3xl tracking-wide text-foreground">
                {entry.nation.toUpperCase()}
              </CardTitle>
              <dl className="mt-5 flex flex-col gap-4 text-sm">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-gold">
                    Then
                  </dt>
                  <dd className="mt-1 leading-relaxed text-muted">
                    {entry.then}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                    What changed
                  </dt>
                  <dd className="mt-1 leading-relaxed text-muted">
                    {entry.whatChanged}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Now
                  </dt>
                  <dd className="mt-1 leading-relaxed text-muted">
                    {entry.currentStatus}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-pitch-bright">
                    Hope ahead
                  </dt>
                  <dd className="mt-1 leading-relaxed text-foreground/90">
                    {entry.hopeForTheFuture}
                  </dd>
                </div>
              </dl>
              {href && team ? (
                <Link
                  href={href}
                  className="mt-5 text-sm font-semibold text-gold hover:text-foreground"
                >
                  View {team.displayName} →
                </Link>
              ) : null}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
