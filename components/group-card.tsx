import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamFlag } from "@/components/team-flag";
import type { TournamentGroup } from "@/lib/openfootball/types";

export function GroupCard({ group }: { group: TournamentGroup }) {
  return (
    <Link href={`/groups/${group.letter.toLowerCase()}`} className="group block">
      <Card accent="gold" interactive padding="none">
        <CardHeader className="flex flex-row items-start justify-between gap-3 pb-0 pl-6">
          <div>
            <CardTitle className="font-display text-3xl tracking-wide text-gold">
              {group.label.toUpperCase()}
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              {group.teams.length} nations ·{" "}
              {group.teams.map((t) => t.confed).filter((v, i, a) => a.indexOf(v) === i).length}{" "}
              confederations
            </p>
          </div>
          <ChevronRight
            className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-gold"
            aria-hidden
          />
        </CardHeader>
        <CardContent className="pl-6">
          <ul className="space-y-2.5">
            {group.teams.map((team) => (
              <li key={team.fifa_code} className="flex items-center gap-3 text-sm">
                <TeamFlag flag={team.flag_icon} name={team.displayName} size="sm" />
                <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                  {team.displayName}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {team.fifa_code}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </Link>
  );
}
