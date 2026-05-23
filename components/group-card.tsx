import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { TeamFlag } from "@/components/team-flag";
import type { TournamentGroup } from "@/lib/openfootball/types";
import { artifactSurface } from "@/lib/utils";

export function GroupCard({ group }: { group: TournamentGroup }) {
  const confeds = group.teams
    .map((team) => team.confed)
    .filter((value, index, array) => array.indexOf(value) === index);

  return (
    <Link
      href={`/groups/${group.letter.toLowerCase()}`}
      className={artifactSurface(
        "group relative block overflow-hidden bg-artifact/85 transition-colors hover:border-gold/35",
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-gold/18 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-3 top-5 font-display text-[8rem] leading-none text-white/[0.025] transition-colors group-hover:text-gold/[0.06]"
        aria-hidden
      >
        {group.letter}
      </div>
      <div className="relative flex items-start justify-between gap-4 border-b border-white/8 px-5 py-4">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Draw board
          </p>
          <h3 className="mt-1 font-display text-4xl leading-none tracking-wide text-gold">
            {group.label.toUpperCase()}
          </h3>
        </div>
        <ChevronRight
          className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-gold"
          aria-hidden
        />
      </div>
      <ul className="relative px-5 py-2">
        {group.teams.map((team) => (
          <li
            key={team.fifa_code}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-white/8 py-3 text-sm last:border-b-0"
          >
            <div className="flex size-9 items-center justify-center rounded-sm border border-white/8 bg-white/5">
              <TeamFlag flag={team.flag_icon} name={team.displayName} size="sm" />
            </div>
            <span className="min-w-0 truncate font-medium text-foreground">
              {team.displayName}
            </span>
            <span className="rounded bg-white/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {team.fifa_code}
            </span>
          </li>
        ))}
      </ul>
      <div className="relative border-t border-white/8 px-5 py-3">
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{group.teams.length} nations</span>
          <span>{confeds.length} confederations</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {confeds.map((confed) => (
            <span
              key={confed}
              className="rounded-sm border border-white/8 bg-white/5 px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground"
            >
              {confed}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
