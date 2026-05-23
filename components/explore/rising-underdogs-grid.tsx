import Link from "next/link";
import { RISING_UNDERDOG_ENTRIES } from "@/lib/discovery";
import type { Team } from "@/lib/openfootball/types";
import { resolveTeamByFifaCode } from "@/lib/openfootball/teams";
import { artifactSurface } from "@/lib/utils";

type RisingUnderdogsGridProps = {
  byCode: Map<string, Team>;
};

export function RisingUnderdogsGrid({ byCode }: RisingUnderdogsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {RISING_UNDERDOG_ENTRIES.map((entry) => {
        const { breakoutPlayers } = entry;
        const { team, href } = resolveTeamByFifaCode(entry.fifaCode, byCode);

        return (
          <article
            key={entry.nation}
            className={artifactSurface(
              "relative flex h-full flex-col overflow-hidden p-5",
            )}
          >
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-pitch-bright/14 to-transparent"
              aria-hidden
            />
            <div className="relative">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-pitch-bright">
                Rising profile
              </p>
              <h2 className="mt-2 font-display text-4xl leading-none tracking-wide text-foreground">
                {entry.nation.toUpperCase()}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {entry.whyTheyMatter}
              </p>
              <p className="mt-4 border-l border-pitch-bright/50 pl-4 text-sm font-medium leading-relaxed text-pitch-bright">
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
                      className="rounded-sm border border-white/10 px-3 py-1 text-sm hover:border-gold/35 hover:text-gold"
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
            </div>
          </article>
        );
      })}
    </div>
  );
}
