import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { RISING_UNDERDOG_ENTRIES } from "@/lib/discovery";
import type { Team } from "@/lib/openfootball/types";
import { resolveTeamByFifaCode } from "@/lib/openfootball/teams";

type RisingUnderdogsGridProps = {
  byCode: Map<string, Team>;
};

export function RisingUnderdogsGrid({ byCode }: RisingUnderdogsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {RISING_UNDERDOG_ENTRIES.map((entry) => {
        const { breakoutPlayers } = entry;
        const { team, href } = resolveTeamByFifaCode(entry.fifaCode, byCode);

        return (
          <Card key={entry.nation} padding="none" className="h-full">
            <CardContent className="flex h-full flex-col p-6">
              <CardTitle className="font-display text-3xl tracking-wide text-foreground">
                {entry.nation.toUpperCase()}
              </CardTitle>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {entry.whyTheyMatter}
              </p>
              <p className="mt-3 rounded-xl bg-pitch/10 px-4 py-3 text-sm text-pitch-bright">
                {entry.keyIdentity}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {entry.whyCasualFansShouldWatch}
              </p>
              {breakoutPlayers.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {breakoutPlayers.map((player) => (
                    <Link
                      key={player.slug}
                      href={`/players/${player.slug}`}
                      className="rounded-full border border-white/10 px-3 py-1 text-sm hover:text-gold"
                    >
                      {player.name}
                    </Link>
                  ))}
                </div>
              ) : null}
              {href && team ? (
                <Link
                  href={href}
                  className="mt-auto pt-5 text-sm font-semibold text-gold hover:text-foreground"
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
