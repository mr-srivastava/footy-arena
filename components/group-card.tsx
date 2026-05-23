import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { TeamFlag } from "@/components/team-flag";
import type { TournamentGroup } from "@/lib/openfootball/types";

export function GroupCard({ group }: { group: TournamentGroup }) {
  return (
    <Link
      href={`/groups/${group.letter.toLowerCase()}`}
      className="glass-panel glass-panel-interactive group relative overflow-hidden rounded-xl p-5"
    >
      <div
        className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-gold/80 to-transparent opacity-80"
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3 pl-2">
        <div>
          <p className="font-display text-3xl tracking-wide text-gold">
            {group.label.toUpperCase()}
          </p>
          <p className="mt-1 text-xs text-muted">
            {group.teams.length} nations · {group.teams.map((t) => t.confed).filter((v, i, a) => a.indexOf(v) === i).length} confederations
          </p>
        </div>
        <ChevronRight
          className="h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-gold"
          aria-hidden
        />
      </div>
      <ul className="mt-5 space-y-2.5 pl-2">
        {group.teams.map((team) => (
          <li
            key={team.fifa_code}
            className="flex items-center gap-3 text-sm"
          >
            <TeamFlag flag={team.flag_icon} name={team.displayName} size="sm" />
            <span className="min-w-0 flex-1 truncate font-medium text-foreground">
              {team.displayName}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
              {team.fifa_code}
            </span>
          </li>
        ))}
      </ul>
    </Link>
  );
}
