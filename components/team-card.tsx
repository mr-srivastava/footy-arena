import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { TeamFlag } from "@/components/team-flag";
import type { Team } from "@/lib/openfootball/types";

export function TeamCard({ team }: { team: Team }) {
  return (
    <Link
      href={`/teams/${team.slug}`}
      className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-white/8 px-1 py-4 transition-colors hover:border-gold/40"
    >
      <div className="flex size-12 items-center justify-center rounded-sm border border-white/10 bg-white/5 shadow-artifact-inset">
        <TeamFlag flag={team.flag_icon} name={team.displayName} size="md" />
      </div>
      <div className="min-w-0">
        <p className="truncate font-display text-2xl leading-none tracking-wide text-foreground transition-colors group-hover:text-gold">
          {team.displayName.toUpperCase()}
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <span className="text-pitch-bright/80">{team.fifa_code}</span>
          <span aria-hidden>·</span>
          <span>{team.groupLabel}</span>
          <span aria-hidden>·</span>
          <span>{team.confed}</span>
        </p>
      </div>
      <ChevronRight
        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-gold"
        aria-hidden
      />
    </Link>
  );
}
