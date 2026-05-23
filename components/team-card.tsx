import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { TeamFlag } from "@/components/team-flag";
import type { Team } from "@/lib/openfootball/types";

export function TeamCard({ team }: { team: Team }) {
  return (
    <Link
      href={`/teams/${team.slug}`}
      className="glass-panel glass-panel-interactive group relative flex items-center gap-4 overflow-hidden rounded-xl p-4"
    >
      <div
        className="absolute inset-y-0 left-0 w-0.5 bg-gradient-to-b from-pitch-bright/80 to-transparent opacity-80"
        aria-hidden
      />
      <TeamFlag flag={team.flag_icon} name={team.displayName} size="md" />
      <div className="min-w-0 flex-1 pl-1">
        <p className="truncate font-semibold text-foreground group-hover:text-gold">
          {team.displayName}
        </p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
          <span className="font-mono uppercase tracking-wider">{team.fifa_code}</span>
          <span aria-hidden>·</span>
          <span>{team.groupLabel}</span>
          <span aria-hidden>·</span>
          <span>{team.confed}</span>
        </p>
      </div>
      <ChevronRight
        className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-gold"
        aria-hidden
      />
    </Link>
  );
}
